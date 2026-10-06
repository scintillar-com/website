# scintillar.com

The website for [Scintillar](https://scintillar.com), a digital playground of free, open-source, white-label tools you host yourself. The site lists the tools, gives each one its own page, and explains what Scintillar is and isn't. It's available in English and French.

## Run it locally

You need Node 22 or later and pnpm 10.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Before opening a pull request, run the same checks the deploy runs:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

No environment variables are required for local work. These are optional:

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID. Analytics load only in production builds, and only after the visitor accepts the consent notice. |
| `GITHUB_TOKEN` | Raises the GitHub API limit used for the activity graphs and contributor lists on tool pages. A token with no scopes is enough. Without it, those sections may show "not available" when the limit is hit. |

## Where things live

| Path | Contents |
| --- | --- |
| `src/content/projects.ts` | Every tool on the site: name, pitch, description, status, category, tags, license, links, features, install commands. Add or edit a tool here. |
| `src/i18n/dictionaries.ts` | Interface text in English and French. |
| `src/app/[locale]/` | Pages: home, `tools`, `tools/[slug]`, `about` and `legal/privacy`. The About and privacy pages keep their own copy in the page file. |
| `src/components/projects/` | Tool cards, cover mockups, the Browse and Filter views, and the activity graph. |
| `src/components/site/` | Navbar, mobile menu, footer, logo, theme and language switches, consent notice. |
| `src/components/ui/` | Components installed from [Scintillar UI](https://ui.sntlr.app). |
| `src/lib/github.ts` | GitHub API calls for activity and contributors, cached for a day. |
| `src/proxy.ts` | Sends visitors to `/en` or `/fr` based on their language cookie or browser settings. |
| `public/brand/` | Scintillar logos, standalone and horizontal, in light, dark, black and white. |

### Adding a tool

1. Add an entry to `projects` in `src/content/projects.ts`, in both languages.
2. Pick a `cover` mockup from `src/components/projects/project-cover.tsx`, or add a new one there.
3. Set `github` once the repository is public. Until then, set `repoPrivate: true` so the page says "Repo coming soon".

Write tool copy like a product description: say what people get and why it helps, not what it's built with. Install commands are fine.

### Adding a component

Components come from Scintillar UI through the shadcn CLI:

```bash
npx shadcn@latest add @sntlr/<name>
```

The CLI currently places files in `src/components/` and skips their dependencies. Move the file to `src/components/ui/` and install any missing packages (usually `radix-ui`).

## Deploying

The site deploys to Vercel through `.github/workflows/deploy.yml`. Vercel's Git integration isn't used.

| Event | Result |
| --- | --- |
| Pull request | Preview deployment. The URL appears in the workflow run's summary. |
| Release published | Production deployment. |
| Manual run (Actions, Deploy, Run workflow) | Production deployment. |

Merging into `main` doesn't deploy. To ship, publish a release (for example `v2.1.0`) or run the workflow by hand.

The workflow needs three repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`. Environment variables for the site itself are set in the Vercel project and pulled at build time.

## Stack

Next.js 16 (App Router, mostly static pages), React 19, Tailwind CSS 4 and TypeScript. TypeScript is pinned to 6 and ESLint to 9 until typescript-eslint and eslint-plugin-react support newer versions.
