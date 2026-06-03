# blommunity — 운영자 어드민 UI Kit (Operator Console)

A high-fidelity recreation of the **platform operator's admin** — the internal console blommunity staff use to approve/suspend **tenants** (paying community customers) and **operators** (internal staff), with full **role-based permissions** (OWNER / MANAGER / MEMBER) and an **audit log**.

Built on the same `--bl-*` **console token family** as the Tenant Console (cool grays, light + dark).

## Run it
Open `index.html`. It boots a **fully live prototype**:
- **승인 대기 큐** on the dashboard — approve/reject pending tenants & operators; each action mutates state, writes an audit entry, and fires a toast.
- **DEMO 역할 switcher** (top bar) — flip between OWNER / MANAGER / MEMBER and watch gated actions disable with a lock + tooltip (e.g. only OWNER can change roles; 운영자 관리 locks for MEMBER).
- Click a tenant row → detail; suspend/resume; browse the audit log.

## Screens
`대시보드` · `테넌트 관리` (+ 상세) · `운영자 관리` · `감사 로그` · `설정·프로필` · `로그인`.

## Files
| File | What's inside |
|------|---------------|
| `console-system.jsx` | Shared console design system (tokens, Icon, Badge, Btn, Avatar, BlomMark). |
| `core.jsx` | `AdminProvider` — live state, routing, **permission matrix** (`ADMIN_PERMS`), mutations (approve/reject/suspend/resume/role), `Tip` tooltip, `AdminToast`. |
| `shell.jsx` | `AdminShell`, `AdminSidebar` (with pending badges + locked items), `AdminTopbar` (role switcher), `DataTable`, `Stat`, status/role badges, `SoftBtn` (gated action button). |
| `data.jsx` | Tenants, operators, audit log, platform metrics. |
| `screen-dashboard.jsx` | `DashboardScreen` — approval queue, metrics, recent audit. |
| `screen-tenants.jsx` | `TenantsScreen`, `TenantDetailScreen`. |
| `screen-operators.jsx` | `OperatorsScreen` — approve + role-change menu. |
| `screen-audit.jsx` | `AuditScreen`. |
| `screen-settings.jsx` | `SettingsScreen`. |
| `screen-login.jsx` | `LoginScreen`. |
| `app.jsx` | `OperatorConsoleApp` — `AdminProvider` + route switch. |

## Reuse
Load order matters (see `index.html`). Render `<OperatorConsoleApp />` for the full loop, or read `core.jsx` to lift the permission model. Permissions live in `ADMIN_PERMS`; gated buttons use `<SoftBtn disabled={!app.can('approveTenant')} tip={...}>`.

## Notes
- Desktop layout (~1240px+). Fonts: Inter + Pretendard (CDN). Icons: inline-SVG Lucide-style set.
- The **permission-aware disabled state** (lock + tooltip rather than hiding) is a deliberate pattern — keep it when extending.
