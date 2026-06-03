// console-system.jsx — Blommunity tenant console design system
// Injects CSS tokens (light + .dark) and exports shared primitives.
// Exports to window: Icon, Badge, Btn, Avatar, AvatarGroup, Sidebar, Topbar, Shell

// ── Design tokens ───────────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('bl-tokens')) {
  const s = document.createElement('style');
  s.id = 'bl-tokens';
  s.textContent = `
  .bl, .bl * { box-sizing: border-box; }
  .bl {
    --bl-surface-0: #f7f7f8;
    --bl-surface-1: #ffffff;
    --bl-surface-2: #f4f4f5;
    --bl-surface-hover: #f4f4f5;
    --bl-border: #e7e7ea;
    --bl-border-strong: #d7d7dc;
    --bl-text-1: #1a1a1f;
    --bl-text-2: #5c5c66;
    --bl-text-3: #92929c;
    --bl-accent: #4f46e5;
    --bl-accent-hover: #4338ca;
    --bl-accent-press: #3730a3;
    --bl-accent-weak: #eef0fe;
    --bl-accent-text: #4f46e5;
    --bl-on-accent: #ffffff;
    --bl-success: #15803d;   --bl-success-bg: #f0fdf4; --bl-success-bd: #c6ecd0;
    --bl-warning: #b45309;   --bl-warning-bg: #fffbeb; --bl-warning-bd: #fbe3a8;
    --bl-danger:  #dc2626;   --bl-danger-bg:  #fef2f2; --bl-danger-bd:  #f9cfcf;
    --bl-neutral: #5c5c66;   --bl-neutral-bg: #f4f4f5; --bl-neutral-bd: #e4e4e7;
    --bl-focus: rgba(79,70,229,0.35);
    --bl-shadow-pop: 0 8px 28px rgba(20,20,30,.12), 0 0 0 1px rgba(20,20,30,.05);
    font-family: "Inter", "Pretendard", system-ui, -apple-system, sans-serif;
    color: var(--bl-text-1);
    background: var(--bl-surface-0);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-feature-settings: "cv05" 1, "ss01" 1;
  }
  .bl.dark {
    --bl-surface-0: #0a0a0c;
    --bl-surface-1: #141417;
    --bl-surface-2: #1c1c20;
    --bl-surface-hover: #1f1f24;
    --bl-border: #28282e;
    --bl-border-strong: #3a3a42;
    --bl-text-1: #f3f3f5;
    --bl-text-2: #a6a6b0;
    --bl-text-3: #6e6e78;
    --bl-accent: #6366f1;
    --bl-accent-hover: #7c7ff5;
    --bl-accent-press: #5457e0;
    --bl-accent-weak: rgba(99,102,241,0.16);
    --bl-accent-text: #a5a8fb;
    --bl-on-accent: #ffffff;
    --bl-success: #5ed68f; --bl-success-bg: rgba(34,197,94,.13); --bl-success-bd: rgba(34,197,94,.28);
    --bl-warning: #f0b65a; --bl-warning-bg: rgba(217,119,6,.15); --bl-warning-bd: rgba(217,119,6,.32);
    --bl-danger:  #f08585; --bl-danger-bg:  rgba(220,38,38,.15); --bl-danger-bd:  rgba(220,38,38,.32);
    --bl-neutral: #a6a6b0; --bl-neutral-bg: #1f1f24; --bl-neutral-bd: #303036;
    --bl-focus: rgba(124,127,245,0.45);
    --bl-shadow-pop: 0 10px 32px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.06);
  }
  .bl ::selection { background: var(--bl-accent-weak); }
  .bl :focus-visible { outline: 2px solid var(--bl-focus); outline-offset: 2px; border-radius: 5px; }
  .bl button { font-family: inherit; }
  .bl-tnum { font-variant-numeric: tabular-nums; }
  `;
  document.head.appendChild(s);
}

