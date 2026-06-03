// community-app.jsx — interactive prototype shell for the user community
// Wires routing, theme, likes, comments, auth via CmAppCtx. Reuses all screen components.

if (typeof document !== 'undefined' && !document.getElementById('cm-app-anim')) {
  const s = document.createElement('style');
  s.id = 'cm-app-anim';
  s.textContent = '@keyframes cmToast{from{transform:translate(-50%,10px)}to{transform:translate(-50%,0)}}';
  document.head.appendChild(s);
}

function CommunityApp() {
  const [screen, setScreen] = React.useState('home');
  const [params, setParams] = React.useState({});
  const [theme, setTheme] = React.useState('light');
  const [user, setUser] = React.useState({ name: '지은', idx: 0 });
  const [liked, setLiked] = React.useState(() => new Set());
  const [clikes, setCLikes] = React.useState(() => new Set());
  const [comments, setComments] = React.useState(() => window.CM_COMMENTS.map((c, i) => ({ ...c, _id: 'seed' + i })));
  const [toast, setToast] = React.useState(null);
  const scrollRef = React.useRef(null);
  const toastTimer = React.useRef(0);

  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [screen, params]);

  const showToast = React.useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast({ id: Math.random().toString(36).slice(2), msg });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const app = {
    live: true, theme, user, screen, params,
    go: (sc, pr = {}) => { setScreen(sc); setParams(pr); },
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toast: showToast,
    isLiked: (id) => liked.has(id),
    likeCount: (base, id) => base + (liked.has(id) ? 1 : 0),
    toggleLike: (id) => setLiked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); showToast(n.has(id) ? '좋아요를 눌렀어요' : '좋아요를 취소했어요'); return n; }),
    isCommentLiked: (cid) => clikes.has(cid),
    toggleCommentLike: (cid) => setCLikes((s) => { const n = new Set(s); n.has(cid) ? n.delete(cid) : n.add(cid); return n; }),
    comments,
    addComment: (text) => { setComments((cs) => [{ name: user ? user.name : '지은', idx: 0, date: '방금', likes: 0, text, replies: [], _id: 'new' + Date.now() }, ...cs]); showToast('댓글을 남겼어요'); },
    submitPost: (title) => { app.go('board', { board: '자유게시판' }); showToast(`‘${(title && title.trim()) || '새 글'}’ 글이 등록되었어요`); },
    login: () => { setUser({ name: '지은', idx: 0 }); app.go('home'); showToast('로그인되었어요'); },
    logout: () => { setUser(null); app.go('login'); },
  };

  let view;
  switch (screen) {
    case 'board': view = <BoardListScreen />; break;
    case 'post': view = <PostDetailScreen />; break;
    case 'compose': view = <ComposeScreen />; break;
    case 'login': view = <AuthScreen mode="login" />; break;
    case 'signup': view = <AuthScreen mode="signup" />; break;
    case 'profile': view = <ProfileScreen />; break;
    case 'home':
    default: view = <HomeScreen />;
  }

  return (
    <window.CmAppCtx.Provider value={app}>
      <div ref={scrollRef} className="cm cm-page" data-theme={theme} style={{ position: 'relative', width: '100vw', height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: 'var(--paper)' }}>
        <div key={screen} style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>{view}</div>
        {toast && (
          <div key={toast.id} className="cm cm-page" data-theme={theme} style={{ position: 'fixed', bottom: 26, left: '50%', zIndex: 100, background: 'transparent', containerType: 'normal', width: 'max-content', transform: 'translateX(-50%)', animation: 'cmToast .22s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', background: 'var(--ink)', color: 'var(--paper)', borderRadius: 11, boxShadow: '0 10px 30px rgba(0,0,0,.22)', fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
              <window.CmIcon name="check" size={16} stroke={2.4} />{toast.msg}
            </div>
          </div>
        )}
      </div>
    </window.CmAppCtx.Provider>
  );
}

window.CommunityApp = CommunityApp;
