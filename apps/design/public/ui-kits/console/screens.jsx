// tenant-screens.jsx — new screens: 게시판 / 회원 / 모더레이션 / 설정 / 프로필
// Depends on console-system (Icon, Badge, Btn, Avatar, Shell, Topbar), tenant-ui (TCard, TField, TInput, TSeg, TToggle, TSectionTitle)

// shared helpers (local)
function TVis({ v }) {
  return v === 'PUBLIC'
    ? <Badge tone="success" icon="globe" size="sm">PUBLIC</Badge>
    : <Badge tone="neutral" icon="lock" size="sm">PRIVATE</Badge>;
}
function TRole({ role }) {
  if (role === 'OWNER') return <Badge tone="accent" size="sm">OWNER</Badge>;
  if (role === 'MANAGER') return <Badge tone="warning" size="sm">MANAGER</Badge>;
  return <Badge tone="neutral" size="sm">MEMBER</Badge>;
}
function TKV({ label, children, mono }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--bl-border)' }}>
      <span style={{ width: 92, flexShrink: 0, fontSize: 12.5, color: 'var(--bl-text-3)', fontWeight: 500 }}>{label}</span>
      <span style={{ flex: 1, fontSize: 13, color: 'var(--bl-text-1)', fontWeight: 500, fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit' }}>{children}</span>
    </div>
  );
}
function TSetRow({ title, desc, control, danger, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '15px 0', borderBottom: last ? 'none' : '1px solid var(--bl-border)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: danger ? 'var(--bl-danger)' : 'var(--bl-text-1)' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--bl-text-3)', marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
      </div>
      {control}
    </div>
  );
}

// content wrapper (scrolls within the shell main area)
function TScroll({ children }) {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ padding: '26px 28px 44px', maxWidth: 1080, margin: '0 auto' }}>{children}</div>
    </div>
  );
}
function TShell({ app, active, crumbs, children }) {
  return (
    <Shell active={active} onNav={app.navigate} dark={app.dark}
      topbar={<Topbar crumbs={crumbs} theme={app.dark ? 'dark' : 'light'} onToggleTheme={app.toggleTheme} />}>
      <TScroll>{children}</TScroll>
    </Shell>
  );
}
function THeaderRow({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 18 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--bl-text-1)' }}>{title}</h1>
        {sub && <p style={{ margin: '5px 0 0', fontSize: 13.5, color: 'var(--bl-text-2)' }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ── 게시판 관리 ─────────────────────────────────────────────────
function BoardsScreen({ app }) {
  const [q, setQ] = React.useState('');
  const rows = window.TC_BOARDS.filter((b) => b.name.includes(q) || b.space.includes(q));
  return (
    <TShell app={app} active="boards" crumbs={['북클럽', '게시판 관리']}>
      <THeaderRow title="게시판 관리" sub={`모든 공간의 게시판 ${window.TC_BOARDS.length}개`}
        action={<Btn variant="primary" icon="plus" onClick={() => app.openModal('createBoard')}>새 게시판</Btn>} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 11px', border: '1px solid var(--bl-border-strong)', borderRadius: 7, background: 'var(--bl-surface-1)', marginBottom: 14, maxWidth: 320 }}>
        <Icon name="search" size={16} style={{ color: 'var(--bl-text-3)' }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="게시판·공간 검색" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--bl-text-1)', fontFamily: 'inherit' }} />
      </div>
      <TCard style={{ overflow: 'hidden' }}>
        {rows.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--bl-border)' }}>
            <span style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--bl-surface-2)', color: 'var(--bl-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="boards" size={16} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--bl-text-1)' }}>{b.name}</span>
                <TVis v={b.vis} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--bl-text-3)', marginTop: 3 }}>{b.space}</div>
            </div>
            <div className="bl-tnum" style={{ display: 'flex', gap: 18, fontSize: 12.5, color: 'var(--bl-text-2)', flexShrink: 0 }}>
              <span>글 {b.posts.toLocaleString()}</span>
              <span style={{ color: 'var(--bl-text-3)' }}>멤버 {b.members}</span>
              <span style={{ color: 'var(--bl-text-3)', width: 56, textAlign: 'right' }}>{b.last}</span>
            </div>
            <Btn variant="ghost" size="sm" icon="settings" onClick={() => app.showToast(`‘${b.name}’ 관리 화면을 여는 중이에요`)}>관리</Btn>
          </div>
        ))}
      </TCard>
    </TShell>
  );
}

