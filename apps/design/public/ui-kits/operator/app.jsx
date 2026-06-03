// app.jsx — interactive prototype shell for the blommunity Operator Console (운영자 어드민)
// AdminProvider (core.jsx) holds all live state: auth, role, routing, mutations, toasts.
// This router renders the screen for the current route; each screen draws its own AdminShell.

function AdminRouter() {
  const app = window.useApp();
  if (!app.authed) return <window.LoginScreen />;
  switch (app.route.screen) {
    case 'tenants':   return <window.TenantsScreen />;
    case 'tenant':    return <window.TenantDetailScreen />;
    case 'operators': return <window.OperatorsScreen />;
    case 'audit':     return <window.AuditScreen />;
    case 'settings':  return <window.SettingsScreen />;
    case 'dashboard':
    default:          return <window.DashboardScreen />;
  }
}

function OperatorConsoleApp() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <window.AdminProvider><AdminRouter /></window.AdminProvider>
    </div>
  );
}

window.OperatorConsoleApp = OperatorConsoleApp;
