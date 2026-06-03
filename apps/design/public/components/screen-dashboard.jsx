// screen-dashboard.jsx — Blommunity dashboard (light)
// Depends on console-system.jsx globals: Icon, Badge, Btn, Avatar, Shell

function BlCard({ children, style, pad = 0 }) {
  return (
    <div style={{
      background: 'var(--bl-surface-1)', border: '1px solid var(--bl-border)',
      borderRadius: 10, padding: pad, ...style,
    }}>{children}</div>
  );
}

function CardHead({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '15px 18px', borderBottom: '1px solid var(--bl-border)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 650, color: 'var(--bl-text-1)', letterSpacing: '-0.01em' }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--bl-text-3)', marginTop: 2 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

function MetricCard({ label, icon, value, unit, delta, deltaTone = 'success', foot }) {
  return (
    <BlCard style={{ padding: '16px 18px 17px', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bl-surface-2)', color: 'var(--bl-text-2)', flexShrink: 0,
        }}><Icon name={icon} size={16} /></span>
        <span style={{ fontSize: 12.5, fontWeight: 550, color: 'var(--bl-text-2)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="bl-tnum" style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--bl-text-1)', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 13, color: 'var(--bl-text-3)', fontWeight: 500 }}>{unit}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 18 }}>
        {delta && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: `var(--bl-${deltaTone})` }}>
            <Icon name="trendingUp" size={13} stroke={2.1} />{delta}
          </span>
        )}
        {foot && <span style={{ fontSize: 12, color: 'var(--bl-text-3)' }}>{foot}</span>}
      </div>
    </BlCard>
  );
}

const BL_ACTIVITY = [
  { who: '민수', idx: 1, action: <>‘이달의 책’에 새 글을 작성했어요</>, target: '책 추천: 《달러구트 꿈 백화점》', t: '12분 전', icon: 'penLine' },
  { who: '유진', idx: 2, action: <>북클럽에 가입했어요</>, t: '38분 전', icon: 'userPlus' },
  { who: '지수', idx: 3, action: <>‘자유게시판’의 <b style={{ color: 'var(--bl-text-1)', fontWeight: 600 }}>Manager</b>로 임명되었어요</>, t: '1시간 전', icon: 'shieldUser' },
  { who: '현우', idx: 4, action: <>‘독서 후기’에 댓글 3개를 남겼어요</>, t: '2시간 전', icon: 'boards' },
  { who: '서연', idx: 5, action: <>북클럽에 가입했어요</>, t: '3시간 전', icon: 'userPlus' },
  { who: '민지', idx: 6, action: <>‘추천 도서’에 새 글을 작성했어요</>, target: '비문학 입문서 모음', t: '5시간 전', icon: 'penLine' },
];

function ActivityRow({ a, last }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '13px 18px', borderBottom: last ? 'none' : '1px solid var(--bl-border)' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar name={a.who} idx={a.idx} size={32} />
        <span style={{
          position: 'absolute', right: -3, bottom: -3, width: 17, height: 17, borderRadius: '50%',
          background: 'var(--bl-surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--bl-text-3)', boxShadow: '0 0 0 1.5px var(--bl-surface-1)',
        }}><Icon name={a.icon} size={11} stroke={2} /></span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--bl-text-2)', lineHeight: 1.45 }}>
          <b style={{ color: 'var(--bl-text-1)', fontWeight: 650 }}>{a.who}</b>님이 {a.action}
        </div>
        {a.target && (
          <div style={{
            fontSize: 12.5, color: 'var(--bl-text-2)', marginTop: 4, padding: '2px 0',
            display: 'inline-flex', alignItems: 'center', gap: 5, maxWidth: '100%',
          }}>
            <span style={{ color: 'var(--bl-text-3)' }}>“</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.target}</span>
            <span style={{ color: 'var(--bl-text-3)' }}>”</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--bl-text-3)', whiteSpace: 'nowrap', flexShrink: 0, paddingTop: 1 }}>{a.t}</div>
    </div>
  );
}

const BL_BOARDS = [
  { name: '자유게시판', space: '북클럽', posts: 1204, idx: 0 },
  { name: '이달의 책', space: '북클럽', posts: 386, idx: 1 },
  { name: '운영진 회의실', space: '운영진 라운지', posts: 142, idx: 6 },
  { name: '추천 도서', space: '북클럽', posts: 98, idx: 3 },
  { name: '독서 후기', space: '북클럽', posts: 73, idx: 4 },
];

