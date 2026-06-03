# blommunity — 유저 커뮤니티 UI Kit (User Community)

A high-fidelity recreation of the **end-user community site** that runs on top of blommunity — the surface real members see and post in. The sample tenant is **북클럽** ("Book Club"), a reading community.

This is the **re-skinnable** surface. It uses the `--cm-*` warm-paper token family with a **single swappable `--accent`** so every tenant can wear its own color while keeping the same structure, type, and spacing.

## Run it
Open `index.html`. It boots an interactive prototype — browse the home hero, open a board, read a post, like it, leave a comment, write a post, sign in/up, view a profile. A theme toggle (sun/moon) in the header flips light ↔ dark.

## Files
| File | What's inside |
|------|---------------|
| `core.jsx` | Tokens (`#cm-tokens` style), `Icon`, `Avatar`, `Btn`, `Tag`, `Stat`, `Header`, `Footer`, `Page`, `CmMark` brand mark, app context (`useCm`). |
| `data.jsx` | Sample content — posts, popular list, boards, comments, profile posts. |
| `screens-main.jsx` | `HomeScreen`, `BoardListScreen`, `PostDetailScreen` (+ `PostRow`, `Comment`, `Pagination`, side cards). |
| `screens-forms.jsx` | `ComposeScreen`, `AuthScreen` (login/signup), `ProfileScreen`. |
| `app.jsx` | `CommunityApp` — wires routing, theme, likes, comments, auth, toasts. |

## How to reuse a component
Load order matters (each file hangs exports on `window`): `core → data → screens-main → screens-forms → app`. Then render any screen directly, or `<CommunityApp />` for the full prototype.

```jsx
// Static single screen (no interactivity):
<window.CmPage theme="light"><window.HomeScreen /></window.CmPage>
// Just primitives:
<window.CmBtn variant="primary" icon="pencil">글쓰기</window.CmBtn>
```

## Re-skinning for a different tenant
Override four variables on `.cm-page` — that's the whole theming contract:

```css
.cm-page { --accent:#0d9488; --accent-press:#0b7c70; --accent-weak:#e3f6f3; --accent-text:#0f766e; }
```

## Notes
- **Fonts:** Inter (Latin) + Pretendard (Korean), loaded from CDN. No binaries ship in the source repo.
- **Icons:** custom inline-SVG set in `core.jsx`, drawn to match **Lucide** geometry (1.7px stroke, round caps).
- **Copy is Korean**, warm and informal (존댓말 ~해요체). See the root `README.md` → CONTENT FUNDAMENTALS.
- The `로고 자리` ("logo slot") dashed chip in the header is intentional in the source — it marks where a tenant drops their own logo.
