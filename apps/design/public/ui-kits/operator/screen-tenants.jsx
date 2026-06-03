// admin-tenants.jsx — 테넌트 목록 + 상세
// Depends on admin-shell + admin-core globals

function StorageBar({ used, quota, width = 64 }) {
  const pct = quota ? Math.min(100, Math.round((used / quota) * 100)) : 0;
  const tone = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'accent';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width, height: 5, borderRadius: 3, background: 'var(--bl-surface-2)', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width: pct + '%', height: '100%', borderRadius: 3, background: `var(--bl-${tone === 'accent' ? 'accent' : tone})` }} />
      </div>
      <span className="bl-tnum" style={{ fontSize: 12, color: 'var(--bl-text-2)', whiteSpace: 'nowrap' }}>{used}/{quota}GB</span>
    </div>
  );
}

function TenantCell({ t }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      <span style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bl-surface-2)', color: 'var(--bl-text-2)' }}><Icon name="building" size={15} /></span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bl-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
        <div style={{ fontSize: 11.5, color: 'var(--bl-text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{t.domain}.blommunity.io</div>
      </div>
    </div>
  );
}

function TenantsScreen() {
  const app = useApp();
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('ALL');

  const counts = {
    ALL: app.tenants.length,
    ACTIVE: app.tenants.filter((t) => t.status === 'ACTIVE').length,
    PENDING: app.tenants.filter((t) => t.status === 'PENDING').length,
    SUSPENDED: app.tenants.filter((t) => t.status === 'SUSPENDED').length,
  };
  const rows = app.tenants.filter((t) =>
    (filter === 'ALL' || t.status === filter) &&
    (t.name.includes(q) || t.domain.includes(q.toLowerCase()) || t.owner.includes(q))
  );

  const columns = [
    { label: '테넌트', width: '26%', render: (t) => <TenantCell t={t} /> },
    { label: '담당자', width: '13%', render: (t) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Avatar name={t.owner} idx={t.idx} size={22} /><span style={{ fontSize: 12.5 }}>{t.owner}</span></span> },
    { label: '상태', width: '11%', render: (t) => <TStatus status={t.status} size="sm" /> },
    { label: '멤버', width: '8%', align: 'right', render: (t) => <span className="bl-tnum" style={{ fontSize: 12.5 }}>{t.members.toLocaleString()}</span> },
    { label: '게시물', width: '9%', align: 'right', render: (t) => <span className="bl-tnum" style={{ fontSize: 12.5, color: 'var(--bl-text-2)' }}>{t.posts.toLocaleString()}</span> },
    { label: '스토리지', width: '15%', render: (t) => <StorageBar used={t.storageUsed} quota={t.storageQuota} /> },
    { label: '최근 활동', width: '9%', render: (t) => <span style={{ fontSize: 12, color: 'var(--bl-text-3)', whiteSpace: 'nowrap' }}>{t.lastActive}</span> },
    {
      label: '', width: '9%', align: 'right', render: (t) => t.status === 'PENDING'
        ? <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
            <SoftBtn tone="success" icon="check" disabled={!app.can('approveTenant')} tip={app.permReason('approveTenant')} onClick={() => app.approveTenant(t.id)}>승인</SoftBtn>
            <SoftBtn tone="danger" icon="x" disabled={!app.can('rejectTenant')} tip={app.permReason('rejectTenant')} onClick={() => app.rejectTenant(t.id)} />
          </div>
        : <Icon name="chevronRight" size={16} style={{ color: 'var(--bl-text-3)', marginLeft: 'auto' }} />
    },
  ];

  return (
    <AdminShell crumbs={['관제', '테넌트 관리']}>
      <PageHeader title="테넌트 관리" sub={`커뮤니티를 운영하는 사업자 고객 ${app.tenants.length}곳`} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <Segmented value={filter} onChange={setFilter} options={[
          { value: 'ALL', label: '전체', count: counts.ALL },
          { value: 'ACTIVE', label: '활성', count: counts.ACTIVE },
          { value: 'PENDING', label: '대기', count: counts.PENDING },
          { value: 'SUSPENDED', label: '정지', count: counts.SUSPENDED },
        ]} />
        <div style={{ flex: 1 }} />
        <SearchInput value={q} onChange={setQ} placeholder="테넌트·도메인·담당자 검색" width={260} />
      </div>
      <DataTable columns={columns} rows={rows} onRowClick={(t) => app.navigate('tenant', { tenantId: t.id })} empty={app.tenants.length === 0 ? '아직 등록된 테넌트가 없어요' : '검색 결과와 일치하는 테넌트가 없어요'} />
    </AdminShell>
  );
}

// ── Detail ──────────────────────────────────────────────────────
function MiniStat({ icon, label, value }) {
  return (
    <ACard style={{ padding: '13px 15px', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9, fontSize: 12, color: 'var(--bl-text-3)', fontWeight: 550 }}><Icon name={icon} size={14} />{label}</div>
      <div className="bl-tnum" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--bl-text-1)' }}>{value}</div>
    </ACard>
  );
}

