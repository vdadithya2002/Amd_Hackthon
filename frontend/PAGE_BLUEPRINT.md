# Student PhishGuard: Page-by-Page UX Blueprint

## 1) Visual Direction ("The Vibe")
- Style: modern startup product + security command center.
- Feel: calm, premium, trustworthy, intelligent.
- Layout: strong whitespace, clean grids, clear hierarchy.
- Accent behavior: subtle glow around AI/safety actions (not noisy).

## 2) Color System
- Primary trust blue: `#0F2B46`
- Surface white: `#F8FBFF`
- Accent electric blue: `#2F80FF`
- Accent secure green: `#14C38E`
- Optional glow purple: `#7A5CFF`
- Text dark: `#0E1A2B`
- Border soft: `#D8E4F2`

Dark mode option:
- Background: `#0B1220`
- Card: `#121D30`
- Text: `#E6F0FF`
- Accent blue: `#5BA3FF`
- Accent green: `#2DD4A7`
- Glow purple: `#9A84FF`

## 3) Global Layout Rules
- Max content width: `1180px`
- Section rhythm: `72px` vertical spacing desktop, `40px` mobile
- Card radius: `14-20px`
- Border: `1px` soft, minimal shadows
- Navigation always visible on desktop; compact menu on mobile

## 4) Page Blueprint

### Page A: Home / Landing (`/`)
Purpose:
- Explain value in 5 seconds.
- Push users to "Start Safety Chat" or "Analyze URL".

Sections:
1. Sticky navbar (logo, links, profile button, theme toggle)
2. Hero split layout:
   - Left: headline + subtext + two CTAs
   - Right: live "Threat Snapshot" mini panel
3. Student scam highlights carousel
4. Feature strip (3 cards)
5. CTA band ("Start your first safety check")
6. Footer

### Page B: Live Safety Chat (`/chat`)
Purpose:
- Main student interaction surface.

Sections:
1. Header with session status ("AI mentor online")
2. Left rail:
   - Recent chats
   - Prompt templates
3. Main chat panel:
   - Message bubbles
   - Risk tags (Safe / Medium / High)
   - Quick actions ("Report", "Verify Sender", "Open Official Site")
4. Right rail:
   - Safety checklist
   - "If urgent, do this now" card

### Page C: URL Analysis Report (`/report/url`)
Purpose:
- Turn a scary warning into a clear student action plan.

Sections:
1. Risk banner with score
2. Why flagged (plain-language bullet reasons)
3. Technical signals (expandable details)
4. "What to do now" checklist
5. 1-question learning quiz

### Page D: Email Analysis (`/report/email`)
Purpose:
- Show phishing signs in student emails.

Sections:
1. Email summary card (sender, subject, risk level)
2. Highlight suspicious phrases/links
3. Recommended response actions
4. Button group:
   - "Mark as suspicious"
   - "Verify sender"
   - "Analyze attached link"

### Page E: Learn Hub (`/resources`)
Purpose:
- Micro-learning for prevention.

Sections:
1. Search + category chips
2. Short lessons ("2 min read")
3. Scam pattern cards
4. Campus-safe practices checklist

### Page F: Profile & Settings (`/profile`)
Purpose:
- Personalization + trust controls.

Sections:
1. Student profile card
2. Notification preferences
3. Dark mode / accessibility
4. Privacy and data controls

## 5) Interaction Blueprint
- Motion: soft fade + 150-220ms transitions.
- Hover states: slight elevation + accent border.
- Loading: skeleton cards + subtle pulse.
- Error: clear human message + retry button.
- Empty states: one guidance sentence + primary action.

## 6) Component Kit (Minimum)
- `TopNav`, `ThemeToggle`, `PrimaryButton`, `GhostButton`
- `RiskBadge`, `InfoCard`, `GlowCard`
- `ChatWindow`, `QuickPromptChips`, `ActionChecklist`
- `ReportSection`, `SignalTable`, `Footer`

## 7) Typography
- Headings: bold geometric sans (e.g., `Sora` / `Plus Jakarta Sans`)
- Body: clean sans (e.g., `Inter` / `Manrope`)
- Use large heading contrast and generous line spacing.

## 8) First Implementation Order
1. Build real multipage routing (`/`, `/chat`, `/report/url`, `/report/email`, `/resources`, `/profile`)
2. Create shared layout (navbar, footer, section container)
3. Implement design tokens + dark mode toggle
4. Migrate current chat/report widgets into dedicated pages
5. Add final polish: glow accents, transitions, micro-interactions
