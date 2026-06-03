[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# blommunity

게시판/블로그/커뮤니티 서비스를 사업하려는 사업자(테넌트)가 공통적으로 필요로 하는 기능을 한 곳에서 제공하는 SaaS형 백엔드입니다.

## 배경

NHN커머스의 샵바이라는 서비스가 있습니다.

고객사가 추구하는 이커머스 서비스를 자유롭게 구축할 수 있도록 필요한 기능들(API, 디자인, CMS, SEO, etc.)을 거의 모두 제공해주던 서비스입니다.

여기에 영감을 받아 게시판/블로그/커뮤니티 서비스 관련하여서 필요한 기능들을 모두 제공하는 서비스를 만들면 재미있겠다고 생각하게 되었습니다.

## 핵심 개념

### 운영자 (Admin)

blommunity 자체를 운영하는 내부 인력이며, 3단계 역할 계층을 가집니다.

| 역할 | 권한 |
|------|------|
| `OWNER` | `MANAGER`를 임명할 수 있습니다. |
| `MANAGER` | 신규 `MEMBER`의 가입을 승인할 수 있습니다. |
| `MEMBER` | 테넌트를 관리할 수 있습니다. |

신규 운영자는 가입 후 `PENDING` 상태로 시작하며, `MANAGER` 이상의 승인을 받아야 `APPROVED` 상태가 되어 활동할 수 있습니다. 모든 운영자의 활동은 `AdminAuditLog`로 기록됩니다.

### 테넌트 (Tenant)

blommunity의 고객이자 게시판 관련 서비스를 운영하는 사업자입니다. 각 테넌트는 독립된 데이터 공간을 가지며, 그 안에서 자체적인 사용자/공간/게시판/게시물/댓글을 운영합니다.

### 도메인 계층 구조

```
Tenant ── Space ── Board ── Post ── Comment
  └── User (테넌트 소속 사용자; Space/Board에 멤버로 참여)
```

- **Space**: 테넌트가 운영하는 하나의 공간 단위 (예: 특정 사이트, 커뮤니티)
- **Board**: 공간 내부의 게시판
- **Post / Comment**: 게시판의 게시물과 댓글 (대댓글 지원, 활성 댓글/답글 수 카운터 관리)

사용자는 `SpaceUser` / `BoardUser`를 통해 개별 공간/게시판에 역할(`OWNER`/`MANAGER`/`MEMBER`)을 가지고 소속됩니다. 모든 리소스는 공개 범위(`PUBLIC`/`PRIVATE`)를 가지며, 소프트 삭제(`deletedAt`)를 지원합니다.

## Tech Stack

| 분류 | 기술 |
|------|------|
| Framework | NestJS 11 (Monorepo) |
| Language | TypeScript 5 |
| Database | PostgreSQL 18 |
| ORM | Prisma 7 |
| Cache | Valkey 9 (Redis 호환) |
| Auth | JWT + bcrypt |
| Security | Helmet |
| Scheduler | @nestjs/schedule (배치 앱) |
| API Docs | Swagger (@nestjs/swagger) |
| Logger | Winston + nest-winston |
| Validation | Joi, class-validator |
| Test | Jest 30 + Supertest |
| Code Quality | ESLint 9, Prettier, Husky, lint-staged, commitlint, commitizen, commit-and-tag-version |

## Project Structure

```
├── apps/
│   ├── api/                  # REST API 서버
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── api.module.ts
│   │   │   ├── auth/         # 인증 (사용자/테넌트/운영자 sign-up·sign-in, JWT)
│   │   │   ├── admins/       # 운영자 관리 (승인, 역할, 감사 로그 인터셉터)
│   │   │   ├── tenants/      # 테넌트 관리
│   │   │   ├── users/        # 테넌트 소속 사용자 관리
│   │   │   ├── spaces/       # 공간 관리
│   │   │   ├── boards/       # 게시판 관리
│   │   │   ├── posts/        # 게시물 관리
│   │   │   └── comments/     # 댓글 / 대댓글 관리
│   │   └── test/             # E2E 테스트
│   └── batch/                # 배치/스케줄러 서버 (@nestjs/schedule)
├── libs/                     # 도메인별 비즈니스 로직 라이브러리
│   ├── admin/                # 운영자 도메인
│   ├── tenant/               # 테넌트 도메인
│   ├── user/                 # 사용자 도메인
│   ├── space/                # 공간 도메인
│   ├── board/                # 게시판 도메인
│   ├── post/                 # 게시물 도메인
│   ├── comment/              # 댓글 도메인
│   ├── cache/                # 캐시 모듈 (Valkey)
│   ├── config/               # 환경 변수 관리 및 설정 (app/secret)
│   ├── db/                   # Prisma 스키마, 마이그레이션, 클라이언트
│   └── util/                 # 공용 유틸리티 및 데코레이터
└── compose.dev-infra.yaml    # 개발용 Docker Compose (PostgreSQL + Valkey)
```

## Getting Started

### Prerequisites

- Node.js
- Docker (개발용 PostgreSQL + Valkey)

### Installation

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
```

### Database Setup

```bash
# 개발용 PostgreSQL + Valkey 컨테이너 실행
npm run start:dev:infra

# Prisma 마이그레이션 실행
npx prisma migrate dev

# 개발용 컨테이너 종료 (볼륨 및 이미지 포함 삭제)
npm run stop:dev:infra
```

### Run

```bash
# API 서버 (개발 모드, 기본 앱)
npm run start:dev

# 배치 서버 (개발 모드)
npm run start:dev batch

# 전체 앱 빌드
npm run build:all

# API 서버 (프로덕션)
npm run start:prod:api
```

### Test

```bash
# 단위 테스트
npm test

# API E2E 테스트
npm run test:e2e:api

# 커버리지 리포트
npm run test:cov
```

## Git Conventions

- **Commit**: [Conventional Commits](https://www.conventionalcommits.org/) (`npm run commit`으로 대화형 커밋)
- **Hooks**: Husky로 pre-commit(lint-staged), commit-msg(commitlint) 자동 실행
- **Release**: `npm run release` (commit-and-tag-version으로 버전 태깅 + CHANGELOG 갱신)

## License

[MIT](../../LICENSE)