// ── 회원 관리 ───────────────────────────────────────────────────
function MembersScreen({ app }) {
  const [q, setQ] = React.useState('');
  const [role, setRole] = React.useState('ALL');
  const all = window.TC_MEMBERS;
  const rows = all.filter((m) => (role === 'ALL' || m.role === role) && (m.name.includes(q) || m.email.includes(q.toLowerCase())));
  return (
    <TShell app={app} active="members" crumbs={['북클럽', '회원 관리']}>
      <THeaderRow title="회원 관리" sub="북클럽 회원 237명"
        action={<Btn variant="primary" icon="userPlus" onClick={() => app.openModal('inviteMember')}>멤버 초대</Btn>} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <TSeg value={role} onChange={setRole} options={[{ value: 'ALL', label: '전체' }, { value: 'OWNER', label: 'OWNER' }, { value: 'MANAGER', label: 'MANAGER' }, { value: 'MEMBER', label: 'MEMBER' }]} />
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 11px', border: '1px solid var(--bl-border-strong)', borderRadius: 7, background: 'var(--bl-surface-1)', width: 240 }}>
          <Icon name="search" size={16} style={{ color: 'var(--bl-text-3)' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="이름·이메일 검색" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--bl-text-1)', fontFamily: 'inherit' }} />
        </div>
      </div>
      <TCard style={{ overflow: 'hidden' }}>
        {rows.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 16px', borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--bl-border)' }}>
            <Avatar name={m.name} idx={m.idx} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--bl-text-1)' }}>{m.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--bl-text-3)', marginTop: 2, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{m.email}</div>
            </div>
            {m.status === '차단' && <Badge tone="danger" size="sm">차단됨</Badge>}
            <TRole role={m.role} />
            <span className="bl-tnum" style={{ fontSize: 12, color: 'var(--bl-text-3)', width: 84, textAlign: 'right' }}>{m.joined}</span>
            <button title="더보기" onClick={() => app.showToast(`‘${m.name}’ 회원 메뉴`)} style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--bl-text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="more" size={16} /></button>
          </div>
        ))}
        {rows.length === 0 && <div style={{ padding: '34px', textAlign: 'center', fontSize: 13, color: 'var(--bl-text-3)' }}>조건에 맞는 회원이 없어요</div>}
      </TCard>
    </TShell>
  );
}

// ── 신고·모더레이션 ─────────────────────────────────────────────
function ModerationScreen({ app }) {
  const reports = window.TC_REPORTS;
  return (
    <TShell app={app} active="moderation" crumbs={['북클럽', '신고·모더레이션']}>
      <THeaderRow title="신고·모더레이션" sub="회원이 신고한 게시물과 댓글을 처리해요" />

      <TCard style={{ overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--bl-border)' }}>
          <span style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bl-success-bg)', color: 'var(--bl-success)', border: '1px solid var(--bl-success-bd)' }}><Icon name="checkCircle" size={16} /></span>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 650, color: 'var(--bl-text-1)' }}>처리 대기 <span className="bl-tnum" style={{ color: 'var(--bl-text-3)' }}>0</span></div>
        </div>
        <div style={{ padding: '34px 16px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: 'var(--bl-success-bg)', color: 'var(--bl-success)', marginBottom: 10 }}><Icon name="checkCircle" size={20} /></div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--bl-text-1)' }}>처리할 신고가 없어요</div>
          <div style={{ fontSize: 12.5, color: 'var(--bl-text-3)', marginTop: 3 }}>새 신고가 들어오면 여기에 표시됩니다</div>
        </div>
      </TCard>

      <div style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--bl-text-1)', marginBottom: 10 }}>최근 처리 내역</div>
      <TCard style={{ overflow: 'hidden' }}>
        {reports.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px', borderBottom: i === reports.length - 1 ? 'none' : '1px solid var(--bl-border)' }}>
            <span style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--bl-surface-2)', color: 'var(--bl-text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={r.target === '댓글' ? 'boards' : 'penLine'} size={15} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: 'var(--bl-text-1)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.target} · {r.excerpt}</div>
              <div style={{ fontSize: 11.5, color: 'var(--bl-text-3)', marginTop: 2 }}>{r.reason} · 신고자 {r.reporter} · {r.time}</div>
            </div>
            <Badge tone={r.kind} size="sm">{r.result}</Badge>
          </div>
        ))}
      </TCard>
    </TShell>
  );
}

