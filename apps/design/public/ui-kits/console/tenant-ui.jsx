// tenant-ui.jsx — prototype UI: Modal, Toast, form controls, card
// Depends on console-system.jsx globals (Icon, Btn, Badge, Avatar)
// Exports: TCard, TField, TInput, TTextarea, TSeg, TToggle, ModalHost, ToastHost, TSectionTitle

if (typeof document !== 'undefined' && !document.getElementById('tc-anim')) {
  const s = document.createElement('style');
  s.id = 'tc-anim';
  s.textContent = '@keyframes tcPop{from{transform:translateY(8px) scale(.99)}to{transform:none}}@keyframes tcToast{from{transform:translate(-50%,8px)}to{transform:translate(-50%,0)}}';
  document.head.appendChild(s);
}

function TCard({ children, style }) {
  return <div style={{ background: 'var(--bl-surface-1)', border: '1px solid var(--bl-border)', borderRadius: 10, ...style }}>{children}</div>;
}

function TSectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--bl-text-1)' }}>{children}</h1>
      {sub && <p style={{ margin: '5px 0 0', fontSize: 13.5, color: 'var(--bl-text-2)' }}>{sub}</p>}
    </div>
  );
}

function TInput({ value, onChange, placeholder, autoFocus, icon, mono }) {
  const [foc, setFoc] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px', border: `1px solid ${foc ? 'var(--bl-accent)' : 'var(--bl-border-strong)'}`, borderRadius: 7, background: 'var(--bl-surface-1)', boxShadow: foc ? '0 0 0 3px var(--bl-focus)' : 'none', transition: 'border-color .12s, box-shadow .12s' }}>
      {icon && <Icon name={icon} size={15} style={{ color: 'var(--bl-text-3)', flexShrink: 0 }} />}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus}
        onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 13.5, color: 'var(--bl-text-1)', fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit' }} />
    </div>
  );
}

function TTextarea({ value, onChange, placeholder, rows = 3 }) {
  const [foc, setFoc] = React.useState(false);
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
      style={{ width: '100%', padding: '10px 12px', border: `1px solid ${foc ? 'var(--bl-accent)' : 'var(--bl-border-strong)'}`, borderRadius: 7, background: 'var(--bl-surface-1)', boxShadow: foc ? '0 0 0 3px var(--bl-focus)' : 'none', fontSize: 13.5, color: 'var(--bl-text-1)', fontFamily: 'inherit', resize: 'none', outline: 'none', lineHeight: 1.5, transition: 'border-color .12s, box-shadow .12s' }} />
  );
}

function TField({ label, children, hint }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--bl-text-2)', marginBottom: 6 }}>{label}</span>
      {children}
      {hint && <span style={{ display: 'block', fontSize: 11.5, color: 'var(--bl-text-3)', marginTop: 6 }}>{hint}</span>}
    </label>
  );
}

function TSeg({ options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', padding: 3, gap: 3, background: 'var(--bl-surface-2)', borderRadius: 9, border: '1px solid var(--bl-border)' }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            style={{ height: 32, padding: '0 13px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: on ? 650 : 550, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', background: on ? 'var(--bl-surface-1)' : 'transparent', color: on ? 'var(--bl-text-1)' : 'var(--bl-text-3)', boxShadow: on ? '0 1px 2px rgba(0,0,0,.08), 0 0 0 1px var(--bl-border)' : 'none', transition: 'color .12s' }}>
            {o.icon && <Icon name={o.icon} size={14} />}{o.label}
          </button>
        );
      })}
    </div>
  );
}

function TToggle({ on, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!on)} style={{ width: 42, height: 24, borderRadius: 13, border: 'none', cursor: 'pointer', padding: 0, background: on ? 'var(--bl-accent)' : 'var(--bl-border-strong)', position: 'relative', transition: 'background .15s' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .15s', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }} />
    </button>
  );
}

// ── Modal shell ─────────────────────────────────────────────────
function TModal({ icon, title, sub, onClose, children, footer, width = 460 }) {
  React.useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 90, background: 'rgba(12,12,18,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width, maxWidth: '100%', background: 'var(--bl-surface-1)', border: '1px solid var(--bl-border)', borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,.3)', overflow: 'hidden', animation: 'tcPop .18s cubic-bezier(.2,.7,.3,1)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '18px 20px 14px', borderBottom: '1px solid var(--bl-border)' }}>
          {icon && <span style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bl-accent-weak)', color: 'var(--bl-accent-text)' }}><Icon name={icon} size={18} /></span>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--bl-text-1)', letterSpacing: '-0.01em' }}>{title}</div>
            {sub && <div style={{ fontSize: 12.5, color: 'var(--bl-text-3)', marginTop: 3 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--bl-text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="x" size={17} /></button>
        </div>
        <div style={{ padding: '18px 20px' }}>{children}</div>
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9, padding: '14px 20px', borderTop: '1px solid var(--bl-border)', background: 'var(--bl-surface-0)' }}>{footer}</div>}
      </div>
    </div>
  );
}

