// community-core.jsx — blommunity user community starter template
// Neutral, re-skinnable, reading-first. Tokens + icons + primitives + Header/Footer + sample data.
// Container-query responsive (adapts to frame width, not viewport).

if (typeof document !== 'undefined' && !document.getElementById('cm-tokens')) {
  const s = document.createElement('style');
  s.id = 'cm-tokens';
  s.textContent = `
  .cm, .cm * { box-sizing: border-box; }
  .cm-page {
    /* ——— single swappable accent ——— */
    --accent: #4f46e5;
    --accent-press: #4036c9;
    --accent-weak: #eef0fe;
    --accent-text: #4338ca;
    /* ——— neutral warm base ——— */
    --paper: #fbfbf9;
    --surface: #ffffff;
    --surface-2: #f4f3ef;
    --ink: #1a1a18;
    --text: #34332e;
    --muted: #6f6e67;
    --faint: #9c9a91;
    --border: #e9e7e1;
    --border-strong: #dcd9d1;
    --like: #d6455d;
    --ok: #2f8a52;
    --focus: rgba(79,70,229,.4);
    container-type: inline-size;
    background: var(--paper);
    color: var(--text);
    font-family: "Inter","Pretendard",system-ui,-apple-system,sans-serif;
    font-size: 16px; line-height: 1.6;
    -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
    font-feature-settings: "cv05" 1;
  }
  .cm-page[data-theme="dark"] {
    --accent: #7c7ff5;
    --accent-press: #6f72ee;
    --accent-weak: rgba(124,127,245,.16);
    --accent-text: #a9abfb;
    --paper: #0e0e10;
    --surface: #18181b;
    --surface-2: #1f1f23;
    --ink: #f3f2ef;
    --text: #cfcdc6;
    --muted: #9a988f;
    --faint: #6c6a63;
    --border: #2a2a2e;
    --border-strong: #3a3a40;
    --like: #f0768a;
    --ok: #5ed68f;
    --focus: rgba(124,127,245,.5);
  }
  .cm-page :focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; border-radius: 4px; }
  .cm-page ::selection { background: var(--accent-weak); }
  .cm-page a { color: inherit; text-decoration: none; }
  .cm-page button { font-family: inherit; }
  .cm-tnum { font-variant-numeric: tabular-nums; }

  /* prose / reading typography */
  .cm-prose { color: var(--text); font-size: 17px; line-height: 1.78; letter-spacing: -0.003em; }
  .cm-prose > * { margin: 0 0 1.15em; }
  .cm-prose > *:last-child { margin-bottom: 0; }
  .cm-prose h2 { font-size: 21px; font-weight: 700; color: var(--ink); letter-spacing: -0.02em; margin: 1.7em 0 .7em; line-height: 1.35; }
  .cm-prose p { color: var(--text); }
  .cm-prose strong { color: var(--ink); font-weight: 650; }
  .cm-prose ul { padding-left: 1.2em; }
  .cm-prose li { margin: .35em 0; }
  .cm-prose blockquote { margin: 1.4em 0; padding: 4px 0 4px 20px; border-left: 3px solid var(--border-strong); color: var(--muted); font-style: normal; }
  .cm-prose .cm-figure { margin: 1.6em 0; }

  /* responsive — driven by FRAME width via container query */
  .cm-nav-inline { display: flex; }
  .cm-menu-btn { display: none; }
  .cm-list-grid { display: grid; grid-template-columns: minmax(0,1fr) 296px; gap: 36px; align-items: start; }
  .cm-home-grid { display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: 40px; align-items: start; }
  .cm-board-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .cm-hide-narrow { display: revert; }
  .cm-wrap { width: 100%; max-width: 1080px; margin: 0 auto; padding: 0 28px; }

  @container (max-width: 880px) {
    .cm-list-grid, .cm-home-grid { grid-template-columns: minmax(0,1fr); gap: 28px; }
    .cm-board-cards { grid-template-columns: repeat(2, 1fr); }
  }
  @container (max-width: 720px) {
    .cm-nav-inline { display: none; }
    .cm-menu-btn { display: inline-flex; }
    .cm-wrap { padding: 0 18px; }
    .cm-hide-narrow { display: none; }
    .cm-hide-narrow { display: none !important; }
    .cm-board-cards { grid-template-columns: 1fr; }
    .cm-prose { font-size: 16.5px; }
    .cm-row-stack { flex-wrap: wrap; }
  }
  `;
  document.head.appendChild(s);
}

