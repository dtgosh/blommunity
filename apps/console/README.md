# Blommunity 테넌트 콘솔 (`@blommunity/console`)

사업자가 자기 커뮤니티를 만들고 운영하는 **테넌트 콘솔(CMS)**. 헤드리스 백엔드
(`apps/backend`, NestJS)를 소비하는 독립 프론트엔드 앱입니다.

- **스택**: Next.js 15 (App Router) · React 19 · TypeScript(strict) · Tailwind CSS v4
- **디자인 시스템**: `docs/design/components/console-system.jsx`의 `--bl-*` 토큰을
  `app/globals.css`에 1:1 이식하고, Tailwind `@theme inline`으로 색 유틸리티에 매핑.
- **아이콘**: `lucide-react` (`components/ui/icon.tsx`에서 디자인 토큰 이름 → Lucide 매핑)
- **폰트**: Inter(`next/font`) + Pretendard(CDN)
- **테마**: `.bl` 래퍼에 `.dark` 클래스 토글 (색 유틸리티가 변수를 참조하므로 자동 전환)

## 개발

```bash
# 레포 루트에서 (npm workspaces)
npm install

# 백엔드 (다른 터미널, 포트 3000)
npm run start:dev -w backend     # 또는 apps/backend 에서 npm run start:dev

# 콘솔 (포트 3001)
npm run dev -w @blommunity/console
```

콘솔은 <http://localhost:3001> 에서 뜹니다.

### API 연동 메모

백엔드는 **CORS가 비활성**이고 라우트에 `/api`·`/v1` 같은 prefix가 **없습니다**(소스 확인).
브라우저에서 직접 호출하면 CORS로 막히므로, `next.config.ts`의 rewrite로 프록시합니다:

```
/api-proxy/:path*  →  ${BACKEND_ORIGIN}/:path*   (기본 http://localhost:3000)
```

따라서 클라이언트는 `NEXT_PUBLIC_API_BASE_URL`(기본 `/api-proxy`)를 베이스로 호출합니다.
환경변수는 `.env.local` 참고. 실제 스키마는 dev 서버의 Swagger(`http://localhost:3000/api`)에서 확인하세요.

## 화면 상태

| 화면 | 기능 ID | 상태 |
|------|---------|:----:|
| 대시보드 | T-OP-04 | 📅 준비 중 |
| 공간 관리 | T-SP-01~15 | ✅ (곧 구현) |
| 게시판 관리 | T-BD-01~16 | ✅ (곧 구현) |
| 회원 관리 | T-UM-01~07 | ✅ (곧 구현) |
| 신고·모더레이션 | T-OP-01~03 | 📅 준비 중 |
| 사이트 설정 | T-ST-01~05 | 📅 준비 중 |
| 내 프로필 | T-AC-03~05 | ✅ (곧 구현) |
| 회원가입/로그인 | T-AC-01·02 | ✅ (인증 단계에서 구현) |

> 현재는 **1단계(스캐폴딩 + 디자인 토큰/폰트 + 셸)** 까지 구현됨. 인증·API 래퍼·도메인
> 화면은 다음 단계에서 추가합니다.
