// community-data.jsx — sample content (북클럽 community)
window.CM_POSTS = [
  { id: 1, notice: true, title: '북클럽 이용 안내 — 처음 오셨다면 꼭 읽어주세요', author: '운영자', idx: 7, date: '2026.04.01', comments: 12, likes: 48, views: 1840, snippet: '환영합니다! 게시판 이용 규칙과 활동 안내를 정리했어요.' },
  { id: 2, title: '요즘 밑줄 그으며 읽은 문장들 공유해요', author: '민수', idx: 0, date: '5시간 전', comments: 23, likes: 67, views: 412, snippet: '읽다가 마음에 남은 문장을 모아두는 중인데, 여러분 것도 궁금해서요.' },
  { id: 3, title: '전자책 vs 종이책, 다들 어떻게 읽으세요?', author: '유진', idx: 1, date: '8시간 전', comments: 41, likes: 39, views: 588, snippet: '이사하면서 책장을 줄였더니 요즘은 거의 전자책인데 가끔 종이책이 그립네요.' },
  { id: 4, title: '집 근처 조용한 카페 추천 받아요 (서울 서북부)', author: '현우', idx: 4, date: '어제', comments: 18, likes: 21, views: 332, snippet: '주말마다 책 들고 나가는데 늘 가던 곳만 가서요.' },
  { id: 5, title: '독서 모임 처음인데 긴장되네요 ㅎㅎ', author: '서연', idx: 5, date: '어제', comments: 27, likes: 54, views: 470, snippet: '다음 주 첫 모임 참석합니다. 준비물이나 분위기 살짝 귀띔 부탁드려요!' },
  { id: 6, title: '읽다 만 책 다시 펴는 나만의 방법', author: '민지', idx: 2, date: '2일 전', comments: 9, likes: 33, views: 290, snippet: '북마크보다 한 문장 메모가 효과가 좋더라고요.' },
  { id: 7, title: '올해 목표 30권, 지금 11권째 기록 남깁니다', author: '태호', idx: 3, date: '3일 전', comments: 15, likes: 44, views: 351, snippet: '느슨하게 가는 중인데 그래도 꾸준함이 붙는 느낌이에요.' },
  { id: 8, title: '같은 책 두 번 읽으면 다르게 보이나요?', author: '보라', idx: 6, date: '4일 전', comments: 31, likes: 28, views: 401, snippet: '몇 년 만에 다시 읽었더니 완전히 다른 책 같았어요.' },
];

window.CM_POPULAR = [
  { rank: 1, title: '요즘 밑줄 그으며 읽은 문장들 공유해요', likes: 67 },
  { rank: 2, title: '독서 모임 처음인데 긴장되네요 ㅎㅎ', likes: 54 },
  { rank: 3, title: '올해 목표 30권, 지금 11권째 기록', likes: 44 },
  { rank: 4, title: '전자책 vs 종이책, 다들 어떻게 읽으세요?', likes: 39 },
  { rank: 5, title: '읽다 만 책 다시 펴는 나만의 방법', likes: 33 },
];

window.CM_BOARDS = [
  { name: '자유게시판', icon: 'chat', desc: '무엇이든 가볍게', posts: 1204 },
  { name: '이달의 책', icon: 'book', desc: '함께 읽는 한 권', posts: 386 },
  { name: '독서 후기', icon: 'pencil', desc: '읽고 난 기록', posts: 273 },
];

window.CM_POST = {
  board: '자유게시판',
  title: '요즘 밑줄 그으며 읽은 문장들 공유해요',
  author: '민수', idx: 0, date: '2026년 5월 28일', readtime: '약 3분', views: 412,
  likes: 67, comments: 23,
  tags: ['문장수집', '에세이', '잡담'],
};

window.CM_COMMENTS = [
  { name: '유진', idx: 1, date: '3시간 전', likes: 8, text: '“우리는 읽은 것으로 이루어진다” — 저도 이 문장 한참 들여다봤어요. 공유 감사합니다!', replies: [
    { name: '민수', idx: 0, date: '2시간 전', likes: 3, text: '오 그 문장 좋네요. 어느 책인가요?' },
    { name: '유진', idx: 1, date: '2시간 전', likes: 2, text: '에세이집인데 제목 찾아서 다시 남길게요 :)' },
  ] },
  { name: '서연', idx: 5, date: '2시간 전', likes: 5, text: '밑줄 긋는 습관 저도 들이는 중이에요. 다 읽고 나면 그 페이지만 다시 펴봐도 좋더라고요.', replies: [] },
  { name: '현우', idx: 4, date: '1시간 전', likes: 2, text: '메모 앱에 옮겨 적기 vs 책에 직접 긋기, 다들 어느 쪽이세요?', replies: [] },
];

window.CM_MY_POSTS = [
  { title: '올해 목표 30권, 지금 11권째 기록 남깁니다', board: '자유게시판', date: '3일 전', comments: 15, likes: 44 },
  { title: '《달러구트 꿈 백화점》 읽고 — 짧은 후기', board: '독서 후기', date: '1주 전', comments: 8, likes: 31 },
  { title: '5월의 책 추천합니다', board: '이달의 책', date: '2주 전', comments: 12, likes: 27 },
];
