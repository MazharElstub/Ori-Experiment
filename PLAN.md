# ORI - Ethical Spending Impact Tracker: Implementation Plan

## Vision

ORI helps users understand what their money supports. When you bank with Barclays or shop at Tesco, what are those companies' interests? Are they environmentally friendly? Do they invest in weapons? Are they donating to political parties? Are they fair employers?

The app scores companies across ethical dimensions ("levers"), lets users set their personal priorities, input their spending, and receive a personalised impact score with actionable suggestions.

---

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + Vite + React Router 6
- **Styling**: Tailwind CSS (replacing all inline styles)
- **Icons**: Lucide React (clean, modern icon set)
- **Charts**: Recharts (radar charts, bar charts for score visualisation)
- **Backend**: Supabase (auth, database, RLS)
- **Hosting**: Netlify
- **Focus**: Web only (mobile-first responsive, ignoring React Native app)

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Lever** | An ethical dimension (e.g., Environmental Sustainability, Warfare) |
| **Factor** | A specific data point that contributes to a lever score (e.g., "Carbon reduction target") |
| **Company** | A UK company with scores against each lever |
| **Sector** | A group of comparable companies (e.g., Supermarkets, Banks) |
| **User Preference** | How much a user cares about each lever (1-5 importance) |
| **User Spending** | Where the user spends money and how much monthly |
| **Impact Score** | Personalised score combining spending × company scores × user weights |

---

## Database Schema (Supabase)

### Tables

```sql
-- Ethical dimensions that companies are scored against
CREATE TABLE levers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "Environmental Sustainability"
  slug TEXT NOT NULL UNIQUE,             -- "environmental-sustainability"
  description TEXT NOT NULL,             -- Explanation of what this lever measures
  icon TEXT NOT NULL,                    -- Lucide icon name, e.g. "leaf"
  colour TEXT NOT NULL,                  -- Hex colour for UI, e.g. "#22C55E"
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Industry sectors for grouping companies
CREATE TABLE sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "Supermarkets"
  slug TEXT NOT NULL UNIQUE,             -- "supermarkets"
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Companies being tracked
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "Tesco"
  slug TEXT NOT NULL UNIQUE,             -- "tesco"
  sector_id UUID NOT NULL REFERENCES sectors(id),
  logo_url TEXT,                         -- URL to company logo
  description TEXT NOT NULL,             -- Brief company description
  website TEXT,                          -- Company website URL
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Overall score for each company against each lever (0-100)
CREATE TABLE company_lever_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  lever_id UUID NOT NULL REFERENCES levers(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  summary TEXT NOT NULL,                 -- "Tesco has strong carbon reduction targets but..."
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, lever_id)
);

-- Individual factors that contribute to lever scores
CREATE TABLE scoring_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lever_id UUID NOT NULL REFERENCES levers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                    -- "Carbon emissions reduction target"
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Score for each company against each factor (0-100)
CREATE TABLE company_factor_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  factor_id UUID NOT NULL REFERENCES scoring_factors(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  evidence TEXT,                         -- Source/justification for the score
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, factor_id)
);

-- Extended user profile (beyond Supabase auth)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- How much a user cares about each lever
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lever_id UUID NOT NULL REFERENCES levers(id) ON DELETE CASCADE,
  importance INTEGER NOT NULL CHECK (importance >= 1 AND importance <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lever_id)
);

-- User's monthly spending at companies
CREATE TABLE user_spending (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  monthly_amount NUMERIC(10,2) NOT NULL CHECK (monthly_amount > 0),
  source TEXT NOT NULL DEFAULT 'manual', -- 'manual' or 'banking' (future)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, company_id, source)
);
```

### Row Level Security (RLS)

```sql
-- Company/lever/sector data: readable by all authenticated users
-- levers, sectors, companies, company_lever_scores, scoring_factors, company_factor_scores
-- → SELECT for authenticated users

-- User-owned data: users can only read/write their own rows
-- user_profiles, user_preferences, user_spending
-- → SELECT/INSERT/UPDATE/DELETE WHERE user_id = auth.uid()
```

### Database Trigger

