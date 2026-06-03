# Blommunity

> 누구나 자기만의 커뮤니티를 빠르게 열고, 온전히 소유한다.

게시판·블로그·커뮤니티를 만들고 싶은 누구나, 코드 없이도 자기만의 커뮤니티를 열 수 있게 하는 **오픈소스 멀티테넌트 커뮤니티 플랫폼**입니다.

NHN커머스의 "샵바이"가 쇼핑몰 영역에서 한 일 — 필요한 기능(API·CMS·디자인·SEO)을 거의 다 제공해 누구나 자기 쇼핑몰을 차리게 한 것 — 을, Blommunity는 **게시판·커뮤니티 영역**에서 합니다.

---

## 제품 구조

Blommunity는 세 사용자 그룹에 대응하는 세 개의 "면"을 가집니다.

| 사용자 | 역할 | 앱 |
|--------|------|-----|
| **운영자 (Admin)** | Blommunity 플랫폼 자체를 관리 | `apps/admin` |
| **테넌트 (Tenant)** | 자기 커뮤니티를 만들고 운영 | `apps/console` |
| **회원 (User)** | 커뮤니티에서 실제로 활동 | `apps/community` |

```
테넌트(Tenant)  ─ 사업자 하나
  └─ 공간(Space)  ─ 사이트/커뮤니티 단위 (여러 개 가능)
       └─ 게시판(Board)  ─ 주제별 게시판
            └─ 게시물(Post)
                 └─ 댓글(Comment)  ─ 대댓글 지원
```

---

## 모노레포 구조

npm workspaces + Turborepo 기반입니다.

```
blommunity/
├── apps/
│   ├── backend/          # NestJS 11 헤드리스 REST API (중첩 Nest 모노레포)
│   │   ├── apps/api/     # 배포 대상 앱 (컨트롤러·DTO·엔티티)
│   │   └── libs/         # 도메인 라이브러리 (@app/board, @app/space, @app/db …)
│   ├── console/          # Next.js 15 테넌트 콘솔 (CMS) — :3001
│   ├── admin/            # Next.js 15 운영자 어드민 — :3002
│   └── community/        # Next.js 15 커뮤니티 기본 템플릿 — :3003
└── packages/
    ├── api-client/       # @blommunity/api-client — openapi-fetch 기반 타입 안전 HTTP 클라이언트
    ├── types/            # @blommunity/types — 공용 TypeScript 타입
    ├── ui/               # @blommunity/ui — 공용 React UI 컴포넌트
    ├── tokens/           # @blommunity/tokens — Tailwind v4 CSS 디자인 토큰
    └── design/           # 디자인 시스템 참조 문서
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| **백엔드** | NestJS 11 · TypeScript · Prisma · PostgreSQL · Valkey(캐시) |
| **프론트엔드** | Next.js 15 App Router · React 19 · Tailwind CSS v4 |
| **공용 패키지** | openapi-fetch (`api-client`) · 공용 UI 컴포넌트 (`ui`) · CSS 토큰 (`tokens`) |
| **인증** | JWT (USER / ADMIN 토큰 분리) · bcryptjs |
| **DB 식별자** | UUIDv7 (시간 정렬 가능) |
| **빌드** | Turborepo · npm workspaces |
| **품질** | commitlint · husky · lint-staged · ESLint |

---

## 시작하기

### 사전 요구사항

- Node.js 22+
- Docker (PostgreSQL + Valkey 인프라용)

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp apps/backend/.env.example apps/backend/.env
# .env 편집: DATABASE_URL, CACHE_URL, JWT_SECRET
```

### 3. 인프라 기동

```bash
cd apps/backend
npm run start:dev:infra   # Docker Compose로 Postgres + Valkey 기동
```

### 4. DB 마이그레이션

```bash
cd apps/backend
npx prisma migrate dev
```

### 5. 백엔드 실행

```bash
cd apps/backend
npm run start:dev         # → http://localhost:3000  (Swagger: /api)
```

### 6. 프론트엔드 실행

각 앱은 독립적으로 실행합니다. 백엔드(:3000)가 먼저 실행 중이어야 합니다.

