// admin-core.jsx — app state, routing, role/permission logic, mutations, Toast, Tooltip
// Exports to window: AdminProvider, useApp, Tip, AdminToast, ADMIN_ROLES, roleRank

const AdminCtx = React.createContext(null);
const useApp = () => React.useContext(AdminCtx);

const ADMIN_ROLES = ['OWNER', 'MANAGER', 'MEMBER'];
const roleRank = (r) => ({ OWNER: 3, MANAGER: 2, MEMBER: 1 }[r] || 0);

const ADMIN_PERMS = {
  approveTenant: ['OWNER', 'MANAGER'],
  rejectTenant: ['OWNER', 'MANAGER'],
  suspendTenant: ['OWNER', 'MANAGER', 'MEMBER'],
  resumeTenant: ['OWNER', 'MANAGER', 'MEMBER'],
  approveOperator: ['OWNER', 'MANAGER'],
  rejectOperator: ['OWNER', 'MANAGER'],
  changeRole: ['OWNER'],
  viewOperators: ['OWNER', 'MANAGER'],
};
const ADMIN_PERM_REASON = {
  approveTenant: '테넌트 승인은 MANAGER 이상만 가능해요',
  rejectTenant: '테넌트 거절은 MANAGER 이상만 가능해요',
  approveOperator: '운영자 승인은 MANAGER 이상만 가능해요',
  rejectOperator: '운영자 거절은 MANAGER 이상만 가능해요',
  changeRole: '역할 변경은 OWNER만 할 수 있어요',
  viewOperators: '운영자 관리는 MANAGER 이상만 접근할 수 있어요',
};