// ── Icons ───────────────────────────────────────────────────────
const CM_ICONS = {
  search: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
  menu: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
  heart: <><path d="M12 20s-7-4.3-9.5-8.6C.9 8.5 2.3 5 5.5 5 7.5 5 9 6.3 12 9c3-2.7 4.5-4 6.5-4 3.2 0 4.6 3.5 3 6.4C19 15.7 12 20 12 20Z"/></>,
  comment: <><path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z"/></>,
  bookmark: <><path d="M19 21l-7-4.5L5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></>,
  share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
  chevronDown: <><path d="m6 9 6 6 6-6"/></>,
  chevronRight: <><path d="m9 6 6 6-6 6"/></>,
  chevronLeft: <><path d="m15 6-6 6 6 6"/></>,
  arrowLeft: <><path d="M19 12H5M12 19l-7-7 7-7"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
  bold: <><path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/></>,
  italic: <><path d="M19 4h-9M14 20H5M15 4 9 20"/></>,
  heading: <><path d="M6 4v16M18 4v16M6 12h12"/></>,
  link: <><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></>,
  quote: <><path d="M6 17h3l2-4V7H5v6h3zM14 17h3l2-4V7h-6v6h3z"/></>,
  pin: <><path d="M12 17v5M9 3h6l-1 6 3 3v1H7v-1l3-3z"/></>,
  pencil: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M5 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
  more: <><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></>,
  check: <><path d="M20 6 9 17l-5-5"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M5 5l1.5 1.5M17.5 17.5 19 19M2 12h2M20 12h2M5 19l1.5-1.5M17.5 6.5 19 5"/></>,
  moon: <><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></>,
  reply: <><path d="M9 17l-5-5 5-5"/><path d="M4 12h11a5 5 0 0 1 5 5v2"/></>,
  book: <><path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/></>,
  chat: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></>,
  hash: <><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
};
function Icon({ name, size = 18, stroke = 1.7, style, fill }) {
  const p = CM_ICONS[name];
  if (!p) return null;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || 'none'} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...style }}>{p}</svg>;
}

// ── Avatar (muted neutral palette) ──────────────────────────────
const CM_AV = [['#6366f1','#fff'],['#0d9488','#fff'],['#b45309','#fff'],['#7c3aed','#fff'],['#2563eb','#fff'],['#be123c','#fff'],['#4d7c0f','#fff'],['#475569','#fff']];
function Avatar({ name, idx = 0, size = 36 }) {
  const [bg, fg] = CM_AV[idx % CM_AV.length];
  return <div aria-hidden="true" style={{ width: size, height: size, borderRadius: '50%', background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: size * 0.42, fontWeight: 600, lineHeight: 1, userSelect: 'none' }}>{(name || '?').charAt(0)}</div>;
}

// ── Button ──────────────────────────────────────────────────────
function Btn({ variant = 'secondary', size = 'md', icon, iconRight, children, as = 'button', href, style, full, ...rest }) {
  const sz = { sm: { h: 32, px: 11, fs: 13, ic: 15 }, md: { h: 38, px: 15, fs: 14, ic: 16 }, lg: { h: 46, px: 20, fs: 15, ic: 18 } }[size];
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff', border: '1px solid transparent' },
    solid: { background: 'var(--ink)', color: 'var(--paper)', border: '1px solid transparent' },
    secondary: { background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border-strong)' },
    ghost: { background: 'transparent', color: 'var(--muted)', border: '1px solid transparent' },
  };
  const Comp = as;
  return (
    <Comp href={href} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: sz.h, padding: `0 ${sz.px}px`, fontSize: sz.fs, fontWeight: 600, borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap', width: full ? '100%' : undefined, letterSpacing: '-0.01em', transition: 'background .14s, border-color .14s, color .14s', ...variants[variant], ...style }} {...rest}>
      {icon && <Icon name={icon} size={sz.ic} stroke={variant === 'primary' || variant === 'solid' ? 2 : 1.8} />}
      {children}
      {iconRight && <Icon name={iconRight} size={sz.ic} stroke={1.8} />}
    </Comp>
  );
}

