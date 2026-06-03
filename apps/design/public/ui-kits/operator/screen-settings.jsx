// admin-settings.jsx — 설정·프로필 (내 계정, 역할, 권한)
// Depends on admin-shell + admin-core globals

const PERM_LIST = [
  { action: 'approveTenant', label: '테넌트 가입 승인·거절' },
  { action: 'suspendTenant', label: '테넌트 정지·해제' },
  { action: 'viewOperators', label: '운영자 관리 접근' },
  { action: 'approveOperator', label: '운영자 가입 승인·거절' },
  { action: 'changeRole', label: '운영자 역할 변경' },
];

function PermRow({ label, allowed, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0', borderBottom: last ? 'none' : '1px solid var(--bl-border)' }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: allowed ? 'var(--bl-success-bg)' : 'var(--bl-surface-2)', color: allowed ? 'var(--bl-success)' : 'var(--bl-text-3)' }}>
        <Icon name={allowed ? 'check' : 'lock'} size={13} stroke={2.2} />
      </span>
      <span style={{ flex: 1, fontSize: 13, color: allowed ? 'var(--bl-text-1)' : 'var(--bl-text-3)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: allowed ? 'var(--bl-success)' : 'var(--bl-text-3)' }}>{allowed ? '가능' : '권한 없음'}</span>
    </div>
  );
}

function SettingsScreen() {
  const app = useApp();
  return (
    <AdminShell crumbs={['관제', '설정·프로필']}>
      <PageHeader title="설정·프로필" sub="내 계정 정보와 현재 역할로 할 수 있는 일을 확인하세요" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* 프로필 */}
        <ACard style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 18px' }}>
            <Avatar name={app.me.name} idx={app.me.idx} size={52} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--bl-text-1)' }}>{app.me.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--bl-text-3)', marginTop: 2, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{app.me.email}</div>
              <div style={{ marginTop: 8 }}><RoleBadge role={app.role} /></div>
            </div>
          </div>
          <div style={{ padding: '2px 18px 14px' }}>
            <KV label="역할">{app.role}</KV>
            <KV label="가입일" mono>2022-09-01</KV>
            <div style={{ display: 'flex', gap: 12, padding: '10px 0' }}>
              <span style={{ width: 96, flexShrink: 0, fontSize: 12.5, color: 'var(--bl-text-3)', fontWeight: 500 }}>최근 접속</span>
              <span style={{ fontSize: 13, color: 'var(--bl-text-1)', fontWeight: 500 }}>방금 · 이 세션</span>
            </div>
          </div>
        </ACard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 내 권한 */}
          <ACard style={{ padding: '6px 18px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 0 8px', fontSize: 12, fontWeight: 700, color: 'var(--bl-text-3)', letterSpacing: '.04em' }}><Icon name="key" size={14} />내 권한 ({app.role})</div>
            {PERM_LIST.map((p, i) => <PermRow key={p.action} label={p.label} allowed={app.can(p.action)} last={i === PERM_LIST.length - 1} />)}
          </ACard>

          {/* 환경설정 */}
          <ACard style={{ padding: '6px 18px 14px' }}>
            <div style={{ padding: '14px 0 8px', fontSize: 12, fontWeight: 700, color: 'var(--bl-text-3)', letterSpacing: '.04em' }}>환경설정</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bl-text-1)' }}>테마</div>
                <div style={{ fontSize: 12, color: 'var(--bl-text-3)', marginTop: 2 }}>라이트 / 다크 모드</div>
              </div>
              <Segmented size="sm" value={app.theme} onChange={(v) => { if (v !== app.theme) app.toggleTheme(); }}
                options={[{ value: 'light', label: '라이트' }, { value: 'dark', label: '다크' }]} />
            </div>
            <div style={{ height: 1, background: 'var(--bl-border)', margin: '8px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bl-text-1)' }}>로그아웃</div>
                <div style={{ fontSize: 12, color: 'var(--bl-text-3)', marginTop: 2 }}>이 세션을 종료하고 로그인 화면으로</div>
              </div>
              <Btn variant="secondary" size="sm" icon="logout" onClick={app.logout}>로그아웃</Btn>
            </div>
          </ACard>
        </div>
      </div>
    </AdminShell>
  );
}

window.SettingsScreen = SettingsScreen;
