# ADR 0001 — 테넌트 격리 전략

- **Status**: Accepted
- **작성일**: 2026-05-29
- **기준**: blommunity v0.1.1
- **관련**: X-SC-07(테넌트 격리 자동화), [threat-model.md](../threat-model.md) I 범주, [erd.md](../erd.md)

> ADR(Architecture Decision Record)은 "왜 이렇게 결정했는가"를 남기는 문서입니다. 결정의 배경·대안·결과를 함께 적어, 나중에 이 선택을 의심하거나 되짚을 때 근거가 되게 합니다.

---

## Context

Blommunity는 멀티테넌트 SaaS입니다. 하나의 데이터베이스에 여러 사업자(테넌트)의 데이터가 함께 들어 있고, 테넌트 스코프 모델 7종(`User`/`Space`/`SpaceUser`/`Board`/`BoardUser`/`Post`/`Comment`)은 모두 `tenant_id` 컬럼을 가집니다.

문제는 **이 `tenant_id` 필터를 거는 일이 지금은 전적으로 애플리케이션 코드의 책임**이라는 점입니다. 컨트롤러·서비스마다 손으로 전달합니다.

```ts
// apps/api/src/users/users.controller.ts (현재 방식)
const found = await this.userService.findOne({
  id,
  tenantId: user.tenantId,   // ← 사람이 매번 직접 넣는다
  deletedAt: null,
});
```

이 패턴은 `findAll`, `findOne`, `update`, `removeMember`, `assignRole` 등 거의 모든 조회·변경에서 반복됩니다. 그리고 여기엔 구조적 약점이 있습니다.

- **단일 누락이 전체 안전을 깹니다.** 테넌트 격리는 "모든 쿼리가 빠짐없이 `tenant_id` 필터를 가져야 한다"는 **전수 조건**입니다. 99개 쿼리가 맞아도 단 1개가 `tenantId`를 빠뜨리면, 그 1개로 옆 테넌트의 데이터가 노출됩니다.
- **휴먼 에러에 의존합니다.** 새 엔드포인트를 추가할 때, 새 개발자가 합류했을 때, 급하게 고칠 때 — 사람은 빠뜨립니다. 코드 리뷰로 100% 잡는다는 가정은 현실적이지 않습니다.
- **테스트로도 완전히 막기 어렵습니다.** 모든 엔드포인트 × 모든 교차 테넌트 조합을 검사하는 건 비현실적이고, 새 쿼리가 추가될 때마다 테스트가 따라붙는다는 보장도 없습니다.
- **운영 인력이 제한적입니다.** 격리 누락을 사람의 주의력만으로 상시 감시할 여력이 없습니다. 안전은 사람의 규율이 아니라 **구조**가 보장해야 합니다.

[위협 모델](../threat-model.md)에서 정리했듯, **테넌트 간 데이터 누출(Information Disclosure)은 Blommunity에 가장 치명적인 위협**입니다. 멀티테넌트 제품에서 옆 테넌트 데이터가 새는 것은 단일 사고로 신뢰가 무너지는 사건입니다. 따라서 격리는 "조심하자"가 아니라 "빠뜨리는 게 불가능하게 만들자"로 풀어야 합니다.

목표를 한 줄로: **개발자가 `tenant_id`를 깜빡해도 격리가 깨지지 않는 구조를 만든다.**

---

## Decision

**Prisma Client Extension** 방식을 채택합니다.

Prisma Client Extension(`$extends`)으로 쿼리 미들웨어 계층을 두어, 테넌트 스코프 모델에 대한 쿼리가 실행될 때 **`where` 절에 `tenant_id`를 자동으로 주입**합니다. 현재 요청의 테넌트 컨텍스트는 **AsyncLocalStorage**로 전파합니다.

흐름은 다음과 같습니다.

