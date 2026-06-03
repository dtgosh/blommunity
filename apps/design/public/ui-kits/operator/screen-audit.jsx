// admin-audit.jsx — 감사 로그 (필터·검색)
// Depends on admin-shell + admin-core + dashboard (auditTone/auditIcon) globals

const AUDIT_FILTERS = [
  { value: 'ALL', label: '전체', kinds: null },
  { value: 'approve', label: '승인·해제', kinds: ['approve', 'resume'] },
  { value: 'deny', label: '정지·거절', kinds: ['suspend', 'reject'] },
  { value: 'role', label: '역할', kinds: ['role'] },
  { value: 'access', label: '접속·조회', kinds: ['auth', 'view'] },
];

function ActionTag({ a }) {
  const tone = auditTone(a.kind);
  const c = tone === 'neutral' ? 'var(--bl-text-2)' : `var(--bl-${tone === 'accent' ? 'accent-text' : tone})`;
  const bg = tone === 'neutral' ? 'var(--bl-surface-2)' : `var(--bl-${tone === 'accent' ? 'accent-weak' : tone + '-bg'})`;
  const bd = tone === 'neutral' ? 'var(--bl-border)' : `var(--bl-${tone === 'accent' ? 'accent-weak' : tone + '-bd'})`;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: c, background: bg, border: `1px solid ${bd}`, borderRadius: 6, padding: '4px 8px', whiteSpace: 'nowrap' }}>
      <Icon name={auditIcon(a.kind)} size={13} stroke={2} />{a.action}
    </span>
  );
}

function AuditScreen() {
  const app = useApp();
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('ALL');

  const fdef = AUDIT_FILTERS.find((f) => f.value === filter);
  const rows = app.audit.filter((a) =>
    (!fdef.kinds || fdef.kinds.includes(a.kind)) &&
    (a.actor.includes(q) || (a.target || '').includes(q) || a.action.includes(q))
  );

  const columns = [
    { label: '행위자', width: '20%', render: (a) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={a.actor} idx={a.actorIdx} size={26} /><span style={{ fontSize: 13, fontWeight: 600 }}>{a.actor}</span></span> },
    { label: '액션', width: '20%', render: (a) => <ActionTag a={a} /> },
    { label: '대상', width: '34%', render: (a) => <span style={{ fontSize: 13, color: 'var(--bl-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{a.target || '—'}</span> },
    { label: '시각', width: '26%', render: (a) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span className="bl-tnum" style={{ fontSize: 12.5, color: 'var(--bl-text-2)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{a.time}</span>
        <span style={{ fontSize: 11, color: 'var(--bl-text-3)' }}>· {a.ago}</span>
        {a.fresh && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--bl-accent-text)', background: 'var(--bl-accent-weak)', borderRadius: 4, padding: '1px 5px' }}>NEW</span>}
      </span>
    ) },
  ];

  return (
    <AdminShell crumbs={['관제', '감사 로그']}>
      <PageHeader title="감사 로그"
        sub="모든 운영자 활동이 변경 불가능하게 기록됩니다"
        actions={<Btn variant="secondary" icon="refresh" onClick={() => app.showToast('최신 로그를 불러왔어요', { logged: false })}>새로고침</Btn>} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <Segmented value={filter} onChange={setFilter} options={AUDIT_FILTERS.map((f) => ({ value: f.value, label: f.label }))} />
        <div style={{ flex: 1 }} />
        <span className="bl-tnum" style={{ fontSize: 12, color: 'var(--bl-text-3)' }}>{rows.length}건</span>
        <SearchInput value={q} onChange={setQ} placeholder="행위자·대상·액션 검색" width={240} />
      </div>
      <DataTable columns={columns} rows={rows} empty="해당하는 기록이 없어요" />
    </AdminShell>
  );
}

window.AuditScreen = AuditScreen;
