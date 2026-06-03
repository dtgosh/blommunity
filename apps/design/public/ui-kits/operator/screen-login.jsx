// admin-login.jsx — 운영자 로그인 (단일 화면)
// Depends on: Icon, Btn (console-system), useApp (admin-core)

function LoginField({ label, type, value, onChange, placeholder, icon, autoFocus }) {
  const [foc, setFoc] = React.useState(false);
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--bl-text-2)', marginBottom: 6 }}>{label}</span>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, height: 42, padding: '0 12px',
        border: `1px solid ${foc ? 'var(--bl-accent)' : 'var(--bl-border-strong)'}`, borderRadius: 8,
        background: 'var(--bl-surface-1)', boxShadow: foc ? '0 0 0 3px var(--bl-focus)' : 'none', transition: 'border-color .12s, box-shadow .12s',
      }}>
        {icon && <Icon name={icon} size={16} style={{ color: 'var(--bl-text-3)', flexShrink: 0 }} />}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          autoFocus={autoFocus} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 13.5, color: 'var(--bl-text-1)', fontFamily: 'inherit' }} />
      </div>
    </label>
  );
}

function LoginScreen() {
  const app = useApp();
  const [email, setEmail] = React.useState('doyun.kim@blommunity.io');
  const [pw, setPw] = React.useState('••••••••••');
  const submit = (e) => { e.preventDefault(); app.login(); };
  return (
    <div className={'bl' + (app.theme === 'dark' ? ' dark' : '')} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bl-surface-0)', position: 'relative' }}>
      <button onClick={app.toggleTheme} title="테마 전환"
        style={{ position: 'absolute', top: 18, right: 20, width: 36, height: 36, borderRadius: 8, border: '1px solid var(--bl-border)', background: 'var(--bl-surface-1)', color: 'var(--bl-text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={app.theme === 'dark' ? 'sun' : 'moon'} size={17} />
      </button>

      <form onSubmit={submit} style={{ width: 372 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 26 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bl-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 800, letterSpacing: '-0.04em' }}><BlomMark size={23} line="var(--bl-accent)" /></div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--bl-text-1)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>blommunity</div>
            <div style={{ fontSize: 12, color: 'var(--bl-text-3)', fontWeight: 550 }}>Operator Console</div>
          </div>
        </div>

        <ACard style={{ padding: 26 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--bl-text-1)' }}>운영자 로그인</h1>
          <p style={{ margin: '0 0 22px', fontSize: 13, color: 'var(--bl-text-2)' }}>내부 운영자 전용 콘솔입니다.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <LoginField label="이메일" type="email" value={email} onChange={setEmail} placeholder="name@blommunity.io" icon="mail" />
            <LoginField label="비밀번호" type="password" value={pw} onChange={setPw} placeholder="비밀번호" icon="lock" />
          </div>

          <div style={{ marginTop: 22 }}>
            <Btn variant="primary" size="lg" full iconRight="arrowRight" onClick={submit}>로그인</Btn>
          </div>
        </ACard>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, fontSize: 11.5, color: 'var(--bl-text-3)' }}>
          <Icon name="shieldCheck" size={13} />
          모든 접속과 활동은 감사 로그에 기록됩니다.
        </div>
      </form>
    </div>
  );
}

window.LoginScreen = LoginScreen;
