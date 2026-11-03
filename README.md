# DemoQA Book Store — BDD Automation Suite

End-to-end BDD suite for https://demoqa.com/books built with
**Playwright + TypeScript + playwright-bdd**, applying Page Object Model,
environment-based configuration, API-backed test-data provisioning, and
zero fixed sleeps (auto-waiting everywhere).

## Requirements covered

| # | Requirement | Where |
|---|---|---|
| 1 | Successful login (valid pre-created user) | `features/login.feature` — provisioned per run via `AccountApi` |
| 2 | Failed login (invalid credentials + error message) | `features/login.feature` (Scenario Outline) |
| 3 | Search with existing keyword | `features/search.feature` |
| 4 | Search with non-existing keyword (empty state) | `features/search.feature` |
| 5 | Feasibility study for "New User" | `docs/new-user-feasibility.md` |

## Setup

```bash
git clone <repo-url> && cd demoqa-books-bdd
npm ci
npx playwright install
cp .env.example .env
```

## Run

```bash
npm test            # headless, full suite (bddgen runs first via pretest)
npm run test:headed # headed mode
npm run test:smoke  # @smoke-tagged scenarios only
npm run report      # open HTML execution report
```

## Project structure

```
├── features/            # Gherkin scenarios (single source of behavior)
├── steps/               # Step definitions + hooks (thin, delegating to POs)
├── pages/               # Page Objects: LoginPage, BookStorePage
├── api/                 # AccountApi: test-data setup/teardown via REST
├── fixtures/            # Playwright fixtures: POs, self-cleaning test user, ad-blocking
├── config/              # Environment configuration (env-driven)
├── docs/                # New User feasibility study
├── reports/html/        # Generated HTML execution report (evidence)
└── test-results/        # Traces / videos / screenshots on failure
```

## Design decisions

- **No fixed sleeps**: synchronization relies exclusively on Playwright
  auto-waiting and `expect` assertions (web-first). Requirement satisfied by
  design, not by discipline.
- **Ad blocking at network level** (`fixtures.ts` page fixture): DemoQA
  injects Google Ads iframes that overlay the UI; aborting those requests
  is more reliable than closing iframes.
- **Test data via API, tests via UI**: each run creates its own unique user
  and deletes it afterwards (`testUser` fixture) — no shared state, no
  residue, no dependence on manually seeded accounts.
- **Evidence**: HTML report with per-scenario final-state screenshots (pass),
  plus trace + video + screenshot on failure.
- **BDD runner**: `playwright-bdd` compiles Gherkin into native Playwright
  specs, keeping the full reporter/trace ecosystem.
- **Feasibility — New User**: full E2E registration is **excluded**
  (production reCAPTCHA cannot be legitimately bypassed); form validations
  are automatable. See `docs/new-user-feasibility.md`.

## Configuration

Copy `.env.example` → `.env`. `ENV=prod` selects the environment defined in
`config/environments.ts`. `TEST_PASSWORD` must satisfy DemoQA's policy
(8+ chars, upper, lower, digit, special char, no spaces).

## Notes / known caveats

- **Verify search keywords against the live catalog before running**: the
  DemoQA default catalog (to our knowledge) contains no ISTQB title, so
  `"ISTQB Fundamentals"` is used as the *non-existing* keyword and `"Git"`
  as the existing one. Adjust in `features/search.feature` if needed.
- DemoQA is a shared public environment: occasional 5xx or account-service
  hiccups can occur. Retries are configured (1 locally, 2 in CI) and any
  residual flake should be investigated via the attached trace, not with
  sleeps.