// ── Icons (Lucide-style, simple line geometry) ──────────────────
const BL_ICONS = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.2"/><rect x="14" y="3" width="7" height="5" rx="1.2"/><rect x="14" y="11" width="7" height="10" rx="1.2"/><rect x="3" y="15" width="7" height="6" rx="1.2"/></>,
  spaces: <><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/></>,
  boards: <><path d="M21 14a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></>,
  members: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  moderation: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Z"/><path d="M4 22v-7"/></>,
  settings: <><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/></>,
  profile: <><circle cx="12" cy="8" r="4"/><path d="M5 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1"/></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.2 9.2a3 3 0 0 1 5.6 1c0 2-3 2.5-3 4"/><path d="M12 17h.01"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/></>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  chevronRight: <><path d="m9 6 6 6-6 6"/></>,
  chevronDown: <><path d="m6 9 6 6 6-6"/></>,
  more: <><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></>,
  trash: <><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></>,
  check: <><path d="M20 6 9 17l-5-5"/></>,
  trendingUp: <><path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></>,
  penLine: <><path d="M12 4h9"/><path d="M3 13l9-9 4 4-9 9H3v-4Z"/></>,
  userPlus: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></>,
  shieldUser: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><circle cx="12" cy="10" r="2.2"/><path d="M8.5 16a3.5 3.5 0 0 1 7 0"/></>,
  bookmark: <><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  arrowRight: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M5 5l1.5 1.5M17.5 17.5 19 19M2 12h2M20 12h2M5 19l1.5-1.5M17.5 6.5 19 5"/></>,
  moon: <><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></>,
  dot: <><circle cx="12" cy="12" r="3"/></>,
  building: <><rect x="4" y="2" width="16" height="20" rx="1.5"/><path d="M9 22v-5h6v5"/><path d="M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2"/></>,
  shieldCheck: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m8.5 11.5 2.5 2.5 4.5-5"/></>,
  shieldAlert: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M12 8v4M12 16h.01"/></>,
  key: <><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.6 12.4 9.4-9.4"/><path d="m16 7 3 3"/></>,
  auditLog: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6M8 9h1.5"/></>,
  activity: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
  zap: <><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></>,
  filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3Z"/></>,
  sort: <><path d="M11 5h10M11 9h7M11 13h4"/><path d="m3 17 3 3 3-3"/><path d="M6 18V4"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
  ban: <><circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/></>,
  rotateCcw: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></>,
  checkCircle: <><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></>,
  x: <><path d="M18 6 6 18M6 6l12 12"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  hardDrive: <><path d="M22 12H2"/><path d="M5.5 6h13l3.5 6v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6Z"/><path d="M6 16h.01M10 16h.01"/></>,
  barChart: <><path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="7" rx="0.5"/><rect x="12" y="6" width="3" height="11" rx="0.5"/><rect x="17" y="13" width="3" height="4" rx="0.5"/></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2.5 7 9.5 6 9.5-6"/></>,
  chevronLeft: <><path d="m15 18-6-6 6-6"/></>,
  alertTriangle: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></>,
  userCheck: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/></>,
  refresh: <><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></>,
  layers2: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m21 12-9 5-9-5"/></>,
};

function Icon({ name, size = 18, stroke = 1.75, style, className }) {
  const p = BL_ICONS[name];
  if (!p) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={{ flexShrink: 0, display: 'block', ...style }}>{p}</svg>
  );
}

// ── Badge ───────────────────────────────────────────────────────
function Badge({ tone = 'neutral', children, icon, size = 'md' }) {
  const map = {
    neutral: ['var(--bl-neutral)', 'var(--bl-neutral-bg)', 'var(--bl-neutral-bd)'],
    accent:  ['var(--bl-accent-text)', 'var(--bl-accent-weak)', 'transparent'],
    success: ['var(--bl-success)', 'var(--bl-success-bg)', 'var(--bl-success-bd)'],
    warning: ['var(--bl-warning)', 'var(--bl-warning-bg)', 'var(--bl-warning-bd)'],
    danger:  ['var(--bl-danger)', 'var(--bl-danger-bg)', 'var(--bl-danger-bd)'],
  };
  const [c, bg, bd] = map[tone] || map.neutral;
  const small = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: small ? 11 : 11.5, fontWeight: 600, lineHeight: 1, letterSpacing: '.01em',
      color: c, background: bg, border: `1px solid ${bd}`,
      padding: small ? '3px 6px' : '4px 8px', borderRadius: 5, whiteSpace: 'nowrap',
    }}>{icon && <Icon name={icon} size={small ? 11 : 12} stroke={2} />}{children}</span>
  );
}

