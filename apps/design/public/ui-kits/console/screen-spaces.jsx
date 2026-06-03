// screen-spaces.jsx — Blommunity 공간 관리 (master/detail, interactive)
// Depends on console-system.jsx globals: Icon, Badge, Btn, Avatar, AvatarGroup, Shell

// ── Data ────────────────────────────────────────────────────────
const BL_SPACES = [
  {
    id: 'bookclub', name: '북클럽', visibility: 'PUBLIC',
    desc: '매달 한 권을 함께 읽는 독서 모임의 온라인 공간입니다.',
    created: '2024년 3월 12일', owner: '지은', boardCount: 5, memberCount: 237,
    boards: [
      { name: '자유게시판', posts: 1204, members: 237, vis: 'PUBLIC' },
      { name: '이달의 책', posts: 386, members: 198, vis: 'PUBLIC' },
      { name: '운영진 회의실', posts: 142, members: 12, vis: 'PRIVATE' },
      { name: '추천 도서', posts: 98, members: 156, vis: 'PUBLIC' },
      { name: '독서 후기', posts: 73, members: 121, vis: 'PUBLIC' },
    ],
    members: [
      { name: '지은', role: 'OWNER', idx: 0, since: '2024.03.12' },
      { name: '지수', role: 'MANAGER', idx: 3, since: '2024.04.01' },
      { name: '민수', role: 'MEMBER', idx: 1, since: '2024.05.18' },
      { name: '유진', role: 'MEMBER', idx: 2, since: '오늘' },
      { name: '현우', role: 'MEMBER', idx: 4, since: '2024.06.02' },
      { name: '서연', role: 'MEMBER', idx: 5, since: '오늘' },
    ],
  },
  {
    id: 'staff', name: '운영진 라운지', visibility: 'PRIVATE',
    desc: '운영진끼리만 쓰는 비공개 작업 공간이에요. 외부에는 노출되지 않습니다.',
    created: '2024년 5월 2일', owner: '지은', boardCount: 2, memberCount: 4,
    boards: [
      { name: '운영진 회의실', posts: 142, members: 4, vis: 'PRIVATE' },
      { name: '공지 초안', posts: 24, members: 4, vis: 'PRIVATE' },
    ],
    members: [
      { name: '지은', role: 'OWNER', idx: 0, since: '2024.05.02' },
      { name: '지수', role: 'MANAGER', idx: 3, since: '2024.05.02' },
      { name: '현우', role: 'MEMBER', idx: 4, since: '2024.05.10' },
      { name: '민수', role: 'MEMBER', idx: 1, since: '2024.05.10' },
    ],
  },
];

const BL_TABS = [
  { key: 'overview', label: '개요' },
  { key: 'boards', label: '게시판' },
  { key: 'members', label: '멤버' },
  { key: 'invite', label: '초대' },
  { key: 'settings', label: '설정' },
];

function SCard({ children, style }) {
  return <div style={{ background: 'var(--bl-surface-1)', border: '1px solid var(--bl-border)', borderRadius: 10, ...style }}>{children}</div>;
}

function VisBadge({ v, size }) {
  return v === 'PUBLIC'
    ? <Badge tone="success" icon="globe" size={size}>PUBLIC</Badge>
    : <Badge tone="neutral" icon="lock" size={size}>PRIVATE</Badge>;
}

