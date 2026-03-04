[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Blommunity

모든 유형의 게시판에서 공통적으로 사용하는 기능을 제공합니다.

## Tech Stack

| 분류 | 기술 |
|------|------|
| Framework | NestJS 11 (Monorepo) |
| Language | TypeScript 5 |
| Database | PostgreSQL 18 |
| ORM | Prisma 7 |
| Cache | Valkey 9 (Redis 호환) |
| Auth | JWT + bcrypt |
| CLI | nest-commander |
| Logger | Winston + nest-winston |
| Validation | Joi, class-validator |
| Test | Jest 30 + Supertest |
| Code Quality | ESLint 9, Prettier, Husky, lint-staged, commitlint |

## Project Structure

```
├── apps/
│   ├── api/                  # REST API 서버
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── api.module.ts
│   │   │   ├── auth/         # 인증 모듈 (JWT, Guard, 데코레이터)
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   └── posts/        # 게시글 모듈 (컨트롤러, DTO, 엔티티)
│   │   │       ├── dto/
│   │   │       └── entities/
│   │   └── test/             # E2E 테스트
│   └── cli/                  # CLI 애플리케이션
│       └── src/
│           ├── main.ts
│           ├── cli.module.ts
│           └── commands/
│               └── basic.command.ts
├── libs/
│   ├── cache/                # 캐시 모듈 (Valkey)
│   ├── config/               # 환경 변수 관리 및 설정
│   │   └── src/
│   │       ├── config.constants.ts
│   │       ├── config.enums.ts
│   │       ├── config.interfaces.ts
│   │       └── configs/
│   │           ├── app.config.ts
│   │           └── secret.config.ts
│   ├── db/                   # Prisma ORM 서비스
│   ├── post/                 # 게시글 비즈니스 로직
│   └── util/                 # 유틸리티 및 커스텀 데코레이터
│       └── src/
│           ├── util.module.ts
│           ├── util.service.ts
│           └── decorators/
│               ├── bigint-id.decorator.ts
│               └── serialize.decorator.ts
├── prisma/
│   ├── schema.prisma         # DB 스키마 정의
│   └── migrations/           # 마이그레이션 파일
├── generated/                # Prisma 생성 클라이언트 (gitignore)
└── compose.dev-infra.yaml    # 개발용 Docker Compose
```

### Path Aliases

| Alias | Path |
|-------|------|
| `@app/cache` | `libs/cache/src` |
| `@app/config` | `libs/config/src` |
| `@app/db` | `libs/db/src` |
| `@app/post` | `libs/post/src` |
| `@app/util` | `libs/util/src` |

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

### Environment Variables

```bash
# PostgreSQL Docker 컨테이너 설정
POSTGRES_USER=postgres
POSTGRES_PASSWORD=LocalDbPw
POSTGRES_DB=postgres

# DB 접속 정보
DB_HOST=localhost        # Docker 내부에서는 컨테이너 이름(blommunity-db) 사용
DB_PORT=5432
DB_SCHEMA=public

# 애플리케이션 설정
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=${DB_SCHEMA}
CACHE_URL=redis://localhost:6379
JWT_SECRET=<최소 32자 이상의 문자열>
NODE_ENV=development     # development | testing | staging | production
PORT=3000
APP_NAME=BlommunityApi
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
# API 서버 (개발 모드)
npm run start:dev

# API 서버 (프로덕션)
npm run start:prod:api

# CLI 실행 (프로덕션)
npm run start:prod:cli
```

## Scripts

| 명령어 | 설명 |
|--------|------|
| `npm run build` | 기본 앱 빌드 |
| `npm run build:all` | 전체 앱 빌드 |
| `npm run start` | 기본 앱 실행 |
| `npm run start:dev` | 개발 모드 실행 (watch) |
| `npm run start:debug` | 디버그 모드 실행 |
| `npm run start:prod:api` | API 프로덕션 실행 |
| `npm run start:prod:cli` | CLI 프로덕션 실행 |
| `npm run start:dev:infra` | 개발용 인프라 컨테이너 실행 |
| `npm run stop:dev:infra` | 개발용 인프라 컨테이너 종료 |
| `npm run lint` | ESLint 실행 |
| `npm run format` | Prettier 포매팅 |
| `npm run test` | 단위 테스트 실행 |
| `npm run test:watch` | 테스트 watch 모드 |
| `npm run test:cov` | 테스트 커버리지 |
| `npm run test:e2e:api` | API E2E 테스트 |
| `npm run commit` | Commitizen 대화형 커밋 |
| `npm run release` | 버전 릴리스 |

## Database Schema

### Account (계정)

| Column | Type | Description |
|--------|------|-------------|
| id | BigInt | PK, Auto Increment |
| username | String | Unique |
| role | AccountRole | OWNER / ADMIN / USER (기본값: USER) |
| email | String? | Unique, Optional |
| password | String | bcrypt 해싱 |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto Update |
| deletedAt | DateTime? | 소프트 삭제 |

### Group (그룹)

| Column | Type | Description |
|--------|------|-------------|
| id | BigInt | PK, Auto Increment |
| name | String | Unique |
| description | String? | Optional |
| visibility | GroupVisibility | PUBLIC / PRIVATE |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto Update |
| deletedAt | DateTime? | 소프트 삭제 |

### Membership (멤버십)

| Column | Type | Description |
|--------|------|-------------|
| id | BigInt | PK, Auto Increment |
| groupId | BigInt | FK -> Group.id |
| accountId | BigInt | FK -> Account.id |
| role | MembershipRole | OWNER / ADMIN / USER |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto Update |
| deletedAt | DateTime? | 소프트 삭제 |

### Post (게시글)

| Column | Type | Description |
|--------|------|-------------|
| id | BigInt | PK, Auto Increment |
| authorId | BigInt | FK -> Account.id |
| groupId | BigInt? | FK -> Group.id, Optional |
| title | String | |
| content | String? | Optional |
| isPublished | Boolean | Default: false |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto Update |
| deletedAt | DateTime? | 소프트 삭제 |

### Comment (댓글)

| Column | Type | Description |
|--------|------|-------------|
| id | BigInt | PK, Auto Increment |
| authorId | BigInt | FK -> Account.id |
| postId | BigInt | FK -> Post.id |
| parentCommentId | BigInt? | FK -> Comment.id (대댓글) |
| content | String | |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto Update |
| deletedAt | DateTime? | 소프트 삭제 |

## Git Conventions

- **Commit**: [Conventional Commits](https://www.conventionalcommits.org/) (`npm run commit`으로 대화형 커밋)
- **Hooks**: Husky로 pre-commit(lint-staged), commit-msg(commitlint) 자동 실행

## License

[MIT](LICENSE)