// ── Button ──────────────────────────────────────────────────────
function Btn({ variant = 'secondary', size = 'md', icon, iconRight, children, onClick, style, title, full }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const sizes = {
    sm: { h: 30, px: 10, fs: 13, gap: 6, ic: 14 },
    md: { h: 36, px: 13, fs: 13.5, gap: 7, ic: 16 },
    lg: { h: 42, px: 16, fs: 14.5, gap: 8, ic: 17 },
  }[size];
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: sizes.gap, height: sizes.h, padding: `0 ${sizes.px}px`, fontSize: sizes.fs,
    fontWeight: 600, borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap',
    border: '1px solid transparent', transition: 'background .13s, border-color .13s, color .13s, box-shadow .13s',
    width: full ? '100%' : undefined, letterSpacing: '-0.005em',
  };
  const variants = {
    primary: {
      background: press ? 'var(--bl-accent-press)' : hover ? 'var(--bl-accent-hover)' : 'var(--bl-accent)',
      color: 'var(--bl-on-accent)', borderColor: 'transparent',
      boxShadow: '0 1px 1px rgba(20,20,40,.10)',
    },
    secondary: {
      background: hover ? 'var(--bl-surface-2)' : 'var(--bl-surface-1)',
      color: 'var(--bl-text-1)', borderColor: 'var(--bl-border-strong)',
    },
    ghost: {
      background: hover ? 'var(--bl-surface-2)' : 'transparent',
      color: 'var(--bl-text-2)', borderColor: 'transparent',
    },
    danger: {
      background: hover ? 'var(--bl-danger-bg)' : 'transparent',
      color: 'var(--bl-danger)', borderColor: hover ? 'var(--bl-danger-bd)' : 'var(--bl-border)',
    },
  };
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}
      style={{ ...base, ...variants[variant], ...style }}>
      {icon && <Icon name={icon} size={sizes.ic} stroke={variant === 'primary' ? 2 : 1.85} />}
      {children}
      {iconRight && <Icon name={iconRight} size={sizes.ic} stroke={1.85} />}
    </button>
  );
}

// ── Avatar ──────────────────────────────────────────────────────
const BL_AV = [
  ['#4f46e5', '#fff'], ['#0e7490', '#fff'], ['#b45309', '#fff'],
  ['#9333ea', '#fff'], ['#15803d', '#fff'], ['#be123c', '#fff'],
  ['#475569', '#fff'], ['#0369a1', '#fff'],
];
function Avatar({ name, size = 32, idx = 0, ring }) {
  const [bg, fg] = BL_AV[idx % BL_AV.length];
  const ch = (name || '?').trim().charAt(0);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontSize: size * 0.42, fontWeight: 600, lineHeight: 1, userSelect: 'none',
      boxShadow: ring ? '0 0 0 2px var(--bl-surface-1)' : 'none',
    }}>{ch}</div>
  );
}
function AvatarGroup({ people, size = 30, max = 5 }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((p, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: shown.length - i }}>
          <Avatar name={p.name} idx={p.idx ?? i} size={size} ring />
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          marginLeft: -8, width: size, height: size, borderRadius: '50%',
          background: 'var(--bl-surface-2)', color: 'var(--bl-text-2)', boxShadow: '0 0 0 2px var(--bl-surface-1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.34, fontWeight: 600,
        }}>+{extra}</div>
      )}
    </div>
  );
}

// ── Sidebar ─────────────────────────────────────────────────────
const BL_NAV = [
  { key: 'dashboard', label: '대시보드', icon: 'dashboard' },
  { key: 'spaces', label: '공간 관리', icon: 'spaces' },
  { key: 'boards', label: '게시판 관리', icon: 'boards' },
  { key: 'members', label: '회원 관리', icon: 'members' },
  { key: 'moderation', label: '신고·모더레이션', icon: 'moderation', badge: 0 },
  { key: 'settings', label: '사이트 설정', icon: 'settings' },
  { key: 'profile', label: '내 프로필', icon: 'profile' },
];

function NavItem({ item, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', height: 38, padding: '0 10px 0 12px', border: 'none',
        background: active ? 'var(--bl-accent-weak)' : hover ? 'var(--bl-surface-2)' : 'transparent',
        color: active ? 'var(--bl-accent-text)' : 'var(--bl-text-2)',
        borderRadius: 7, cursor: 'pointer', fontSize: 13.5,
        fontWeight: active ? 600 : 500, letterSpacing: '-0.01em', textAlign: 'left',
        transition: 'background .12s, color .12s',
      }}>
      {active && <span style={{ position: 'absolute', left: -8, top: 8, bottom: 8, width: 3, borderRadius: 3, background: 'var(--bl-accent)' }} />}
      <Icon name={item.icon} size={18} stroke={active ? 2 : 1.75} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {typeof item.badge === 'number' && (
        <span style={{
          minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9, fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: item.badge > 0 ? 'var(--bl-danger-bg)' : 'var(--bl-surface-2)',
          color: item.badge > 0 ? 'var(--bl-danger)' : 'var(--bl-text-3)',
          border: `1px solid ${item.badge > 0 ? 'var(--bl-danger-bd)' : 'var(--bl-border)'}`,
        }}>{item.badge}</span>
      )}
    </button>
  );
}