1. 요청이 들어오면 인증 가드가 JWT에서 `tenantId`를 꺼냅니다(사용자 토큰에는 `tenantId`가 들어 있습니다).
2. 인터셉터/미들웨어가 그 `tenantId`를 **AsyncLocalStorage**에 담아 요청 수명 동안 들고 갑니다.
3. Prisma Client Extension이 테넌트 스코프 모델의 쿼리를 가로채, AsyncLocalStorage에서 `tenantId`를 읽어 `where`(그리고 create 시 `data`)에 자동으로 끼워 넣습니다.
4. 개발자는 더 이상 `tenantId`를 손으로 전달하지 않습니다. 빠뜨릴 일 자체가 없어집니다.

```ts
// 개념 스케치 (실제 구현은 v0.2.0에서)
const tenantStore = new AsyncLocalStorage<{ tenantId: string }>();

const prisma = basePrisma.$extends({
  query: {
    // 테넌트 스코프 모델에 한해 자동 주입
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (!TENANT_SCOPED_MODELS.has(model)) return query(args);
        const ctx = tenantStore.getStore();
        if (!ctx) throw new Error(`테넌트 컨텍스트 없이 ${model} 쿼리 실행`);
        // find/update/delete: where에 주입 / create: data에 주입
        return query(injectTenantId(operation, args, ctx.tenantId));
      },
    },
  },
});
```

핵심 설계 원칙:

- **컨텍스트가 없으면 실패합니다(fail-closed).** 테넌트 스코프 모델을 테넌트 컨텍스트 없이 쿼리하면 조용히 통과시키지 않고 에러를 던집니다. "격리가 안 걸린 채 성공"하는 것보다 "확실히 실패"하는 편이 안전합니다.
- **전역 모델은 제외합니다.** `Admin`·`AdminAuditLog`는 `tenant_id`가 없으므로 주입 대상에서 명시적으로 뺍니다. 운영자 경로는 별도 Prisma 인스턴스(또는 컨텍스트 우회)를 사용합니다.
- **`deletedAt: null` 소프트 삭제 필터도 같은 계층에서 함께 다루는 것을 검토합니다**(구현 시 결정).

---

## Consequences

### 좋아지는 점
- **격리가 기본값이 됩니다.** 개발자가 `tenantId`를 깜빡해도 Extension이 채웁니다. 새 엔드포인트가 자동으로 안전해집니다.
- **타입 안전과 생태계 유지.** Prisma Client 안에서 해결하므로 기존 타입·쿼리 인터페이스를 그대로 쓰며, 별도 DB 권한 체계를 도입하지 않습니다.
- **마이그레이션 영향 없음.** 스키마(테이블·컬럼)는 그대로입니다. `tenant_id`는 이미 모든 대상 모델에 있으므로 DB 변경이 필요 없습니다. 애플리케이션 계층만 바뀝니다.
- **점진적 적용이 가능합니다.** 모델별로 대상 집합(`TENANT_SCOPED_MODELS`)을 넓혀가며 검증할 수 있습니다.

### 감수해야 하는 점
- **raw query는 자동 보호 밖입니다.** `$queryRaw`/`$executeRaw`는 Extension의 쿼리 가로채기를 거치지 않습니다. raw query를 쓸 때는 `tenant_id` 조건을 직접 넣어야 하며, 이를 강제하는 별도 규칙(린트/리뷰/래퍼)이 필요합니다. → 다행히 현재 코드베이스는 raw query 사용이 없거나 적습니다. 새로 도입할 때 주의 대상으로 명시합니다.
- **AsyncLocalStorage 컨텍스트 전파의 정확성에 의존합니다.** 비동기 경계(큐 작업, 배치, 이벤트 핸들러 등 요청 컨텍스트 밖)에서는 컨텍스트가 없으므로, 그런 경로는 `tenantId`를 명시적으로 넘기는 별도 진입점을 마련합니다. fail-closed 원칙이 여기서 안전망이 됩니다.
- **약간의 런타임 오버헤드.** 모든 쿼리가 Extension 계층을 한 번 더 통과합니다. 무시할 수준이지만 0은 아닙니다.

