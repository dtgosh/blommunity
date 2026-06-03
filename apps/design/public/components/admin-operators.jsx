// admin-operators.jsx — 운영자 목록 (승인 + 역할 변경)
// Depends on admin-shell + admin-core globals

function RoleDropdown({ op }) {
  const app = useApp();
  const [open, setOpen] = React.useState(false);
  const [coords, setCoords] = React.useState(null);
  const btnRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const canChange = app.can('changeRole');
  const isSelf = op.isMe;
  const locked = !canChange || isSelf;
  const tip = isSelf ? '본인 역할은 변경할 수 없어요' : app.permReason('changeRole');

  const place = () => {
    const r = btnRef.current.getBoundingClientRect();
    const w = 176;
    setCoords({ top: r.bottom + 6, left: Math.min(r.left, window.innerWidth - w - 12) });
  };
  const toggle = (e) => { e.stopPropagation(); if (!open) place(); setOpen((o) => !o); };

  React.useEffect(() => {
    if (!open) return;
    const off = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const close = () => setOpen(false);
    document.addEventListener('pointerdown', off, true);
    window.addEventListener('resize', close);
    const main = document.querySelector('[data-admin-main]');
    main && main.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('pointerdown', off, true);
      window.removeEventListener('resize', close);
      main && main.removeEventListener('scroll', close, true);
    };
  }, [open]);

  const trigger = (
    <button ref={btnRef} onClick={locked ? undefined : toggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid transparent',
        background: 'transparent', borderRadius: 7, padding: locked ? 0 : '3px 5px 3px 4px', cursor: locked ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', transition: 'background .12s, border-color .12s',
      }}
      onMouseEnter={(e) => { if (!locked) { e.currentTarget.style.background = 'var(--bl-surface-2)'; e.currentTarget.style.borderColor = 'var(--bl-border)'; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
      <RoleBadge role={op.role} size="sm" />
      {locked ? <Icon name="lock" size={12} style={{ color: 'var(--bl-text-3)' }} /> : <Icon name="chevronDown" size={13} style={{ color: 'var(--bl-text-3)' }} />}
    </button>
  );

  const menu = open && coords && ReactDOM.createPortal(
    <div className={'bl' + (app.theme === 'dark' ? ' dark' : '')} style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 1000 }}>
      <div ref={menuRef} onClick={(e) => e.stopPropagation()}
        style={{ width: 176, background: 'var(--bl-surface-1)', border: '1px solid var(--bl-border)', borderRadius: 9, boxShadow: 'var(--bl-shadow-pop)', padding: 5 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--bl-text-3)', letterSpacing: '.04em', padding: '5px 8px 6px' }}>역할 변경</div>
        {ADMIN_ROLES.map((r) => (
          <button key={r} onClick={() => { setOpen(false); app.changeOperatorRole(op.id, r); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', border: 'none', background: r === op.role ? 'var(--bl-surface-2)' : 'transparent', borderRadius: 6, padding: '7px 8px', cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bl-surface-2)'} onMouseLeave={(e) => e.currentTarget.style.background = r === op.role ? 'var(--bl-surface-2)' : 'transparent'}>
            <RoleBadge role={r} size="sm" />
            {r === op.role && <Icon name="check" size={14} style={{ color: 'var(--bl-accent-text)', marginLeft: 'auto' }} />}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );

  return (
    <div style={{ display: 'inline-flex' }} onClick={(e) => e.stopPropagation()}>
      {locked ? <Tip text={tip}>{trigger}</Tip> : trigger}
      {menu}
    </div>
  );
}

function AccessDenied() {
  const app = useApp();
  return (
    <AdminShell crumbs={['관제', '운영자 관리']}>
      <div style={{ padding: '70px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 13, background: 'var(--bl-surface-2)', color: 'var(--bl-text-3)', marginBottom: 16 }}><Icon name="shieldAlert" size={26} /></div>
        <h2 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: 'var(--bl-text-1)' }}>접근 권한이 없어요</h2>
        <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'var(--bl-text-2)' }}>운영자 관리는 MANAGER 이상만 볼 수 있어요.<br />현재 역할은 <b style={{ color: 'var(--bl-text-1)' }}>{app.role}</b>입니다. 상단의 데모 역할을 바꿔보세요.</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Btn variant="secondary" icon="dashboard" onClick={() => app.navigate('dashboard')}>대시보드로 가기</Btn></div>
      </div>
    </AdminShell>
  );
}

function OperatorsScreen() {
  const app = useApp();
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('ALL');

  if (!app.can('viewOperators')) return <AccessDenied />;

  const counts = {
    ALL: app.operators.length,
    APPROVED: app.operators.filter((o) => o.status === 'APPROVED').length,
    PENDING: app.operators.filter((o) => o.status === 'PENDING').length,
  };
  const rows = app.operators.filter((o) =>
    (filter === 'ALL' || o.status === filter) && (o.name.includes(q) || o.email.includes(q.toLowerCase()))
  );

  const columns = [
    { label: '운영자', width: '30%', render: (o) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <Avatar name={o.name} idx={o.idx} size={30} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bl-text-1)', display: 'flex', alignItems: 'center', gap: 6 }}>{o.name}{o.isMe && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--bl-text-3)', background: 'var(--bl-surface-2)', border: '1px solid var(--bl-border)', borderRadius: 4, padding: '1px 5px' }}>나</span>}</div>
          <div style={{ fontSize: 11.5, color: 'var(--bl-text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{o.email}</div>
        </div>
      </div>
    ) },
    { label: '역할', width: '18%', render: (o) => o.status === 'PENDING'
      ? <span style={{ fontSize: 12, color: 'var(--bl-text-3)' }}>MEMBER <span style={{ opacity: .7 }}>(요청)</span></span>
      : <RoleDropdown op={o} /> },
    { label: '상태', width: '13%', render: (o) => <OStatus status={o.status} size="sm" /> },
    { label: '가입일', width: '13%', render: (o) => <span className="bl-tnum" style={{ fontSize: 12, color: 'var(--bl-text-2)' }}>{o.joinedAt}</span> },
    { label: '최근 활동', width: '11%', render: (o) => <span style={{ fontSize: 12, color: 'var(--bl-text-3)' }}>{o.lastActive}</span> },
    { label: '', width: '15%', align: 'right', render: (o) => o.status === 'PENDING'
      ? <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
          <SoftBtn tone="success" icon="check" disabled={!app.can('approveOperator')} tip={app.permReason('approveOperator')} onClick={() => app.approveOperator(o.id)}>승인</SoftBtn>
          <SoftBtn tone="danger" icon="x" disabled={!app.can('rejectOperator')} tip={app.permReason('rejectOperator')} onClick={() => app.rejectOperator(o.id)} />
        </div>
      : <span style={{ fontSize: 12, color: 'var(--bl-text-3)' }}>—</span> },
  ];

  return (
    <AdminShell crumbs={['관제', '운영자 관리']}>
      <PageHeader title="운영자 관리"
        sub={`내부 운영자 ${counts.APPROVED}명${counts.PENDING ? ` · 승인 대기 ${counts.PENDING}명` : ''}`}
        actions={<Btn variant="primary" icon="userPlus" onClick={() => app.showToast('운영자 초대 링크를 복사했어요', { sub: '받은 사람은 가입 후 승인 대기 상태가 됩니다', logged: false })}>운영자 초대</Btn>} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <Segmented value={filter} onChange={setFilter} options={[
          { value: 'ALL', label: '전체', count: counts.ALL },
          { value: 'APPROVED', label: '승인됨', count: counts.APPROVED },
          { value: 'PENDING', label: '승인 대기', count: counts.PENDING },
        ]} />
        <div style={{ flex: 1 }} />
        <SearchInput value={q} onChange={setQ} placeholder="이름·이메일 검색" width={220} />
      </div>
      <DataTable columns={columns} rows={rows} empty="해당하는 운영자가 없어요" />
      {!app.can('changeRole') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 12, color: 'var(--bl-text-3)' }}>
          <Icon name="key" size={13} />역할 변경은 OWNER만 할 수 있어요. 현재 역할({app.role})로는 승인까지 가능합니다.
        </div>
      )}
    </AdminShell>
  );
}

window.OperatorsScreen = OperatorsScreen;