// ── Left: space list item ───────────────────────────────────────
function SpaceListItem({ s, selected, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
        border: `1px solid ${selected ? 'var(--bl-accent)' : 'var(--bl-border)'}`,
        background: selected ? 'var(--bl-accent-weak)' : hover ? 'var(--bl-surface-2)' : 'var(--bl-surface-1)',
        borderRadius: 9, padding: '13px 14px', transition: 'background .12s, border-color .12s',
        boxShadow: selected ? '0 0 0 1px var(--bl-accent)' : 'none',
      }}>
      {selected && <span style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 3, borderRadius: 3, background: 'var(--bl-accent)' }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <span style={{
          width: 30, height: 30, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: s.visibility === 'PRIVATE' ? 'var(--bl-surface-2)' : 'var(--bl-accent)',
          color: s.visibility === 'PRIVATE' ? 'var(--bl-text-2)' : '#fff',
        }}>{s.visibility === 'PRIVATE' ? <Icon name="lock" size={15} /> : <span style={{ fontSize: 14, fontWeight: 700 }}>{s.name.charAt(0)}</span>}</span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 650, color: 'var(--bl-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
        <VisBadge v={s.visibility} size="sm" />
      </div>
      <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--bl-text-3)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}><Icon name="boards" size={13} />게시판 {s.boardCount}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}><Icon name="members" size={13} />멤버 {s.memberCount}</span>
      </div>
    </button>
  );
}

// ── Right: tabs ─────────────────────────────────────────────────
function Tabs({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--bl-border)', padding: '0 22px' }}>
      {BL_TABS.map((t) => {
        const on = active === t.key;
        return (
          <button key={t.key} onClick={() => onChange(t.key)}
            style={{
              position: 'relative', border: 'none', background: 'transparent', cursor: 'pointer',
              padding: '12px 8px 13px', fontSize: 13.5, fontWeight: on ? 650 : 550,
              color: on ? 'var(--bl-text-1)' : 'var(--bl-text-3)', transition: 'color .12s',
            }}>
            {t.label}
            <span style={{ position: 'absolute', left: 4, right: 4, bottom: -1, height: 2, borderRadius: 2, background: on ? 'var(--bl-accent)' : 'transparent' }} />
          </button>
        );
      })}
    </div>
  );
}

// ── Overview tab ────────────────────────────────────────────────
function MetaRow({ label, children }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--bl-border)' }}>
      <span style={{ width: 84, flexShrink: 0, fontSize: 12.5, color: 'var(--bl-text-3)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--bl-text-1)', fontWeight: 500 }}>{children}</span>
    </div>
  );
}

function BoardPreview({ b }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        border: '1px solid var(--bl-border)', borderRadius: 9, padding: '13px 14px', cursor: 'pointer',
        background: hover ? 'var(--bl-surface-2)' : 'var(--bl-surface-1)', transition: 'background .12s, border-color .12s',
        borderColor: hover ? 'var(--bl-border-strong)' : 'var(--bl-border)',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <span style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--bl-surface-2)', color: 'var(--bl-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="boards" size={14} /></span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, color: 'var(--bl-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</span>
        {b.vis === 'PRIVATE' && <Icon name="lock" size={13} style={{ color: 'var(--bl-text-3)' }} />}
      </div>
      <div className="bl-tnum" style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--bl-text-3)' }}>
        <span>글 {b.posts.toLocaleString()}</span>
        <span>멤버 {b.members}</span>
      </div>
    </div>
  );
}

