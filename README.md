# Tala Prototypes

A shared home for clickable mobile prototypes, so a flow can be built and shared without starting in Figma.

- **Desktop:** the prototype list is on the left, the phone sits on a dot-field stage in the middle, and notes for the current screen (assumptions, open questions, design inputs) are on the right.
- **Mobile:** the prototype runs full screen. Tap the tab on the right edge to switch screens or read notes.

Every screen has its own URL (`#/mx-auto-debit/consent`), so you can link people straight to it.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173 (also on your network, so you can open it on a phone)
npm run build    # outputs dist/
```

## Prototypes

| Prototype | Folder | What's in it |
|---|---|---|
| 🇲🇽 MX Auto-Debit | `src/prototypes/mx-auto-debit` | 4 entry points + a post-payment exploration, consent and registration (including penny-drop failure), debit lifecycle states, payment history, auto-pay management, and all push notifications |

## Project layout

```
src/
  ds/            Tala design system: tokens live in index.css, plus components, icons and placeholder illustrations
  shell/         Hub chrome: sidebar, phone device, dot field, notes panel, mobile menu
  prototypes/
    registry.ts  List of prototypes shown in the sidebar
    types.ts     Prototype, Section, ScreenDef, ScreenNotes
    <id>/
      index.ts   Sections, screen metadata and per-screen notes
      data.ts    Simulated customer and loan data
      screens/   Screen components
```

## Adding a prototype

1. Create `src/prototypes/<id>/` with an `index.ts` that exports a `Prototype`.
2. Group screens into `sections`. Use `kind: 'entry'` for entry points and `kind: 'notifications'` for pushes; these get their own markers in the sidebar.
3. Each screen is a component that receives `{ go, back, state, setState }`. Use `go('screen-id')` to move forward, and `go(id, { replace: true })` for auto-advancing states.
4. Add notes to a screen whenever they're useful. The notes panel shows whichever of these groups are filled in:
   ```ts
   notes: { assumptions: [...], openQuestions: [...], designInputs: [...] }
   ```
5. Register the prototype in `src/prototypes/registry.ts`.

## Design system

Tokens and type come from the Tala design system skill and are defined in `src/index.css`:

- colours: `bg-orange-50`, `text-dark-green-70`, …
- type: `type-header-1`, `type-body-1`, …
- radius: `rounded-md`
- elevation: `shadow-surface-1`

Components live in `src/ds/`. Use tokens rather than hardcoded values. When the web design system package is ready, swap it in behind `src/ds/`; screens shouldn't need to change.

## Deploying to GitHub Pages

The build uses `base: './'` and hash routing, so it works from any Pages sub-path.

1. Push to a GitHub repo on `main`.
2. In the repo, go to **Settings → Pages → Source** and choose **GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

> `docs/` (PRDs and call transcripts) is git-ignored on purpose. Pages sites are public, so review the notes content before pushing.
