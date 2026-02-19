[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Blommunity Backend

블로그 커뮤니티 서비스의 백엔드 서버입니다.

## Tech Stack

| 분류 | 기술 |
|------|------|
| Framework | NestJS 11 (Monorepo) |
| Language | TypeScript 5 |
| Database | PostgreSQL 18 |
| ORM | Prisma 7 |
| CLI | nest-commander |
| Logger | Winston + nest-winston |
| Validation | Joi |
| Test | Jest 30 + Supertest |
| Code Quality | ESLint 9, Prettier, Husky, lint-staged, commitlint |

## Project Structure

```
├── apps/
│   ├── api/                  # REST API 서버
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── api.module.ts
│   │   │   ├── api.controller.ts
│   │   │   └── api.service.ts
│   │   └── test/             # E2E 테스트
│   └── cli/                  # CLI 애플리케이션
│       └── src/
│           ├── main.ts
│           ├── cli.module.ts
│           └── commands/
│               └── basic.command.ts
├── libs/
│   ├── config/               # 환경 변수 관리 및 설정
│   │   └── src/
│   │       ├── config.constants.ts
│   │       ├── config.enums.ts
│   │       ├── config.interfaces.ts
│   │       └── configs/
│   │           ├── app.config.ts
│   │           ├── db.config.ts
│   │           └── logger.config.ts
│   ├── db/                   # Prisma ORM 서비스
│   │   └── src/
│   │       ├── db.module.ts
│   │       └── db.service.ts
│   └── util/                 # 유틸리티 함수
│       └── src/
│           ├── util.module.ts
│           └── util.service.ts
├── prisma/
│   ├── schema.prisma         # DB 스키마 정의
│   └── migrations/           # 마이그레이션 파일
└── compose.dev-infra.yaml    # 개발용 Docker Compose
```

### Path Aliases

| Alias | Path |
|-------|------|
| `@app/config` | `libs/config/src` |
| `@app/db` | `libs/db/src` |
| `@app/util` | `libs/util/src` |

## Getting Started

### Prerequisites

- Node.js
- Docker (개발용 PostgreSQL)

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
NODE_ENV=development     # development | testing | staging | production
PORT=3000
```

### Database Setup

```bash
# 개발용 PostgreSQL 컨테이너 실행
npm run start:dev:infra

# Prisma 마이그레이션 실행
npx prisma migrate dev

# 개발용 PostgreSQL 컨테이너 종료 (볼륨 및 이미지 포함 삭제)
npm run stop:dev:infra
```

### Run

```bash
# API 서버 (개발 모드)
npm run start:dev

# API 서버 (프로덕션)
npm run start:prod:api

# CLI 실행 (프로덕션)
npm run start:prod
```

## Scripts

| 명령어 | 설명 |
|--------|------|
| `npm run build` | 기본 앱 빌드 |
| `npm run build:all` | 전체 앱 빌드 |
| `npm run start` | 기본 앱 실행 |
| `npm run start:dev` | 개발 모드 실행 (watch) |
| `npm run start:debug` | 디버그 모드 실행 |
| `npm run start:prod` | CLI 프로덕션 실행 |
| `npm run start:prod:api` | API 프로덕션 실행 |
| `npm run start:dev:infra` | 개발용 DB 컨테이너 실행 |
| `npm run stop:dev:infra` | 개발용 DB 컨테이너 종료 |
| `npm run lint` | ESLint 실행 |
| `npm run format` | Prettier 포매팅 |
| `npm run test` | 단위 테스트 실행 |
| `npm run test:watch` | 테스트 watch 모드 |
| `npm run test:cov` | 테스트 커버리지 |
| `npm run test:e2e:api` | API E2E 테스트 |
| `npm run commit` | Commitizen 대화형 커밋 |
| `npm run release` | 버전 릴리스 |

## Database Schema

### User

| Column | Type | Description |
|--------|------|-------------|
| id | BigInt | PK, Auto Increment |
| email | String | Unique |
| password | String | |
| name | String? | Optional |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto Update |

### Post

| Column | Type | Description |
|--------|------|-------------|
| id | BigInt | PK, Auto Increment |
| title | String | |
| content | String? | Optional |
| isPublished | Boolean? | Default: false |
| authorId | BigInt? | FK -> User.id |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto Update |

## Git Conventions

- **Commit**: [Conventional Commits](https://www.conventionalcommits.org/) (`npm run commit`으로 대화형 커밋)
- **Hooks**: Husky로 pre-commit(lint-staged), commit-msg(commitlint) 자동 실행

## TODO

1. 캐싱 기능 추가
2. 커맨더에 테스트코드 추가
3. .vscode 설정

## License

[MIT](LICENSE)
