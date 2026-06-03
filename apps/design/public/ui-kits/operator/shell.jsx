// admin-shell.jsx — Sidebar, Topbar (role switcher + theme), tables, badges, layout
// Depends on console-system.jsx (Icon, Badge, Btn, Avatar) + admin-core.jsx (useApp, Tip)
// Exports: AdminShell, AdminSidebar, AdminTopbar, PageHeader, ACard, DataTable,
//          TStatus, OStatus, RoleBadge, Segmented, SearchInput, Stat, KV

// ── Status & role badges ────────────────────────────────────────
function TStatus({ status, size }) {
  const m = {
    ACTIVE: ['success', '활성'], PENDING: ['warning', '승인 대기'], SUSPENDED: ['danger', '정지'],
  }[status] || ['neutral', status];
  return <Badge tone={m[0]} size={size}><span style={{ width: 6, height: 6, borderRadius: 4, background: 'currentColor', display: 'inline-block', marginRight: 1 }} />{m[1]}</Badge>;
}
function OStatus({ status, size }) {
  const m = { APPROVED: ['success', '승인됨'], PENDING: ['warning', '승인 대기'] }[status] || ['neutral', status];
  return <Badge tone={m[0]} size={size}><span style={{ width: 6, height: 6, borderRadius: 4, background: 'currentColor', display: 'inline-block', marginRight: 1 }} />{m[1]}</Badge>;
}
function RoleBadge({ role, size }) {
  if (role === 'OWNER') return <Badge tone="accent" icon="key" size={size}>OWNER</Badge>;
  if (role === 'MANAGER') return <Badge tone="neutral" icon="shieldCheck" size={size}>MANAGER</Badge>;
  return <Badge tone="neutral" size={size}>MEMBER</Badge>;
}

// ── Stat (metric) ───────────────────────────────────────────────
function Stat({ icon, label, value, unit, sub, tone }) {
  return (
    <ACard style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
        <span style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: tone ? `var(--bl-${tone}-bg)` : 'var(--bl-surface-2)', color: tone ? `var(--bl-${tone})` : 'var(--bl-text-2)' }}><Icon name={icon} size={15} /></span>
        <span style={{ fontSize: 12, fontWeight: 550, color: 'var(--bl-text-2)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span className="bl-tnum" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--bl-text-1)', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 12.5, color: 'var(--bl-text-3)', fontWeight: 500 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--bl-text-3)', marginTop: 7 }}>{sub}</div>}
    </ACard>
  );
}

// ── Card ────────────────────────────────────────────────────────
function ACard({ children, style }) {
  return <div style={{ background: 'var(--bl-surface-1)', border: '1px solid var(--bl-border)', borderRadius: 10, ...style }}>{children}</div>;
}

// ── Key/Value row ───────────────────────────────────────────────
function KV({ label, children, mono }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--bl-border)' }}>
      <span style={{ width: 96, flexShrink: 0, fontSize: 12.5, color: 'var(--bl-text-3)', fontWeight: 500 }}>{label}</span>
      <span style={{ flex: 1, fontSize: 13, color: 'var(--bl-text-1)', fontWeight: 500, fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit' }}>{children}</span>
    </div>
  );
}

// ── Segmented control ───────────────────────────────────────────
function Segmented({ options, value, onChange, size = 'md' }) {
  const h = size === 'sm' ? 28 : 32;
  const fs = size === 'sm' ? 12 : 12.5;
  return (
    <div style={{ display: 'inline-flex', padding: 2, gap: 2, background: 'var(--bl-surface-2)', borderRadius: 8, border: '1px solid var(--bl-border)' }}>
      {options.map((o) => {
        const val = typeof o === 'string' ? o : o.value;
        const lbl = typeof o === 'string' ? o : o.label;
        const on = val === value;
        return (
          <button key={val} onClick={() => onChange(val)}
            style={{
              height: h, padding: '0 11px', border: 'none', borderRadius: 6, cursor: 'pointer',
              fontSize: fs, fontWeight: on ? 650 : 550, fontFamily: 'inherit', letterSpacing: '-0.01em',
              display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              background: on ? 'var(--bl-surface-1)' : 'transparent',
              color: on ? 'var(--bl-text-1)' : 'var(--bl-text-3)',
              boxShadow: on ? '0 1px 2px rgba(0,0,0,.08), 0 0 0 1px var(--bl-border)' : 'none',
              transition: 'color .12s',
            }}>
            {typeof o === 'object' && o.count != null && (
              <span className="bl-tnum" style={{ fontSize: 11, fontWeight: 700, color: on ? 'var(--bl-text-2)' : 'var(--bl-text-3)' }}>{o.count}</span>
            )}
            {lbl}
          </button>
        );
      })}
    </div>
  );
}

