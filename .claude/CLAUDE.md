# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개요

Blommunity는 멀티테넌트 커뮤니티/게시판 플랫폼(MACH 스타일)입니다. **npm workspaces + Turborepo 모노레포**이며, 두 개의 독립적인 빌드 시스템이 나란히 존재합니다.

- `apps/backend` — 헤드리스 **NestJS 11** REST API. 그 자체가 *중첩된* Nest 모노레포입니다(아래 참고). API 계약의 단일 진실 공급원으로 취급하며, 프런트엔드 앱은 이 백엔드를 절대 수정하지 않습니다.
- `apps/console` — **Next.js 15** App Router 테넌트 콘솔(사업자 CMS). `:3001`
- `apps/admin` — **Next.js 15** App Router 운영자 어드민. `:3002`
- `apps/community` — **Next.js 15** App Router 커뮤니티 기본 템플릿. `:3003`
- `packages/api-client` — `@blommunity/api-client`. OpenAPI 스펙 기반 **openapi-fetch** 타입 안전 HTTP 클라이언트. 세 프런트엔드 앱이 공통 사용.
- `packages/types` — `@blommunity/types`. 공용 TypeScript 타입 및 `ApiError`.
- `packages/ui` — `@blommunity/ui`. 공용 React UI 컴포넌트(Button, Input, Modal, Badge 등).
- `packages/tokens` — `@blommunity/tokens`. Tailwind v4 CSS 디자인 토큰(콘솔/커뮤니티 테마 분리).

대부분의 코드, 문서, 제품 스펙은 한국어로 작성되어 있습니다.

## 명령어

별도 표기가 없으면 저장소 루트에서 실행합니다. Turbo가 워크스페이스 전체로 태스크를 분배합니다.

```bash
npx turbo build          # 전체 워크스페이스 빌드
npx turbo lint           # 전체 lint
npx turbo check-types    # check-types를 정의한 앱에서 tsc --noEmit 실행
npm run commit           # commitizen — Conventional Commits 작성 시 사용 (commitlint + husky가 강제)
```

### 백엔드 (`apps/backend`)

백엔드는 Turbo의 dev 태스크에 **연결되어 있지 않습니다**. `apps/backend`에서 직접 실행하세요.

```bash
npm run start:dev:infra  # docker compose로 Postgres + Valkey 기동 (compose.dev-infra.yaml)
npm run start:dev        # nest start --watch  → http://localhost:3000  (Swagger는 dev에서만 /api)
npm run test             # jest (apps/, libs/ 하위 모든 *.spec.ts)
npm run test -- board.service           # 경로 일부로 단일 스위트 실행
npm run test:e2e:api     # e2e 테스트 (apps/api/test)
npm run lint             # eslint --fix
npx prisma migrate dev   # libs/db/schema.prisma 기준으로 마이그레이션 적용/생성
npx prisma generate      # libs/db/src/generated 로 client 재생성 (postinstall에서도 실행)
```

백엔드 환경 변수는 `apps/backend/.env`에 있습니다(`.env.example`에서 복사). 주요 변수: `DATABASE_URL`, `CACHE_URL`, `JWT_SECRET`, `PORT`(3000), `NODE_ENV`.

### 프런트엔드 앱 공통

세 앱 모두 백엔드(:3000)가 실행 중이어야 동작합니다. 각 앱 디렉터리에서 실행합니다.

```bash
# apps/console  → :3001
# apps/admin    → :3002
# apps/community → :3003
npm run dev          # next dev
npm run build
npm run check-types  # tsc --noEmit
npm run lint         # next lint
```

API 클라이언트 코드 재생성 (`packages/api-client`에서):

```bash
npm run generate     # openapi.json → api.generated.ts 재생성
```

## 백엔드 아키텍처

### 중첩된 Nest 모노레포 구조

`apps/backend`는 `nest-cli.json`에서 하나의 **애플리케이션**과 여러 **라이브러리**로 구성된 Nest 모노레포로 설정되어 있습니다.

