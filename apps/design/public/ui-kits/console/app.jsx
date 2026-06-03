// app.jsx — interactive prototype shell for the blommunity Tenant Console
// Wires routing (sidebar nav), theme, modal host, and toasts via a plain `app` object.
// Reuses Dashboard, SpaceMgmt, BoardsScreen, MembersScreen, ModerationScreen, SettingsScreen, ProfileScreen.

function TenantConsoleApp() {
  const [screen, setScreen] = React.useState('dashboard');
  const [dark, setDark] = React.useState(false);
  const [modal, setModal] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const toastTimer = React.useRef(0);

  const showToast = React.useCallback((msg, opts = {}) => {
    clearTimeout(toastTimer.current);
    setToast({ id: Math.random().toString(36).slice(2), msg, sub: opts.sub });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const app = {
    screen, dark, modal, toast,
    navigate: (key) => { setScreen(key); },
    toggleTheme: () => setDark((d) => !d),
    showToast,
    openModal: (name, data) => setModal({ name, data }),
    closeModal: () => setModal(null),
  };

  let view;
  switch (screen) {
    case 'spaces':     view = <window.SpaceMgmt app={app} />; break;
    case 'boards':     view = <window.BoardsScreen app={app} />; break;
    case 'members':    view = <window.MembersScreen app={app} />; break;
    case 'moderation': view = <window.ModerationScreen app={app} />; break;
    case 'settings':   view = <window.SettingsScreen app={app} />; break;
    case 'profile':    view = <window.ProfileScreen app={app} />; break;
    case 'dashboard':
    default:           view = <window.Dashboard app={app} />;
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {view}
      <window.ModalHost app={app} />
      <window.ToastHost app={app} />
    </div>
  );
}

window.TenantConsoleApp = TenantConsoleApp;