// ── Search input ────────────────────────────────────────────────
function SearchInput({ value, onChange, placeholder, width = 240 }) {
  const [foc, setFoc] = React.useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7, height: 34, width, padding: '0 10px',
      border: `1px solid ${foc ? 'var(--bl-accent)' : 'var(--bl-border-strong)'}`, borderRadius: 7,
      background: 'var(--bl-surface-1)', boxShadow: foc ? '0 0 0 3px var(--bl-focus)' : 'none', transition: 'border-color .12s, box-shadow .12s',
    }}>
      <Icon name="search" size={15} style={{ color: 'var(--bl-text-3)', flexShrink: 0 }} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--bl-text-1)', fontFamily: 'inherit' }} />
    </div>
  );
}

// ── Data table ──────────────────────────────────────────────────
function DataTable({ columns, rows, onRowClick, rowKey = 'id', empty = '결과가 없어요' }) {
  return (
    <ACard style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>{columns.map((c, i) => <col key={i} style={{ width: c.width }} />)}</colgroup>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bl-border)' }}>
              {columns.map((c, i) => (
                <th key={i} style={{
                  textAlign: c.align || 'left', padding: '10px 14px', fontSize: 11.5, fontWeight: 600,
                  color: 'var(--bl-text-3)', letterSpacing: '.02em', whiteSpace: 'nowrap',
                  background: 'var(--bl-surface-2)', position: 'sticky', top: 0,
                }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length} style={{ padding: '40px 14px', textAlign: 'center', fontSize: 13, color: 'var(--bl-text-3)' }}>{empty}</td></tr>
            )}
            {rows.map((row) => <TRow key={row[rowKey]} row={row} columns={columns} onRowClick={onRowClick} />)}
          </tbody>
        </table>
      </div>
    </ACard>
  );
}
function TRow({ row, columns, onRowClick }) {
  const [hover, setHover] = React.useState(false);
  const clickable = !!onRowClick;
  return (
    <tr onClick={clickable ? () => onRowClick(row) : undefined}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        borderBottom: '1px solid var(--bl-border)', cursor: clickable ? 'pointer' : 'default',
        background: hover && clickable ? 'var(--bl-surface-2)' : 'transparent', transition: 'background .1s',
      }}>
      {columns.map((c, i) => (
        <td key={i} style={{ padding: '11px 14px', fontSize: 13, color: 'var(--bl-text-1)', textAlign: c.align || 'left', verticalAlign: 'middle', overflow: 'hidden' }}>
          {c.render ? c.render(row, hover) : row[c.key]}
        </td>
      ))}
    </tr>
  );
}