function OverviewTab({ s, app }) {
  return (
    <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* description + meta two-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22, alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--bl-text-3)', marginBottom: 8, letterSpacing: '.02em' }}>설명</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--bl-text-1)', maxWidth: 520 }}>{s.desc}</p>
        </div>
        <SCard style={{ padding: '4px 16px' }}>
          <MetaRow label="생성일">{s.created}</MetaRow>
          <MetaRow label="소유자"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Avatar name={s.owner} idx={0} size={20} />{s.owner}</span></MetaRow>
          <div style={{ display: 'flex', gap: 12, padding: '11px 0' }}>
            <span style={{ width: 84, flexShrink: 0, fontSize: 12.5, color: 'var(--bl-text-3)', fontWeight: 500 }}>공개 범위</span>
            <VisBadge v={s.visibility} />
          </div>
        </SCard>
      </div>

      {/* boards preview */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ flex: 1, fontSize: 13.5, fontWeight: 650, color: 'var(--bl-text-1)' }}>게시판 <span className="bl-tnum" style={{ color: 'var(--bl-text-3)', fontWeight: 600 }}>{s.boardCount}</span></div>
          <Btn variant="ghost" size="sm" icon="plus" onClick={() => app && app.openModal('createBoard', { space: s })}>게시판 추가</Btn>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {s.boards.map((b, i) => <BoardPreview key={i} b={b} />)}
        </div>
      </div>

      {/* members preview */}
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--bl-text-1)', marginBottom: 12 }}>멤버 <span className="bl-tnum" style={{ color: 'var(--bl-text-3)', fontWeight: 600 }}>{s.memberCount}</span></div>
        <SCard style={{ padding: '15px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <AvatarGroup people={s.members} size={34} max={6} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bl-text-1)' }}>{s.members[0].name}, {s.members[1].name} 외 {s.memberCount - 2}명</div>
            <div style={{ fontSize: 12, color: 'var(--bl-text-3)', marginTop: 2 }}>OWNER 1 · MANAGER {s.members.filter((m) => m.role === 'MANAGER').length} · MEMBER {s.memberCount - 1 - s.members.filter((m) => m.role === 'MANAGER').length}</div>
          </div>
          <Btn variant="secondary" size="sm" iconRight="arrowRight" onClick={() => app && app.showToast(`${s.memberCount}명의 멤버를 불러왔어요`)}>{s.memberCount}명 모두 보기</Btn>
        </SCard>
      </div>
    </div>
  );
}

// ── Boards tab ──────────────────────────────────────────────────
function BoardsTab({ s, app }) {
  return (
    <div style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ flex: 1, fontSize: 13.5, color: 'var(--bl-text-2)' }}>이 공간의 게시판 <b style={{ color: 'var(--bl-text-1)' }}>{s.boardCount}개</b></div>
        <Btn variant="primary" size="sm" icon="plus" onClick={() => app && app.openModal('createBoard', { space: s })}>새 게시판</Btn>
      </div>
      <SCard>
        {s.boards.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i === s.boards.length - 1 ? 'none' : '1px solid var(--bl-border)' }}>
            <span style={{ width: 32, height: 32, borderRadius: 7, background: 'var(--bl-surface-2)', color: 'var(--bl-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="boards" size={16} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--bl-text-1)' }}>{b.name}</span>
                <VisBadge v={b.vis} size="sm" />
              </div>
              <div className="bl-tnum" style={{ fontSize: 12, color: 'var(--bl-text-3)', marginTop: 3 }}>글 {b.posts.toLocaleString()} · 멤버 {b.members}</div>
            </div>
            <Btn variant="ghost" size="sm" icon="settings">관리</Btn>
            <button title="더보기" style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--bl-text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="more" size={16} /></button>
          </div>
        ))}
      </SCard>
    </div>
  );
}

// ── Members tab ─────────────────────────────────────────────────
function RoleBadge({ role }) {
  if (role === 'OWNER') return <Badge tone="accent" size="sm">OWNER</Badge>;
  if (role === 'MANAGER') return <Badge tone="warning" size="sm">MANAGER</Badge>;
  return <Badge tone="neutral" size="sm">MEMBER</Badge>;
}
function MembersTab({ s, app }) {
  return (
    <div style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ flex: 1, fontSize: 13.5, color: 'var(--bl-text-2)' }}>전체 <b style={{ color: 'var(--bl-text-1)' }}>{s.memberCount}명</b> 중 최근 {s.members.length}명</div>
        <Btn variant="primary" size="sm" icon="userPlus" onClick={() => app && app.openModal('inviteMember', { space: s })}>멤버 초대</Btn>
      </div>
      <SCard>
        {s.members.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i === s.members.length - 1 ? 'none' : '1px solid var(--bl-border)' }}>
            <Avatar name={m.name} idx={m.idx} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--bl-text-1)' }}>{m.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--bl-text-3)', marginTop: 2 }}>가입 {m.since}</div>
            </div>
            <RoleBadge role={m.role} />
            <button title="더보기" style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--bl-text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="more" size={16} /></button>
          </div>
        ))}
        {s.memberCount > s.members.length && (
          <div style={{ padding: '13px 16px', textAlign: 'center' }}>
            <Btn variant="ghost" size="sm" iconRight="chevronDown">나머지 {s.memberCount - s.members.length}명 더 보기</Btn>
          </div>
        )}
      </SCard>
    </div>
  );
}