// ── 사이트 설정 ─────────────────────────────────────────────────
function SettingsScreen({ app }) {
  const [approve, setApprove] = React.useState(true);
  return (
    <TShell app={app} active="settings" crumbs={['북클럽', '사이트 설정']}>
      <THeaderRow title="사이트 설정" sub="북클럽 사이트 전반을 설정해요" />
      <TCard style={{ padding: '4px 18px', marginBottom: 16 }}>
        <TSetRow title="사이트 이름" desc="방문자와 회원에게 보이는 이름이에요." control={<Btn variant="secondary" size="sm" icon="edit" onClick={() => app.showToast('사이트 이름 편집')}>북클럽</Btn>} />
        <TSetRow title="도메인" desc="커뮤니티 접속 주소예요." control={<span style={{ fontSize: 12.5, color: 'var(--bl-text-2)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>bookclub.blommunity.io</span>} />
        <TSetRow title="공개 범위" desc="누구나 검색하고 가입을 신청할 수 있어요." control={<TVis v="PUBLIC" />} />
        <TSetRow title="가입 승인" desc="새 가입 요청을 운영진이 직접 승인해요." control={<TToggle on={approve} onChange={(v) => { setApprove(v); app.showToast(v ? '가입 승인을 켰어요' : '가입 승인을 껐어요'); }} />} />
        <TSetRow title="테마" desc="라이트 / 다크 모드" last control={<TSeg value={app.dark ? 'dark' : 'light'} onChange={(v) => { if ((v === 'dark') !== app.dark) app.toggleTheme(); }} options={[{ value: 'light', label: '라이트' }, { value: 'dark', label: '다크' }]} />} />
      </TCard>
      <div style={{ border: '1px solid var(--bl-danger-bd)', borderRadius: 10, padding: '4px 18px', background: 'var(--bl-danger-bg)' }}>
        <TSetRow danger last title="사이트 삭제" desc="사이트와 모든 공간·게시판·글·회원 데이터가 영구히 삭제돼요. 되돌릴 수 없어요." control={<Btn variant="danger" size="sm" icon="trash" onClick={() => app.showToast('삭제하려면 한 번 더 확인이 필요해요')}>사이트 삭제</Btn>} />
      </div>
    </TShell>
  );
}

// ── 내 프로필 ───────────────────────────────────────────────────
function ProfileScreen({ app }) {
  return (
    <TShell app={app} active="profile" crumbs={['북클럽', '내 프로필']}>
      <THeaderRow title="내 프로필" sub="내 계정 정보를 확인하고 관리해요" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <TCard style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18 }}>
            <Avatar name="지은" idx={0} size={52} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--bl-text-1)' }}>지은</div>
              <div style={{ fontSize: 12.5, color: 'var(--bl-text-3)', marginTop: 2, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>jieun@bookclub.kr</div>
              <div style={{ marginTop: 8 }}><Badge tone="accent" size="sm">OWNER</Badge></div>
            </div>
          </div>
          <div style={{ padding: '2px 18px 14px' }}>
            <TKV label="이메일" mono>jieun@bookclub.kr</TKV>
            <TKV label="역할">OWNER · 북클럽</TKV>
            <TKV label="가입일" mono>2024-03-12</TKV>
            <div style={{ display: 'flex', gap: 12, padding: '11px 0' }}>
              <span style={{ width: 92, flexShrink: 0, fontSize: 12.5, color: 'var(--bl-text-3)', fontWeight: 500 }}>최근 접속</span>
              <span style={{ fontSize: 13, color: 'var(--bl-text-1)', fontWeight: 500 }}>방금 · 이 세션</span>
            </div>
          </div>
        </TCard>
        <TCard style={{ padding: '4px 18px' }}>
          <div style={{ padding: '14px 0 6px', fontSize: 12, fontWeight: 700, color: 'var(--bl-text-3)', letterSpacing: '.04em' }}>환경설정</div>
          <TSetRow title="테마" desc="라이트 / 다크 모드" control={<TSeg value={app.dark ? 'dark' : 'light'} onChange={(v) => { if ((v === 'dark') !== app.dark) app.toggleTheme(); }} options={[{ value: 'light', label: '라이트' }, { value: 'dark', label: '다크' }]} />} />
          <TSetRow title="이메일 알림" desc="새 가입·신고를 메일로 받아요." control={<TToggle on={true} onChange={() => app.showToast('알림 설정을 변경했어요')} />} />
          <TSetRow title="비밀번호" desc="주기적으로 변경하는 것을 권장해요." last control={<Btn variant="secondary" size="sm" icon="key" onClick={() => app.showToast('비밀번호 변경 화면')}>변경</Btn>} />
        </TCard>
      </div>
    </TShell>
  );
}

Object.assign(window, { BoardsScreen, MembersScreen, ModerationScreen, SettingsScreen, ProfileScreen });
