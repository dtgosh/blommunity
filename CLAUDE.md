# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Blommunity는 **포트폴리오 목적**으로 개발하는 게시판 서비스입니다. **NestJS 11 모노레포** 기반으로 TypeScript 5, PostgreSQL 18, Prisma 7, Valkey(Redis 호환) 캐시를 사용합니다.

## 주요 명령어

```bash
# 로컬 개발 인프라 (Docker로 PostgreSQL + Valkey 실행)
npm run start:dev:infra        # 컨테이너 실행
npm run stop:dev:infra         # 컨테이너 종료 (볼륨, 이미지 포함 삭제)

# 데이터베이스
npx prisma migrate dev         # 마이그레이션 실행 (클라이언트도 자동 생성)
npx prisma generate            # Prisma 클라이언트만 재생성

# 개발
npm run start:dev              # API 서버 핫 리로드 모드 (기본 앱)
npm run build                  # 기본 앱(api) 빌드
npm run build:all              # 전체 앱 빌드

# 테스트
npm run test                   # 전체 단위 테스트
npm run test -- --testPathPattern=<패턴>  # 특정 테스트만 실행
npm run test:e2e:api           # API E2E 테스트

# 코드 품질
npm run lint                   # ESLint (--fix 포함)
npm run format                 # Prettier 포매팅
npm run commit                 # Commitizen 대화형 커밋
```

## 아키텍처

### 모노레포 구조

- **`apps/api/`** — REST API 서버이며 기본 앱입니다 (NestJS + Express).
- **`apps/cli/`** — CLI 애플리케이션입니다 (nest-commander).
- **`libs/`** — 공유 라이브러리이며, `@app/<name>` 경로 별칭으로 임포트합니다:
  - `@app/config` — 글로벌 설정 모듈입니다. `app.*` (env, port, name)과 `secret.*` (DATABASE_URL, CACHE_URL, JWT_SECRET) 두 네임스페이스로 구성되며, Joi로 시작 시 검증합니다.
  - `@app/db` — 글로벌 DB 모듈입니다. `DbService extends PrismaClient`, `@prisma/adapter-pg`를 사용합니다.
  - `@app/cache` — 글로벌 캐시 모듈입니다 (Valkey + `@keyv/valkey` + `@nestjs/cache-manager`).
  - `@app/post` — 게시글 비즈니스 로직입니다 (앱 간 공유되는 서비스 레이어).
  - `@app/util` — 글로벌 유틸리티 모듈이며, 커스텀 데코레이터를 포함합니다.

`DbModule`과 `UtilModule`은 `@Global()`로 선언되어 별도 임포트 없이 어디서든 사용 가능합니다.

### Prisma

- 스키마는 `prisma/schema.prisma`에 정의되어 있으며, 생성된 클라이언트는 `generated/prisma/`에 위치합니다 (gitignore 대상, `postinstall`에서 자동 생성).
- 모델은 `Account`, `Group`, `Membership`, `Post`, `Comment`이며, 모두 `BigInt` PK와 소프트 삭제(`deletedAt`)를 사용합니다.
- DB 컬럼은 snake_case(`@map`), TypeScript 속성은 camelCase입니다.
- Enum은 `AccountRole`, `MembershipRole`, `GroupVisibility`입니다.
- 생성된 타입은 `generated/prisma/client`, `generated/prisma/enums`, `generated/prisma/models`에서 임포트합니다.

### 인증

- `@nestjs/jwt` 기반 JWT Bearer 토큰 인증을 사용합니다. 글로벌 `AuthGuard`가 `APP_GUARD`로 등록되어 모든 라우트가 기본 보호됩니다.
- `@Public()` — 인증을 건너뜁니다. `@Role(AccountRole.X)` — 최소 역할 수준을 강제합니다. `@User()` — 요청에서 `AuthenticatedUser`를 추출합니다.
- 비밀번호는 bcrypt로 해싱합니다.

### 주요 데코레이터 및 패턴

- **`@Serialize()`** — `ClassSerializerInterceptor`를 `excludeAll` 전략으로 적용합니다. 응답 엔티티는 노출할 필드에 `@Expose()`가 필수입니다.
- **`@BigIntId()`** — BigInt 필드용 복합 데코레이터입니다. 요청/응답 양방향 string↔BigInt 변환과 Swagger 타입을 String으로 설정합니다.
- **소프트 삭제** — 모든 쿼리에서 `deletedAt: null` 필터가 필수입니다.
- **엔티티 상속** — 예: `PostDetailEntity extends PostListItemEntity`로 중복을 제거합니다.
- **DTO** — `class-validator` 데코레이터 + `@ApiSchema`(Swagger)를 사용합니다. `PartialType()` 및 클래스 상속으로 재사용합니다.

### API 부트스트랩 (`apps/api/src/main.ts`)

- Winston 로거 (개발: pretty-print, 프로덕션: JSON)
- Helmet 미들웨어
- 글로벌 `ValidationPipe`: `transform: true`, `whitelist: true`, `forbidNonWhitelisted: true`
- Swagger UI: `/api` 경로 (프로덕션 외 환경에서만)

## 코드 스타일

- **ESLint 9** flat config + `typescript-eslint` recommendedTypeChecked + Prettier.
- `explicit-function-return-type: error` — 모든 함수에 명시적 반환 타입이 필수입니다.
- `explicit-member-accessibility: error` — 모든 클래스 멤버에 접근 제어자가 필수입니다 (생성자: `no-public`).
- `lines-between-class-members: always` (단일 행 멤버 뒤는 예외).
- Prettier: 작은따옴표, trailing comma.
- TypeScript: `module: nodenext`, `moduleResolution: nodenext`, `target: ES2023`, strict 모드.

## Git 컨벤션

- **Conventional Commits** — commitlint(Husky 훅)으로 강제합니다.
- Pre-commit 훅에서 `lint-staged`를 실행합니다 (`*.ts` 파일에 ESLint --fix).
- `npm run commit`으로 Commitizen 대화형 커밋 UI를 사용합니다.
- 코드베이스 내 주석은 한글 존댓말로 작성합니다.
