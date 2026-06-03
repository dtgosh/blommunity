// community-catalog.jsx — static catalog: lays out the community screens with labels
// Desktop frames + mobile frames + a dark example. No routing.

function CFrame({ tag, label, caption, w, device = 'desktop', dark, url, children }) {
  const isMobile = device === 'mobile';
  return (
    <div style={{ width: w, flex: '0 0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginBottom: 12, flexWrap: 'wrap' }}>
        {tag && <span style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', background: '#eef0fe', border: '1px solid #e0e3fb', borderRadius: 6, padding: '3px 8px', letterSpacing: '.02em' }}>{tag}</span>}
        <span style={{ fontSize: 15.5, fontWeight: 700, color: '#1a1a18', letterSpacing: '-0.01em' }}>{label}</span>
        {caption && <span style={{ fontSize: 13, color: '#76746e' }}>· {caption}</span>}
        {isMobile && <span style={{ fontSize: 10.5, fontWeight: 600, color: '#6c6a63', background: '#e7e6e1', borderRadius: 5, padding: '2px 7px' }}>MOBILE</span>}
        {dark && <span style={{ fontSize: 10.5, fontWeight: 600, color: '#e7e6e1', background: '#2a2a2e', borderRadius: 5, padding: '2px 7px' }}>DARK</span>}
      </div>
      <div style={{ width: w, borderRadius: isMobile ? 30 : 14, overflow: 'hidden', border: dark ? '1px solid #2a2a2e' : '1px solid #dcd9d1', boxShadow: '0 1px 2px rgba(20,20,40,.05), 0 12px 30px rgba(20,20,40,.06)', background: dark ? '#0e0e10' : '#fff' }}>
        {/* chrome */}
        {isMobile ? (
          <div style={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', background: dark ? '#0e0e10' : '#fbfbf9', color: dark ? '#cfcdc6' : '#34332e' }}>
            <span className="cm-tnum" style={{ fontSize: 11.5, fontWeight: 600 }}>9:41</span>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ width: 16, height: 9, border: '1px solid currentColor', borderRadius: 2, opacity: .6 }} />
            </span>
          </div>
        ) : (
          <div style={{ height: 38, display: 'flex', alignItems: 'center', gap: 7, padding: '0 14px', background: dark ? '#18181b' : '#f4f3ef', borderBottom: dark ? '1px solid #2a2a2e' : '1px solid #e9e7e1' }}>
            {['#e06c63', '#e3b341', '#5fb463'].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: .85 }} />)}
            <div style={{ flex: 1, maxWidth: 360, margin: '0 auto', height: 23, borderRadius: 6, background: dark ? '#0e0e10' : '#fff', border: dark ? '1px solid #2a2a2e' : '1px solid #e3e1db', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: dark ? '#6c6a63' : '#9c9a91', fontFamily: 'ui-monospace, Menlo, monospace' }}>{url || 'bookclub.example.com'}</span>
            </div>
            <span style={{ width: 60 }} />
          </div>
        )}
        <div style={{ height: isMobile ? 720 : 'auto', maxHeight: isMobile ? 720 : 'none', overflow: 'hidden', position: 'relative' }}>{children}</div>
      </div>
    </div>
  );
}

function CRow({ children }) { return <div style={{ display: 'flex', gap: 30, flexWrap: 'nowrap', alignItems: 'flex-start' }}>{children}</div>; }

function CGroup({ title, desc, children }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{ marginBottom: 26, borderBottom: '1px solid #dcd9d1', paddingBottom: 14 }}>
        <h2 style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9c9a91', margin: 0 }}>{title}</h2>
        {desc && <p style={{ fontSize: 14, color: '#54534d', margin: '7px 0 0', lineHeight: 1.55, maxWidth: 760 }}>{desc}</p>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 50 }}>{children}</div>
    </section>
  );
}

