// tenant-data.jsx — dummy data for the new tenant-console screens
window.TC_BOARDS = [
  { name: '자유게시판', space: '북클럽', vis: 'PUBLIC', posts: 1204, members: 237, last: '방금' },
  { name: '이달의 책', space: '북클럽', vis: 'PUBLIC', posts: 386, members: 198, last: '12분 전' },
  { name: '추천 도서', space: '북클럽', vis: 'PUBLIC', posts: 98, members: 156, last: '1시간 전' },
  { name: '독서 후기', space: '북클럽', vis: 'PUBLIC', posts: 73, members: 121, last: '3시간 전' },
  { name: '운영진 회의실', space: '운영진 라운지', vis: 'PRIVATE', posts: 142, members: 4, last: '2시간 전' },
  { name: '공지 초안', space: '운영진 라운지', vis: 'PRIVATE', posts: 24, members: 4, last: '어제' },
];

window.TC_MEMBERS = [
  { name: '지은', idx: 0, email: 'jieun@bookclub.kr', role: 'OWNER', joined: '2024-03-12', last: '방금', status: '활성' },
  { name: '지수', idx: 3, email: 'jisu@bookclub.kr', role: 'MANAGER', joined: '2024-04-01', last: '8분 전', status: '활성' },
  { name: '민수', idx: 1, email: 'minsu@bookclub.kr', role: 'MEMBER', joined: '2024-05-18', last: '32분 전', status: '활성' },
  { name: '유진', idx: 2, email: 'yujin@bookclub.kr', role: 'MEMBER', joined: '오늘', last: '1시간 전', status: '활성' },
  { name: '현우', idx: 4, email: 'hyunwoo@bookclub.kr', role: 'MEMBER', joined: '2024-06-02', last: '2시간 전', status: '활성' },
  { name: '서연', idx: 5, email: 'seoyeon@bookclub.kr', role: 'MEMBER', joined: '오늘', last: '3시간 전', status: '활성' },
  { name: '민지', idx: 6, email: 'minji@bookclub.kr', role: 'MEMBER', joined: '2024-04-22', last: '어제', status: '활성' },
  { name: '태호', idx: 1, email: 'taeho@bookclub.kr', role: 'MEMBER', joined: '2024-03-30', last: '어제', status: '활성' },
  { name: '보라', idx: 4, email: 'bora@bookclub.kr', role: 'MEMBER', joined: '2024-05-09', last: '2일 전', status: '활성' },
  { name: '준석', idx: 0, email: 'junseok@bookclub.kr', role: 'MEMBER', joined: '2024-06-15', last: '3일 전', status: '차단' },
  { name: '영민', idx: 4, email: 'youngmin@bookclub.kr', role: 'MEMBER', joined: '2024-02-28', last: '1주 전', status: '활성' },
  { name: '미나', idx: 2, email: 'mina@bookclub.kr', role: 'MEMBER', joined: '2024-01-20', last: '2주 전', status: '활성' },
];

window.TC_REPORTS = [
  { target: '댓글', excerpt: '“여기서 이런 거 팔아요…”', reason: '스팸·광고', reporter: '현우', result: '삭제', kind: 'danger', time: '어제' },
  { target: '게시글', excerpt: '“책 추천 좀 그만…”', reason: '욕설·비방', reporter: '서연', result: '경고', kind: 'warning', time: '2일 전' },
  { target: '댓글', excerpt: '“ㅋㅋㅋㅋㅋㅋ도배”', reason: '도배', reporter: '민지', result: '반려', kind: 'neutral', time: '3일 전' },
];
