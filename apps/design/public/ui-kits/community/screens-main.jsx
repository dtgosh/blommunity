// community-screens.jsx — Home, BoardList, PostDetail, Compose, Auth, Profile
// Depends on community-core (CmPage, CmIcon, CmAvatar, CmBtn, CmTag, CmStat, CmLogo) + community-data
const I = window.CmIcon, Av = window.CmAvatar, B = window.CmBtn, Tag = window.CmTag, Stat = window.CmStat, Page = window.CmPage, useCm = window.useCm;

function Breadcrumb({ items, onNav }) {
  return (
    <nav aria-label="현재 위치" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--faint)', marginBottom: 18 }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <I name="chevronRight" size={13} />}
          <a href="#" onClick={(e) => { if (onNav) { e.preventDefault(); onNav(it, i); } }} style={{ color: i === items.length - 1 ? 'var(--muted)' : 'var(--faint)', fontWeight: i === items.length - 1 ? 600 : 500 }}>{it}</a>
        </React.Fragment>
      ))}
    </nav>
  );
}

function SideCard({ title, action, children }) {
  return (
    <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      {title && <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid var(--border)' }}><h3 style={{ flex: 1, margin: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{title}</h3>{action}</div>}
      <div>{children}</div>
    </section>
  );
}

function PopularList() {
  const app = useCm();
  return window.CM_POPULAR.map((p) => (
    <a key={p.rank} href="#" onClick={(e) => { if (app.live) { e.preventDefault(); app.go('post', { postId: 2 }); } }} style={{ display: 'flex', gap: 11, padding: '11px 16px', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
      <span className="cm-tnum" style={{ fontSize: 13, fontWeight: 700, color: p.rank <= 3 ? 'var(--accent-text)' : 'var(--faint)', width: 14, flexShrink: 0, lineHeight: 1.5 }}>{p.rank}</span>
      <span style={{ flex: 1, fontSize: 13, color: 'var(--text)', lineHeight: 1.5, fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</span>
    </a>
  ));
}

// ── 1. 게시판 글 목록 ───────────────────────────────────────────
function PostRow({ p }) {
  const app = useCm();
  const open = (e) => { if (app.live) { e.preventDefault(); app.go('post', { postId: p.id }); } };
  const liked = app.isLiked(p.id);
  return (
    <article onClick={app.live ? open : undefined} style={{ display: 'flex', gap: 16, padding: '18px 4px', borderBottom: '1px solid var(--border)', cursor: app.live ? 'pointer' : 'default', borderRadius: 8, transition: 'background .12s' }}
      onMouseEnter={app.live ? (e) => e.currentTarget.style.background = 'color-mix(in srgb, var(--surface-2) 55%, transparent)' : undefined}
      onMouseLeave={app.live ? (e) => e.currentTarget.style.background = 'transparent' : undefined}>
      <div style={{ flex: 1, minWidth: 0, padding: app.live ? '0 8px' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, flexWrap: 'wrap' }}>
          {p.notice && <Tag tone="notice" icon="pin">공지</Tag>}
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 650, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.4 }}>
            <a href="#" onClick={open}>{p.title}</a>
          </h3>
        </div>
        <p style={{ margin: '0 0 11px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.snippet}</p>
        <div className="cm-row-stack" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Av name={p.author} idx={p.idx} size={22} /><span style={{ fontSize: 12.5, color: 'var(--text)', fontWeight: 500 }}>{p.author}</span></span>
          <span style={{ fontSize: 12.5, color: 'var(--faint)' }}>{p.date}</span>
          <span style={{ flex: 1 }} />
          <Stat icon="comment">{p.comments}</Stat>
          <Stat icon="heart" active={liked}>{app.likeCount(p.likes, p.id)}</Stat>
        </div>
      </div>
    </article>
  );
}

function Pagination() {
  return (
    <nav aria-label="페이지" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 28 }}>
      <button aria-label="이전" style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name="chevronLeft" size={16} /></button>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} aria-current={n === 1 ? 'page' : undefined} style={{ minWidth: 36, height: 36, padding: '0 6px', borderRadius: 8, border: n === 1 ? '1px solid var(--accent)' : '1px solid var(--border)', background: n === 1 ? 'var(--accent-weak)' : 'var(--surface)', color: n === 1 ? 'var(--accent-text)' : 'var(--muted)', cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{n}</button>
      ))}
      <button aria-label="다음" style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name="chevronRight" size={16} /></button>
    </nav>
  );
}

function BoardListScreen({ theme }) {
  const app = useCm();
  const sorts = ['최신순', '인기순', '댓글순'];
  const [sort, setSort] = React.useState('최신순');
  const board = (app.live && app.params.board) || '자유게시판';
  return (
    <Page theme={theme} active={board}>
      <main className="cm-wrap" style={{ maxWidth: 1140, padding: '32px 28px 0' }}>
        <Breadcrumb items={['홈', board]} onNav={(it, i) => i === 0 && app.go('home')} />
        <div className="cm-list-grid">
          <div style={{ minWidth: 0 }}>
            {/* board header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, paddingBottom: 18, borderBottom: '2px solid var(--ink)', marginBottom: 4 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 750, color: 'var(--ink)', letterSpacing: '-0.03em' }}>{board}</h1>
                <p style={{ margin: '7px 0 0', fontSize: 14, color: 'var(--muted)' }}>무엇이든 가볍게 나누는 공간 · <span className="cm-tnum">1,204</span>개의 글</p>
              </div>
              <B variant="solid" icon="pencil" className="cm-hide-narrow" onClick={() => app.go('compose')}>글쓰기</B>
            </div>
            {/* sort tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '12px 0 4px' }}>
              {sorts.map((s) => (
                <button key={s} onClick={() => setSort(s)} style={{ padding: '7px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, fontWeight: s === sort ? 700 : 500, color: s === sort ? 'var(--ink)' : 'var(--faint)', borderRadius: 7 }}>{s}</button>
              ))}
            </div>
            <div>{window.CM_POSTS.map((p) => <PostRow key={p.id} p={p} />)}</div>
            <Pagination />
            <div style={{ height: 8 }} />
          </div>
          {/* right rail */}
          <aside className="cm-hide-narrow" style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 76 }}>
            <SideCard title="이 게시판">
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>가볍게 이야기 나누는 자유 공간이에요. 서로 존중하며 즐겁게 활동해요.</p>
                <div style={{ display: 'flex', gap: 18 }}>
                  <div><div className="cm-tnum" style={{ fontSize: 18, fontWeight: 750, color: 'var(--ink)' }}>237</div><div style={{ fontSize: 11.5, color: 'var(--faint)' }}>멤버</div></div>
                  <div><div className="cm-tnum" style={{ fontSize: 18, fontWeight: 750, color: 'var(--ink)' }}>1,204</div><div style={{ fontSize: 11.5, color: 'var(--faint)' }}>글</div></div>
                </div>
              </div>
            </SideCard>
            <SideCard title="인기 글"><PopularList /></SideCard>
          </aside>
        </div>
      </main>
    </Page>
  );
}