function TenantDetailScreen() {
  const app = useApp();
  const t = app.tenants.find((x) => x.id === app.route.tenantId);
  if (!t) {
    return <AdminShell crumbs={['관제', '테넌트 관리']}>
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--bl-text-3)' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--bl-text-1)', marginBottom: 6 }}>테넌트를 찾을 수 없어요</div>
        <Btn variant="secondary" size="sm" icon="chevronLeft" onClick={() => app.navigate('tenants')} style={{ margin: '0 auto' }}>목록으로</Btn>
      </div>
    </AdminShell>;
  }
  const tenantAudit = app.audit.filter((a) => a.target && a.target.includes(t.name)).slice(0, 5);
  const pct = t.storageQuota ? Math.round((t.storageUsed / t.storageQuota) * 100) : 0;
  const stPct = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'accent';

  return (
    <AdminShell crumbs={['관제', '테넌트 관리', t.name]}>
      <PageHeader back={{ screen: 'tenants', label: '테넌트 관리' }}
        title={t.name}
        sub={<TStatus status={t.status} />}
        actions={
          <>
            {t.status === 'PENDING' && <>
              <SoftBtn tone="danger" size="md" icon="x" disabled={!app.can('rejectTenant')} tip={app.permReason('rejectTenant')} onClick={() => app.rejectTenant(t.id)}>거절</SoftBtn>
              <SoftBtn tone="success" size="md" icon="check" disabled={!app.can('approveTenant')} tip={app.permReason('approveTenant')} onClick={() => app.approveTenant(t.id)}>가입 승인</SoftBtn>
            </>}
            {t.status === 'ACTIVE' && <SoftBtn tone="danger" size="md" icon="ban" disabled={!app.can('suspendTenant')} tip={app.permReason('suspendTenant')} onClick={() => app.suspendTenant(t.id)}>정지</SoftBtn>}
            {t.status === 'SUSPENDED' && <SoftBtn tone="success" size="md" icon="rotateCcw" disabled={!app.can('resumeTenant')} tip={app.permReason('resumeTenant')} onClick={() => app.resumeTenant(t.id)}>정지 해제</SoftBtn>}
          </>
        } />

      {t.status === 'SUSPENDED' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', marginBottom: 16, borderRadius: 9, background: 'var(--bl-danger-bg)', border: '1px solid var(--bl-danger-bd)' }}>
          <Icon name="alertTriangle" size={17} style={{ color: 'var(--bl-danger)', flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: 'var(--bl-danger)', fontWeight: 550 }}>이 테넌트는 정지 상태입니다. {t.note ? `사유: ${t.note}` : ''} 멤버는 현재 접속할 수 없어요.</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 16, alignItems: 'start' }}>
        {/* 기본 정보 */}
        <ACard style={{ padding: '6px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--bl-text-3)', letterSpacing: '.04em', padding: '14px 0 6px' }}>기본 정보</div>
          <KV label="도메인" mono>{t.domain}.blommunity.io</KV>
          <KV label="담당자"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Avatar name={t.owner} idx={t.idx} size={20} />{t.owner} · {t.ownerEmail}</span></KV>
          <KV label="플랜">{t.plan}</KV>
          <KV label="생성일" mono>{t.createdAt}</KV>
          <div style={{ display: 'flex', gap: 12, padding: '10px 0' }}>
            <span style={{ width: 96, flexShrink: 0, fontSize: 12.5, color: 'var(--bl-text-3)', fontWeight: 500 }}>최근 활동</span>
            <span style={{ fontSize: 13, color: 'var(--bl-text-1)', fontWeight: 500 }}>{t.lastActive}</span>
          </div>
        </ACard>

        {/* 현황 + 스토리지 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <MiniStat icon="layers2" label="공간" value={t.spaces} />
            <MiniStat icon="boards" label="게시판" value={t.boards} />
            <MiniStat icon="penLine" label="게시물" value={t.posts.toLocaleString()} />
            <MiniStat icon="members" label="멤버" value={t.members.toLocaleString()} />
          </div>
          <ACard style={{ padding: '15px 17px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 650, color: 'var(--bl-text-1)' }}><Icon name="hardDrive" size={15} style={{ color: 'var(--bl-text-2)' }} />스토리지 사용량</div>
              <span className="bl-tnum" style={{ fontSize: 12.5, color: 'var(--bl-text-2)', fontWeight: 600 }}>{t.storageUsed} / {t.storageQuota} GB</span>
            </div>
            <div style={{ height: 8, borderRadius: 5, background: 'var(--bl-surface-2)', overflow: 'hidden' }}>
              <div style={{ width: pct + '%', height: '100%', borderRadius: 5, background: `var(--bl-${stPct === 'accent' ? 'accent' : stPct})` }} />
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--bl-text-3)', marginTop: 8 }}>{pct}% 사용 중 · {(t.storageQuota - t.storageUsed).toFixed(1)}GB 남음</div>
          </ACard>
        </div>
      </div>

      {/* 이 테넌트 활동 로그 */}
      <ACard style={{ marginTop: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid var(--bl-border)' }}>
          <div style={{ flex: 1, fontSize: 13.5, fontWeight: 650, color: 'var(--bl-text-1)' }}>이 테넌트 관련 감사 로그</div>
          <Btn variant="ghost" size="sm" iconRight="arrowRight" onClick={() => app.navigate('audit')}>전체 로그</Btn>
        </div>
        {tenantAudit.length === 0
          ? <div style={{ padding: '26px 16px', textAlign: 'center', fontSize: 12.5, color: 'var(--bl-text-3)' }}>아직 기록된 활동이 없어요</div>
          : tenantAudit.map((a, i) => <AuditMini key={a.id} a={a} last={i === tenantAudit.length - 1} />)}
      </ACard>
    </AdminShell>
  );
}

window.TenantsScreen = TenantsScreen;
window.TenantDetailScreen = TenantDetailScreen;