```bash
# 테넌트 콘솔
cd apps/console && npm run dev    # → http://localhost:3001

# 운영자 어드민
cd apps/admin && npm run dev      # → http://localhost:3002

# 커뮤니티 템플릿
cd apps/community && npm run dev  # → http://localhost:3003
```

---

## 주요 명령어

루트에서 실행 (Turbo가 워크스페이스로 분배):

```bash
npx turbo build          # 전체 빌드
npx turbo lint           # 전체 lint
npx turbo check-types    # 타입 검사
npm run commit           # Conventional Commits 작성 (commitizen)
```

백엔드 전용 (`apps/backend`에서):

```bash
npm run test                        # Jest 유닛 테스트
npm run test:e2e:api                # e2e 테스트
npx prisma migrate dev              # 마이그레이션 적용
npx prisma generate                 # Prisma Client 재생성
```

API 클라이언트 코드 재생성 (`packages/api-client`에서):

```bash
npm run generate          # openapi.json → api.generated.ts 재생성
```

---

## 구현 현황

### ✅ 완료

**백엔드 API**
- 멀티테넌트 인증·인가 (JWT, USER/ADMIN 분리, 역할 계층)
- 공간(Space) · 게시판(Board) CRUD + 멤버십(초대·수락·거절)
- 게시물(Post) · 댓글(Comment) CRUD + 대댓글 + 카운터 자동 관리
- 운영자 관리 (승인 워크플로우, 권한 임명, 감사 로그)
- 테넌트 관리 (사업자 CRUD)
- 소프트 삭제, UUIDv7, ValidationPipe, Helmet, 구조화 로깅

**공용 패키지**
- `@blommunity/api-client` — OpenAPI 스펙 기반 타입 안전 HTTP 클라이언트 (openapi-fetch)
- `@blommunity/types` — 공용 TypeScript 타입
- `@blommunity/ui` — 공용 React UI 컴포넌트 (Button, Input, Modal, Badge 등)
- `@blommunity/tokens` — Tailwind v4 CSS 디자인 토큰 (콘솔/커뮤니티 테마 분리)

**프론트엔드**
- 테넌트 콘솔: 회원가입/로그인, 공간·게시판·회원 관리, 프로필
- 운영자 어드민: 로그인, 운영자 관리, 사업자 관리, 프로필
- 커뮤니티 템플릿: 회원가입/로그인, 공간·게시판·게시물·댓글 기본 흐름

### 🛠 다음 우선순위 (M1)

- 이미지·파일 첨부 (S3 호환 스토리지)
- 게시물·댓글 좋아요/반응
- 게시물 태그·분류
- RefreshToken

### 📅 이후 단계

알림 → 신고·모더레이션 → 검색 → 소셜 로그인 → 자체 도메인 → 오픈소스 정식 공개

---

## 아키텍처 원칙

- **헤드리스 (API 우선)**: 백엔드 API 계약이 단일 진실 공급원. 프론트엔드 3개가 동일 API 소비.
- **MACH**: 마이크로서비스 지향, API 우선, 헤드리스, 클라우드 친화.
- **테넌트 격리**: 모든 도메인 테이블에 `tenantId`. JWT에서 자동 주입, DB 레벨 RLS 없음.
- **소프트 삭제**: `deletedAt` 필드로 복구 가능한 삭제. 조회 시 `deletedAt: null` 필터 필수.
- **컨트롤러에 정책**: 서비스는 얇은 Prisma 래퍼, 비즈니스 규칙(가시성·멤버십 검사)은 컨트롤러 `where` 절에.

---

## 문서

| 문서 | 내용 |
|------|------|
| [product-spec.md](docs/product-spec.md) | 제품 비전·원칙·로드맵 |
| [feature-spec.md](docs/feature-spec.md) | 기능 명세 (T-/A-/U- 기능 ID) |
| [erd.md](docs/erd.md) | 데이터 모델 |
| [sitemap.md](docs/sitemap.md) | 화면 구조 |
| [threat-model.md](docs/threat-model.md) | 보안 위협 모델 |
| [docs/adr/](docs/adr/) | 주요 설계 결정 기록 (ADR) |

---

## 라이선스

MIT © dtgosh
