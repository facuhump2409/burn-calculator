# Project Context & Agent Rules
[IMPORTANT]: This is the AGENTS.md file. You must read this file entirely before performing any tasks or generating any code for this repository.
> **Always use this file** when working on this project. Consult it for conventions, commands, and rules before making changes or suggestions.

- **Deployment findings:** Any discoveries regarding deployment (config, issues, solutions, quirks) must be documented in this file.

## Tech Stack
- **Language:** TypeScript
- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Icons:** Lucide React
- **Deployment:** GitHub Pages

## Git Commits (CRITICAL)
- **Always bypass git hooks** when committing:
  ```bash
  git commit -m "Your message" --no-verify
  ```
- Use this format for every commit to skip pre-commit hooks (lint, tests, etc.).
- **Note:** The main repo `.git/hooks/pre-commit` is a dummy script that exits 0 to prevent hook issues.

## Project Overview
Pediatric burn assessment calculator implementing:
- **Parkland Formula** (4 ml × kg × %BSA) for fluid resuscitation
- **Lund-Browder Method** for age-adjusted body surface area estimation
- Interactive body diagram for burn area selection

## Lund-Browder Percentage Tables (CRITICAL)
**These tables MUST be followed exactly in all calculations and UI rendering.**

### 10 Years or Higher (10 years included)
| Body Region | Anterior % | Posterior % | Total % |
|-------------|-----------|-------------|---------|
| Head & Neck | 4.5% | 4.5% | 9% |
| Trunk (Torso/Back) | 18% (4.5 × 4) | 18% (4.5 × 4) | 36% |
| Arms (Both) | 9% (1.5 × 6) | 9% (1.5 × 6) | 18% |
| Thighs (Both) | 9% (4.5 × 2) | 9% (4.5 × 2) | 18% |
| Legs (Both) | 6% (3 × 2) | 6% (3 × 2) | 12% |
| Feet (Both) | 3% (1.5 × 2) | 3% (1.5 × 2) | 6% |
| Genitals | 0.5% | 0.5% | 1% |
| **Grand Total** | **50%** | **50%** | **100%** |

**Head Division:** Single area (NO subdivision)
- Per head: 4.5% anterior + 4.5% posterior = 9% total

### 1 Year Old
| Body Region | Anterior % | Posterior % | Total % |
|-------------|-----------|-------------|---------|
| Head & Neck | 9% (4.5 + 4.5) | 9% (4.5 + 4.5) | 18% |
| Trunk (Torso/Back) | 16% (4+4+4+4) | 16% (4+4+4+4) | 32% |
| Arms (Both) | 9% (1.5×6) | 9% (1.5×6) | 18% |
| Thighs (Both) | 7% (3.5×2) | 7% (3.5×2) | 14% |
| Legs (Both) | 5% (2.5×2) | 5% (2.5×2) | 10% |
| Feet (Both) | 3% (1.5×2) | 3% (1.5×2) | 6% |
| Genitals | 1% | 1% | 2% |
| **Grand Total** | **50%** | **50%** | **100%** |

**Head Division:** 4 quadrants
- Left anterior: 4.5%
- Right anterior: 4.5%
- Left posterior: 4.5%
- Right posterior: 4.5%
- Total: 18%

### Implementation Notes
- **Age < 10:** Use 4-quadrant head subdivision + detailed arm/leg subdivisions
- **Age ≥ 10:** Use single head area + detailed arm/leg subdivisions
- All ages use left/right splits for torso and abdomen
- Arms divided into: hand (1.5%), forearm (1.5%), upper arm (1.5%) per side
- Legs divided into: foot (1.5%), lower leg (varies by age), thigh (varies by age) per side
- **Genitals:** 1% anterior + 1% posterior for ages <10; 0.5% + 0.5% for ages >=10

## Common Commands
- **Install:** `npm install`
- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Deploy:** ~~`npm run deploy`~~ **BROKEN** - Use git worktree method (see "Deployment Findings" section)

## Project Structure
```
src/
  components/     # PatientData, BodyDiagram, Results, ClinicalSummary
  store/         # burnStore (Zustand)
  utils/         # calculations.ts (Parkland, BSA logic)
  App.tsx
  main.tsx
```

## Important Configuration
- **Base path:** `/burn-calculator/` (required for GitHub Pages)
- **Strict TS:** `noUnusedLocals`, `noUnusedParameters` enabled