// ── Tag / pill ──────────────────────────────────────────────────
function Tag({ children, tone, icon }) {
  const tones = {
    notice: { c: 'var(--accent-text)', bg: 'var(--accent-weak)', bd: 'transparent' },
    soft: { c: 'var(--muted)', bg: 'var(--surface-2)', bd: 'var(--border)' },
  };
  const t = tones[tone] || tones.soft;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, color: t.c, background: t.bg, border: `1px solid ${t.bd}`, borderRadius: 5, padding: '3px 7px', lineHeight: 1, whiteSpace: 'nowrap' }}>{icon && <Icon name={icon} size={11} stroke={2} />}{children}</span>;
}

// ── meta count (likes/comments/views) ───────────────────────────
function Stat({ icon, children, active }) {
  return <span className="cm-tnum" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: active ? 'var(--like)' : 'var(--faint)', fontWeight: 500 }}><Icon name={icon} size={13.5} fill={active && icon === 'heart' ? 'currentColor' : 'none'} stroke={active ? 0 : 1.7} />{children}</span>;
}

// ── App context (interactive prototype; catalog falls back to no-op) ──
const CmAppCtx = React.createContext(null);
const CM_STATIC = {
  live: false, theme: 'light', user: { name: '지은', idx: 0 },
  screen: null, params: {},
  go: () => {}, back: () => {}, toggleTheme: () => {}, toast: () => {},
  isLiked: () => false, toggleLike: () => {}, likeCount: (b) => b,
  isCommentLiked: () => false, toggleCommentLike: () => {},
  comments: null, addComment: () => {}, login: () => {}, logout: () => {},
};
function useCm() { return React.useContext(CmAppCtx) || CM_STATIC; }

// ── Header ──────────────────────────────────────────────────────
const CM_NAV = ['홈', '자유게시판', '이달의 책', '독서 후기'];
function Logo({ onClick }) {
  return (
    <a href="#" aria-label="북클럽 홈" onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
      <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, letterSpacing: '-0.04em' }}><CmMark size={17} line="var(--accent)" /></span>
      <span style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>북클럽</span>
      <span className="cm-hide-narrow" style={{ fontSize: 10, fontWeight: 600, color: 'var(--faint)', border: '1px dashed var(--border-strong)', borderRadius: 4, padding: '1px 5px', letterSpacing: '.04em' }}>로고 자리</span>
    </a>
  );
}
function Header({ active = '홈', loggedIn = true }) {
  const app = useCm();
  const go = (e, screen, params) => { if (app.live) { e.preventDefault(); app.go(screen, params); } };
  const curActive = app.live ? (app.screen === 'home' ? '홈' : app.screen === 'board' ? (app.params.board || '') : '') : active;
  const signedIn = app.live ? !!app.user : loggedIn;
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'color-mix(in srgb, var(--paper) 88%, transparent)', backdropFilter: 'saturate(140%) blur(8px)', borderBottom: '1px solid var(--border)' }}>
      <div className="cm-wrap" style={{ maxWidth: 1140, height: 60, display: 'flex', alignItems: 'center', gap: 18 }}>
        <Logo onClick={(e) => go(e, 'home')} />
        <nav className="cm-nav-inline" aria-label="게시판" style={{ alignItems: 'center', gap: 2, marginLeft: 8 }}>
          {CM_NAV.map((n) => {
            const on = n === curActive;
            return <a key={n} href="#" aria-current={on ? 'page' : undefined} onClick={(e) => go(e, n === '홈' ? 'home' : 'board', n === '홈' ? {} : { board: n })} style={{ position: 'relative', padding: '8px 12px', fontSize: 14, fontWeight: on ? 650 : 500, color: on ? 'var(--ink)' : 'var(--muted)', borderRadius: 7 }}>{n}{on && <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 2, borderRadius: 2, background: 'var(--accent)' }} />}</a>;
          })}
        </nav>
        <div style={{ flex: 1 }} />
        <button aria-label="검색" onClick={() => app.live && app.toast('검색은 준비 중이에요')} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="search" size={18} /></button>
        {app.live && (
          <button aria-label="테마 전환" onClick={app.toggleTheme} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={app.theme === 'dark' ? 'sun' : 'moon'} size={18} /></button>
        )}
        {signedIn ? (
          <>
            <Btn variant="solid" size="sm" icon="pencil" className="cm-hide-narrow" onClick={(e) => go(e, 'compose')}>글쓰기</Btn>
            <a href="#" aria-label="내 프로필" onClick={(e) => go(e, 'profile')}><Avatar name={app.user ? app.user.name : '지은'} idx={0} size={32} /></a>
          </>
        ) : (
          <>
            <a href="#" className="cm-hide-narrow" onClick={(e) => go(e, 'login')} style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)', padding: '0 6px' }}>로그인</a>
            <Btn variant="solid" size="sm" onClick={(e) => go(e, 'signup')}>회원가입</Btn>
          </>
        )}
        <button aria-label="메뉴 열기" className="cm-menu-btn" style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--ink)', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}><Icon name="menu" size={20} /></button>
      </div>
    </header>
  );
}

