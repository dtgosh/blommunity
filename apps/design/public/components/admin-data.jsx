// admin-data.jsx — Blommunity 운영자 어드민 더미 데이터 (window globals)

// 현재 로그인한 운영자 (역할은 데모 스위처로 바뀜)
window.ADMIN_ME = { name: '김도윤', email: 'doyun.kim@blommunity.io', idx: 7 };

// ── 테넌트 (커뮤니티 운영 사업자 고객) ──────────────────────────
window.ADMIN_TENANTS = [
  { id: 't_bookclub', name: '북클럽', domain: 'bookclub', owner: '지은', ownerEmail: 'jieun@bookclub.kr', idx: 0, status: 'ACTIVE', plan: 'Growth', spaces: 2, boards: 7, posts: 4128, members: 237, storageUsed: 1.2, storageQuota: 5, createdAt: '2024-03-12', lastActive: '방금' },
  { id: 't_side', name: '사이드프로젝트 모임', domain: 'sideproject', owner: '태호', ownerEmail: 'taeho@side.io', idx: 1, status: 'ACTIVE', plan: 'Growth', spaces: 4, boards: 12, posts: 8842, members: 612, storageUsed: 3.4, storageQuota: 5, createdAt: '2023-11-02', lastActive: '7분 전' },
  { id: 't_mountain', name: '등산 크루', domain: 'mountain', owner: '영민', ownerEmail: 'ym@mtn.kr', idx: 4, status: 'ACTIVE', plan: 'Starter', spaces: 1, boards: 4, posts: 1903, members: 158, storageUsed: 0.6, storageQuota: 2, createdAt: '2024-01-20', lastActive: '32분 전' },
  { id: 't_baking', name: '베이킹 클래스', domain: 'baking', owner: '수진', ownerEmail: 'sujin@bake.kr', idx: 5, status: 'PENDING', plan: 'Starter', spaces: 0, boards: 0, posts: 0, members: 1, storageUsed: 0, storageQuota: 2, createdAt: '2026-05-29', lastActive: '—' },
  { id: 't_board', name: '보드게임 길드', domain: 'boardgame', owner: '현우', ownerEmail: 'hw@bg.gg', idx: 3, status: 'ACTIVE', plan: 'Growth', spaces: 3, boards: 9, posts: 5310, members: 421, storageUsed: 2.1, storageQuota: 5, createdAt: '2023-08-14', lastActive: '1시간 전' },
  { id: 't_running', name: '러닝 클럽', domain: 'running', owner: '지훈', ownerEmail: 'jh@run.kr', idx: 6, status: 'SUSPENDED', plan: 'Starter', spaces: 1, boards: 3, posts: 740, members: 88, storageUsed: 0.3, storageQuota: 2, createdAt: '2024-02-28', lastActive: '4일 전', note: '결제 미납으로 정지' },
  { id: 't_photo', name: '사진 동호회', domain: 'photo', owner: '미나', ownerEmail: 'mina@photo.kr', idx: 2, status: 'ACTIVE', plan: 'Scale', spaces: 5, boards: 18, posts: 14203, members: 1840, storageUsed: 12.8, storageQuota: 20, createdAt: '2022-12-01', lastActive: '12분 전' },
  { id: 't_writing', name: '글쓰기 워크숍', domain: 'writing', owner: '다은', ownerEmail: 'daeun@write.kr', idx: 5, status: 'PENDING', plan: 'Starter', spaces: 0, boards: 0, posts: 0, members: 1, storageUsed: 0, storageQuota: 2, createdAt: '2026-05-29', lastActive: '—' },
  { id: 't_wine', name: '와인 모임', domain: 'wine', owner: '준석', ownerEmail: 'js@wine.kr', idx: 0, status: 'ACTIVE', plan: 'Growth', spaces: 2, boards: 6, posts: 2674, members: 196, storageUsed: 1.5, storageQuota: 5, createdAt: '2024-04-09', lastActive: '2시간 전' },
  { id: 't_calli', name: '캘리그라피', domain: 'calli', owner: '보라', ownerEmail: 'bora@calli.kr', idx: 4, status: 'ACTIVE', plan: 'Starter', spaces: 1, boards: 3, posts: 988, members: 102, storageUsed: 0.9, storageQuota: 2, createdAt: '2024-05-18', lastActive: '3시간 전' },
  { id: 't_startup', name: '스타트업 라운지', domain: 'startup', owner: '재현', ownerEmail: 'jh@su.io', idx: 1, status: 'PENDING', plan: 'Growth', spaces: 0, boards: 0, posts: 0, members: 1, storageUsed: 0, storageQuota: 5, createdAt: '2026-05-28', lastActive: '—' },
  { id: 't_climb', name: '클라이밍 짐', domain: 'climbing', owner: '성훈', ownerEmail: 'sh@climb.kr', idx: 3, status: 'ACTIVE', plan: 'Starter', spaces: 1, boards: 5, posts: 1420, members: 134, storageUsed: 0.7, storageQuota: 2, createdAt: '2024-06-01', lastActive: '1일 전' },
];

