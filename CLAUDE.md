# CLAUDE.md - Website Functionality Testing Project

## Project Overview
Automated website functionality testing using Playwright, running on a schedule via GitHub Actions. Tests verify critical user flows and features in production and staging environments.

## Setup & Dependencies
- **Node.js**: 18+ required for Playwright
- **Playwright**: Latest stable version, installed via `npm install`
- **MCP Tools**: GitHub Actions runner must have MCPs installed before test execution
- **Environment**: Tests run in isolated GitHub Actions containers

### Initial Setup
```bash
npm install
npm run build  # If applicable
```

## Code Style & Conventions
- Use ES modules (import/export) syntax throughout
- Test files follow naming pattern: `*.test.ts` or `*.spec.ts`
- Page objects/helpers: `*-page.ts` or `*-helpers.ts`
- Configuration files: `playwright.config.ts` at project root
- Use TypeScript for test code when possible

## Testing
### Running Tests Locally
```bash
npm run test              # Run all tests
npm run test -- --ui      # Run with Playwright Inspector UI
npm run test -- --debug   # Debug mode
npm run test -- -g "pattern"  # Run specific test by name
```

### Test Structure
- Use `test.describe()` for grouping related tests
- One test per user flow or feature
- Include explicit waits for dynamic content
- Avoid hard-coded timeouts; use Playwright's built-in waits
- Tests must be idempotent (no state dependencies between tests)

### Verification & Success Criteria
- All tests must pass before considering work complete
- Tests verify both happy paths AND failure states
- Check return codes: `0 = pass`, non-zero = fail
- GitHub Actions will block merges if tests fail
- Use `expect()` assertions with descriptive messages

## GitHub Actions Workflow
Tests trigger on schedule (cron) and on push to main/staging branches. Workflow file location: `.github/workflows/test.yml`. Each run spins up a fresh container with MCP dependencies pre-installed. Logs available in Actions tab; review failed test output immediately.

### Core Workflow Steps
Your GitHub Actions workflow must execute these essential steps in order:

1. **Checkout Code**: Use `actions/checkout` to pull your repository onto the runner
2. **Setup Environment**: Install Node.js 18+ runtime and project dependencies via `npm install`
3. **Install Playwright Browsers**: Run `npx playwright install --with-deps` to install browser binaries and system dependencies
4. **Execute Tests**: Run your test suite via `npm run test` or similar command
5. **Upload Artifacts**: Save generated HTML reports, traces, or screenshots to GitHub Actions artifacts for post-run viewing

### Implementation Options
- **Direct Runner**: Run directly on GitHub-hosted runners (e.g., `ubuntu-latest`) for standard testing
- **Containerized**: Use official Playwright Docker images (e.g., `mcr.microsoft.com/playwright:v1.x-focal`) to ensure consistent environment for visual regression testing
- **Sharding**: For large test suites, use the `--shard` flag to split tests across multiple parallel jobs and reduce total execution time

### MCP Installation in CI
MCPs must be available before tests run. Update `.github/workflows/test.yml` if adding new MCP dependencies. If a test references an MCP tool and it's not installed, the run will fail.

### GitHub Actions Best Practices
- **Avoid Deprecated Actions**: Do not use `microsoft/playwright-github-action`. Instead, use the Playwright CLI directly in your workflow steps (`npx playwright install`, `npm run test`) for better version control and stability
- **Secure Credentials**: Store sensitive data (API keys, login credentials, URLs) in GitHub Secrets, never hardcode them in your repository
- **Localhost Testing**: If testing a local server before deployment, use Playwright's `webServer` option in `playwright.config.ts` to automatically start and stop your application during the CI run

## Playwright-Specific Gotchas
- **Network isolation**: GitHub Actions containers may have limited external access; configure proxies if needed
- **Headless mode**: Always runs headless in CI; use `--ui` flag locally for visual debugging
- **Screenshot/trace failures**: Store in `./test-results/` directory; GitHub Actions will fail if tests crash
- **Timeouts**: Default is 30s; increase for slow environments with `timeout: 60000` in test config
- **Element stability**: Wait for elements to be stable before interaction; don't rely on fixed waits

## Scheduled Testing
- Cron schedule defined in workflow trigger
- Runs independently of code changes
- Use descriptive commit messages for scheduled runs if storing results
- Monitor run times; alert if execution takes significantly longer than expected
- Failed scheduled runs should trigger notifications (configure in Actions settings)

## Common Commands
```bash
npm run test              # Full test suite
npm run test:watch       # Watch mode for local development
npm run lint             # Check code style
npm run type-check       # TypeScript validation
npm test -- --reporter=json  # Machine-readable output for CI
```

## Repository Etiquette
- Push test changes to feature branches; use PRs before merging to main
- Include test updates when modifying pages or features under test
- Update `.github/workflows/test.yml` if adding MCP dependencies
- Keep sensitive credentials in GitHub Secrets, never in code
- Document new test suites in a `TEST_GUIDE.md` at project root if complex

## Architectural Decisions
- **Page Object Model**: Tests use page objects to encapsulate selectors and interactions
- **Staging-first**: Test against staging before main branch to catch issues early
- **Parallel execution**: Tests may run in parallel; ensure no cross-test dependencies
- **Secrets management**: Use GitHub Secrets for URLs, credentials, API keys

## Environment Variables
- `PLAYWRIGHT_HEADLESS`: Defaults to `true` in CI
- `TESTS_TIMEOUT`: Global timeout override (milliseconds)
- `STAGING_URL`: Target staging environment (set in GitHub Secrets)
- `PROD_URL`: Target production environment (set in GitHub Secrets)
- Any MCP-specific vars: Document in `.env.example`

## Debugging Failed Tests
1. Check GitHub Actions logs first
2. If local reproduction needed: `npm run test -- --debug -g "test-name"`
3. Use `page.screenshot()` before assertions to see state
4. Enable trace recording: `npx playwright show-trace trace.zip` after failure
5. Review Playwright Inspector output for element selectors

## Important: Context Management
- Keep this file short; remove sections that Claude can infer from code
- Add new rules only when they prevent real mistakes
- Link to external docs rather than including full tutorials
- Review CLAUDE.md after Claude makes repeated mistakes to identify missing rules
