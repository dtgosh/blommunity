// admin-catalog.jsx — static catalog: lays out admin screens, role diffs & states
// Reuses the admin visual language verbatim. No routing/interactions.
// Depends on: console-system, admin-data, admin-core (AdminCtx, ADMIN_PERMS...),
//             admin-shell, admin-dashboard, admin-tenants, admin-operators, admin-audit

// ── static app factory (no state, drives the real screens via AdminCtx) ──
function makeApp(opts = {}) {
  const role = opts.role || 'OWNER';
  return {
    role,
    dark: !!opts.dark,
    theme: opts.dark ? 'dark' : 'light',
    screen: (opts.route && opts.route.screen) || 'dashboard',
    route: opts.route || { screen: 'dashboard', tenantId: null },
    tenants: opts.tenants || window.ADMIN_TENANTS,
    operators: opts.operators || window.ADMIN_OPERATORS,
    audit: opts.audit || window.ADMIN_AUDIT,
    me: window.ADMIN_ME,
    today: window.ADMIN_TODAY,
    toast: null,
    modal: null,
    can: (a) => (window.ADMIN_PERMS[a] || []).includes(role),
    permReason: (a) => window.ADMIN_PERM_REASON[a] || '권한이 없어요',
    navigate: () => {}, setRole: () => {}, toggleTheme: () => {},
    showToast: () => {}, dismissToast: () => {},
    approveTenant: () => {}, rejectTenant: () => {}, suspendTenant: () => {}, resumeTenant: () => {},
    approveOperator: () => {}, rejectOperator: () => {}, changeOperatorRole: () => {},
    login: () => {}, logout: () => {},
  };
}

// data variants
const NO_PENDING_TENANTS = window.ADMIN_TENANTS.map((t) => t.status === 'PENDING' ? { ...t, status: 'ACTIVE', spaces: 1, boards: 2, members: 14, lastActive: '방금' } : t);
const NO_PENDING_OPERATORS = window.ADMIN_OPERATORS.map((o) => o.status === 'PENDING' ? { ...o, status: 'APPROVED', lastActive: '방금' } : o);

// ── Screen mount (injects a static app context) ─────────────────
function Mount({ app, children }) {
  return <AdminCtx.Provider value={app}>{children}</AdminCtx.Provider>;
}

// ── Framed screen with a label ──────────────────────────────────
function Frame({ tag, label, caption, w, h, dark, children }) {
  return (
    <div style={{ width: w, flex: '0 0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        {tag && <span style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', background: '#eef0fe', border: '1px solid #e0e3fb', borderRadius: 6, padding: '3px 8px', letterSpacing: '.02em' }}>{tag}</span>}
        <span style={{ fontSize: 15.5, fontWeight: 700, color: '#1a1a1f', letterSpacing: '-0.01em' }}>{label}</span>
        {caption && <span style={{ fontSize: 13, color: '#71717a' }}>· {caption}</span>}
        {dark && <span style={{ fontSize: 11, fontWeight: 600, color: '#52525b', background: '#e4e4e7', borderRadius: 5, padding: '2px 7px' }}>DARK</span>}
      </div>
      <div style={{ width: w, height: h, borderRadius: 14, overflow: 'hidden', border: '1px solid #d7d7dc', boxShadow: '0 1px 2px rgba(20,20,40,.05), 0 8px 24px rgba(20,20,40,.04)', position: 'relative', background: dark ? '#0a0a0c' : '#fff' }}>
        {children}
      </div>
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: 'flex', gap: 28, flexWrap: 'nowrap', alignItems: 'flex-start' }}>{children}</div>;
}