// ── 운영자 (내부 직원) ──────────────────────────────────────────
window.ADMIN_OPERATORS = [
  { id: 'o_doyun', name: '김도윤', email: 'doyun.kim@blommunity.io', idx: 7, role: 'OWNER', status: 'APPROVED', joinedAt: '2022-09-01', lastActive: '방금', isMe: true },
  { id: 'o_seoa', name: '이서아', email: 'seoa.lee@blommunity.io', idx: 2, role: 'MANAGER', status: 'APPROVED', joinedAt: '2023-01-15', lastActive: '5분 전' },
  { id: 'o_jiho', name: '박지호', email: 'jiho.park@blommunity.io', idx: 3, role: 'MANAGER', status: 'APPROVED', joinedAt: '2023-03-20', lastActive: '40분 전' },
  { id: 'o_yuna', name: '최유나', email: 'yuna.choi@blommunity.io', idx: 5, role: 'MEMBER', status: 'APPROVED', joinedAt: '2024-02-10', lastActive: '2시간 전' },
  { id: 'o_minjun', name: '정민준', email: 'minjun.jung@blommunity.io', idx: 1, role: 'MEMBER', status: 'APPROVED', joinedAt: '2024-07-22', lastActive: '어제' },
  { id: 'o_soyul', name: '한소율', email: 'soyul.han@blommunity.io', idx: 4, role: 'MEMBER', status: 'PENDING', joinedAt: '2026-05-29', lastActive: '—' },
  { id: 'o_taekyung', name: '오태경', email: 'taekyung.oh@blommunity.io', idx: 6, role: 'MEMBER', status: 'PENDING', joinedAt: '2026-05-28', lastActive: '—' },
  { id: 'o_harin', name: '윤하린', email: 'harin.yoon@blommunity.io', idx: 0, role: 'MEMBER', status: 'APPROVED', joinedAt: '2024-11-03', lastActive: '3시간 전' },
];

// ── 감사 로그 (초기 기록, 최신순) ───────────────────────────────
// kind: approve | reject | suspend | resume | role | auth | view
window.ADMIN_AUDIT = [
  { id: 'a1', actor: '이서아', actorIdx: 2, kind: 'approve', action: '테넌트 승인', target: '베이킹 클래스', time: '2026-05-30 09:12', ago: '방금' },
  { id: 'a2', actor: '김도윤', actorIdx: 7, kind: 'role', action: '역할 변경', target: '박지호 · MEMBER → MANAGER', time: '2026-05-30 08:40', ago: '32분 전' },
  { id: 'a3', actor: '박지호', actorIdx: 3, kind: 'suspend', action: '테넌트 정지', target: '러닝 클럽', time: '2026-05-30 06:02', ago: '3시간 전' },
  { id: 'a4', actor: '이서아', actorIdx: 2, kind: 'approve', action: '운영자 승인', target: '윤하린', time: '2026-05-30 04:18', ago: '5시간 전' },
  { id: 'a5', actor: '김도윤', actorIdx: 7, kind: 'auth', action: '로그인', target: '김도윤', time: '2026-05-30 03:05', ago: '6시간 전' },
  { id: 'a6', actor: '최유나', actorIdx: 5, kind: 'view', action: '테넌트 상세 조회', target: '사진 동호회', time: '2026-05-29 22:41', ago: '어제' },
  { id: 'a7', actor: '박지호', actorIdx: 3, kind: 'reject', action: '테넌트 거절', target: '스팸 의심 가입', time: '2026-05-29 18:30', ago: '어제' },
  { id: 'a8', actor: '이서아', actorIdx: 2, kind: 'resume', action: '테넌트 정지 해제', target: '와인 모임', time: '2026-05-29 15:12', ago: '어제' },
  { id: 'a9', actor: '정민준', actorIdx: 1, kind: 'view', action: '운영자 목록 조회', target: '—', time: '2026-05-29 11:02', ago: '어제' },
  { id: 'a10', actor: '김도윤', actorIdx: 7, kind: 'role', action: '역할 변경', target: '이서아 · MEMBER → MANAGER', time: '2026-05-28 16:44', ago: '2일 전' },
  { id: 'a11', actor: '이서아', actorIdx: 2, kind: 'approve', action: '테넌트 승인', target: '클라이밍 짐', time: '2026-05-28 10:20', ago: '2일 전' },
  { id: 'a12', actor: '박지호', actorIdx: 3, kind: 'auth', action: '로그인', target: '박지호', time: '2026-05-28 09:00', ago: '2일 전' },
];

// 당일 플랫폼 활동량 (전 테넌트 합산)
window.ADMIN_TODAY = { posts: 1284, comments: 4521, signups: 37, apiCalls: '2.4M' };