```sql
-- Auto-create user_profiles row on signup
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## Scoring Algorithm

### Company Lever Score
Each company's lever score (0-100) is the average of its factor scores for that lever. This is pre-computed and stored in `company_lever_scores`.

### User's Lever Score (personalised)
Weighted average of company scores for that lever, weighted by spending proportion:

```
user_lever_score = Σ(spending_proportion_i × company_lever_score_i)
where spending_proportion_i = monthly_amount_i / total_monthly_spending
```

### User's Overall Score (personalised)
Weighted average of user lever scores, weighted by user preference importance:

```
overall_score = Σ(user_lever_score_j × importance_j) / Σ(importance_j)
```

### Score Interpretation
- **80-100**: Excellent alignment with your values
- **60-79**: Good, with room for improvement
- **40-59**: Mixed — some areas need attention
- **20-39**: Poor alignment — consider alternatives
- **0-19**: Significant conflict with your values

---

## Navigation Structure

After login, the app uses a **bottom tab navigation** (mobile pattern):

| Tab | Icon | Route | Purpose |
|-----|------|-------|---------|
| Dashboard | `layout-dashboard` | `/dashboard` | Overall score, insights, suggestions |
| Explore | `search` | `/explore` | Search companies, browse sectors |
| My Spending | `wallet` | `/spending` | Add/manage spending, see breakdown |
| Settings | `settings` | `/settings` | Preferences, account, about |

---

## Project Structure

```
web/src/
├── components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── ScoreBadge.jsx     # Colour-coded score display
│   │   ├── ScoreBar.jsx       # Horizontal score bar
│   │   ├── RadarChart.jsx     # Lever scores radar chart
│   │   └── TabBar.jsx         # Bottom navigation
│   ├── company/               # Company-related components
│   │   ├── CompanyCard.jsx    # Company search result card
│   │   ├── CompanyProfile.jsx # Full company profile
│   │   ├── LeverScoreRow.jsx  # Single lever score display
│   │   └── AlternativeCard.jsx# Suggested alternative company
│   ├── spending/              # Spending-related components
│   │   ├── SpendingRow.jsx    # Single spending entry
│   │   └── AddSpendingModal.jsx
│   ├── dashboard/             # Dashboard widgets
│   │   ├── OverallScore.jsx
│   │   ├── LeverBreakdown.jsx
│   │   └── Suggestions.jsx
│   └── layout/
│       ├── AppShell.jsx       # Main app wrapper with tab bar
│       └── PageHeader.jsx     # Consistent page header
├── screens/
│   ├── LandingScreen.jsx      # Reworked for ethical spending messaging
│   ├── LoginScreen.jsx        # Reworked with Tailwind
│   ├── SignUpScreen.jsx        # Reworked with Tailwind
│   ├── OnboardingScreen.jsx   # Post-signup lever preference selection
│   ├── DashboardScreen.jsx    # Main dashboard
│   ├── ExploreScreen.jsx      # Company search + sector browse
│   ├── CompanyScreen.jsx      # Individual company profile
│   ├── SpendingScreen.jsx     # Manage spending entries
│   └── SettingsScreen.jsx     # Settings + preferences
├── context/
│   ├── AuthContext.jsx        # Existing (minor updates)
│   └── PreferencesContext.jsx # User lever preferences
├── services/
│   ├── companies.js           # Supabase queries for companies
│   ├── levers.js              # Supabase queries for levers
│   ├── spending.js            # Supabase queries for user spending
│   ├── preferences.js         # Supabase queries for user preferences
│   └── scoring.js             # Score calculation logic
├── lib/
│   └── supabase.js            # Existing
├── hooks/
│   ├── useCompanies.js        # Data fetching hook for companies
│   ├── useLevers.js           # Data fetching hook for levers
│   ├── useUserSpending.js     # Data fetching hook for spending
│   └── useScores.js           # Score calculation hook
├── App.jsx
├── main.jsx
└── index.css                  # Tailwind directives + minimal overrides
```

---

## Implementation Phases

### Phase 1: Foundation & Rework (screens: Landing, Login, Signup, App Shell)

**Goal**: Set up the styling system, database, project structure, navigation shell, and rework all existing screens.

**Steps**:
1. Install dependencies: `tailwindcss`, `@tailwindcss/vite`, `lucide-react`, `recharts`
2. Configure Tailwind (tailwind config with ORI colour tokens, mobile-first breakpoints)
3. Update `index.css` to Tailwind directives
4. Update `vite.config.js` for Tailwind plugin
5. Provide SQL for all Supabase tables + RLS policies + trigger (user runs in Supabase dashboard)
6. Create service layer files (empty shells with function signatures)
7. Build `AppShell` layout component with bottom tab bar
8. Build reusable UI components: `Button`, `Input`, `Card`, `ScoreBadge`, `PageHeader`
9. Rework `LandingScreen` — update messaging to ethical spending mission, use Tailwind
10. Rework `LoginScreen` — Tailwind, use new `Input`/`Button` components
11. Rework `SignUpScreen` — Tailwind, use new components
12. Update `App.jsx` routing to include tab-based navigation for authenticated users
13. Create placeholder screens for Dashboard, Explore, Spending, Settings
14. Update `AuthContext` to check onboarding status

**Deliverable**: App with new look, tab navigation, all auth flows working, database ready.

### Phase 2: Company Data & Exploration

**Goal**: Seed company data and build the explore/search experience.

**Steps**:
1. Create seed SQL for levers (7 initial levers with descriptions, icons, colours)
2. Create seed SQL for sectors (e.g., Supermarkets, Banks, Energy, Fashion, Tech, etc.)
3. Create seed SQL for sample companies (at least 10-15 to demonstrate, user provides full 100 later)
4. Create seed SQL for scoring_factors per lever
5. Create seed SQL for company_lever_scores and company_factor_scores
6. Build `companies.js` service (search, getBySlug, getBySector, getAlternatives)
7. Build `levers.js` service (getAll, getById)
8. Build `ExploreScreen` — search bar with live search, sector filter pills, company results
9. Build `CompanyCard` component — company name, sector, overall score summary
10. Build `CompanyScreen` — full profile with:
    - Company header (name, sector, description)
    - Lever scores as visual bars/radar chart
    - Strengths (top 2-3 levers) and weaknesses (bottom 2-3 levers)
    - Factor breakdown per lever (expandable)
    - "Better alternatives" section — higher-scoring companies in same sector
11. Build `ScoreBar` and `RadarChart` components

**Deliverable**: Users can search and browse companies, view detailed ethical profiles, see alternatives.

### Phase 3: User Preferences

**Goal**: Let users set which ethical levers matter to them and how much.

**Steps**:
1. Build `OnboardingScreen` — after first login, present all levers and ask user to rate importance (1-5 slider or star rating per lever)
2. Build `preferences.js` service (get, upsert, delete)
3. Build `PreferencesContext` — loads and caches user preferences
4. Update `App.jsx` routing to redirect new users to onboarding before dashboard
5. Add preferences section to `SettingsScreen` — edit lever importance ratings
6. Update `CompanyScreen` — highlight levers that match user's priorities, tailor "alternatives" to user's weights
7. Build `useLevers` hook that combines lever data with user preferences

**Deliverable**: Users set priorities, company profiles are personalised to those priorities.

### Phase 4: Spending Tracker

**Goal**: Let users manually input their spending and see where their money goes.

**Steps**:
1. Build `spending.js` service (getAll, add, update, delete)
2. Build `SpendingScreen`:
   - List of current spending entries (company name, amount, score preview)
   - "Add spending" button
   - Total monthly spend summary
3. Build `AddSpendingModal`:
   - Company search (reuse search from Explore)
   - Monthly amount input
   - Save to Supabase with source='manual'
4. Build `SpendingRow` component — inline edit/delete for amounts
5. Build `useUserSpending` hook
6. Add spending summary to Dashboard as preparation for Phase 5

**Deliverable**: Users can add, edit, remove spending entries. Data is stored and ready for scoring.

### Phase 5: Dashboard & Scoring Engine

**Goal**: Calculate personalised scores and present insights.

**Steps**:
1. Build `scoring.js` — implement the scoring algorithm:
   - `calculateLeverScores(spending, companyScores, levers)` → per-lever score
   - `calculateOverallScore(leverScores, preferences)` → weighted overall score
   - `generateSuggestions(spending, companyScores, preferences, sectors)` → actionable tips
2. Build `useScores` hook — combines spending data + company scores + preferences
3. Build `DashboardScreen`:
   - `OverallScore` widget — large circular score display with label
   - `LeverBreakdown` widget — score per lever as coloured bars
   - `Suggestions` widget — "Switch from X to Y to improve your environmental score by Z%"
   - Empty state for users with no spending data (prompt to add spending)
4. Build `RadarChart` for lever scores visualisation
5. Add quick-stats to spending screen (mini scores per spending entry)

**Deliverable**: Personalised ethical impact dashboard with scores, breakdown, and suggestions.

### Phase 6: Settings, Polish & Hardening

**Goal**: Complete settings, polish UI, handle edge cases.

**Steps**:
1. Build full `SettingsScreen` with sections:
   - **Profile**: Edit display name
   - **Priorities**: Edit lever importance (link to preferences editor)
   - **Account**: Change password, delete account (actual Supabase deletion)
   - **About**: App version, mission statement, data sources
   - **Log Out**
2. Add proper loading states (skeletons) for all data-fetching screens
3. Add empty states with helpful messaging (no spending yet, no preferences set)
4. Add error handling with toast/banner notifications
5. Add pull-to-refresh pattern for data screens
6. Ensure all screens work well at 320px-430px and look good on desktop too
7. Performance: memoize expensive calculations, lazy-load routes
8. Add page transitions/animations for polish
9. Test complete user journey end-to-end

**Deliverable**: Production-ready app with complete feature set.

---

## Future Considerations (Architecture Ready)

### Open Banking Integration
- `user_spending.source` field already supports `'banking'`
- Spending service can accept data from multiple sources
- No tight coupling to manual input in the scoring algorithm
- Will need: Netlify Functions (serverless) for bank API calls, token storage in Supabase

### Additional Levers
- `levers` table is fully dynamic — add new rows anytime
- `scoring_factors` extends automatically per lever
- Company scores for new levers can be added incrementally
- User preferences UI dynamically renders all available levers

### More Companies
- No hardcoded company limits
- Search is database-driven
- Seed scripts are additive (can run additional inserts)

### Admin Capabilities
- Supabase dashboard serves as admin UI for now
- Company data can be updated via direct SQL or Supabase table editor
- Future: dedicated admin panel if needed

---

## Design Language

### Colour Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0F172A` | Headings, primary text |
| Secondary | `#64748B` | Subtitles, secondary text |
| Accent | `#3B82F6` | Buttons, links, active states |
| Background | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Cards, panels |
| Border | `#E2E8F0` | Dividers, input borders |
| Success | `#22C55E` | Good scores, positive states |
| Warning | `#F59E0B` | Medium scores, caution |
| Danger | `#EF4444` | Poor scores, errors, destructive actions |