// ── Modal host — switches on app.modal ──────────────────────────
function CreateSpaceForm({ app }) {
  const [name, setName] = React.useState('');
  const [vis, setVis] = React.useState('PUBLIC');
  const [desc, setDesc] = React.useState('');
  const submit = () => { app.closeModal(); app.showToast(`‘${name || '새 공간'}’ 공간을 만들었어요`, { sub: '이제 게시판을 추가할 수 있어요' }); };
  return (
    <TModal icon="layers2" title="새 공간 만들기" sub="멤버와 게시판을 담는 새로운 공간을 만들어요" onClose={app.closeModal}
      footer={<><Btn variant="ghost" onClick={app.closeModal}>취소</Btn><Btn variant="primary" icon="plus" onClick={submit}>공간 만들기</Btn></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TField label="공간 이름"><TInput value={name} onChange={setName} placeholder="예: 북클럽" autoFocus /></TField>
        <TField label="공개 범위" hint={vis === 'PUBLIC' ? '누구나 검색하고 가입을 신청할 수 있어요.' : '초대받은 사람만 들어올 수 있어요.'}>
          <TSeg value={vis} onChange={setVis} options={[{ value: 'PUBLIC', label: '공개', icon: 'globe' }, { value: 'PRIVATE', label: '비공개', icon: 'lock' }]} />
        </TField>
        <TField label="설명 (선택)"><TTextarea value={desc} onChange={setDesc} placeholder="이 공간을 한 줄로 소개해 주세요" /></TField>
      </div>
    </TModal>
  );
}

function CreateBoardForm({ app }) {
  const space = app.modal.data && app.modal.data.space;
  const [name, setName] = React.useState('');
  const [vis, setVis] = React.useState('PUBLIC');
  const submit = () => { app.closeModal(); app.showToast(`‘${name || '새 게시판'}’ 게시판을 만들었어요`, { sub: space ? `‘${space.name}’ 공간에 추가됨` : undefined }); };
  return (
    <TModal icon="boards" title="새 게시판 만들기" sub={space ? `‘${space.name}’ 공간에 게시판을 추가해요` : '게시판을 추가해요'} onClose={app.closeModal}
      footer={<><Btn variant="ghost" onClick={app.closeModal}>취소</Btn><Btn variant="primary" icon="plus" onClick={submit}>게시판 만들기</Btn></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TField label="게시판 이름"><TInput value={name} onChange={setName} placeholder="예: 이달의 책" autoFocus /></TField>
        <TField label="공개 범위">
          <TSeg value={vis} onChange={setVis} options={[{ value: 'PUBLIC', label: '공개', icon: 'globe' }, { value: 'PRIVATE', label: '비공개', icon: 'lock' }]} />
        </TField>
      </div>
    </TModal>
  );
}

function InviteMemberForm({ app }) {
  const space = app.modal.data && app.modal.data.space;
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('MEMBER');
  const submit = () => { app.closeModal(); app.showToast(`초대를 보냈어요`, { sub: `${email || '받는 사람'} · ${role}` }); };
  return (
    <TModal icon="userPlus" title="멤버 초대" sub={space ? `‘${space.name}’ 공간으로 초대해요` : '새 멤버를 초대해요'} onClose={app.closeModal}
      footer={<><Btn variant="ghost" onClick={app.closeModal}>취소</Btn><Btn variant="primary" icon="mail" onClick={submit}>초대 보내기</Btn></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TField label="이메일"><TInput value={email} onChange={setEmail} placeholder="name@example.com" icon="mail" autoFocus /></TField>
        <TField label="역할" hint={role === 'MANAGER' ? '게시판 운영과 멤버 관리를 할 수 있어요.' : '글과 댓글을 작성할 수 있어요.'}>
          <TSeg value={role} onChange={setRole} options={[{ value: 'MEMBER', label: 'MEMBER' }, { value: 'MANAGER', label: 'MANAGER' }]} />
        </TField>
      </div>
    </TModal>
  );
}

function ModalHost({ app }) {
  if (!app.modal) return null;
  return (
    <div className={'bl' + (app.dark ? ' dark' : '')} style={{ position: 'absolute', inset: 0, zIndex: 90, background: 'transparent' }}>
      {app.modal.name === 'createSpace' && <CreateSpaceForm app={app} />}
      {app.modal.name === 'createBoard' && <CreateBoardForm app={app} />}
      {app.modal.name === 'inviteMember' && <InviteMemberForm app={app} />}
    </div>
  );
}

// ── Toast host ──────────────────────────────────────────────────
function ToastHost({ app }) {
  const t = app.toast;
  if (!t) return null;
  return (
    <div key={t.id} className={'bl' + (app.dark ? ' dark' : '')} style={{ position: 'absolute', bottom: 22, left: '50%', zIndex: 95, background: 'transparent', transform: 'translateX(-50%)', animation: 'tcToast .22s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 16px 11px 13px', minWidth: 260, background: 'var(--bl-surface-1)', border: '1px solid var(--bl-border)', borderRadius: 10, boxShadow: 'var(--bl-shadow-pop)' }}>
        <span style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bl-success-bg)', color: 'var(--bl-success)' }}><Icon name="check" size={16} stroke={2.4} /></span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bl-text-1)', lineHeight: 1.3 }}>{t.msg}</div>
          {t.sub && <div style={{ fontSize: 11.5, color: 'var(--bl-text-3)', marginTop: 2 }}>{t.sub}</div>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TCard, TField, TInput, TTextarea, TSeg, TToggle, TModal, ModalHost, ToastHost, TSectionTitle });
