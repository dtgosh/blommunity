# Blommunity 커뮤니티 기본 템플릿 (`@blommunity/community`)

사업자의 커뮤니티에 가입한 **회원(USER)이 사용하는 프론트엔드**. 헤드리스 백엔드
(`apps/backend`, NestJS)를 소비하는 독립 앱입니다. 콘솔(`apps/console`)·어드민
(`apps/admin`)과 디자인 시스템·프리미티브·API 클라이언트 코어를 공유하지만,
회원 시점의 헤더 기반 IA(공간·게시판 둘러보기 → 글 → 댓글)를 가집니다.

- **스택**: Next.js 15 (App Router) · React 19 · TypeScript(strict) · Tailwind CSS v4
- **인증**: USER JWT(`{ type:'user', id, tenantId, role }`). `localStorage` 키
  `bl-console-token`(콘솔과 동일 — 같은 USER 토큰 체계). 로그인/가입은 tenantId 컨텍스트.
- **포트**: 3003 (콘솔 3001, 어드민 3002, 백엔드 3000)

## 개발

```bash
# 레포 루트에서 (npm workspaces)
npm install

# 백엔드 (다른 터미널, 포트 3000)
npm run start:dev -w backend

# 커뮤니티 (포트 3003)
npm run dev -w @blommunity/community
```

커뮤니티는 <http://localhost:3003> 에서 뜹니다. 백엔드는 **CORS가 비활성**이라
`next.config.ts`의 rewrite로 프록시합니다(`/api-proxy/:path*` → `${BACKEND_ORIGIN}/:path*`).

## 화면 상태

| 화면 | 기능 ID | 상태 |
|------|---------|:----:|
| 로그인 / 회원가입 | U-AC-01·02 | ✅ |
| 메인 (공간·게시판 둘러보기) | T-SP-02 · T-BD-02 | ✅ |
| 게시판 상세 (글 목록) | U-PT-02 | ✅ |
| 게시물 상세 + 댓글·대댓글 | U-PT-03 · U-CM-01~06 | ✅ |
| 글쓰기 / 수정 | U-PT-01 · U-PT-04 · U-PT-05 | ✅ (첨부·태그 U-PT-06·08 준비 중) |
| 받은 초대함 | U-PJ-03 · U-PJ-04 | ✅ |
| 내 프로필 | U-AC-03 ~ U-AC-05 | ✅ |
| 검색 | U-PT-12 | 📅 준비 중 |

## 백엔드 계약 메모 (비자명)

- `GET /spaces`·`/boards`·`/posts`·`/comments`는 모두 **인증(@User) 필요** —
  비로그인 둘러보기는 불가. 따라서 전 화면이 로그인 게이트 뒤에 있습니다.
- 게시물·댓글 응답은 스칼라만(`authorId`만, `username` 없음). 작성자명은
  `GET /users`로 id→username 매핑(`lib/use-user-names.ts`).
- `GET /posts`에 boardId 필터·페이지네이션 없음 → 전체를 받아 클라이언트에서
  boardId로 필터링·정렬.
- 댓글 계층은 `GET /comments?postId=&parentId=`로 최상위/대댓글 분리. 대댓글은
  펼칠 때 지연 로드.
- 좋아요·저장·공유(U-PT-07·13, U-CM-07)와 검색(U-PT-12), 첨부·태그(U-PT-06·08)는
  백엔드 미구현 → 비활성 + "준비 중".