### Score Colours (gradient)
- **80-100**: `#22C55E` (green)
- **60-79**: `#84CC16` (lime)
- **40-59**: `#F59E0B` (amber)
- **20-39**: `#F97316` (orange)
- **0-19**: `#EF4444` (red)

### Typography
- Font: Inter (via Google Fonts) — clean, modern, excellent readability
- Headings: `font-bold` (700)
- Body: `font-normal` (400)
- Labels: `font-medium` (500)

### Spacing & Layout
- Mobile-first: base design at 375px, max-width 430px centred
- Consistent padding: `p-4` (16px) for screen edges, `p-5` (20px) for cards
- Border radius: `rounded-xl` (12px) for cards, `rounded-lg` (8px) for inputs/buttons
- Shadows: `shadow-sm` for subtle elevation, `shadow-md` for cards

---

## Initial Lever Definitions

| Lever | Icon | Colour | Description |
|-------|------|--------|-------------|
| Political Affiliation | `landmark` | `#8B5CF6` (purple) | Political donations, lobbying activities, board member political ties |
| Tax Transparency | `receipt` | `#3B82F6` (blue) | Tax compliance, offshore structures, public reporting |
| Local Business Support | `store` | `#F59E0B` (amber) | UK supplier percentage, local sourcing, community investment |
| Animal Welfare | `heart` | `#EC4899` (pink) | Animal testing, supply chain welfare, vegan/cruelty-free products |
| Environmental Sustainability | `leaf` | `#22C55E` (green) | Carbon emissions, renewable energy, waste reduction, biodiversity |
| Warfare & Arms | `shield-alert` | `#EF4444` (red) | Arms manufacturing, military contracts, conflict zone operations |
| Fair Employment | `users` | `#06B6D4` (cyan) | Living wage, gender pay gap, worker rights, diversity |