function Sidebar({ active, onNav }) {
  return (
    <aside style={{
      width: 240, flexShrink: 0, height: '100%', background: 'var(--bl-surface-1)',
      borderRight: '1px solid var(--bl-border)', display: 'flex', flexDirection: 'column',
    }}>
      {/* Tenant header */}
      <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid var(--bl-border)' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '6px 8px',
          border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8, textAlign: 'left',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: 'var(--bl-accent)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em',
          }}><BlomMark size={19} line="var(--bl-accent)" /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--bl-text-1)', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>북클럽</div>
            <div style={{ fontSize: 11.5, color: 'var(--bl-text-3)', lineHeight: 1.3 }}>blommunity.io</div>
          </div>
          <Icon name="chevronDown" size={15} style={{ color: 'var(--bl-text-3)' }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
        {BL_NAV.map((it) => (
          <NavItem key={it.key} item={it} active={active === it.key} onClick={() => onNav && onNav(it.key)} />
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--bl-border)' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '7px 8px',
          border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8, textAlign: 'left',
        }}>
          <Avatar name="지은" idx={0} size={30} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bl-text-1)', lineHeight: 1.25 }}>지은</div>
            <div style={{ fontSize: 11, color: 'var(--bl-text-3)', lineHeight: 1.3 }}>jieun@blommunity.io</div>
          </div>
          <Badge tone="accent" size="sm">OWNER</Badge>
        </button>
      </div>
    </aside>
  );
}

// ── Topbar ──────────────────────────────────────────────────────
function TopIconBtn({ name, badge, onClick, title }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', width: 34, height: 34, borderRadius: 7, border: '1px solid transparent',
        background: hover ? 'var(--bl-surface-2)' : 'transparent', color: 'var(--bl-text-2)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .12s',
      }}>
      <Icon name={name} size={18} />
      {badge && <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: 4, background: 'var(--bl-accent)', boxShadow: '0 0 0 2px var(--bl-surface-1)' }} />}
    </button>
  );
}

function Topbar({ crumbs = [], right, onToggleTheme, theme = 'light' }) {
  return (
    <header style={{
      height: 56, flexShrink: 0, borderBottom: '1px solid var(--bl-border)',
      background: 'var(--bl-surface-1)', display: 'flex', alignItems: 'center',
      padding: '0 22px', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 0 }}>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Icon name="chevronRight" size={14} style={{ color: 'var(--bl-text-3)' }} />}
            <span style={{
              fontSize: 13.5, fontWeight: i === crumbs.length - 1 ? 600 : 500,
              color: i === crumbs.length - 1 ? 'var(--bl-text-1)' : 'var(--bl-text-3)',
              whiteSpace: 'nowrap',
            }}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      {right}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {onToggleTheme && <TopIconBtn name={theme === 'dark' ? 'sun' : 'moon'} title="테마 전환" onClick={onToggleTheme} />}
        <TopIconBtn name="bell" badge title="알림" />
        <TopIconBtn name="help" title="도움말" />
        <div style={{ width: 1, height: 22, background: 'var(--bl-border)', margin: '0 6px' }} />
        <button title="지은" style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 2, borderRadius: '50%' }}>
          <Avatar name="지은" idx={0} size={30} />
        </button>
      </div>
    </header>
  );
}

// ── Shell (sidebar + main) ──────────────────────────────────────
function Shell({ active, onNav, topbar, children, dark }) {
  return (
    <div className={'bl' + (dark ? ' dark' : '')} style={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden' }}>
      <Sidebar active={active} onNav={onNav} />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--bl-surface-0)' }}>
        {topbar}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</div>
      </main>
    </div>
  );
}

// blommunity brand mark — speech bubble + post lines (knockout)
function BlomMark({ size = 18, color = '#fff', line = 'var(--bl-accent)' }) {
  const H = size * 0.86, lh = Math.max(1.5, size * 0.125);
  return (
    <div style={{ width: size, height: H, background: color, borderRadius: `${size * 0.3}px ${size * 0.3}px ${size * 0.3}px ${size * 0.08}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: size * 0.13, padding: `0 ${size * 0.2}px`, flexShrink: 0 }}>
      <div style={{ height: lh, width: '100%', borderRadius: lh, background: line }} />
      <div style={{ height: lh, width: '58%', borderRadius: lh, background: line }} />
    </div>
  );
}

Object.assign(window, { Icon, Badge, Btn, Avatar, AvatarGroup, Sidebar, Topbar, Shell, BL_NAV, BlomMark });