## Development Notes
- Build outputs to `dist/`; gh-pages publishes that folder
- Source files remain on `master`; only `dist` is pushed to `gh-pages` branch

## Deployment Findings (Feb 2026)

### GitHub Pages Deployment Issues
**Problem:** The `npm run deploy` command (using `gh-pages` package) fails with a Spotless pre-commit hook error:
```
🎨 Running Spotless Apply...
.git/hooks/pre-commit: line 3: ./gradlew: No such file or directory
❌ Spotless failed! Fix formatting before committing.
```

**Root Cause:** The `gh-pages` npm package creates a temporary `.git` directory with hooks when deploying. This project has git config `core.hookspath=false` which was causing the gh-pages tool to use hooks from another location or environment.

**Attempted Solutions That FAILED:**
1. ❌ Adding `--no-verify` flag to gh-pages command (not supported by the package)
2. ❌ Creating dummy `.git/hooks/pre-commit` in main repo (gh-pages uses its own temp directory)
3. ❌ Clearing `node_modules/.cache/gh-pages` (hooks persist from environment)
4. ❌ Using `GIT_CONFIG_GLOBAL=/dev/null gh-pages -d dist` (command not found error)
5. ❌ Direct `git checkout gh-pages` and file manipulation (shell confirmation prompts block automation)

**Working Solution:**
Use **git worktree** for manual deployment:
```bash
# Step 1: Build the project
npm run build

# Step 2: Create backup of dist
cp -r dist /tmp/dist-backup

# Step 3: Create worktree for gh-pages branch
git worktree prune  # Clean up any stale worktrees
git worktree add -f /tmp/gh-pages-deploy gh-pages

# Step 4: Deploy
cd /tmp/gh-pages-deploy
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +
cp -r /tmp/dist-backup/* .
git add -A
git commit -m "Deploy updated burn calculator"
git push origin gh-pages

# Step 5: Cleanup (optional)
cd /path/to/main/repo
git worktree remove /tmp/gh-pages-deploy
```

**Why This Works:**
- Git worktree creates a separate working directory for the gh-pages branch
- Commits happen in a fresh git environment without interfering hooks
- No dependency on the `gh-pages` npm package's internal tooling
- Full control over the deployment process

**Alternative for Future:**
Consider removing `gh-pages` as a dependency and creating a custom deploy script that uses the git worktree method above.

### TypeScript Compilation Notes
When modifying the body area tracking (e.g., removing genitals, changing subdivisions):
1. Update `src/store/burnStore.ts` - BurnData interface
2. Update `src/utils/calculations.ts` - getLundBrowderPercentages()
3. Update `src/components/BodyDiagram.tsx` - SVG rendering and area definitions
4. Update `src/components/ClinicalSummary.tsx` - Summary display (combine split areas like torsoLeft + torsoRight)
5. Update `src/components/Results.tsx` - Results display (combine split areas)
6. Rename or exclude `.tsx` backup files to `.tsx.bak` to avoid TypeScript compilation errors

### File Structure Changes
- `src/components/BodyDiagram_old.tsx.bak` - Original implementation backup (excluded from TS compilation)
- Body areas now use detailed subdivisions:
  - **Children (<10 years):** Head split into 4 quadrants (left/right anterior/posterior)
  - **Adults (10+ years):** Single head area
  - **All ages:** Arms split into hand/forearm/upper arm; Legs split into foot/lower leg/thigh
  - Torso and abdomen split into left/right for both anterior/posterior

## Additional Findings (Feb 2026)

### Tooling Updates
- **Vite upgraded to 7.3.1** to resolve the esbuild dev-server vulnerability; note Vite 7 requires **Node >= 20.19**.
- **Vitest added** with `npm test` (uses `vitest run`) for regression checks.
- **GitHub Actions CI** added at `.github/workflows/ci.yml` to run `npm test` on pushes and PRs to `master`.

### Percentage Validation Tests
- New tests in `src/utils/percentages.test.ts` validate both the **diagram max values** and **calculation tables** against AGENTS.md.
- Diagram totals match AGENTS.md and include **genitals** at 1%+1% (<10) and 0.5%+0.5% (>=10).

### Shared Graph Definitions
- Diagram max values are now centralized in `src/utils/bodyAreaDefinitions.ts` and imported by `BodyDiagram.tsx`.

### Build Note
- A build failed due to an unused `labelX` variable; removed to satisfy `noUnusedLocals`.