function CommunityCatalog() {
  const D = 1180; // desktop frame width
  const M = 390;  // mobile frame width
  return (
    <div style={{ width: 'fit-content', minWidth: '100%', padding: '48px 56px 80px' }}>
      <header style={{ marginBottom: 50, maxWidth: 780 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em' }}><window.CmMark size={21} line="#4f46e5" /></div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#76746e' }}>blommunity · User Community</div>
        </div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: '#1a1a18' }}>유저 커뮤니티 — 스타터 템플릿</h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, lineHeight: 1.6, color: '#54534d' }}>사업자가 가져다 자기 색을 입히는 중립 베이스입니다. 강한 브랜드색 대신 교체 가능한 단일 액센트, 읽기 좋은 타이포그래피와 넉넉한 여백을 우선했어요. 예시 콘텐츠는 ‘북클럽’ 독서 커뮤니티로 채웠습니다. 각 화면은 프레임 너비에 반응해 데스크톱/모바일로 자동 전환됩니다.</p>
      </header>

      <CGroup title="가장 많이 보는 화면" desc="방문자·회원이 대부분의 시간을 보내는 두 화면. 우선순위: 글 목록 → 게시물 상세.">
        <CFrame tag="01" label="게시판 글 목록" caption="정렬 · 목록 · 페이지네이션 · 사이드바" w={D} url="bookclub.example.com/b/free">
          <BoardListScreen theme="light" />
        </CFrame>
        <CFrame tag="02" label="게시물 상세" caption="본문 · 좋아요 · 댓글/대댓글" w={D} url="bookclub.example.com/p/요즘-밑줄">
          <PostDetailScreen theme="light" />
        </CFrame>
      </CGroup>

      <CGroup title="홈 & 작성" desc="커뮤니티 소개와 진입, 그리고 글을 쓰는 흐름.">
        <CFrame tag="03" label="홈" caption="소개 · 게시판 바로가기 · 최근/인기 글" w={D} url="bookclub.example.com">
          <HomeScreen theme="light" />
        </CFrame>
        <CFrame tag="04" label="글 작성" caption="게시판 선택 · 제목 · 서식 에디터" w={D} url="bookclub.example.com/write">
          <ComposeScreen theme="light" />
        </CFrame>
      </CGroup>

      <CGroup title="계정 & 프로필" desc="단순한 로그인·회원가입과 내 활동 모아보기.">
        <CRow>
          <CFrame tag="05" label="로그인" w={560} url="bookclub.example.com/login">
            <AuthScreen theme="light" mode="login" />
          </CFrame>
          <CFrame tag="05" label="회원가입" w={560} url="bookclub.example.com/signup">
            <AuthScreen theme="light" mode="signup" />
          </CFrame>
        </CRow>
        <CFrame tag="06" label="내 프로필" caption="내 정보 · 활동 통계 · 내가 쓴 글/댓글" w={D} url="bookclub.example.com/u/지은">
          <ProfileScreen theme="light" />
        </CFrame>
      </CGroup>

      <CGroup title="모바일" desc="방문자는 모바일이 많습니다. 같은 컴포넌트가 좁은 폭에서 모바일 레이아웃으로 자동 전환돼요 — 인라인 내비는 햄버거로, 사이드바는 숨겨집니다.">
        <CRow>
          <CFrame label="게시판 글 목록" device="mobile" w={M}>
            <BoardListScreen theme="light" />
          </CFrame>
          <CFrame label="게시물 상세" device="mobile" w={M}>
            <PostDetailScreen theme="light" />
          </CFrame>
          <CFrame label="홈" device="mobile" w={M}>
            <HomeScreen theme="light" />
          </CFrame>
        </CRow>
      </CGroup>

      <CGroup title="다크 모드" desc="라이트가 기본이지만 다크도 같은 토큰으로 자연스럽게. 단일 액센트만 교체하면 전체 톤이 바뀝니다.">
        <CFrame label="게시물 상세 — 다크" caption="동일 레이아웃 · 다크 토큰" w={D} dark url="bookclub.example.com/p/요즘-밑줄">
          <PostDetailScreen theme="dark" />
        </CFrame>
      </CGroup>
    </div>
  );
}

window.CommunityCatalog = CommunityCatalog;