- `apps/api/src/` — 배포 대상 앱. 컨트롤러, DTO, `entities/`(응답 직렬화 클래스)가 리소스별로 묶여 있습니다(`auth/`, `boards/`, `spaces/`, `posts/`, `comments/`, `users/`, `admins/`, `tenants/`). `main.ts`가 부트스트랩하고 `api.module.ts`가 전체를 연결합니다.
- `libs/<domain>/` — `@app/<domain>`으로 임포트되는 도메인 라이브러리(`nest-cli.json`의 경로 별칭 + jest `moduleNameMapper`). 예: `@app/board`, `@app/space`, `@app/db`, `@app/config`, `@app/cache`, `@app/util`.

**핵심 분리:** `apps/api/src/`의 컨트롤러는 HTTP 처리 + 인가 + 리소스 간 오케스트레이션을 담당하고, `@app/<domain>` 서비스는 얇은 Prisma 래퍼입니다(예: `BoardService.create/findAll/update/remove`). 가시성/멤버십 검사 같은 비즈니스 규칙은 서비스가 아니라 **컨트롤러 안의 Prisma `where` 절**로 작성됩니다. 동작을 추가할 때 이 패턴을 따르세요 — 서비스는 데이터 접근 프리미티브로 유지하고, 정책은 컨트롤러에 둡니다.

### 데이터베이스 & 멀티테넌시

- Prisma 스키마: `libs/db/schema.prisma`. client는 `libs/db/src/generated/`로 생성되어 `@app/db`로 재익스포트됩니다(`DbService extends PrismaClient`, `@prisma/adapter-pg` 드라이버 사용). 모든 Prisma 타입/이넘(`Role`, `Visibility`, `MembershipStatus`, 모델 타입, `*Args` 타입)은 `@prisma/client`가 아니라 `@app/db`에서 임포트하세요.
- **모든 도메인 테이블은 `tenantId`를 가집니다.** 테넌트 격리는 애플리케이션 레벨에서 강제됩니다 — 컨트롤러가 인증된 사용자의 JWT(`@User()`)에서 `tenantId`를 꺼내 모든 `where`에 추가합니다. DB 레벨 RLS는 없으며 `tenantId`는 절대 요청 헤더가 아니라 토큰에서 옵니다. `tenantId` 스코프를 빠뜨린 쿼리를 작성하지 마세요.
- **소프트 삭제:** 행에 `deletedAt`이 있습니다. "삭제" = `deletedAt: new Date()` 설정. 조회 시 반드시 `deletedAt: null`로 필터링합니다.
- ID는 UUIDv7입니다. 멤버십은 `SpaceUser`/`BoardUser` 조인 테이블에서 `status`(`PENDING`/`ACTIVE`)로 초대 플로우를 처리합니다.

### 인증 & 인가

- **전역 `AuthGuard`**(`apps/api/src/auth/`)가 모든 라우트에서 JWT를 검증합니다. `@Public()`으로 예외 처리합니다.
- JWT의 `type` 클레임으로 구분되는 상호 배타적 토큰 두 종류: `user`, `admin`. `@AdminOnly()` 라우트에 USER 토큰(또는 사용자 라우트에 ADMIN 토큰)을 쓰면 **401이 아니라 403**입니다. 페이로드는 `@User()` / `@Admin()` 파라미터 데코레이터로 얻습니다.
- 역할 위계 `MEMBER < MANAGER < OWNER`, `@Role(...)`로 제어합니다(`auth.constants.ts`의 `ROLE_LEVELS` 참고).
- 데코레이터는 `auth/auth.decorators.ts`에 있습니다: `@Public`, `@AdminOnly`, `@Role`, `@User`, `@Admin`.
- 컨트롤러는 `@Serialize()`(`api.decorators.ts`) + 각 리소스 `entities/`의 `class-transformer` 엔티티 클래스로 응답을 직렬화합니다. 관리자 동작은 `AdminAuditInterceptor`가 기록합니다(password 필드는 마스킹).
- 전역 `ValidationPipe`는 `whitelist + forbidNonWhitelisted`이므로, DTO는 허용하는 모든 필드를 선언해야 합니다. `helmet`은 활성화되어 있고 **CORS는 비활성화**되어 있습니다.

