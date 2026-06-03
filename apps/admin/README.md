# Blommunity 운영자 어드민 (`@blommunity/admin`)

Blommunity **플랫폼 자체를 운영**하는 운영자(Admin) 어드민. 헤드리스 백엔드
(`apps/backend`, NestJS)를 소비하는 독립 프론트엔드 앱입니다. 테넌트 콘솔
(`apps/console`)과 디자인 시스템·셸 구조를 공유하지만, **ADMIN 토큰**으로 동작하며
USER 토큰과 절대 섞이지 않습니다(X-SC-02).

- **스택**: Next.js 15 (App Router) · React 19 · TypeScript(strict) · Tailwind CSS v4
- **인증**: ADMIN JWT(`{ type:'admin', id, role }`). `localStorage` 키 `bl-admin-token`.
  로그인은 이메일+비밀번호. 가입은 승인제(PENDING → MANAGER+ 승인 후 로그인 가능).
- **포트**: 3002 (콘솔 3001, 백엔드 3000)

## 개발

```bash
# 레포 루트에서 (npm workspaces)
npm install

# 백엔드 (다른 터미널, 포트 3000)
npm run start:dev -w backend     # 또는 apps/backend 에서 npm run start:dev

# 어드민 (포트 3002)
npm run dev -w @blommunity/admin
```

어드민은 <http://localhost:3002> 에서 뜹니다. 백엔드는 **CORS가 비활성**이라
`next.config.ts`의 rewrite로 프록시합니다(`/api-proxy/:path*` → `${BACKEND_ORIGIN}/:path*`).

## 화면 상태

| 화면 | 기능 ID | 상태 |
|------|---------|:----:|
| 로그인 / 가입 신청 | A-AC-01·02 | ✅ |
| 대시보드 | A-ST-01·02 | 📅 준비 중 |
| 운영자 관리 | A-AM-01~07 | ✅ |
| 사업자(테넌트) 관리 | A-TN-01~04 | ✅ (정지·사용량 A-TN-05·06 📅) |
| 감사 로그 | A-AL-02 | 📅 준비 중 |
| 내 프로필 | A-AC-03~04 | ✅ (조회/이름·이메일 수정/비밀번호 변경) |

> 운영자 본인 프로필 전용 조회 API(A-AC-04)는 아직 없어, 토큰의 `id`로
> `GET /admins/:id`(A-AM-02)를 호출해 프로필을 구성합니다. 본인 정보 수정은
> `PATCH /admins/:id`(A-AM-03)를 사용합니다.