// ── Page header ─────────────────────────────────────────────────
function PageHeader({ title, sub, actions, back }) {
  const app = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {back && (
          <button onClick={() => app.navigate(back.screen)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', color: 'var(--bl-text-3)', cursor: 'pointer', fontSize: 12.5, fontWeight: 550, padding: '0 0 8px', fontFamily: 'inherit' }}>
            <Icon name="chevronLeft" size={14} />{back.label}
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: 21, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--bl-text-1)' }}>{title}</h1>
          {sub && typeof sub !== 'string' && sub}
        </div>
        {typeof sub === 'string' && <p style={{ margin: '5px 0 0', fontSize: 13.5, color: 'var(--bl-text-2)' }}>{sub}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 9, flexShrink: 0, alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

// ── Sidebar ─────────────────────────────────────────────────────
const ADMIN_NAV = [
  { key: 'dashboard', label: '대시보드', icon: 'dashboard' },
  { key: 'tenants', label: '테넌트 관리', icon: 'building', pending: 'tenant' },
  { key: 'operators', label: '운영자 관리', icon: 'shieldCheck', perm: 'viewOperators', pending: 'operator' },
  { key: 'audit', label: '감사 로그', icon: 'auditLog' },
  { key: 'settings', label: '설정·프로필', icon: 'settings' },
];

function AdminNavItem({ item, active, locked, pendingCount, onClick }) {
  const [hover, setHover] = React.useState(false);
  const btn = (
    <button onClick={locked ? undefined : onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      disabled={locked}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 10, width: '100%', height: 36,
        padding: '0 10px 0 12px', border: 'none', borderRadius: 7, textAlign: 'left',
        background: active ? 'var(--bl-accent-weak)' : (hover && !locked) ? 'var(--bl-surface-2)' : 'transparent',
        color: locked ? 'var(--bl-text-3)' : active ? 'var(--bl-accent-text)' : 'var(--bl-text-2)',
        cursor: locked ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: active ? 650 : 500,
        letterSpacing: '-0.01em', opacity: locked ? 0.55 : 1, transition: 'background .12s, color .12s',
      }}>
      {active && <span style={{ position: 'absolute', left: -8, top: 7, bottom: 7, width: 3, borderRadius: 3, background: 'var(--bl-accent)' }} />}
      <Icon name={item.icon} size={17} stroke={active ? 2 : 1.75} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {locked ? <Icon name="lock" size={13} />
        : pendingCount > 0 ? (
          <span className="bl-tnum" style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bl-warning-bg)', color: 'var(--bl-warning)', border: '1px solid var(--bl-warning-bd)' }}>{pendingCount}</span>
        ) : null}
    </button>
  );
  return locked ? <Tip text={`MANAGER 이상만 접근할 수 있어요`} side="bottom">{btn}</Tip> : btn;
}

function AdminSidebar() {
  const app = useApp();
  const pendingTenants = app.tenants.filter((t) => t.status === 'PENDING').length;
  const pendingOps = app.operators.filter((o) => o.status === 'PENDING').length;
  return (
    <aside style={{ width: 236, flexShrink: 0, height: '100%', background: 'var(--bl-surface-1)', borderRight: '1px solid var(--bl-border)', display: 'flex', flexDirection: 'column' }}>
      {/* brand */}
      <div style={{ padding: '15px 16px 13px', borderBottom: '1px solid var(--bl-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bl-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, fontWeight: 800, letterSpacing: '-0.04em' }}><BlomMark size={18} line="var(--bl-accent)" /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--bl-text-1)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>blommunity</div>
            <div style={{ fontSize: 11, color: 'var(--bl-text-3)', lineHeight: 1.3, fontWeight: 550 }}>Operator Console</div>
          </div>
        </div>
      </div>
      {/* nav */}
      <nav style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--bl-text-3)', letterSpacing: '.06em', padding: '6px 12px 6px' }}>관제</div>
        {ADMIN_NAV.map((it) => {
          const locked = it.perm ? !app.can(it.perm) : false;
          const pc = it.pending === 'tenant' ? pendingTenants : it.pending === 'operator' ? pendingOps : 0;
          const active = app.route.screen === it.key || (it.key === 'tenants' && app.route.screen === 'tenant');
          return <AdminNavItem key={it.key} item={it} active={active} locked={locked} pendingCount={pc} onClick={() => app.navigate(it.key)} />;
        })}
      </nav>
      {/* profile footer */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--bl-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px' }}>
          <Avatar name={app.me.name} idx={app.me.idx} size={30} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--bl-text-1)', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.me.name}</div>
            <div style={{ marginTop: 3 }}><RoleBadge role={app.role} size="sm" /></div>
          </div>
          <Tip text="로그아웃"><button onClick={app.logout} style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--bl-text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="logout" size={16} /></button></Tip>
        </div>
      </div>
    </aside>
  );
}

// ── Role switcher (demo) ────────────────────────────────────────
function RoleSwitcher() {
  const app = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--bl-text-3)', letterSpacing: '.01em' }}>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4, background: 'var(--bl-surface-2)', border: '1px solid var(--bl-border)', color: 'var(--bl-text-3)' }}>DEMO</span>
        역할
      </span>
      <Segmented size="sm" value={app.role} onChange={app.setRole} options={ADMIN_ROLES} />
    </div>
  );
}

// ── Topbar ──────────────────────────────────────────────────────
function AdminTopbar({ crumbs = [] }) {
  const app = useApp();
  return (
    <header style={{ height: 54, flexShrink: 0, borderBottom: '1px solid var(--bl-border)', background: 'var(--bl-surface-1)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 0 }}>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Icon name="chevronRight" size={13} style={{ color: 'var(--bl-text-3)' }} />}
            <span style={{ fontSize: 13, fontWeight: i === crumbs.length - 1 ? 650 : 500, color: i === crumbs.length - 1 ? 'var(--bl-text-1)' : 'var(--bl-text-3)', whiteSpace: 'nowrap' }}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <RoleSwitcher />
      <div style={{ width: 1, height: 22, background: 'var(--bl-border)' }} />
      <Tip text={app.theme === 'dark' ? '라이트 모드' : '다크 모드'}>
        <button onClick={app.toggleTheme} style={{ width: 34, height: 34, borderRadius: 7, border: '1px solid transparent', background: 'transparent', color: 'var(--bl-text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bl-surface-2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          <Icon name={app.theme === 'dark' ? 'sun' : 'moon'} size={17} />
        </button>
      </Tip>
    </header>
  );
}

// ── Shell ───────────────────────────────────────────────────────
function AdminShell({ crumbs, children }) {
  const app = useApp();
  return (
    <div className={'bl' + (app.theme === 'dark' ? ' dark' : '')} style={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden', position: 'relative' }}>
      <AdminSidebar />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--bl-surface-0)' }}>
        <AdminTopbar crumbs={crumbs} />
        <div data-admin-main style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div style={{ padding: '24px 28px 40px', maxWidth: 1240, margin: '0 auto' }}>{children}</div>
        </div>
      </main>
      <AdminToast />
    </div>
  );
}

// ── Soft action button (approve / reject / suspend) — gated-aware ─
function SoftBtn({ tone = 'neutral', icon, children, onClick, disabled, tip, size = 'sm', solid }) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    success: ['var(--bl-success)', 'var(--bl-success-bg)', 'var(--bl-success-bd)'],
    danger: ['var(--bl-danger)', 'var(--bl-danger-bg)', 'var(--bl-danger-bd)'],
    accent: ['var(--bl-accent-text)', 'var(--bl-accent-weak)', 'var(--bl-accent-weak)'],
    neutral: ['var(--bl-text-1)', 'var(--bl-surface-1)', 'var(--bl-border-strong)'],
  };
  const [c, bg, bd] = tones[tone] || tones.neutral;
  const h = size === 'sm' ? 30 : 34;
  const el = (
    <button onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        height: h, padding: `0 ${size === 'sm' ? 10 : 13}px`, borderRadius: 6,
        fontSize: size === 'sm' ? 12.5 : 13, fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer', letterSpacing: '-0.005em',
        border: `1px solid ${disabled ? 'var(--bl-border)' : bd}`,
        background: disabled ? 'transparent' : hover ? bg : (tone === 'neutral' ? bg : 'transparent'),
        color: disabled ? 'var(--bl-text-3)' : c, opacity: disabled ? 0.6 : 1,
        boxShadow: !disabled && tone === 'neutral' ? '0 1px 1px rgba(20,20,40,.04)' : 'none',
        transition: 'background .12s, border-color .12s',
      }}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 15} stroke={2} />}{children}
      {disabled && <Icon name="lock" size={12} style={{ opacity: 0.7 }} />}
    </button>
  );
  return disabled && tip ? <Tip text={tip}>{el}</Tip> : el;
}

Object.assign(window, { AdminShell, AdminSidebar, AdminTopbar, PageHeader, ACard, DataTable, TStatus, OStatus, RoleBadge, Segmented, SearchInput, Stat, KV, SoftBtn });