// ── Invite tab ──────────────────────────────────────────────────
function InviteTab({ s, app }) {
  return (
    <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 620 }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--bl-text-1)', marginBottom: 4 }}>초대 링크</div>
        <div style={{ fontSize: 12.5, color: 'var(--bl-text-3)', marginBottom: 11 }}>이 링크를 받은 사람은 ‘{s.name}’ 공간에 가입할 수 있어요.</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: 38, padding: '0 12px', border: '1px solid var(--bl-border-strong)', borderRadius: 6, background: 'var(--bl-surface-1)', fontSize: 13, color: 'var(--bl-text-2)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>blommunity.io/join/{s.id}-x9f2k</div>
          <Btn variant="secondary" icon="bookmark" onClick={() => app && app.showToast('초대 링크를 복사했어요')}>복사</Btn>
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--bl-border)' }} />
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--bl-text-1)', marginBottom: 4 }}>이메일로 초대</div>
        <div style={{ fontSize: 12.5, color: 'var(--bl-text-3)', marginBottom: 11 }}>가입 시 부여할 역할을 함께 정할 수 있어요.</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="이름 또는 이메일 입력" style={{
            flex: 1, height: 38, padding: '0 12px', border: '1px solid var(--bl-border-strong)', borderRadius: 6,
            background: 'var(--bl-surface-1)', color: 'var(--bl-text-1)', fontSize: 13, fontFamily: 'inherit', outline: 'none',
          }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 38, padding: '0 12px', border: '1px solid var(--bl-border-strong)', borderRadius: 6, fontSize: 13, fontWeight: 600, color: 'var(--bl-text-2)', cursor: 'pointer', whiteSpace: 'nowrap' }}>MEMBER <Icon name="chevronDown" size={14} /></div>
          <Btn variant="primary" icon="userPlus" onClick={() => app && app.showToast('초대를 보냈어요')}>초대</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Settings tab ────────────────────────────────────────────────
function SetRow({ title, desc, control, danger }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--bl-border)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: danger ? 'var(--bl-danger)' : 'var(--bl-text-1)' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--bl-text-3)', marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
      </div>
      {control}
    </div>
  );
}
function SettingsTab({ s }) {
  return (
    <div style={{ padding: 22, maxWidth: 640 }}>
      <SetRow title="공간 이름" desc="멤버에게 보이는 공간의 이름이에요." control={<Btn variant="secondary" size="sm" icon="edit">{s.name}</Btn>} />
      <SetRow title="공개 범위" desc={s.visibility === 'PUBLIC' ? '누구나 검색하고 가입을 신청할 수 있어요.' : '초대받은 사람만 들어올 수 있어요.'} control={<VisBadge v={s.visibility} />} />
      <SetRow title="가입 승인" desc="새 가입 요청을 운영진이 직접 승인해요." control={<span style={{ width: 40, height: 23, borderRadius: 12, background: 'var(--bl-accent)', position: 'relative', display: 'inline-block' }}><span style={{ position: 'absolute', top: 2, right: 2, width: 19, height: 19, borderRadius: '50%', background: '#fff' }} /></span>} />
      <div style={{ marginTop: 18, border: '1px solid var(--bl-danger-bd)', borderRadius: 10, padding: '4px 18px', background: 'var(--bl-danger-bg)' }}>
        <SetRow danger title="공간 삭제" desc="공간과 그 안의 모든 게시판·글·댓글이 영구히 삭제돼요. 되돌릴 수 없어요." control={<Btn variant="danger" size="sm" icon="trash">삭제</Btn>} />
      </div>
    </div>
  );
}