### 영향 범위
- 기존 컨트롤러의 수동 `tenantId` 전달은 **점진적으로 제거**합니다(있어도 동작은 하지만, 중복이 되므로 정리). 이는 v0.2.0 Hardened의 X-SC-07 작업입니다.
- 교차 테넌트 접근을 시도하는 테스트(다른 테넌트의 리소스 id로 조회 → 결과 없음/거부)를 추가해 회귀를 막습니다.

---

## Alternatives Considered

### A. PostgreSQL RLS (Row Level Security) — 기각
DB 차원에서 행 단위 접근 정책을 걸어, `SET app.tenant_id`로 세션 변수를 주고 정책이 자동으로 `tenant_id` 행만 보이게 하는 방식입니다. "DB가 강제하니 가장 단단하다"는 장점이 있습니다.

**기각 이유:**
- **운영 권한 관리 복잡도.** RLS는 DB 역할(role)·정책(policy)·세션 변수 설정을 정확히 운영해야 합니다. 커넥션 풀 환경에서 세션 변수가 요청 간 새지 않게 다루는 것, 마이그레이션마다 정책을 유지하는 것은 추가 운영 부담입니다. 운영 인력이 제한적인 현 상황에서 이 복잡도는 위험을 줄이기보다 새 위험(정책 설정 실수)을 들여올 수 있습니다.
- **Prisma raw query 호환성 이슈.** Prisma는 RLS를 1급으로 다루지 않습니다. 세션 변수 주입을 위해 매 트랜잭션·커넥션마다 별도 raw 명령을 끼워야 하고, Prisma의 커넥션 관리와 맞물리는 지점에서 까다롭습니다. 결국 Prisma 생태계 밖에서 추가 배관을 떠안게 됩니다.
- 정리하면, RLS는 더 강력하지만 **현재 스택(Prisma)·운영 여건과 마찰이 큽니다.** 훗날 규모가 커지고 운영 체계가 갖춰지면 다층 방어로 RLS를 더할 수 있으나, v1.0의 1차 방어선으로는 부적합합니다.

### B. 코드 컨벤션·리뷰로 강제 — 기각
"모든 쿼리에 `tenantId`를 넣자"를 규칙·리뷰·문서로 강제하는 방식. 추가 기술 도입이 없습니다.

**기각 이유:**
- **휴먼 에러를 구조적으로 막지 못합니다.** Context에서 말했듯 단일 누락이 전체를 깨는데, 사람의 규율은 단일 누락을 0으로 만들지 못합니다. 이건 "조심하자"로 풀 문제가 아닙니다.

### C. 테넌트별 스키마/DB 분리 — 기각(현 단계)
테넌트마다 별도 스키마나 별도 DB를 두는 방식. 격리는 가장 확실합니다.

**기각 이유:**
- 테넌트 수가 많아질수록 마이그레이션·커넥션·운영 비용이 선형 이상으로 늘어납니다. 소규모 테넌트가 다수인 SaaS 형태(이 제품의 지향)와 맞지 않습니다. 현재 단일 DB + `tenant_id` 모델을 바꿀 이유가 없습니다.

---

## 구현 가이드 스케치 (v0.2.0)

실제 코드는 v0.2.0 Hardened에서 작성하되, 방향을 미리 적어 둡니다.

1. `libs/db`에 `TENANT_SCOPED_MODELS` 집합과 `tenantStore`(AsyncLocalStorage) 정의.
2. `$extends`로 `query.$allModels.$allOperations`에서 `tenant_id`를 주입하는 Extension 작성. 컨텍스트 없으면 fail-closed.
3. `apps/api`에 인터셉터/미들웨어를 두어, 인증 가드 이후 `request.user.tenantId`를 `tenantStore.run(...)`으로 감싸 핸들러를 실행.
4. 운영자(Admin) 경로는 테넌트 컨텍스트를 쓰지 않는 별도 진입점으로 분리.
5. 컨트롤러의 수동 `tenantId` 전달을 점진 제거.
6. 교차 테넌트 접근 차단 회귀 테스트 추가.

---

*ADR 0001 / 작성일: 2026-05-29 / Status: Accepted*