// ── 2. 게시물 상세 ──────────────────────────────────────────────
function Comment({ c, reply, cid }) {
  const app = useCm();
  const liked = app.isCommentLiked(cid);
  return (
    <div style={{ display: 'flex', gap: 12, padding: reply ? '14px 0 14px 0' : '18px 0', borderBottom: reply ? 'none' : '1px solid var(--border)' }}>
      <Av name={c.name} idx={c.idx} size={reply ? 30 : 36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--ink)' }}>{c.name}</span>
          <span style={{ fontSize: 12, color: 'var(--faint)' }}>{c.date}</span>
        </div>
        <p style={{ margin: '0 0 8px', fontSize: 14.5, color: 'var(--text)', lineHeight: 1.65 }}>{c.text}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => app.toggleCommentLike(cid)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', color: liked ? 'var(--like)' : 'var(--faint)', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, padding: 0 }}><I name="heart" size={13} fill={liked ? 'currentColor' : 'none'} stroke={liked ? 0 : 1.7} />{c.likes + (liked ? 1 : 0)}</button>
          <button onClick={() => app.live && app.toast('답글은 준비 중이에요')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', color: 'var(--faint)', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, padding: 0 }}><I name="reply" size={13} />답글</button>
        </div>
        {c.replies && c.replies.length > 0 && (
          <div style={{ marginTop: 8, paddingLeft: 16, borderLeft: '2px solid var(--border)' }}>
            {c.replies.map((r, i) => <Comment key={i} c={r} reply cid={cid + '-' + i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function PostDetailScreen({ theme }) {
  const P = window.CM_POST;
  const app = useCm();
  const pid = (app.live && app.params.postId) || 2;
  const liked = app.isLiked(pid);
  const comments = app.live && app.comments ? app.comments : window.CM_COMMENTS;
  const [draft, setDraft] = React.useState('');
  const submitComment = () => { if (draft.trim() && app.live) { app.addComment(draft.trim()); setDraft(''); } };
  return (
    <Page theme={theme} active="자유게시판">
      <main className="cm-wrap" style={{ maxWidth: 760, padding: '30px 28px 0' }}>
        <Breadcrumb items={['홈', '자유게시판']} onNav={(it, i) => app.go(i === 0 ? 'home' : 'board', i === 0 ? {} : { board: '자유게시판' })} />
        <article>
          <h1 style={{ margin: '0 0 16px', fontSize: 30, fontWeight: 750, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1.28 }}>{P.title}</h1>
          {/* author row */}
          <div className="cm-row-stack" style={{ display: 'flex', alignItems: 'center', gap: 11, paddingBottom: 20, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <Av name={P.author} idx={P.idx} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 650, color: 'var(--ink)' }}>{P.author}</div>
              <div className="cm-tnum" style={{ fontSize: 12.5, color: 'var(--faint)', display: 'flex', gap: 10, marginTop: 2 }}><span>{P.date}</span><span>· {P.readtime}</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><I name="eye" size={12.5} />{P.views}</span></div>
            </div>
            <B variant="secondary" size="sm">팔로우</B>
          </div>
          {/* body */}
          <div className="cm-prose">
            <p>주말마다 읽은 책에서 마음에 남는 문장을 옮겨 적는 습관이 생겼어요. 처음엔 그냥 예뻐서 적었는데, 모아 놓고 보니 그때의 제 마음이 같이 적혀 있더라고요.</p>
            <p>오늘은 그동안 모은 것 중 몇 개를 골라 와봤습니다. 여러분이 요즘 밑줄 그은 문장도 댓글로 같이 나눠주시면 좋겠어요.</p>
            <blockquote>“우리는 우리가 읽은 것으로 이루어진다. 그러니 무엇을 읽을지 고르는 일은 곧 어떤 사람이 될지를 고르는 일이다.”</blockquote>
            <h2>옮겨 적으며 알게 된 것</h2>
            <p>손으로 다시 적다 보면 문장의 호흡이 보여요. 빠르게 읽을 땐 지나쳤던 쉼표 하나, 단어의 순서 같은 것들이요. 그래서 요즘은 <strong>좋았던 페이지만 다시 펴서 천천히 옮겨 적는</strong> 시간을 일부러 둡니다.</p>
            <ul>
              <li>문장은 짧게, 출처는 꼭 함께 적어두기</li>
              <li>그때 든 생각을 한 줄로 덧붙이기</li>
              <li>한 달에 한 번 모아서 다시 읽기</li>
            </ul>
            <figure className="cm-figure">
              <div role="img" aria-label="필사 노트 사진 자리" style={{ width: '100%', aspectRatio: '16/9', borderRadius: 10, border: '1px solid var(--border)', background: 'repeating-linear-gradient(135deg, var(--surface-2), var(--surface-2) 11px, var(--surface) 11px, var(--surface) 22px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12, fontFamily: 'ui-monospace, Menlo, monospace', color: 'var(--faint)', background: 'var(--surface)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)' }}>이미지 자리 · 필사 노트</span>
              </div>
            </figure>
            <p>여러분의 문장도 궁금합니다. 가볍게 한 줄씩 남겨주세요 :)</p>
          </div>
          {/* tags */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', margin: '26px 0 0' }}>
            {P.tags.map((t) => <a key={t} href="#"><Tag icon="hash">{t}</Tag></a>)}
          </div>
          {/* like / actions bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '28px 0', flexWrap: 'wrap' }}>
            <button onClick={() => app.toggleLike(pid)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 46, padding: '0 22px', borderRadius: 24, border: '1px solid var(--like)', background: liked ? 'var(--like)' : 'color-mix(in srgb, var(--like) 8%, transparent)', color: liked ? '#fff' : 'var(--like)', cursor: 'pointer', fontSize: 15, fontWeight: 700, transition: 'background .14s, color .14s' }}><I name="heart" size={18} fill="currentColor" stroke={0} />좋아요 <span className="cm-tnum">{app.likeCount(P.likes, pid)}</span></button>
            <button aria-label="댓글로 이동" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 46, padding: '0 18px', borderRadius: 24, border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--muted)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}><I name="comment" size={16} /><span className="cm-tnum">{comments.length}</span></button>
            <button aria-label="저장" onClick={() => app.live && app.toast('글을 저장했어요')} style={{ width: 46, height: 46, borderRadius: 23, border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name="bookmark" size={17} /></button>
            <button aria-label="공유" onClick={() => app.live && app.toast('링크를 복사했어요')} style={{ width: 46, height: 46, borderRadius: 23, border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name="share" size={16} /></button>
          </div>
        </article>

        {/* comments */}
        <section aria-label="댓글" style={{ marginTop: 8 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: '0 0 16px' }}>댓글 <span className="cm-tnum" style={{ color: 'var(--accent-text)' }}>{comments.length}</span></h2>
          {/* composer */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <Av name={app.user ? app.user.name : '지은'} idx={0} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ border: '1px solid var(--border-strong)', borderRadius: 12, background: 'var(--surface)', padding: 12 }}>
                <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="따뜻한 댓글을 남겨주세요…" rows={2} style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'none', fontFamily: 'inherit', fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.6 }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}><B variant="primary" size="sm" onClick={submitComment}>등록</B></div>
              </div>
            </div>
          </div>
          <div>{comments.map((c, i) => <Comment key={c._id || i} c={c} cid={'c' + (c._id || i)} />)}</div>
        </section>
      </main>
    </Page>
  );
}

// ── 3. 홈 ───────────────────────────────────────────────────────
function HomeScreen({ theme }) {
  const app = useCm();
  return (
    <Page theme={theme} active="홈">
      {/* hero */}
      <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="cm-wrap" style={{ maxWidth: 1140, padding: '52px 28px' }}>
          <div style={{ maxWidth: 620 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', letterSpacing: '.02em' }}>함께 읽는 사람들</span>
            <h1 style={{ margin: '12px 0 14px', fontSize: 36, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.035em', lineHeight: 1.18 }}>북클럽에 오신 걸 환영해요</h1>
            <p style={{ margin: 0, fontSize: 16.5, color: 'var(--muted)', lineHeight: 1.65, maxWidth: 520 }}>매달 한 권을 함께 읽고, 밑줄 그은 문장과 생각을 나누는 작은 커뮤니티예요. 가볍게 둘러보고 마음 맞는 글에 한마디 남겨보세요.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 26, flexWrap: 'wrap' }}>
              <B variant="solid" size="lg" onClick={() => app.live && (app.user ? app.go('compose') : app.go('signup'))}>{app.user ? '글 쓰러 가기' : '가입하고 시작하기'}</B>
              <B variant="secondary" size="lg" iconRight="chevronRight" onClick={() => app.go('board', { board: '자유게시판' })}>게시판 둘러보기</B>
            </div>
          </div>
        </div>
      </section>

      <main className="cm-wrap" style={{ maxWidth: 1140, padding: '40px 28px 0' }}>
        {/* board shortcuts */}
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', margin: '0 0 16px', letterSpacing: '-0.01em' }}>게시판</h2>
        <div className="cm-board-cards" style={{ marginBottom: 44 }}>
          {window.CM_BOARDS.map((b) => (
            <a key={b.name} href="#" onClick={(e) => { if (app.live) { e.preventDefault(); app.go('board', { board: b.name }); } }} style={{ display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, transition: 'border-color .12s, transform .12s' }}
              onMouseEnter={app.live ? (e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-2px)'; } : undefined}
              onMouseLeave={app.live ? (e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; } : undefined}>
              <span style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-2)', color: 'var(--accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}><I name={b.icon} size={20} /></span>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{b.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{b.desc}</div>
              <div className="cm-tnum" style={{ fontSize: 12, color: 'var(--faint)', marginTop: 12 }}>글 {b.posts.toLocaleString()}개</div>
            </a>
          ))}
        </div>

        <div className="cm-home-grid" style={{ paddingBottom: 8 }}>
          {/* recent */}
          <section style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 4, borderBottom: '2px solid var(--ink)', paddingBottom: 12 }}>
              <h2 style={{ flex: 1, fontSize: 18, fontWeight: 750, color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>최근 글</h2>
              <a href="#" onClick={(e) => { if (app.live) { e.preventDefault(); app.go('board', { board: '자유게시판' }); } }} style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>전체 보기</a>
            </div>
            {window.CM_POSTS.slice(1, 6).map((p) => <PostRow key={p.id} p={p} />)}
          </section>
          {/* popular rail */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SideCard title="인기 글"><PopularList /></SideCard>
            <SideCard title="이번 주 모임">
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>토요일 오후 3시 · 온라인</div>
                <div style={{ fontSize: 14.5, fontWeight: 650, color: 'var(--ink)', margin: '4px 0 12px' }}>《빛의 과거》 함께 읽기</div>
                <B variant="secondary" size="sm" full onClick={() => app.live && app.toast('모임 참여 신청이 접수됐어요')}>참여 신청</B>
              </div>
            </SideCard>
          </aside>
        </div>
      </main>
    </Page>
  );
}

window.HomeScreen = HomeScreen;
window.BoardListScreen = BoardListScreen;
window.PostDetailScreen = PostDetailScreen;