// ── Detail panel ────────────────────────────────────────────────
function DetailPanel({ s, tab, onTab, app }) {
  return (
    <SCard style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ padding: '18px 22px 16px', borderBottom: '1px solid var(--bl-border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <span style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: s.visibility === 'PRIVATE' ? 'var(--bl-surface-2)' : 'var(--bl-accent)',
            color: s.visibility === 'PRIVATE' ? 'var(--bl-text-2)' : '#fff',
          }}>{s.visibility === 'PRIVATE' ? <Icon name="lock" size={20} /> : <span style={{ fontSize: 20, fontWeight: 700 }}>{s.name.charAt(0)}</span>}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--bl-text-1)' }}>{s.name}</h2>
              <VisBadge v={s.visibility} />
            </div>
            <div className="bl-tnum" style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 12.5, color: 'var(--bl-text-3)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="boards" size={13} />게시판 {s.boardCount}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="members" size={13} />멤버 {s.memberCount}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="calendar" size={13} />{s.created}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Btn variant="secondary" size="sm" icon="edit">수정</Btn>
            <Btn variant="danger" size="sm" icon="trash">삭제</Btn>
          </div>
        </div>
      </div>
      {/* tabs */}
      <Tabs active={tab} onChange={onTab} />
      {/* content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'overview' && <OverviewTab s={s} app={app} />}
        {tab === 'boards' && <BoardsTab s={s} app={app} />}
        {tab === 'members' && <MembersTab s={s} app={app} />}
        {tab === 'invite' && <InviteTab s={s} app={app} />}
        {tab === 'settings' && <SettingsTab s={s} />}
      </div>
    </SCard>
  );
}

// ── Screen ──────────────────────────────────────────────────────
function SpaceMgmt({ onNav, active = 'spaces', dark, app }) {
  const nav = app ? app.navigate : onNav;
  const isDark = app ? app.dark : dark;
  const onToggle = app ? app.toggleTheme : undefined;
  const [selId, setSel] = React.useState('bookclub');
  const [tab, setTab] = React.useState('overview');
  const [q, setQ] = React.useState('');
  const sel = BL_SPACES.find((x) => x.id === selId) || BL_SPACES[0];
  const list = BL_SPACES.filter((x) => x.name.includes(q));

  return (
    <Shell active={active} onNav={nav} dark={isDark}
      topbar={<Topbar crumbs={['북클럽', '공간 관리']} theme={isDark ? 'dark' : 'light'} onToggleTheme={onToggle} />}>
      <div style={{ height: '100%', display: 'flex', gap: 18, padding: '22px', overflow: 'hidden' }}>

        {/* Left — list */}
        <div style={{ width: 326, flexShrink: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <h1 style={{ flex: 1, margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--bl-text-1)' }}>공간 <span className="bl-tnum" style={{ color: 'var(--bl-text-3)', fontWeight: 600 }}>{BL_SPACES.length}</span></h1>
          </div>
          {/* search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 11px', border: '1px solid var(--bl-border-strong)', borderRadius: 7, background: 'var(--bl-surface-1)', marginBottom: 10 }}>
            <Icon name="search" size={16} style={{ color: 'var(--bl-text-3)' }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="공간 검색"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--bl-text-1)', fontFamily: 'inherit' }} />
          </div>
          <Btn variant="primary" full icon="plus" style={{ marginBottom: 14 }} onClick={() => app && app.openModal('createSpace')}>새 공간 만들기</Btn>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 9 }}>
            {list.map((s) => (
              <SpaceListItem key={s.id} s={s} selected={s.id === selId} onClick={() => { setSel(s.id); setTab('overview'); }} />
            ))}
            {list.length === 0 && <div style={{ fontSize: 13, color: 'var(--bl-text-3)', textAlign: 'center', padding: 24 }}>‘{q}’ 결과 없음</div>}
          </div>
        </div>

        {/* Right — detail */}
        <DetailPanel s={sel} tab={tab} onTab={setTab} app={app} />
      </div>
    </Shell>
  );
}

window.SpaceMgmt = SpaceMgmt;