## 프런트엔드 ↔ 백엔드 연결

실제 백엔드 계약(소스로 검증함 — 문서에는 아직 구현되지 않은 향후 의도가 일부 섞여 있음):

- **전역 라우트 프리픽스 없음, API 버저닝 없음.** 라우트는 그대로입니다: `/auth/...`, `/boards`, `/spaces` 등. `/api`나 `/v1`을 가정하지 마세요.
- 인증 엔드포인트는 **JWT 원문 문자열**을 본문으로 반환합니다(`{ token }` 형태가 아님). JWT에는 `exp`가 없고, 아직 **리프레시 토큰 엔드포인트가 없습니다**.
- 백엔드에 CORS가 없으므로 세 앱 모두 **Next.js rewrite 프록시**를 통해 호출합니다: `NEXT_PUBLIC_API_BASE_URL`은 기본값 `/api-proxy`이고, `next.config.ts`에서 `BACKEND_ORIGIN`(`http://localhost:3000`)으로 재작성됩니다. 경로는 그대로 전달됩니다.
- **API 클라이언트:** `@blommunity/api-client`의 `createApiClient`(openapi-fetch 기반)를 각 앱의 `lib/api/client.ts`에서 래핑해 사용합니다. `token.ts`가 `localStorage` 토큰 키(`bl-console-token` 등)를 관리하고, 401 발생 시 토큰을 비워 라우트 가드가 로그인으로 보냅니다.
- **공통 규칙:** 백엔드 엔드포인트를 임의로 만들거나 수정하지 마세요 — 백엔드 소스나 Swagger `/api`로 검증합니다. 백엔드에 아직 없는 기능은 UI 스켈레톤 + "준비 중"으로 처리하고, 가짜 데이터를 절대 쓰지 않습니다. 각 화면의 `components/shell/nav.ts` 항목은 추적성을 위해 `status`(`live`/`soon`)와 feature ID를 가집니다.

### 공용 UI 시스템

Tailwind v4(CSS-first). 세 앱이 공용 패키지를 통해 동일한 디자인 시스템을 공유합니다.

- **`@blommunity/tokens`** — CSS 디자인 토큰. `--bl-*` CSS 변수를 앱별 파일(`console.css`/`community.css`)로 분리해 제공합니다. 테마는 `.bl` 래퍼에 `.dark`를 추가하는 방식(`ThemeProvider`가 설정). `dark:` 변형 없이 CSS 변수만 참조합니다.
- **`@blommunity/ui`** — 공용 React UI 컴포넌트(Button, Input, Modal, Badge, Icon 등). 아이콘은 `Icon` 컴포넌트(이름 → lucide-react 매핑)를 거칩니다.
- 각 앱의 `components/shell/`(sidebar/topbar/shell), `components/auth/`(가드/프로바이더)는 앱별로 관리합니다.
- 디자인 시스템 참조 문서는 `apps/design/`(Astro 기반)에 있습니다.

## 문서

`docs/`에는 코드가 이런 형태인 *이유*를 설명하는 제품 맥락이 담겨 있습니다: `product-spec.md`, `feature-spec.md`(T-/A-/U- feature ID와 ✅/🛠/📅 상태), `erd.md`, `sitemap.md`, `glossary.md`, `threat-model.md`, 그리고 `docs/adr/`의 ADR들(테넌트 격리, 스토리지 어댑터, 리프레시 토큰). 어떤 기능을 지금 연동 가능한지 판단할 때는 `feature-spec.md`를 참고하세요.
