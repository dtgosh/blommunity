// admin-dashboard.jsx — 대시보드 (승인 대기 큐 + 지표 + 최근 감사 로그)
// Depends on admin-shell + admin-core globals

function ApprovalRow({ item, last }) {
  const app = useApp();
  const canApprove = item.kind === 'tenant' ? app.can('approveTenant') : app.can('approveOperator');
  const reason = item.kind === 'tenant' ? app.permReason('approveTenant') : app.permReason('approveOperator');
  const isTenant = item.kind === 'tenant';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px', borderBottom: last ? 'none' : '1px solid var(--bl-border)' }}>
      <span style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bl-warning-bg)', color: 'var(--bl-warning)', border: '1px solid var(--bl-warning-bd)' }}>
        <Icon name={isTenant ? 'building' : 'shieldCheck'} size={17} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--bl-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--bl-text-2)', background: 'var(--bl-surface-2)', border: '1px solid var(--bl-border)', borderRadius: 5, padding: '2px 6px', whiteSpace: 'nowrap' }}>{isTenant ? '테넌트 가입' : '운영자 가입'}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--bl-text-3)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.meta}</div>
      </div>
      <span style={{ fontSize: 11.5, color: 'var(--bl-text-3)', whiteSpace: 'nowrap', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="clock" size={12} />{item.ago}</span>
      <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
        <SoftBtn tone="success" icon="check" disabled={!canApprove} tip={reason} onClick={() => isTenant ? app.approveTenant(item.id) : app.approveOperator(item.id)}>승인</SoftBtn>
        <SoftBtn tone="danger" icon="x" disabled={!canApprove} tip={reason} onClick={() => isTenant ? app.rejectTenant(item.id) : app.rejectOperator(item.id)}>거절</SoftBtn>
      </div>
    </div>
  );
}

function ApprovalQueue() {
  const app = useApp();
  const pendingTenants = app.tenants.filter((t) => t.status === 'PENDING').map((t) => ({ kind: 'tenant', id: t.id, name: t.name, meta: `담당자 ${t.owner} · ${t.ownerEmail} · ${t.plan}`, ago: t.createdAt === '2026-05-29' ? '어제' : t.createdAt === '2026-05-28' ? '2일 전' : '방금' }));
  const pendingOps = app.operators.filter((o) => o.status === 'PENDING').map((o) => ({ kind: 'operator', id: o.id, name: o.name, meta: `${o.email} · 요청 역할 MEMBER`, ago: o.joinedAt === '2026-05-29' ? '어제' : '2일 전' }));
  const items = [...pendingTenants, ...pendingOps];
  const canAny = app.can('approveTenant') || app.can('approveOperator');

  return (
    <ACard style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--bl-border)' }}>
        <span style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: items.length ? 'var(--bl-warning-bg)' : 'var(--bl-success-bg)', color: items.length ? 'var(--bl-warning)' : 'var(--bl-success)', border: `1px solid ${items.length ? 'var(--bl-warning-bd)' : 'var(--bl-success-bd)'}` }}>
          <Icon name={items.length ? 'clock' : 'checkCircle'} size={16} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 650, color: 'var(--bl-text-1)' }}>처리할 승인 대기 <span className="bl-tnum" style={{ color: items.length ? 'var(--bl-warning)' : 'var(--bl-text-3)' }}>{items.length}</span></div>
          <div style={{ fontSize: 12, color: 'var(--bl-text-3)', marginTop: 1 }}>테넌트·운영자 가입 요청을 한 곳에서 처리하세요</div>
        </div>
        {!canAny && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--bl-text-3)', background: 'var(--bl-surface-2)', border: '1px solid var(--bl-border)', borderRadius: 6, padding: '5px 9px' }}>
            <Icon name="lock" size={12} />MANAGER 이상만 처리할 수 있어요
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <div style={{ padding: '34px 16px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: 'var(--bl-success-bg)', color: 'var(--bl-success)', marginBottom: 10 }}><Icon name="checkCircle" size={20} /></div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--bl-text-1)' }}>모든 승인 요청을 처리했어요</div>
          <div style={{ fontSize: 12.5, color: 'var(--bl-text-3)', marginTop: 3 }}>새 가입 요청이 들어오면 여기에 표시됩니다</div>
        </div>
      ) : items.map((it, i) => <ApprovalRow key={it.id} item={it} last={i === items.length - 1} />)}
    </ACard>
  );
}

const AUDIT_KIND_STYLE = {
  approve: ['checkCircle', 'success'], resume: ['rotateCcw', 'success'],
  reject: ['x', 'danger'], suspend: ['ban', 'danger'],
  role: ['key', 'accent'], auth: ['logout', 'neutral'], view: ['eye', 'neutral'],
};
function auditTone(kind) { return (AUDIT_KIND_STYLE[kind] || ['dot', 'neutral'])[1]; }
function auditIcon(kind) { return (AUDIT_KIND_STYLE[kind] || ['dot'])[0]; }