function fmtNow() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `2026-05-30 ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function AdminProvider({ children }) {
  const [authed, setAuthed] = React.useState(true);
  const [role, setRole] = React.useState('OWNER');
  const [theme, setTheme] = React.useState('light');
  const [route, setRoute] = React.useState({ screen: 'dashboard', tenantId: null });
  const [tenants, setTenants] = React.useState(() => window.ADMIN_TENANTS.map((t) => ({ ...t })));
  const [operators, setOperators] = React.useState(() => window.ADMIN_OPERATORS.map((o) => ({ ...o })));
  const [audit, setAudit] = React.useState(() => window.ADMIN_AUDIT.map((a) => ({ ...a })));
  const [toast, setToast] = React.useState(null);
  const toastTimer = React.useRef(0);

  const navigate = React.useCallback((screen, params = {}) => {
    setRoute({ screen, tenantId: params.tenantId ?? null });
    const main = document.querySelector('[data-admin-main]');
    if (main) main.scrollTop = 0;
  }, []);

  const showToast = React.useCallback((msg, opts = {}) => {
    clearTimeout(toastTimer.current);
    const id = Math.random().toString(36).slice(2);
    setToast({ id, msg, sub: opts.sub, tone: opts.tone || 'success', logged: opts.logged !== false });
    toastTimer.current = setTimeout(() => setToast(null), opts.tone === 'error' ? 3200 : 3600);
  }, []);

  const can = React.useCallback((action) => (ADMIN_PERMS[action] || []).includes(role), [role]);
  const permReason = (action) => ADMIN_PERM_REASON[action] || '권한이 없어요';

  const logAction = React.useCallback((kind, action, target) => {
    const entry = { id: Math.random().toString(36).slice(2), actor: window.ADMIN_ME.name, actorIdx: window.ADMIN_ME.idx, kind, action, target, time: fmtNow(), ago: '방금', fresh: true };
    setAudit((prev) => [entry, ...prev]);
  }, []);

  const guard = (action) => {
    if (can(action)) return true;
    showToast('권한이 없어요', { sub: permReason(action), tone: 'error', logged: false });
    return false;
  };

  const api = {
    authed, role, theme, route, tenants, operators, audit, toast,
    me: window.ADMIN_ME,
    today: window.ADMIN_TODAY,
    navigate, setRole, showToast, can, permReason,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    login: () => { setAuthed(true); navigate('dashboard'); },
    logout: () => { setAuthed(false); setRole('OWNER'); },
    dismissToast: () => setToast(null),

    approveTenant: (id) => {
      if (!guard('approveTenant')) return;
      const t = tenants.find((x) => x.id === id); if (!t) return;
      setTenants((prev) => prev.map((x) => x.id === id ? { ...x, status: 'ACTIVE', lastActive: '방금' } : x));
      logAction('approve', '테넌트 승인', t.name);
      showToast(`‘${t.name}’ 테넌트를 승인했습니다`, { sub: '감사 로그에 기록됨' });
    },
    rejectTenant: (id) => {
      if (!guard('rejectTenant')) return;
      const t = tenants.find((x) => x.id === id); if (!t) return;
      setTenants((prev) => prev.filter((x) => x.id !== id));
      logAction('reject', '테넌트 거절', t.name);
      showToast(`‘${t.name}’ 가입을 거절했습니다`, { sub: '감사 로그에 기록됨' });
      if (route.tenantId === id) navigate('tenants');
    },
    suspendTenant: (id) => {
      if (!guard('suspendTenant')) return;
      const t = tenants.find((x) => x.id === id); if (!t) return;
      setTenants((prev) => prev.map((x) => x.id === id ? { ...x, status: 'SUSPENDED' } : x));
      logAction('suspend', '테넌트 정지', t.name);
      showToast(`‘${t.name}’ 테넌트를 정지했습니다`, { sub: '감사 로그에 기록됨' });
    },
    resumeTenant: (id) => {
      if (!guard('resumeTenant')) return;
      const t = tenants.find((x) => x.id === id); if (!t) return;
      setTenants((prev) => prev.map((x) => x.id === id ? { ...x, status: 'ACTIVE' } : x));
      logAction('resume', '테넌트 정지 해제', t.name);
      showToast(`‘${t.name}’ 정지를 해제했습니다`, { sub: '감사 로그에 기록됨' });
    },
    approveOperator: (id) => {
      if (!guard('approveOperator')) return;
      const o = operators.find((x) => x.id === id); if (!o) return;
      setOperators((prev) => prev.map((x) => x.id === id ? { ...x, status: 'APPROVED', lastActive: '방금' } : x));
      logAction('approve', '운영자 승인', o.name);
      showToast(`‘${o.name}’ 운영자를 승인했습니다`, { sub: '감사 로그에 기록됨' });
    },
    rejectOperator: (id) => {
      if (!guard('rejectOperator')) return;
      const o = operators.find((x) => x.id === id); if (!o) return;
      setOperators((prev) => prev.filter((x) => x.id !== id));
      logAction('reject', '운영자 거절', o.name);
      showToast(`‘${o.name}’ 가입을 거절했습니다`, { sub: '감사 로그에 기록됨' });
    },
    changeOperatorRole: (id, newRole) => {
      if (!guard('changeRole')) return;
      const o = operators.find((x) => x.id === id); if (!o || o.role === newRole) return;
      const old = o.role;
      setOperators((prev) => prev.map((x) => x.id === id ? { ...x, role: newRole } : x));
      logAction('role', '역할 변경', `${o.name} · ${old} → ${newRole}`);
      showToast(`‘${o.name}’의 역할을 ${newRole}로 변경했습니다`, { sub: '감사 로그에 기록됨' });
    },
  };

  return <AdminCtx.Provider value={api}>{children}</AdminCtx.Provider>;
}

// ── Tooltip (hover) — used for disabled / gated actions ─────────
function Tip({ text, children, side = 'top', disabled }) {
  const [show, setShow] = React.useState(false);
  if (!text) return children;
  const pos = side === 'top'
    ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 }
    : { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 };
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span style={{
          position: 'absolute', ...pos, zIndex: 50, whiteSpace: 'nowrap', pointerEvents: 'none',
          background: 'var(--bl-text-1)', color: 'var(--bl-surface-1)', fontSize: 11.5, fontWeight: 500,
          padding: '6px 9px', borderRadius: 6, boxShadow: '0 4px 14px rgba(0,0,0,.22)', letterSpacing: '-0.01em',
        }}>{text}</span>
      )}
    </span>
  );
}

// ── Toast ───────────────────────────────────────────────────────
function AdminToast() {
  const app = useApp();
  const t = app.toast;
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { if (t) { setMounted(false); requestAnimationFrame(() => setMounted(true)); } }, [t && t.id]);
  if (!t) return null;
  const err = t.tone === 'error';
  return (
    <div style={{ position: 'absolute', bottom: 22, left: '50%', zIndex: 80, transform: `translateX(-50%) translateY(${mounted ? 0 : 10}px)`, opacity: mounted ? 1 : 0, transition: 'opacity .2s, transform .2s' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px 11px 13px', minWidth: 280,
        background: 'var(--bl-surface-1)', border: '1px solid var(--bl-border)', borderRadius: 10,
        boxShadow: 'var(--bl-shadow-pop)',
      }}>
        <span style={{
          width: 26, height: 26, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: err ? 'var(--bl-danger-bg)' : 'var(--bl-success-bg)', color: err ? 'var(--bl-danger)' : 'var(--bl-success)',
        }}><Icon name={err ? 'alertTriangle' : 'checkCircle'} size={16} stroke={2} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bl-text-1)', lineHeight: 1.3 }}>{t.msg}</div>
          {t.sub && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--bl-text-3)', marginTop: 2 }}>
              {t.logged && <Icon name="auditLog" size={11} />}{t.sub}
            </div>
          )}
        </div>
        {t.logged && !err && (
          <button onClick={() => { app.dismissToast(); app.navigate('audit'); }}
            style={{ border: 'none', background: 'transparent', color: 'var(--bl-accent-text)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '4px 6px', borderRadius: 5, fontFamily: 'inherit', flexShrink: 0 }}>로그 보기</button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { AdminProvider, useApp, Tip, AdminToast, ADMIN_ROLES, roleRank, AdminCtx, ADMIN_PERMS, ADMIN_PERM_REASON });
