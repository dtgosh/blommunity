# blommunity — 테넌트 콘솔 UI Kit (Tenant Console)

A high-fidelity recreation of the **tenant console** — the dashboard a community owner/manager uses to run *their* site on blommunity. Sample tenant: **북클럽**.

Built on the `--bl-*` **console token family** (cool neutral grays, dense SaaS) with **light + dark** modes.

## Run it
Open `index.html`. The sidebar routes between every screen; a sun/moon toggle in the top bar flips the theme. Creating a space, board, or member invite opens a real modal; actions fire toasts.

## Screens
`대시보드` (dashboard with metrics + activity + top boards) · `공간 관리` (spaces master/detail with tabs) · `게시판 관리` · `회원 관리` (filter + search) · `신고·모더레이션` · `사이트 설정` · `내 프로필`.

## Files
| File | What's inside |
|------|---------------|
| `console-system.jsx` | **The console design system.** `#bl-tokens` style block (light + `.dark`), `Icon` (Lucide-style set), `Badge`, `Btn`, `Avatar`, `AvatarGroup`, `Sidebar`, `Topbar`, `Shell`, `BlomMark`. |
| `tenant-ui.jsx` | Prototype primitives: `TCard`, `TField`, `TInput`, `TTextarea`, `TSeg`, `TToggle`, `TModal` + `ModalHost` (create space / board / invite) + `ToastHost`. |
| `data.jsx` | Sample boards, members, reports. |
| `screen-dashboard.jsx` | `Dashboard` — metric cards, activity feed, top-5 boards. |
| `screen-spaces.jsx` | `SpaceMgmt` — master/detail with 개요/게시판/멤버/초대/설정 tabs. |
| `screens.jsx` | `BoardsScreen`, `MembersScreen`, `ModerationScreen`, `SettingsScreen`, `ProfileScreen`. |
| `app.jsx` | `TenantConsoleApp` — wires nav routing, theme, modal host, toasts. |

## Reuse
Load order: `console-system → tenant-ui → data → screen-dashboard → screen-spaces → screens → app`. Then render `<TenantConsoleApp />`, or compose primitives directly inside a `.bl` (add `.dark` for dark mode):

```jsx
<div className="bl"><window.Btn variant="primary" icon="plus">새 공간</window.Btn></div>
```

## Notes
- The console is a **desktop layout** (sidebar + content, designed ~1240px+). At narrow preview widths some columns wrap — that's expected; give it room.
- Fonts: Inter + Pretendard (CDN). Icons: inline-SVG Lucide-style set in `console-system.jsx`.
- This is the **same token family** the Operator Console uses — see `../operator/`.