// ── Footer ──────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 56, background: 'var(--surface)' }}>
      <div className="cm-wrap" style={{ maxWidth: 1140, padding: '32px 28px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}><CmMark size={13} line="var(--accent)" /></span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>북클럽</span>
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--faint)', maxWidth: 300, lineHeight: 1.6 }}>함께 읽고 나누는 사람들의 커뮤니티.</p>
        </div>
        {[['커뮤니티', ['게시판', '이달의 책', '독서 후기', '멤버']], ['도움말', ['이용약관', '개인정보처리방침', '문의하기']]].map(([h, items]) => (
          <nav key={h} style={{ minWidth: 130 }} aria-label={h}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>{h}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((i) => <li key={i}><a href="#" style={{ fontSize: 13, color: 'var(--muted)' }}>{i}</a></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="cm-wrap" style={{ maxWidth: 1140, padding: '14px 28px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--faint)' }}>© 2026 북클럽</span>
        <span style={{ fontSize: 12, color: 'var(--faint)' }}>Powered by <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, verticalAlign: 'middle' }}><CmMark size={13} color="var(--accent)" line="var(--surface)" /><strong style={{ fontWeight: 600, color: 'var(--muted)' }}>blommunity</strong></span></span>
      </div>
    </footer>
  );
}

// ── Page wrapper (theme + container) ────────────────────────────
function Page({ theme, active, loggedIn = true, header = true, footer = true, children, minH }) {
  const app = useCm();
  const th = theme || app.theme || 'light';
  return (
    <div className="cm cm-page" data-theme={th} style={{ minHeight: minH || 'auto', display: 'flex', flexDirection: 'column' }}>
      {header && <Header active={active} loggedIn={loggedIn} />}
      <div style={{ flex: 1 }}>{children}</div>
      {footer && <Footer />}
    </div>
  );
}

// blommunity brand mark — speech bubble + post lines (knockout)
function CmMark({ size = 18, color = '#fff', line = 'var(--accent)' }) {
  const H = size * 0.86, lh = Math.max(1.5, size * 0.125);
  return (
    <div style={{ width: size, height: H, background: color, borderRadius: `${size * 0.3}px ${size * 0.3}px ${size * 0.3}px ${size * 0.08}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: size * 0.13, padding: `0 ${size * 0.2}px`, flexShrink: 0 }}>
      <div style={{ height: lh, width: '100%', borderRadius: lh, background: line }} />
      <div style={{ height: lh, width: '58%', borderRadius: lh, background: line }} />
    </div>
  );
}

Object.assign(window, { CmIcon: Icon, CmAvatar: Avatar, CmBtn: Btn, CmTag: Tag, CmStat: Stat, CmHeader: Header, CmFooter: Footer, CmPage: Page, CmLogo: Logo, CM_NAV, CmAppCtx, useCm, CmMark });