function BoardRow({ b, rank, max, last }) {
  const [hover, setHover] = React.useState(false);
  const pct = Math.max(8, Math.round((b.posts / max) * 100));
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: last ? 'none' : '1px solid var(--bl-border)', background: hover ? 'var(--bl-surface-2)' : 'transparent', cursor: 'pointer', transition: 'background .12s' }}>
      <span className="bl-tnum" style={{ width: 18, fontSize: 13, fontWeight: 700, color: rank <= 3 ? 'var(--bl-accent-text)' : 'var(--bl-text-3)', flexShrink: 0 }}>{rank}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--bl-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</span>
          <span style={{ fontSize: 11, color: 'var(--bl-text-3)', whiteSpace: 'nowrap' }}>· {b.space}</span>
        </div>
        <div style={{ height: 4, borderRadius: 3, background: 'var(--bl-surface-2)', overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', borderRadius: 3, background: rank <= 3 ? 'var(--bl-accent)' : 'var(--bl-border-strong)' }} />
        </div>
      </div>
      <span className="bl-tnum" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--bl-text-2)', whiteSpace: 'nowrap', flexShrink: 0 }}>{b.posts.toLocaleString()}<span style={{ color: 'var(--bl-text-3)', fontWeight: 500, marginLeft: 3 }}>글</span></span>
    </div>
  );
}

function Dashboard({ onNav, active = 'dashboard', dark, app }) {
  const nav = app ? app.navigate : onNav;
  const isDark = app ? app.dark : dark;
  const onToggle = app ? app.toggleTheme : undefined;
  const maxPosts = Math.max(...BL_BOARDS.map((b) => b.posts));
  return (
    <Shell active={active} onNav={nav} dark={isDark}
      topbar={<Topbar crumbs={['북클럽', '대시보드']} theme={isDark ? 'dark' : 'light'} onToggleTheme={onToggle} />}>
      <div style={{ height: '100%', overflow: 'hidden', padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Greeting + quick actions */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--bl-text-1)' }}>안녕하세요, 지은님</h1>
            <p style={{ margin: '5px 0 0', fontSize: 13.5, color: 'var(--bl-text-2)' }}>이번 주 북클럽에서 일어난 일을 한눈에 정리했어요.</p>
          </div>
          <div style={{ display: 'flex', gap: 9 }}>
            <Btn variant="secondary" icon="boards" onClick={() => nav && nav('boards')}>새 게시판</Btn>
            <Btn variant="primary" icon="penLine" onClick={() => app && app.showToast('새 글 작성을 시작합니다')}>새 글 작성</Btn>
          </div>
        </div>

        {/* Metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <MetricCard label="총 회원 수" icon="members" value="237" unit="명" delta="+12" foot="이번 주" />
          <MetricCard label="이번 주 새 글" icon="penLine" value="18" unit="건" delta="+5" foot="지난주 대비" />
          <MetricCard label="이번 주 새 댓글" icon="boards" value="64" unit="건" delta="+22" foot="지난주 대비" />
          <MetricCard label="신고 처리 대기" icon="moderation" value="0" unit="건" foot="모두 처리됨" />
        </div>

        {/* Two columns */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 16 }}>
          <BlCard style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <CardHead title="최근 활동" sub="멤버와 콘텐츠의 최신 변화"
              action={<Btn variant="ghost" size="sm" iconRight="arrowRight" onClick={() => app && app.showToast('활동 로그 전체를 불러왔어요')}>전체 보기</Btn>} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {BL_ACTIVITY.map((a, i) => <ActivityRow key={i} a={a} last={i === BL_ACTIVITY.length - 1} />)}
            </div>
          </BlCard>

          <BlCard style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <CardHead title="인기 게시판 Top 5" sub="누적 글 수 기준" />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {BL_BOARDS.map((b, i) => <BoardRow key={i} b={b} rank={i + 1} max={maxPosts} last={i === BL_BOARDS.length - 1} />)}
            </div>
          </BlCard>
        </div>
      </div>
    </Shell>
  );
}

window.Dashboard = Dashboard;
