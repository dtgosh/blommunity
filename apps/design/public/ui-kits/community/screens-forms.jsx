// community-screens2.jsx — Compose, Auth (login/signup), Profile
const I2 = window.CmIcon, Av2 = window.CmAvatar, B2 = window.CmBtn, Tag2 = window.CmTag, Stat2 = window.CmStat, Page2 = window.CmPage, useCm2 = window.useCm;

// ── 4. 글 작성 ──────────────────────────────────────────────────
function ComposeScreen({ theme }) {
  const app = useCm2();
  const tools = [['heading', '제목'], ['bold', '굵게'], ['italic', '기울임'], ['link', '링크'], ['list', '목록'], ['quote', '인용'], ['image', '이미지']];
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  return (
    <Page2 theme={theme} active="">
      <main className="cm-wrap" style={{ maxWidth: 760, padding: '30px 28px 0' }}>
        <h1 style={{ margin: '0 0 22px', fontSize: 22, fontWeight: 750, color: 'var(--ink)', letterSpacing: '-0.02em' }}>새 글 작성</h1>

        {/* board select */}
        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 7 }}>게시판</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 42, padding: '0 14px', border: '1px solid var(--border-strong)', borderRadius: 9, background: 'var(--surface)', cursor: 'pointer', minWidth: 220 }}>
            <I2 name="chat" size={16} style={{ color: 'var(--muted)' }} />
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>자유게시판</span>
            <I2 name="chevronDown" size={16} style={{ color: 'var(--faint)' }} />
          </div>
        </label>

        {/* editor card */}
        <div style={{ border: '1px solid var(--border-strong)', borderRadius: 12, background: 'var(--surface)', overflow: 'hidden' }}>
          <input aria-label="제목" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" style={{ display: 'block', width: '100%', border: 'none', outline: 'none', background: 'transparent', padding: '18px 18px 10px', fontSize: 21, fontWeight: 700, color: 'var(--ink)', fontFamily: 'inherit', letterSpacing: '-0.02em' }} />
          {/* toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '8px 12px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
            {tools.map(([ic, label], i) => (
              <React.Fragment key={ic}>
                {(i === 3 || i === 6) && <span style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 5px' }} />}
                <button title={label} aria-label={label} onClick={() => app.live && app.toast(label + ' 서식')} style={{ width: 34, height: 34, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I2 name={ic} size={17} /></button>
              </React.Fragment>
            ))}
          </div>
          {/* body */}
          <div style={{ padding: 18, minHeight: 300, position: 'relative' }}>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="내용을 입력하세요. 마음에 남은 문장이나 생각을 편하게 적어보세요." style={{ width: '100%', minHeight: 264, border: 'none', outline: 'none', background: 'transparent', resize: 'none', fontFamily: 'inherit', fontSize: 16, color: 'var(--ink)', lineHeight: 1.75 }} />
          </div>
          {/* footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            <button onClick={() => app.live && app.toast('사진을 추가하세요')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 10px', border: '1px dashed var(--border-strong)', borderRadius: 8, background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}><I2 name="image" size={15} />사진 추가</button>
            <div style={{ flex: 1 }} />
            <B2 variant="ghost" size="md" onClick={() => app.live && app.toast('임시저장됐어요')}>임시저장</B2>
            <B2 variant="secondary" size="md" onClick={() => app.live && app.go('board', { board: '자유게시판' })}>취소</B2>
            <B2 variant="primary" size="md" onClick={() => app.live && app.submitPost(title)}>등록</B2>
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--faint)', margin: '12px 2px 0', lineHeight: 1.6 }}>커뮤니티 가이드라인을 지켜주세요. 작성한 글은 등록 즉시 자유게시판에 공개됩니다.</p>
      </main>
    </Page2>
  );
}

// ── 5. 로그인 / 회원가입 ────────────────────────────────────────
function AuthField({ label, type = 'text', placeholder, icon, hint }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 7 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, height: 44, padding: '0 13px', border: '1px solid var(--border-strong)', borderRadius: 9, background: 'var(--surface)' }}>
        {icon && <I2 name={icon} size={16} style={{ color: 'var(--faint)' }} />}
        <input type={type} placeholder={placeholder} style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--ink)', fontFamily: 'inherit' }} />
      </div>
      {hint && <span style={{ display: 'block', fontSize: 11.5, color: 'var(--faint)', marginTop: 6 }}>{hint}</span>}
    </label>
  );
}

function AuthCard({ mode = 'login', onSubmit, onToggle }) {
  const signup = mode === 'signup';
  return (
    <div style={{ width: '100%', maxWidth: 392 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span aria-hidden="true" style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 10, background: 'var(--accent)', color: '#fff', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, letterSpacing: '-0.04em', marginBottom: 14 }}><window.CmMark size={24} line="var(--accent)" /></span>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 750, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{signup ? '북클럽 회원가입' : '다시 오신 걸 환영해요'}</h1>
        <p style={{ margin: '7px 0 0', fontSize: 13.5, color: 'var(--muted)' }}>{signup ? '몇 가지만 입력하면 바로 시작할 수 있어요.' : '북클럽 계정으로 로그인하세요.'}</p>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 15 }}>
        {signup && <AuthField label="닉네임" placeholder="커뮤니티에서 쓸 이름" icon="user" />}
        <AuthField label="이메일" type="email" placeholder="name@example.com" icon="mail" />
        <AuthField label="비밀번호" type="password" placeholder={signup ? '8자 이상' : '비밀번호'} icon="lock" hint={signup ? '영문·숫자를 포함해 8자 이상' : undefined} />
        {signup && <AuthField label="비밀번호 확인" type="password" placeholder="다시 한 번 입력" icon="lock" />}
        {!signup && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }}>
              <span style={{ width: 17, height: 17, borderRadius: 5, border: '1px solid var(--border-strong)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)' }} />로그인 유지
            </label>
            <a href="#" style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)' }}>비밀번호 찾기</a>
          </div>
        )}
        <B2 variant="solid" size="lg" full style={{ marginTop: 2 }} onClick={onSubmit}>{signup ? '가입하기' : '로그인'}</B2>
      </div>
      <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--muted)', marginTop: 18 }}>
        {signup ? '이미 계정이 있으세요? ' : '아직 회원이 아니세요? '}
        <a href="#" onClick={(e) => { if (onToggle) { e.preventDefault(); onToggle(); } }} style={{ fontWeight: 650, color: 'var(--accent-text)' }}>{signup ? '로그인' : '회원가입'}</a>
      </p>
    </div>
  );
}

function AuthScreen({ theme, mode = 'login' }) {
  const app = useCm2();
  const th = theme || app.theme || 'light';
  return (
    <div className="cm cm-page" data-theme={th} style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ height: 60, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px' }}><window.CmLogo onClick={(e) => { if (app.live) { e.preventDefault(); app.go('home'); } }} /></header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <AuthCard mode={mode} onSubmit={() => app.live && app.login()} onToggle={() => app.live && app.go(mode === 'signup' ? 'login' : 'signup')} />
      </div>
    </div>
  );
}

// ── 6. 내 프로필 ────────────────────────────────────────────────
function MyPostRow({ p }) {
  const app = useCm2();
  return (
    <article onClick={() => app.live && app.go('post', { postId: 2 })} style={{ display: 'flex', gap: 14, padding: '15px 4px', borderBottom: '1px solid var(--border)', alignItems: 'center', cursor: app.live ? 'pointer' : 'default' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <Tag2 tone="soft">{p.board}</Tag2>
          <span style={{ fontSize: 12, color: 'var(--faint)' }}>{p.date}</span>
        </div>
        <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.4 }}><a href="#">{p.title}</a></h3>
      </div>
      <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
        <Stat2 icon="comment">{p.comments}</Stat2>
        <Stat2 icon="heart">{p.likes}</Stat2>
      </div>
    </article>
  );
}

function ProfileScreen({ theme }) {
  const app = useCm2();
  const tabs = ['내가 쓴 글', '내가 쓴 댓글', '좋아요한 글'];
  const [tab, setTab] = React.useState('내가 쓴 글');
  return (
    <Page2 theme={theme} active="">
      <main className="cm-wrap" style={{ maxWidth: 860, padding: '32px 28px 0' }}>
        {/* profile header */}
        <header className="cm-row-stack" style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
          <Av2 name={app.user ? app.user.name : '지은'} idx={0} size={76} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 23, fontWeight: 750, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{app.user ? app.user.name : '지은'}</h1>
              <Tag2 tone="notice">OWNER</Tag2>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>매달 한 권씩, 느리게 읽는 사람. 밑줄과 메모를 좋아해요.</p>
            <div className="cm-tnum" style={{ fontSize: 12.5, color: 'var(--faint)', marginTop: 8 }}>2024년 3월 가입 · 북클럽</div>
          </div>
          <div className="cm-hide-narrow" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <B2 variant="secondary" icon="pencil" onClick={() => app.live && app.toast('프로필 편집')}>프로필 편집</B2>
            <B2 variant="ghost" size="sm" onClick={() => app.live && app.logout()}>로그아웃</B2>
          </div>
        </header>

        {/* stats */}
        <div style={{ display: 'flex', gap: 0, padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
          {[['작성한 글', '34'], ['작성한 댓글', '128'], ['받은 좋아요', '512']].map(([l, v], i) => (
            <div key={l} style={{ flex: 1, textAlign: 'center', borderLeft: i ? '1px solid var(--border)' : 'none' }}>
              <div className="cm-tnum" style={{ fontSize: 22, fontWeight: 750, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{v}</div>
              <div style={{ fontSize: 12.5, color: 'var(--faint)', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginTop: 4 }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ position: 'relative', padding: '14px 10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: t === tab ? 700 : 500, color: t === tab ? 'var(--ink)' : 'var(--faint)' }}>
              {t}<span style={{ position: 'absolute', left: 6, right: 6, bottom: -1, height: 2, borderRadius: 2, background: t === tab ? 'var(--accent)' : 'transparent' }} />
            </button>
          ))}
        </div>

        {/* my posts */}
        <div style={{ paddingBottom: 8 }}>{window.CM_MY_POSTS.map((p, i) => <MyPostRow key={i} p={p} />)}</div>
        <div style={{ textAlign: 'center', padding: '8px 0 4px' }}><B2 variant="secondary" size="md" iconRight="chevronDown">더 보기</B2></div>
      </main>
    </Page2>
  );
}

window.ComposeScreen = ComposeScreen;
window.AuthScreen = AuthScreen;
window.ProfileScreen = ProfileScreen;