function Group({ title, desc, children }) {
  return (
    <section style={{ marginBottom: 60 }}>
      <div style={{ marginBottom: 26, borderBottom: '1px solid #d7d7dc', paddingBottom: 14 }}>
        <h2 style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#92929c', margin: 0 }}>{title}</h2>
        {desc && <p style={{ fontSize: 14, color: '#52525b', margin: '7px 0 0', lineHeight: 1.5 }}>{desc}</p>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>{children}</div>
    </section>
  );
}

// ── Sidebar role comparison ─────────────────────────────────────
function SidebarCompare() {
  const items = [
    { role: 'OWNER', cap: '모든 메뉴 + 역할 변경' },
    { role: 'MANAGER', cap: '운영자 관리 접근 · 역할 변경 불가' },
    { role: 'MEMBER', cap: '운영자 관리 잠김' },
  ];
  return (
    <Row>
      {items.map((it) => (
        <Frame key={it.role} label={`사이드바 — ${it.role}`} caption={it.cap} w={238} h={544}>
          <Mount app={makeApp({ role: it.role })}>
            <div className="bl" style={{ height: '100%', display: 'flex' }}><AdminSidebar /></div>
          </Mount>
        </Frame>
      ))}
    </Row>
  );
}

// ── Catalog ─────────────────────────────────────────────────────
function Catalog() {
  return (
    <div style={{ width: 'fit-content', minWidth: '100%', padding: '48px 56px 80px' }}>
      <header style={{ marginBottom: 48, maxWidth: 760 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em' }}><BlomMark size={21} line="#4f46e5" /></div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#71717a' }}>blommunity · Operator Console</div>
        </div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: '#18181b' }}>운영자 어드민 — 화면 &amp; 상태 카탈로그</h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, lineHeight: 1.6, color: '#52525b' }}>프로토타입의 시각 언어를 그대로 사용한 정적 검토용 시안입니다. 핵심 화면, 역할(OWNER/MANAGER/MEMBER)에 따른 차이, 주요 상태 변형을 한 페이지에 펼쳤어요.</p>
      </header>

      {/* 1. 핵심 화면 */}
      <Group title="핵심 화면" desc="운영자가 가장 자주 보는 다섯 화면. 모두 라이트 모드 · OWNER 기준입니다.">
        <Frame tag="01" label="대시보드" caption="승인 대기 큐 · 핵심 지표 · 최근 감사 로그" w={1280} h={1012}>
          <Mount app={makeApp()}><DashboardScreen /></Mount>
        </Frame>
        <Frame tag="02" label="테넌트 목록" caption="상태 배지 · 승인/거절 · 행 클릭 → 상세" w={1280} h={868}>
          <Mount app={makeApp({ route: { screen: 'tenants' } })}><TenantsScreen /></Mount>
        </Frame>
        <Frame tag="03" label="테넌트 상세" caption="기본 정보 · 현황 · 스토리지 · 정지 액션" w={1280} h={748}>
          <Mount app={makeApp({ route: { screen: 'tenant', tenantId: 't_bookclub' } })}><TenantDetailScreen /></Mount>
        </Frame>
        <Frame tag="04" label="운영자 목록" caption="가입 대기 승인 · 역할 변경" w={1280} h={724}>
          <Mount app={makeApp({ route: { screen: 'operators' } })}><OperatorsScreen /></Mount>
        </Frame>
        <Frame tag="05" label="감사 로그" caption="행위자 · 대상 · 액션 · 시각 필터" w={1280} h={836}>
          <Mount app={makeApp({ route: { screen: 'audit' } })}><AuditScreen /></Mount>
        </Frame>
      </Group>

      {/* 2. 역할별 차이 */}
      <Group title="역할별 차이" desc="같은 화면이 역할에 따라 어떻게 달라지는지. 권한이 없는 액션은 숨기지 않고 비활성 + 자물쇠로 표시합니다.">
        <Row>
          <Frame label="운영자 관리 — OWNER" caption="역할 변경 가능" w={940} h={700}>
            <Mount app={makeApp({ role: 'OWNER', route: { screen: 'operators' } })}><OperatorsScreen /></Mount>
          </Frame>
          <Frame label="운영자 관리 — MANAGER" caption="역할 변경 비활성 · 승인은 가능" w={940} h={700}>
            <Mount app={makeApp({ role: 'MANAGER', route: { screen: 'operators' } })}><OperatorsScreen /></Mount>
          </Frame>
        </Row>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#3f3f46', marginBottom: 16 }}>사이드바 메뉴 — 역할별 차이</div>
          <SidebarCompare />
        </div>
      </Group>

      {/* 3. 상태 변형 */}
      <Group title="상태 변형" desc="검토에 유용한 주요 상태를 함께 펼쳤습니다.">
        <Row>
          <Frame label="대시보드 — 승인 대기 여러 건" caption="처리할 큐가 있을 때" w={940} h={980}>
            <Mount app={makeApp()}><DashboardScreen /></Mount>
          </Frame>
          <Frame label="대시보드 — 승인 대기 0건" caption="모두 처리된 빈 큐" w={940} h={980}>
            <Mount app={makeApp({ tenants: NO_PENDING_TENANTS, operators: NO_PENDING_OPERATORS })}><DashboardScreen /></Mount>
          </Frame>
        </Row>
        <Row>
          <Frame label="테넌트 목록 — 데이터 있음" caption="12개 테넌트" w={940} h={760}>
            <Mount app={makeApp({ route: { screen: 'tenants' } })}><TenantsScreen /></Mount>
          </Frame>
          <Frame label="테넌트 목록 — 빈 상태" caption="등록된 테넌트 없음" w={940} h={440}>
            <Mount app={makeApp({ tenants: [], route: { screen: 'tenants' } })}><TenantsScreen /></Mount>
          </Frame>
        </Row>
      </Group>

      {/* 4. 다크 모드 */}
      <Group title="다크 모드" desc="밀도 높은 화면의 다크 모드. 인프라 도구는 다크 모드 사용자가 많습니다.">
        <Frame label="감사 로그" caption="동일 레이아웃 · 다크 토큰" w={1280} h={836} dark>
          <Mount app={makeApp({ dark: true, route: { screen: 'audit' } })}><AuditScreen /></Mount>
        </Frame>
      </Group>
    </div>
  );
}

window.Catalog = Catalog;