function AuditMini({ a, last }) {
  const tone = auditTone(a.kind);
  const cVar = tone === 'neutral' ? 'var(--bl-text-2)' : `var(--bl-${tone === 'accent' ? 'accent-text' : tone})`;
  const bgVar = tone === 'neutral' ? 'var(--bl-surface-2)' : `var(--bl-${tone === 'accent' ? 'accent-weak' : tone + '-bg'})`;
  return (
    <div style={{ display: 'flex', gap: 11, padding: '11px 16px', borderBottom: last ? 'none' : '1px solid var(--bl-border)', alignItems: 'flex-start', background: a.fresh ? 'var(--bl-accent-weak)' : 'transparent' }}>
      <span style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bgVar, color: cVar, marginTop: 1 }}><Icon name={auditIcon(a.kind)} size={13} stroke={2} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: 'var(--bl-text-2)', lineHeight: 1.45 }}>
          <b style={{ color: 'var(--bl-text-1)', fontWeight: 650 }}>{a.actor}</b> · {a.action}
        </div>
        <div style={{ fontSize: 12, color: 'var(--bl-text-3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.target}</div>
      </div>
      <span style={{ fontSize: 11, color: 'var(--bl-text-3)', whiteSpace: 'nowrap', flexShrink: 0 }}>{a.ago}</span>
    </div>
  );
}

function TodayRow({ icon, label, value, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 16px', borderBottom: last ? 'none' : '1px solid var(--bl-border)' }}>
      <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--bl-surface-2)', color: 'var(--bl-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={icon} size={14} /></span>
      <span style={{ flex: 1, fontSize: 13, color: 'var(--bl-text-2)', fontWeight: 500 }}>{label}</span>
      <span className="bl-tnum" style={{ fontSize: 14, fontWeight: 700, color: 'var(--bl-text-1)' }}>{value}</span>
    </div>
  );
}

function DashboardScreen() {
  const app = useApp();
  const total = app.tenants.length;
  const active = app.tenants.filter((t) => t.status === 'ACTIVE').length;
  const ops = app.operators.filter((o) => o.status === 'APPROVED').length;
  const t = app.today;
  const recent = app.audit.slice(0, 6);

  return (
    <AdminShell crumbs={['관제', '대시보드']}>
      <PageHeader title="대시보드"
        sub={<RoleBadge role={app.role} />} />
      <p style={{ margin: '-8px 0 20px', fontSize: 13.5, color: 'var(--bl-text-2)' }}>안녕하세요, {app.me.name}님. blommunity 플랫폼 전체 현황이에요.</p>

      {/* Approval queue — hero */}
      <ApprovalQueue />

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 18 }}>
        <Stat icon="building" label="전체 테넌트" value={total} unit="개" sub={`승인 대기 ${app.tenants.filter((x) => x.status === 'PENDING').length} · 정지 ${app.tenants.filter((x) => x.status === 'SUSPENDED').length}`} />
        <Stat icon="checkCircle" label="활성 테넌트" value={active} unit="개" tone="success" sub={`전체의 ${Math.round(active / total * 100)}%`} />
        <Stat icon="shieldCheck" label="운영자" value={ops} unit="명" sub={`승인 대기 ${app.operators.filter((x) => x.status === 'PENDING').length}명`} />
        <Stat icon="zap" label="당일 활동량" value={(t.posts + t.comments).toLocaleString()} unit="건" tone="accent" sub={`API 호출 ${t.apiCalls}`} />
      </div>

      {/* Recent audit + today breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 14, marginTop: 18 }}>
        <ACard style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid var(--bl-border)' }}>
            <div style={{ flex: 1, fontSize: 13.5, fontWeight: 650, color: 'var(--bl-text-1)' }}>최근 감사 로그</div>
            <Btn variant="ghost" size="sm" iconRight="arrowRight" onClick={() => app.navigate('audit')}>전체 보기</Btn>
          </div>
          {recent.map((a, i) => <AuditMini key={a.id} a={a} last={i === recent.length - 1} />)}
        </ACard>

        <ACard style={{ overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--bl-border)', fontSize: 13.5, fontWeight: 650, color: 'var(--bl-text-1)' }}>오늘의 플랫폼 활동</div>
          <TodayRow icon="penLine" label="새 게시물" value={t.posts.toLocaleString()} />
          <TodayRow icon="boards" label="새 댓글" value={t.comments.toLocaleString()} />
          <TodayRow icon="userPlus" label="신규 가입" value={t.signups.toLocaleString()} />
          <TodayRow icon="activity" label="API 호출" value={t.apiCalls} last />
        </ACard>
      </div>
    </AdminShell>
  );
}

window.DashboardScreen = DashboardScreen;
window.AuditMini = AuditMini;
window.auditTone = auditTone;
window.auditIcon = auditIcon;
