### Prompt 0 – Landing Page / Homepage (Guest View)

Design a modern SaaS marketing landing page for "StreamHub" — a social media management + multi-platform livestream tool. Monochrome palette (black/white/grays), no gradients in UI chrome. Font: DM Sans or Plus Jakarta Sans.

─────────────────────────────────────────
SECTION 1 — NAVBAR (Sticky, white bg, border-bottom 0.5px #E5E7EB)
─────────────────────────────────────────
- Layout: flex, height 56px, max-width 1200px centered, padding 0 24px
- Left: Logo mark (28px black rounded-square) + "StreamHub" wordmark (15px/500 #0A0A0A)
- Center nav links (13px #6B7280, hover → #0A0A0A):
  Product ▾ | Platforms ▾ | Pricing | Agencies | Blog
- Right:
  "Log in" ghost link (13px #0A0A0A) +
  "Get started free →" black button (12px/500, 36px height, 12px radius, padding 0 16px)
- Mobile: hamburger icon replaces center + right nav

Product mega-dropdown (on hover, white panel, 0.5px border, 12px radius, shadow-sm):
  3 columns:
  Col 1 "Planner & Publish": icon + "Planner", "Post Creator", "Approval System", "SmartLinks", "AI Assistant"
  Col 2 "Livestream": icon + "Stream Scheduler", "Live Monitor", "Multi-Platform Streaming", "VOD History"
  Col 3 "Analytics & Grow": icon + "Analytics", "Reports", "Competitors", "Ads", "Inbox"
  Each item: 13px label + 11px gray description, hover: light gray bg, 6px radius

─────────────────────────────────────────
SECTION 2 — HERO (full-width, white bg, padding 100px 0 80px)
─────────────────────────────────────────
- Centered content, max-width 760px
- Announcement pill (top, centered):
  Dark pill (#0A0A0A bg, white text, 6px radius):
  "✦ NEW — Multi-Platform Livestream is here  →"
  Font: 11px/500, padding 4px 12px

- Headline (centered, 52px/500, #0A0A0A, letter-spacing -1px, line-height 1.15):
  "Plan, stream, and grow —
   all in one workspace"
  (two lines, balanced line break)

- Subheading (centered, 16px/400, #6B7280, max-width 520px, line-height 1.6):
  "Schedule posts, go live on every platform simultaneously, and track what's actually working. Built for creators, teams, and agencies."

- CTA row (centered, margin-top 32px, gap 12px):
  Primary: "Start for free →" black button (44px height, 12px radius, 16px/500)
  Secondary: "Watch demo ▶" ghost button (44px height, 0.5px #E5E7EB border, #0A0A0A text)
  Below buttons: "No credit card required · Free forever plan" (11px #9CA3AF, centered)

- HERO VISUAL (below CTAs, margin-top 56px):
  Large dashboard mockup screenshot container (max-width 1100px, centered, 12px radius, 0.5px #E5E7EB border, subtle offset 1px):
  - Shows the app shell from Prompt 1 (sidebar + topbar + dashboard overview)
  - Floating stat badge top-left: white card, 8px radius, "↑ 12.4% viewers today" (11px/500)
  - Floating LIVE badge top-right: dark pill, red pulsing dot + "2 streams LIVE"
  - Floating platform icons row bottom-center: YouTube + Facebook + TikTok + Instagram + Twitch + LinkedIn + X small colored squares
  - Slight top clip: image fades into white at bottom via CSS mask (so it bleeds into next section)

─────────────────────────────────────────
SECTION 3 — SOCIAL PROOF BAR (white bg, border-top + border-bottom 0.5px #E5E7EB, padding 20px 0)
─────────────────────────────────────────
- Centered row, gap 48px, flex wrap
- "Trusted by 150,000+ creators & teams" (12px #9CA3AF, uppercase, letter-spacing 0.8px) — left label
- Logo row: grayscale company/brand logos (5–6 logos, 80px wide each, opacity 0.4)
- Right: 5-star rating chip — "★★★★★  4.8 / 5 on G2" (12px #6B7280)

─────────────────────────────────────────
SECTION 4 — FEATURES OVERVIEW (white bg, padding 100px 0)
─────────────────────────────────────────
- Section label (centered, 10px/500 uppercase #9CA3AF, letter-spacing 0.8px): "EVERYTHING YOU NEED"
- Section title (centered, 32px/500 #0A0A0A, max-width 480px, line-height 1.25): "One tool for social media and livestreams"

Feature cards grid (3 columns, max-width 1100px, centered, gap 16px, margin-top 56px):
Each card (white bg, 0.5px #E5E7EB border, 12px radius, padding 28px 24px):

  Card 1 — Planner:
  Icon: calendar-check (24px, black square with white icon, 8px radius)
  Title: "Content Planner" (15px/500 #0A0A0A)
  Description: "Schedule posts across all your platforms from a single calendar. Set it and forget it." (13px #6B7280, line-height 1.6)
  Tags row (below description, gap 6px): gray pill chips "Instagram" "Facebook" "TikTok" "YouTube" "+4 more" (10px, 0.5px border, 4px radius)
  Bottom mini-visual: mini calendar grid preview (abstract, 3 dark event bars on light rows, 60px height, 8px radius)

  Card 2 — Multi-Platform Livestream (FEATURED — black bg #0A0A0A, white text):
  Icon: broadcast waves (24px, white icon on #1E1E1E bg, 8px radius)
  Title: "Go Live Everywhere" (15px/500 #FFFFFF)
  Description: "Stream to YouTube, Facebook, TikTok, Instagram, Twitch — all at once, one click." (13px #9CA3AF, line-height 1.6)
  Platform toggles mini-visual: 5 platform icon rows (18px colored icons + platform name #DDD + toggle switch ON state) — matches dark panel style from Prompt 2
  Live badge floating top-right of card: "LIVE" red badge + "3 active"

  Card 3 — Analytics:
  Icon: trending-up (24px, black square, 8px radius)
  Title: "Analytics & Reports" (15px/500 #0A0A0A)
  Description: "Track every metric, benchmark competitors, and export beautiful reports in one click." (13px #6B7280, line-height 1.6)
  Tags row: "Social" "Livestream" "Ads" "Competitors" chips
  Bottom mini-visual: mini line chart (abstract, 2 lines crossing, 60px height, platform brand colors)

Second row (2 cards, max-width 720px centered OR full-width 2-col):

  Card 4 — Team & Approvals:
  Icon: users (24px, black)
  Title: "Team Collaboration" (15px/500)
  Description: "Roles, permissions, approval workflows — built for agencies and teams of any size."
  Role pills row: "Owner" black | "Editor" gray | "Client" light gray | "Analyst" lighter — matches role pill style from Prompt 5

  Card 5 — Inbox & Engagement:
  Icon: message-circle (24px, black)
  Title: "Unified Inbox" (15px/500)
  Description: "Reply to DMs and comments from every platform in one feed. Never miss a message."
  Platform color strip preview: 3 mock message rows with left platform color strips (red/blue/black)

─────────────────────────────────────────
SECTION 5 — FEATURE DEEP DIVE (alternating layout, padding 80px 0)
─────────────────────────────────────────
Max-width 1100px centered. 3 feature blocks (alternating image-left / image-right):

BLOCK A — Livestream (image right):
- Left text (max-width 440px):
  Section pill: "LIVESTREAM" (10px uppercase black pill, white text)
  Headline: "Go live on every platform — simultaneously" (28px/500, line-height 1.25)
  Body: "Stop juggling multiple streaming software tools. StreamHub sends your stream to YouTube, Facebook, TikTok, Instagram, and Twitch in one setup. Manage chat, monitor quality, and control everything from one screen." (14px #6B7280, line-height 1.7)
  Feature checkmark list (12px #0A0A0A, gap 8px):
  ✓ Multi-platform RTMP routing
  ✓ Real-time viewer count per platform
  ✓ Unified live chat moderation
  ✓ Stream health monitoring (bitrate, FPS, latency)
  CTA: "Explore Livestream →" ghost link (13px, underline on hover)
- Right visual (50%):
  Dark rounded panel (#0A0A0A, 12px radius): Live Monitor mockup (platform status cards row + viewer counts + LIVE badges) from Prompt 4

BLOCK B — Content Planner (image left):
- Right text (max-width 440px):
  Section pill: "PLANNER" (10px uppercase)
  Headline: "Plan a month of content in minutes" (28px/500)
  Body: "Drag, drop, schedule. See all your posts and streams in one calendar. Submit for approval, reschedule on the fly, and publish at the perfect time automatically." (14px #6B7280)
  Checkmarks: ✓ Monthly calendar view ✓ Best time to post AI suggestions ✓ Bulk scheduling ✓ Multi-platform post customization
  CTA: "See the Planner →"
- Left visual (50%):
  White card (0.5px border, 12px radius): Calendar grid week view mockup with dark event cards and status dots

BLOCK C — Analytics (image right):
- Left text:
  Section pill: "ANALYTICS"
  Headline: "Data that actually tells you something" (28px/500)
  Body: "Track your social growth, livestream performance, and ad campaigns in one unified dashboard. Compare competitors, generate reports, and share results with clients in one click." (14px #6B7280)
  Checkmarks: ✓ Social + livestream combined analytics ✓ Competitor benchmarking ✓ PDF/CSV report export ✓ Scheduled report delivery
  CTA: "Explore Analytics →"
- Right visual:
  White card (0.5px border): Line chart multi-platform + stat cards row (mini version of Prompt 6)

─────────────────────────────────────────
SECTION 6 — PLATFORM LOGOS GRID (white bg, padding 80px 0)
─────────────────────────────────────────
- Section label (centered, 10px/500 uppercase #9CA3AF): "WORKS WITH YOUR PLATFORMS"
- Platform icon grid (centered, flex wrap, gap 24px, max-width 600px):
  Each item: platform icon (36px, brand color bg, white icon, 10px radius) + platform name below (11px #6B7280)
  Platforms: YouTube | Facebook | Instagram | TikTok | Twitch | LinkedIn | X/Twitter | Pinterest | Bluesky | Threads | Google Ads | Facebook Ads | TikTok Ads | Google Analytics
  Layout: 7 per row, 2 rows (14 total)

─────────────────────────────────────────
SECTION 7 — TESTIMONIALS (bg #F8F8F7, padding 100px 0)
─────────────────────────────────────────
- Section label + title (centered): "What our users say"
- 3-column card grid (max-width 1100px, gap 16px):
  Each testimonial card (white bg, 0.5px #E5E7EB border, 12px radius, padding 24px):
  - Star row: ★★★★★ (gold — only semantic color exception on this page)
  - Quote text (14px #0A0A0A, italic, line-height 1.7, 3–4 lines)
  - Bottom: avatar (32px circle) + name (12px/500) + role + brand (11px #6B7280)
  - Platform badge (top-right of card): small platform icon chip showing which platform they use

─────────────────────────────────────────
SECTION 8 — PRICING TEASER (white bg, padding 100px 0)
─────────────────────────────────────────
- Centered, max-width 800px
- Section label + title: "Plans for every stage of growth" (32px/500)
- Subtitle: "Start free, upgrade when you're ready." (15px #6B7280)
- 4-column plan cards (same style as Prompt 19, compact version):
  Free | Starter $19/mo | Pro $49/mo (highlighted, black border) | Agency Custom
  Each: plan name + price + 4 key features + CTA button
- "See full pricing →" ghost link below grid (centered)
- Billing toggle: "Monthly | Annual (save 20%)" centered above cards

─────────────────────────────────────────
SECTION 9 — CTA BANNER (black bg #0A0A0A, padding 80px 0)
─────────────────────────────────────────
- Centered layout
- Headline (36px/500 white, centered): "Start managing everything — for free"
- Subtext (15px #9CA3AF, centered): "No credit card needed. Set up in 2 minutes."
- CTA row (centered, gap 12px, margin-top 32px):
  "Create free account →" white button (black text, 44px height, 12px radius, 16px/500)
  "Talk to sales" ghost button (white border, white text, 44px height)
- Below buttons: avatar row (5 stacked 28px circles) + "Join 150,000+ creators and teams" (12px #9CA3AF)

─────────────────────────────────────────
SECTION 10 — FOOTER (black bg #0A0A0A, padding 60px 0 32px)
─────────────────────────────────────────
- Top section (4 columns, gap 48px):
  Col 1 (wider): Logo + tagline (13px #777) + social icons row (X, LinkedIn, YouTube, Instagram — 20px each, #666, hover #FFF)
  Col 2 "Product": Planner | Livestream | Analytics | Inbox | SmartLinks | Ads | Reports
  Col 3 "Company": About | Blog | Careers | Press | Partners | Agencies
  Col 4 "Support": Help Center | Tutorials | Status | API Docs | Contact

  Each link: 12px #777, hover #FFF, gap 10px between links

- Divider: 0.5px #1E1E1E
- Bottom row (flex, space-between):
  Left: "© 2025 StreamHub. All rights reserved." (11px #555)
  Right: "Privacy Policy · Terms of Service · Cookie Settings" (11px #555, gap 16px)
  Language selector: "🌐 English ▾" ghost chip (#1E1E1E bg, #777 text, 6px radius)

─────────────────────────────────────────
DESIGN RULES (apply globally to this page):
─────────────────────────────────────────
- Font: DM Sans or Plus Jakarta Sans
- All borders: 0.5px solid — NO 1px borders
- Border radius: 6px chips | 8px buttons/inputs | 12px cards | 16px large modals
- Colors: #0A0A0A (black) | #FFFFFF (white) | #F8F8F7 (off-white bg) | #6B7280 (secondary text) | #E5E7EB (borders)
- Semantic only: #DC2626 red (LIVE badge) | #16A34A green (success/savings) | ★ amber (stars only)
- Platform brand colors: ONLY on platform icons/logos — nowhere else
- NO gradients anywhere on the page (except the hero image fade-out mask)
- NO shadows — use 0.5px borders + 1px offset for depth on featured elements
- Hover states: text → #0A0A0A | bg → #F8F8F7 | transition 150ms ease
- Section spacing: 80–100px between major sections
- Mobile responsive: single column, 16px horizontal padding, hamburger nav

Design a Pricing Plan Configuration page for the StreamHub platform admin 
(Super Admin only — separate from the user-facing Pricing page).
This page lives inside a "Platform Admin" section, NOT inside a brand workspace.

ADMIN SHELL (khác với app shell thông thường):
- Sidebar bg: #0A0A0A (giống app) nhưng có label "ADMIN PANEL" 
  ở top (10px uppercase, #DC2626 — đỏ để phân biệt với user workspace)
- Admin nav items: Plans & Pricing | Users | Brands | Revenue | Audit Logs | System Settings
- Topbar: "⚠ Admin Mode" chip (red tint bg, red text, 6px radius) right-aligned
  kế bên user avatar — để nhắc nhở đang ở chế độ admin

─────────────────────────────────────────
PAGE HEADER
─────────────────────────────────────────
- Title: "Plans & Pricing Configuration" (15px/500 #0A0A0A)
- Subtitle: "Manage subscription tiers, feature limits, and pricing. 
  Changes take effect immediately for new subscribers." (12px #6B7280)
- Right: "Add New Plan" black button + "Preview Public Page ↗" ghost button
  (preview button opens Prompt 19 in new tab)
- Warning banner (yellow tint, 0.5px #D97706 border, 8px radius, padding 10px 14px):
  "⚠ Editing active plans will affect existing subscribers. 
   Changes to limits apply at next billing cycle." (12px #D97706)

─────────────────────────────────────────
SECTION 1 — PLAN CARDS OVERVIEW (editable)
─────────────────────────────────────────
Horizontal row of plan cards (same structure as Prompt 19 but EDITABLE):
Max-width full width, gap 16px, 4 columns

Each Plan Card (white bg, 0.5px #E5E7EB border, 12px radius, padding 20px):

  CARD HEADER:
  - Plan name: inline editable text field (click to edit, 15px/500)
  - Status toggle: "Active ●" green | "Hidden ○" gray | "Archived ○" red
    (pill group, small, 10px)
  - 3-dot menu (top-right): Duplicate Plan | Archive | Delete (danger, red)
  - "MOST POPULAR" toggle chip (click to set which plan gets the badge)
    Active: black bg white text | Inactive: gray ghost

  PRICING BLOCK:
  - Monthly price input: "$" prefix + number input (28px, bold, inline editable)
    e.g. "$  [49]  /month"
  - Annual price input: "$  [39]  /month (billed annually)"
  - Annual savings auto-calculated: "= [20]% off" (green badge, auto-updates on input)
  - Currency selector: "USD ▾" small dropdown (top-right of pricing block)

  LIMITS SECTION (collapsible, default open):
  Section label: "LIMITS" (10px uppercase gray)
  Each limit row (flex, space-between, border-bottom 0.5px #F0F0F0):
  - Left: limit name (12px #6B7280): "Social Brands" | "Team Members" | 
    "Posts per month" | "Media Storage" | "Stream Hours/month" | 
    "Platforms connected" | "Competitor tracking" | "Reports/month" |
    "SmartLinks" | "Autolist rules" | "Custom roles"
  - Right: editable value (12px/500 #0A0A0A):
    - Number input (small, 40px wide) for counted limits
    - "∞" toggle button for unlimited (click number → becomes ∞, click ∞ → back to number)
    - "—" for not available (disabled state, gray)
  
  Limit rows per plan example:
  Free:      Brands [1]  | Team [1]   | Posts [50]  | Storage [500MB]
  Starter:   Brands [3]  | Team [5]   | Posts [200] | Storage [5GB]
  Pro:       Brands [10] | Team [∞]   | Posts [500] | Storage [20GB]
  Agency:    Brands [∞]  | Team [∞]   | Posts [∞]   | Storage [100GB]

  CTA BUTTON CONFIG (bottom of card):
  - Button label input: "Get started free" / "Upgrade to Starter" (editable)
  - Button action: "Sign up" | "Contact sales" | "Disabled" (radio group)

─────────────────────────────────────────
SECTION 2 — FEATURE MATRIX EDITOR (full-width panel)
─────────────────────────────────────────
White panel, 0.5px border, 12px radius, margin-top 24px

Header row: "Feature Matrix" (13px/500) + "Add Feature" ghost button + 
  "Add Section" ghost button (right-aligned)

Table structure:
- Left column (280px): Feature name (editable inline) + drag handle (⠿)
- Remaining columns: one per plan (Free | Starter | Pro | Agency)
- Column headers: plan name + price per month (small gray)

Cell types (click cell to change):
  ✅ = included (click → cycles to next type)
  ❌ = not included
  [text] = custom value (e.g. "Up to 5" | "Unlimited" | "Priority" | "24/7")
  — = not applicable

Section header rows (gray bg, sticky within table):
  "📅 Planner & Publishing" | "📡 Livestream" | "📊 Analytics" | 
  "👥 Team & Collaboration" | "💬 Inbox" | "🔗 SmartLinks & Ads" | 
  "🛠 Support"

Each section is collapsible (click section header to collapse rows)

Feature row on hover:
- Row highlights light gray
- Right side of feature name: "Edit" pencil icon + drag handle shows
- On pencil click: inline edit input appears for feature name
- 3-dot at end of row: Move to section | Duplicate row | Delete row

─────────────────────────────────────────
SECTION 3 — BILLING SETTINGS (white panel, full-width)
─────────────────────────────────────────
Two-column layout (50% / 50%), gap 24px

LEFT — Trial & Discount Settings:
  Card (white, 0.5px border, 12px radius, padding 20px):
  Title: "Trial Settings" (13px/500)
  
  - Free trial toggle: "Offer free trial" ON/OFF
  - Trial duration: [14] days input (number, inline)
  - "Require credit card for trial" toggle
  - Trial plans: checkboxes which plans get trial (Pro ✅ | Starter ✅ | Agency ❌)
  
  Divider
  
  Title: "Coupon / Discount" (13px/500)
  - "+ Create Coupon" black ghost button
  
  Coupon list (if any):
  Each row: code (monospace) + discount (%) + expiry + usage count + 
    status dot (active/expired) + 3-dot (Deactivate | Delete)

RIGHT — Payment & Currency:
  Card (white, 0.5px border, 12px radius, padding 20px):
  Title: "Payment Configuration" (13px/500)
  
  - Payment gateway: "Stripe ✅ Connected" green status + "Configure →" link
  - Accepted cards: Visa ✅ | Mastercard ✅ | AmEx ✅ | PayPal ☐ (toggles)
  - Default currency: "USD ($) ▾" dropdown
  - Supported currencies: multi-select chips (USD | EUR | VND | GBP | SGD | JPY)
  - Invoice branding: logo upload (small, 40px) + company name input
  - Tax settings: "Collect VAT/GST" toggle + "Tax % [10]" input
  
  Divider
  
  Title: "Billing Cycle" (13px/500)
  - Default billing: "Monthly ○" | "Annual ●" radio (which is pre-selected on pricing page)
  - Grace period: "[3] days" after failed payment before downgrade

─────────────────────────────────────────
SECTION 4 — PLAN ANALYTICS (white panel, full-width)
─────────────────────────────────────────
Read-only section (no editing here)

Header: "Subscription Overview" (13px/500) + 
  "View Revenue Dashboard →" ghost link (right)

4 stat cards (horizontal row):
  Card 1: "Active Subscribers" — value "1,247" — delta "↑ 8.2% this month"
  Card 2: "MRR" — value "$48,291" — delta "↑ 12.4%"
  Card 3: "Churn Rate" — value "2.1%" — delta "↓ 0.3% vs last month" (green = good)
  Card 4: "Avg Revenue Per User" — value "$38.70"

Plan distribution bar (below stat cards):
- Horizontal stacked bar (full width, 20px height, 8px radius):
  Free: gray 45% | Starter: dark gray 28% | Pro: black 22% | Agency: #444 5%
- Legend below: plan name + color swatch + subscriber count + MRR contribution
- Hover on segment: tooltip shows exact numbers

─────────────────────────────────────────
FOOTER ACTION BAR (sticky bottom, white bg, border-top 0.5px #E5E7EB)
─────────────────────────────────────────
- Height: 56px, padding 0 24px, flex space-between
- Left: "Last saved: 5 minutes ago" (11px #9CA3AF) + 
  "⚠ 2 unsaved changes" yellow indicator (if edits pending)
- Right: "Discard Changes" ghost button (gray) + "Save & Publish" black button

PUBLISH CONFIRMATION MODAL (on "Save & Publish" click):
- Modal (white, 440px, 16px radius, padding 24px)
- Title: "Confirm Plan Changes" (15px/500)
- Change summary list (what was modified):
  "• Pro plan: monthly price $49 → $59"
  "• Starter: posts limit 200 → 300"
  "• Free: added 'Stream Hours' limit = 0"
- Impact warning: "⚠ 892 existing Pro subscribers will see new price 
  at their next renewal date." (12px #D97706, yellow tint bg, 8px radius)
- Checkbox: "☐ I understand — notify affected users via email"
  (must check to enable confirm button)
- Footer: "Cancel" ghost + "Confirm & Publish" black button 
  (disabled until checkbox checked)

─────────────────────────────────────────
DESIGN RULES (specific to admin pages):
─────────────────────────────────────────
- Admin sidebar: same #0A0A0A but với "ADMIN PANEL" red label 
  để phân biệt hoàn toàn với user workspace
- Tất cả input fields: 36px height, 8px radius, 0.5px #E5E7EB border
- Editable cells: show subtle dashed underline (0.5px dashed #9CA3AF) 
  để user biết có thể click chỉnh sửa
- Inline edit active state: input border → 0.5px solid #0A0A0A + 
  light focus ring (2px offset, rgba(0,0,0,0.08))
- Confirmation dialogs: LUÔN có change summary + impact warning 
  trước khi áp dụng bất kỳ thay đổi nào
- Monochrome throughout, 0.5px borders, DM Sans
- Danger actions (Delete plan, Archive): text/icon đỏ, confirm modal bắt buộc

### Prompt 22 – Command Palette (Cmd+K)

Design a Command Palette overlay — triggered by Cmd+K (Mac) or Ctrl+K (Windows).

OVERLAY:
- Full-screen dim overlay: rgba(0,0,0,0.45), z-index max
- Palette container: white bg, 560px wide, max-height 480px,
  16px radius, centered horizontally at 18% from top
  border: 0.5px #E5E7EB, no shadow

SEARCH INPUT ROW (top, sticky):
- Left: search icon (16px, #9CA3AF) + input (flex-1, 14px, no border,
  placeholder "Search pages, actions, users, posts...")
- Right: "ESC" keyboard chip (10px, gray bg, 4px radius, #9CA3AF text)
- Border-bottom: 0.5px #E5E7EB, padding: 12px 16px

RESULTS LIST (scrollable, max-height 380px):
Grouped sections, each with 10px uppercase gray section label:

Section "RECENT":
  - Dashboard ← icon + label + right hint "Last visited 2m ago"
  - Stream Monitor — "Tech Review Q2"

Section "ACTIONS" (most important):
  Each item row (padding 8px 14px, 6px radius on hover, flex align-center):
  - Left: action icon (16px, bg #F3F4F6 rounded-6px, icon #0A0A0A)
  - Label: 13px #0A0A0A
  - Shortcut hint right: gray keyboard chips "⌘ N" etc.
  - Arrow → far right (only shows on hover)

  Action items:
  ⚡ Start Livestream Now ............... ⌘⇧L
  📝 Create New Post .................... ⌘N
  📅 Schedule Stream .................... ⌘⇧S
  📤 Invite Team Member
  📊 Export Report
  🔗 Create SmartLink
  🤖 Open AI Assistant .................. ⌘⇧A

Section "NAVIGATE":
  Each item: page icon + page name + breadcrumb hint (gray)
  Dashboard | Content Planner | Live Monitor | Analytics | Inbox |
  Team Settings | Media Library | Notifications | Reports | Pricing

Section "SEARCH RESULTS" (appears after typing):
  Mixed results: posts, streams, users, brands — each with type badge
  Type badge: small pill (gray bg, 9px): "Post" | "Stream" | "User" | "Brand"
  Thumbnail (24px square, 4px radius) left for posts/streams
  Avatar (24px circle) left for users

KEYBOARD NAVIGATION:
- Arrow up/down: highlights row (black left border strip, 2px)
- Enter: executes / navigates
- Tab: jumps between sections
- Typing filters instantly

EMPTY STATE (no results):
- Centered: search icon + "No results for '[query]'" (13px #6B7280)
- Suggestion: "Try 'create post', 'analytics', or a team member's name"

Font DM Sans. Monochrome only. 0.5px borders. Palette slides in with
translateY(-8px) → 0 + opacity 0→1 on open (100ms ease-out).

### Prompt 23 – Audit Log

Design an Audit Log page accessible to Owner and Admin roles.

PAGE HEADER:
- Title "Audit Log"
- Subtitle: "All account activity with timestamps. Read-only." (12px #6B7280)
- Right: "Export CSV" ghost button + date range picker (30 days default)

FILTER ROW (below header, horizontal):
- Actor filter: "All Users ▾" dropdown (shows team member avatars + names)
- Action filter multi-select chips:
  All | Login | Content | Stream | Team | Settings | Billing | API
- Brand filter: "All Brands ▾" (if multi-brand account)
- Search: "Search actions or IPs..." input (200px)

STATS ROW (3 mini cards):
Total Events (30d) | Failed Actions | Unique Actors

LOG TABLE (white panel, full width):
Columns: Timestamp | Actor | Action | Target | IP Address | Status | Detail

- Timestamp: 12px monospace, "May 14, 2025  09:41:23" format
- Actor: avatar (24px) + name (12px/500) + role chip (tiny, 9px)
- Action: color-coded pill (10px, 4px radius):
  CREATE: teal tint bg  | EDIT: blue tint bg   | DELETE: red tint bg
  LOGIN:  gray tint bg  | EXPORT: amber tint bg | PUBLISH: green tint bg
  REJECT: orange tint bg | START STREAM: red pill
- Target: what was acted on (13px) — post title, user name, brand name, etc.
  Clickable → navigates to that resource (if still exists)
- IP Address: 11px monospace #9CA3AF
- Status: dot only — green (success) | red (failed) | yellow (partial)
- Detail ›: expand row for full JSON payload (monospace, 11px, dark bg panel)

ROW STATES:
- Failed action rows: very light red row tint (rgba(220,38,38,0.04))
- Expanded row: dark panel (#0A0A0A bg, white text, 11px monospace)
  Shows: full action data, request ID, user agent, session ID

SAMPLE LOG ENTRIES (illustrative):
09:41:23  Sarah K. (Editor)   PUBLISHED   "Q2 Campaign Post"      IP: 192.168.1.42   ✅
09:38:01  John D. (Admin)     INVITED      alex@company.com        IP: 10.0.0.15      ✅
09:22:47  Admin (system)      FAILED LOGIN  —                      IP: 45.33.21.108   ❌
09:15:30  Maria L. (Creator)  SUBMITTED    "Product Launch Stream" IP: 192.168.1.88   ✅
08:59:12  Owner               PLAN UPGRADE  Pro → Agency           IP: 192.168.1.1    ✅

PAGINATION: "Showing 1–50 of 2,847 events" + prev/next + "50 per page ▾"

SECURITY ALERT BANNER (if suspicious activity detected):
Yellow border panel (top of table): "⚠ 3 failed login attempts from 45.33.21.108 
in the last hour. [Block IP] [Dismiss]" — action buttons inline

Font DM Sans. Monochrome base. Action pill colors are only semantic 
(teal/blue/red/green = create/info/delete/success). 0.5px borders throughout.

### Prompt 24 – Super Admin Revenue Dashboard

Design a Revenue & Business Dashboard for the StreamHub platform Super Admin.
Lives inside the Admin Panel (Prompt 21's shell with red "ADMIN" label).

PAGE HEADER:
- Title "Revenue Dashboard"
- Subtitle: "Platform-wide subscription and financial overview" (12px #6B7280)
- Right: date range picker + "Download Report" ghost button
- "⚠ Admin Mode" red chip (top-right topbar — inherited from admin shell)

KPI ROW (5 stat cards, horizontal):
MRR | ARR | Active Subscribers | New This Month | Churned This Month
Each: white card, 0.5px border, 12px radius, 22px value, 11px label,
small sparkline (5px height, 30-day data, black fill bars)

MRR BREAKDOWN PANEL (white card, full width, chart + donut):
Two-column:
LEFT (65%): MRR over time — area chart (12 months)
  - One line: MRR (solid black)
  - Secondary line: New MRR (green dashed)
  - Third: Churned MRR (red dashed, below 0 axis)
  - Hover tooltip: dark pill showing all 3 values at that date

RIGHT (35%): MRR by Plan — donut chart
  Free: gray | Starter: dark gray | Pro: black | Agency: #444
  Center: total MRR "$48,291"
  Legend: plan name + MRR + % + subscriber count

SUBSCRIBER TABLE (white panel, full width):
Shows all plan tiers as rows:
Columns: Plan | Active Subs | MRR | Avg ARPU | Churn Rate | 
         New (30d) | Cancelled (30d) | Trial→Paid Conv.%
- Plan row: plan name (13px/500) + colored dot (matches donut)
- Highlighted row: Pro plan (light gray bg — highest MRR)
- Total row: bold, border-top 0.5px #E5E7EB

COHORT ANALYSIS PANEL (white card, full width):
- Title: "Subscriber Retention Cohorts" + "?" tooltip explaining cohort
- Table: rows = signup month | columns = month 0 to month 12
  Cell: percentage of cohort still subscribed (e.g. "86%", "71%")
  Color intensity: dark black = 100% → light gray = 0%
  (heatmap style — monochrome, darker = better retention)
- Row header: "Jan 2025 (142 subs)" | "Feb 2025 (167 subs)" etc.

RECENT TRANSACTIONS TABLE (white card, full width):
Columns: User | Plan | Amount | Date | Status | Type | Invoice
- Type pill: "New" (green) | "Renewal" (gray) | "Upgrade" (blue) |
  "Downgrade" (yellow) | "Refund" (red) | "Failed" (red border)
- Invoice: small "↓ PDF" ghost link
- 3-dot per row: Refund | Cancel Subscription | View User

GEOGRAPHY MAP PLACEHOLDER (white card):
- Title "Revenue by Country"
- Placeholder: simple world outline (SVG, gray strokes) +
  top 5 countries list: flag emoji + country + sub count + MRR %

Font DM Sans. Monochrome throughout except semantic green/red for 
growth/churn. Retention heatmap: black (#0A0A0A) → light gray (#F3F4F6).
0.5px borders. Red "ADMIN MODE" banner inherited from shell.

### Prompt 25 – AutoLists Manager

Design an AutoLists Manager page for creating recurring post scheduling rules.
AutoLists = smart queues that auto-schedule posts on a repeating cadence.

PAGE HEADER:
- Title "AutoLists"
- Subtitle: "Create repeating content queues. Posts are pulled from your 
  queue and scheduled automatically." (12px #6B7280)
- Right: "+ Create AutoList" black button

AUTOLISTS GRID (2 columns, white cards):
Each AutoList card (white bg, 0.5px border, 12px radius, padding 20px):
  TOP ROW:
  - AutoList name (14px/500) + status toggle (Active ● / Paused ○)
  - Platform icons row (18px colored squares) — which platforms this list posts to
  - 3-dot menu: Edit | Pause | Duplicate | Delete

  SCHEDULE DISPLAY:
  - "Posts" chip + cadence: "3× per week" / "Daily at 9AM, 3PM" / "Mon Wed Fri 10:00"
  - Visual week grid (7 small squares Mon–Sun):
    Filled black = active day | Empty = inactive
    Each active square shows time label below (e.g. "10AM")

  QUEUE STATUS:
  - Progress bar: "12 posts in queue" — black fill proportional to queue size
  - Warning if queue low (< 3 posts): yellow tint + "⚠ Queue running low. Add posts."
  - "Last posted: 2 hours ago" (10px gray)

  BOTTOM ACTIONS (on hover):
  "View Queue (12)" ghost button | "Add Posts" black ghost button

"+ Create AutoList" dashed card (last card in grid)

AUTOLISTS DETAIL / EDITOR (slide-in right panel, 400px):
Panel (white bg, left border 0.5px #E5E7EB):
  Header: "Edit AutoList" (15px/500) + X close

  [Settings]
  - Name input (full width)
  - Platform toggles (checkboxes with platform icons — same as Prompt 3)
  
  [Schedule]
  - Cadence type:
    ○ Specific days & times
    ○ Times per day / week / month (e.g. "Post 3× per week, best times")
  
  - Day selector (if specific):
    7 toggle chips Mon Tue Wed Thu Fri Sat Sun (black = active, gray = inactive)
  
  - Time slots per active day:
    Each day: time picker inputs (add up to 5 time slots)
    "+ Add time slot" ghost link per day
  
  - "Use AI best times" toggle (replaces manual times with AI suggestions)
    Shows: "Posts will be timed for max engagement per platform"

  [Queue] section:
  - Queue list: draggable list of posts waiting to be published
    Each row: thumbnail (32px) + post title (truncated) + platforms + drag handle
    "Remove" × on hover
  - "Add posts to queue" button → opens post picker modal (grid of drafts)
  - Recycle option toggle: "Recycle queue when empty" 
    (posts go back to end of queue after posting)

  Footer: "Save Changes" black button | "Pause List" ghost button

EMPTY STATE (no AutoLists created):
- Centered icon (calendar with repeat arrows) + 
  "No AutoLists yet" (14px/500) + 
  "Create a repeating schedule to automatically publish content from a queue." (12px gray)
- "+ Create your first AutoList" black button

Font DM Sans. 0.5px borders. Monochrome + platform brand colors for icons only.

### Prompt 26 – AI Assistant

Design a standalone AI Assistant page for generating and improving social media content.

PAGE HEADER:
- Title "AI Assistant"
- Subtitle: "Generate captions, suggest hashtags, repurpose content 
  across platforms." (12px #6B7280)
- Right: "Clear chat" ghost button + usage indicator "847 / 1000 credits" 
  (small progress bar, gray, 10px label)

TWO-COLUMN LAYOUT (left 60% | right 40%):

LEFT — AI CHAT INTERFACE:
Chat container (white card, 0.5px border, 12px radius, full height):
  - Header: AI avatar (28px, black circle with white spark icon) + 
    "StreamHub AI" (13px/500) + "Powered by Claude" (10px gray)
  
  CHAT MESSAGES (scrollable, bottom-anchored):
    User message: right-aligned bubble (black bg, white text, 12px radius, 
                  padding 10px 14px, max-width 70%)
    AI message:   left-aligned (white bg, 0.5px border, 12px radius, 
                  padding 12px 14px, max-width 85%)
                  AI messages can contain:
                  - Plain text (14px, line-height 1.6)
                  - Code/hashtag blocks: monospace, light gray bg, 6px radius
                  - Action buttons below message: 
                    "Use this caption" black (small) | "Try another" ghost | "Copy" ghost
    
    Loading state: 3 pulsing dots (● ● ●, gray, staggered animation)
  
  QUICK PROMPTS (above input, if chat empty):
  Grid of prompt chips (2×3, white bg, 0.5px border, 8px radius, padding 10px 14px):
    ✨ "Write a caption for my product launch"
    🔁 "Repurpose my YouTube script to Instagram"
    # "Suggest hashtags for fitness content"
    🎯 "Write 5 hook variations for TikTok"
    📊 "Analyze my top-performing post style"
    🌐 "Translate this caption to Vietnamese"
  
  INPUT ROW (sticky bottom):
    - Textarea (1 row, auto-expand to 4 rows)
    - Placeholder: "Ask AI to write, improve, or transform your content..."
    - Left icons: 📎 Attach (reference post/media) | 🎨 Tone selector ▾
    - Right: "Send" black button (disabled when empty)
    - Tone selector dropdown: Professional | Casual | Funny | Inspirational | 
      Urgent | Educational (each with example preview on hover)

RIGHT — CONTEXT & OUTPUT PANEL:
  Section "Context" (white card, 0.5px border, 12px radius):
    Title: "Tell AI about your brand" (13px/500)
    - Brand voice: textarea "Our brand is..." (3 rows, placeholder)
    - Target audience: tags input (e.g. "25-34 women" "fitness enthusiasts")
    - Platform focus: platform chips (toggle active/inactive)
    - "Save as brand voice" ghost button
  
  Section "Generated Content" (white card, below context):
    Title: "Latest output" (13px/500)
    - Caption output box: editable textarea (white, 0.5px border)
    - Platform preview tabs: Instagram | Facebook | TikTok | LinkedIn
    - Character count (per platform limit, changes red when over)
    - Actions row:
      "Insert into post" black button | "Save to drafts" ghost | "Copy" ghost
  
  Section "Hashtag Suggestions" (white card, below output):
    - Suggested tags: black pill chips (click to copy)
    - Trending indicator: 🔥 next to trending tags
    - "Refresh suggestions" ghost link

HISTORY SIDEBAR (collapsible left rail, 240px, when expanded):
- Recent conversations list
- Each: AI prompt excerpt (1 line, 11px) + date + "Restore" on hover

Font DM Sans. AI bubble: white bg always. User bubble: black bg always.
0.5px borders throughout. Spark icon: only decorative color element.

### Prompt 27 – Hashtag Manager

Design a Hashtag Manager page for organizing and saving hashtag sets.

PAGE HEADER:
- Title "Hashtag Manager"
- Right: search input (200px) + "Create Set" black button

HASHTAG SETS GRID (3 columns, white cards):
Each set card (white bg, 0.5px border, 12px radius, padding 16px):
  - Set name (14px/500) + hashtag count badge "24 tags" (gray pill, 10px)
  - 3-dot menu: Edit | Duplicate | Delete
  - Tags preview: first 8-10 hashtag pills shown
    Each pill: gray bg (#F3F4F6), 6px radius, 11px text "#fitnessmotivation"
    "+ 14 more" gray text if > 10 tags
  - Avg reach badge (bottom): "↑ 12.4K avg reach" (11px green #16A34A)
  - Platform icons (bottom row): platforms this set is tagged for
  - "Use in post" ghost button (appears on hover)
  "+" dashed card for "Create New Set"

HASHTAG SET EDITOR (slide-in right panel, 420px):
  Header: set name (editable inline) + X close
  
  [Hashtags] section:
  - Large tag input area: free-form chip input
    Type # or without # → auto-adds "#"
    Each chip: black bg white text, × to remove
  - "Add from suggestions" ghost link → expands suggestion panel
  - Drag to reorder chips (drag handle on each)
  
  [Performance data per tag] (expandable):
  Table: Tag | Posts using | Avg Reach | Trending? | Competition Level
  Competition level: Low (green dot) | Medium (yellow) | High (red)
  Trending: 🔥 icon if trending on selected platform
  
  [Platforms]:
  - Platform chips (toggle which platforms this set applies to)
  
  [Auto-add rules] (optional):
  - "Automatically add to posts about:" tags input (topic keywords)
  
  Footer: "Save Set" black button | character count of all tags combined

EXPLORE HASHTAGS SECTION (bottom of page, white panel):
  Title "Discover Hashtags" (13px/500) + platform selector tabs
  
  Categories row (horizontal chips):
  Trending | Fitness | Food | Tech | Travel | Fashion | Business | ...
  
  Hashtag cards grid (5 columns):
  Each card (white, 0.5px border, 8px radius, padding 10px):
  - "#hashtag" (13px/500)
  - Posts count (11px gray): "2.4M posts"
  - Trend arrow: ↑ green | ↓ red | → gray
  - "+ Save to set" ghost link (dropdown: pick which set)
  
  PERFORMANCE ANALYTICS (tab: "My Hashtag Stats"):
  - Bar chart: top 10 hashtags by reach (platform brand color fill)
  - Table: hashtag + total posts used + total reach generated + best performing platform

Font DM Sans. 0.5px borders. Monochrome: tag chips = black bg white text.
Platform colors only on platform icons. Green/red only for semantic data.

### Prompt 29 – Getting Started Checklist Widget

Design an in-app onboarding progress widget that appears on Dashboard
for new users (< 30 days old or < 5 posts).

WIDGET TRIGGER (Dashboard):
- Collapsible card widget (white bg, 0.5px #E5E7EB border, 12px radius)
- TOP STRIP: black bg (#0A0A0A), white text
  "Getting started" (13px/500) + progress "3 / 7 complete" (right)
  + "Dismiss" × (far right, gray)
- Progress bar: full-width, 4px tall, below strip
  Black fill proportional to completion (0–100%)

CHECKLIST ITEMS (below header, padding 16px):
Each item row (padding 8px 0, border-bottom 0.5px #F0F0EF):

  Completed item:
  - ✅ checkmark (black circle, white check, 18px) left
  - Label (13px, color #9CA3AF, line-through) "Connect your first platform"
  - "Done" (10px green #16A34A) right

  Incomplete item (current / next):
  - ○ empty circle (0.5px #E5E7EB border, 18px) left
  - Label (13px/500 #0A0A0A) "Schedule your first post"
  - CTA link "Do it →" (12px #0A0A0A, underline on hover) right

  Locked item (grayed out):
  - ○ empty circle (gray bg)
  - Label (13px #9CA3AF) "Set up approval workflow"
  - Lock icon right (12px, gray)

CHECKLIST ITEMS (7 total):
① ✅ Connect a social platform
② ✅ Create your first Brand
③ ✅ Invite a team member
④ ○  Schedule your first post              "Go to Planner →"
⑤ ○  Set up an AutoList                   "Create AutoList →"
⑥ 🔒 Schedule a livestream (requires ④)   "Schedule Stream →"
⑦ 🔒 Go live for the first time           "Start Streaming →"

COMPLETION STATE (all 7 done):
- Strip changes: "🎉 All done! You're a pro." (white text on black)
- Body: short confetti-like text + "Explore advanced features →" link
- Widget auto-collapses after 3 seconds

COLLAPSED STATE (user dismisses or all done):
- Small persistent chip in dashboard topbar area:
  "Getting started · 5/7" — click to re-open widget
  Only shown until 100% complete, then disappears forever

TOOLTIP (on hover of locked item):
- Dark pill tooltip: "Complete 'Schedule your first post' first"
  Arrow pointing to locked item

Font DM Sans. Widget: white bg. Header strip: #0A0A0A always.
0.5px borders. No color except black/white/gray + green checkmarks.

### Prompt 30 – Empty States

Design a comprehensive Empty States system for all major pages.
Each empty state is a centered component that replaces the content area
when no data exists for that section.

DESIGN RULES for all empty states:
- Container: centered vertically and horizontally in content area
- Max-width: 400px
- Icon: 48px geometric shape (NOT illustrations — just simple SVG shapes)
  e.g. calendar outline for planner, broadcast icon for stream
  Color: #D1D5DB (light gray) — never black, never brand colors
- Title: 16px/500 #0A0A0A (what's missing)
- Description: 13px #6B7280 line-height 1.6 (why and what to do, 2 lines max)
- CTA: black button (primary action) + ghost button (secondary, if relevant)
- No illustrations, no cute characters, no gradients

PAGE-SPECIFIC EMPTY STATES:

DASHBOARD (no connected platforms):
  Icon: plug/connection shape (48px)
  Title: "No platforms connected yet"
  Desc: "Connect your social media accounts to start tracking analytics 
         and scheduling content."
  CTA: [Connect a Platform →] black button

CONTENT PLANNER (no scheduled posts):
  Icon: calendar grid shape
  Title: "Your calendar is empty"
  Desc: "Schedule your first post or create an AutoList to fill your calendar automatically."
  CTA: [+ Create Post] black | [Set up AutoList] ghost

CONTENT PLANNER — specific date cell:
  Micro empty state (inside day cell on hover):
  "+" icon centered | tooltip on hover: "Add post for May 14"
  Dashed border appears on hover

STREAM SCHEDULE (no streams):
  Icon: broadcast/signal waves shape
  Title: "No streams scheduled"
  Desc: "Plan your next livestream across YouTube, Facebook, TikTok, and more."
  CTA: [Schedule a Stream →] black

MEDIA LIBRARY (no media uploaded):
  Icon: image frame shape
  Title: "No media uploaded yet"
  Desc: "Upload images, videos, and GIFs to use in your posts and stream thumbnails."
  CTA: [Upload Files] black | [Connect Canva] ghost

INBOX (no messages):
  Icon: speech bubble outline
  Title: "All caught up!"
  Desc: "New comments and DMs from your connected platforms will appear here."
  (no CTA needed — positive empty state)

ANALYTICS (no data / account just connected):
  Icon: chart bars shape (empty)
  Title: "Analytics loading..."
  Desc: "It takes up to 24 hours to collect your first analytics data 
         after connecting a platform."
  Progress: subtle gray bar animating (indeterminate) below description
  (no CTA)

TEAM PAGE (only owner, no members):
  Icon: users group shape
  Title: "You're flying solo"
  Desc: "Invite team members to collaborate, assign roles, and manage 
         content approvals together."
  CTA: [Invite Team Member →] black

NOTIFICATIONS (all read / none):
  Icon: bell shape
  Title: "You're all caught up"
  Desc: "New notifications will appear here for streams, approvals, 
         and team activity."
  (no CTA)

COMPETITORS (none added):
  Icon: bar chart/podium shape
  Title: "No competitors tracked yet"
  Desc: "Add competitor handles to benchmark your growth against others in your niche."
  CTA: [+ Add Competitor] black

REPORTS (no reports created):
  Icon: document/page shape
  Title: "No reports yet"
  Desc: "Create a report to share your social and stream performance 
         with clients or stakeholders."
  CTA: [Create Report →] black

STREAM HISTORY (no past streams):
  Icon: video camera shape
  Title: "No streams yet"
  Desc: "Your first livestream will appear here when you go live. 
         Start by scheduling a stream."
  CTA: [Schedule Your First Stream →] black

SEARCH / COMMAND PALETTE (no results):
  Inline micro empty state (inside palette, centered):
  "No results for '{query}'" — icon (magnifier) + text (13px gray)
  Suggestion: "Try searching for a page name, action, or team member"

Font DM Sans. All empty state icons: #D1D5DB gray (pure outline/shape).
Monochrome only. No shadows, no gradients, no illustrations.
Max 2 CTAs per empty state (primary black + optional ghost).

### Prompt 31 – Error Pages (404 / 500 / Offline)

Design three error pages maintaining the app's monochrome design system.

PAGE LAYOUT for all: Full viewport, centered content (max-width 480px),
vertically centered. App shell (sidebar + topbar) IS present so user 
can navigate away. Content area shows the error.

ERROR 404 — Page Not Found:
  Top: "404" — large numeral (72px/500, #E5E7EB — very light gray, 
       NOT black — feels lighter, less alarming)
  Below numerals: thin 0.5px line (full width of content block)
  Title: "Page not found" (20px/500 #0A0A0A)
  Description: "The page you're looking for doesn't exist or has been moved. 
                Check the URL or go back to where you came from." 
                (13px #6B7280, line-height 1.6)
  CTA row: [← Go Back] ghost button | [Go to Dashboard] black button
  
  Below CTA — "Looking for something?" section (margin-top 32px):
  Quick links list (centered, gap 8px):
  → Content Planner
  → Analytics
  → Stream Schedule
  → Team Settings
  Each: 13px #0A0A0A, underline on hover, chevron → left

ERROR 500 — Server Error:
  Top: "500" (same 72px/500 #E5E7EB style)
  Title: "Something went wrong on our end"
  Description: "Our team has been notified and is working on a fix. 
                Try refreshing the page or come back in a few minutes."
  CTA: [Refresh Page] black button | [Check Status Page ↗] ghost
  
  Status mini-card (below CTAs, white bg, 0.5px border, 8px radius, padding 12px):
  "System status" label (10px uppercase gray) +
  green dot + "All systems operational" (12px)
  OR yellow dot + "Investigating an issue" (if outage)
  Small "Last updated: 2 minutes ago" (10px gray)

ERROR OFFLINE — No Internet:
  Top: wifi-off icon (48px, #D1D5DB, outlined)
  Title: "You're offline"
  Description: "Check your internet connection and try again. 
                Your drafts have been saved locally."
  CTA: [Try Again] black button (auto-retries on click)
  
  Auto-retry indicator (below CTA):
  "Checking connection..." with subtle animated dots (●○○ → ○●○ → ○○●)
  Page auto-refreshes when connection detected

COMMON DESIGN RULES for all error pages:
- Large error code: 72px/500, color #E5E7EB (not black — avoid alarm)
- Content stays within app shell so sidebar navigation is always accessible
- Max 2 CTAs
- No illustrations, no sad robots, no cartoon characters
- Keep descriptions under 2 sentences — direct, not apologetic
- If navigated back from a 404: restore previous scroll position

Font DM Sans. Monochrome only. 0.5px borders on any cards.
The error code numerals are INTENTIONALLY light gray — not the main focus.
The title + description + CTAs are the focus.

### Prompt 32 – Brand Switcher Flow

Design the Brand Switcher UI — the mechanism for switching between multiple brands.
The switcher lives in the top of the sidebar.

CLOSED STATE (default — single brand selector pill):
- Container: dark pill (#161616 bg, 0.5px #2A2A2A border, 8px radius)
  padding: 8px 12px, full sidebar width minus 24px margins
- Layout: flex, align-center, gap 8px
  - Brand avatar: 24px circle, colored initials (brand color bg)
    e.g. "TV" initials on dark blue bg
  - Brand name: 13px #E0E0E0, truncated 1 line
  - "▾" caret: #666, 10px, right-aligned
- Hover: bg → #1E1E1E, border → #333

OPEN STATE (dropdown panel below pill):
- Panel: #0A0A0A bg, 0.5px #2A2A2A border, 8px radius
  width: 240px (slightly wider than pill), positioned below pill
  max-height: 320px, scrollable if many brands

  TOP: Search input (inside dropdown):
  - Bg #161616, 0.5px #2A2A2A border, 6px radius
  - Placeholder: "Search brands..." (11px #777)
  - Search icon left (12px, #555)

  BRAND LIST:
  Each brand row (padding 8px 10px, gap 8px, flex align-center):
  - Avatar (24px circle) + brand name (12px #DDD) + plan badge (10px gray pill "Pro")
  - Active brand: white left border strip (2px) + slightly lighter bg (#161616)
  - Unread indicator: orange dot right if brand has pending notifications
  - Hover: bg #1A1A1A

  BOTTOM ACTIONS (below list, border-top 0.5px #222):
  - "+ Add new brand" (12px #777, hover #FFF, + icon left)
  - "Manage all brands" (12px #777, hover #FFF, settings icon left)

BRAND SWITCH TRANSITION:
- On click brand row: panel closes
- Topbar shows brief loading state: "Switching to Brand X..." (11px gray center)
- Sidebar nav items re-render (slight opacity flash 0.8→1, 150ms)
- Active page reloads data for new brand context
- Dashboard content re-fetches and replaces (skeleton loading cards)
- URL updates: app.streamhub.com/[brand-slug]/dashboard

ADD NEW BRAND FLOW (on "+ Add new brand" click):
- Small modal (white, 400px, 16px radius, padding 24px):
  Title: "Create a new Brand" (15px/500)
  - Brand name input (auto-focused)
  - Brand logo upload (small, 56px circle dashed target)
  - Industry dropdown
  - "Create Brand" black button | "Cancel" ghost
  After create: auto-switches to new brand, shows onboarding checklist

MANAGE BRANDS PAGE (on "Manage all brands" click → full page):
- Table: Brand avatar | Name | Plan | Members | Posts | Status | Actions
- "Transfer ownership" option in 3-dot (Owner only)
- "Archive brand" option (soft delete, data retained)
- "+ Add brand" black button top-right

Font DM Sans. Switcher: always dark (#0A0A0A bg family).
Modal for add: white. 0.5px borders. Brand avatars: colored initials only.

### Prompt 33 – Invite Accept Flow

Design the landing page and flow for when a team member accepts an invitation email.

SCREEN A — INVITE LANDING (public page, no auth required yet):
Full-page split: Left 40% black | Right 60% white
(Same split layout as Login — Prompt 20)

LEFT PANEL (#0A0A0A bg):
- Logo top-left (white mark + "StreamHub")
- Center content (vertically centered):
  - Inviter avatar (40px circle, colored initials)
  - "[Inviter name] has invited you" (15px white)
  - "to join [Brand Name] on StreamHub" (13px #9CA3AF)
  - Role badge (large, dark pill): "as Editor"
  - Brand avatar (32px circle) + brand name (14px white) below role
- Bottom: "streamhub.com" (11px #555)

RIGHT PANEL (white bg):
  If NOT logged in (new user):
  Title: "Accept your invitation" (18px/500)
  Subtitle: "Create your account to get started" (13px #6B7280)
  
  - Full name input (auto-focused)
  - Email input (pre-filled with invite email, LOCKED — gray bg)
    Note below: "Invitation was sent to this email" (10px gray)
  - Password input + strength bar
  - "Create Account & Accept Invite" black button (full width, 42px)
  - Divider + "Continue with Google" option (if Google account matches email)
  
  If ALREADY logged in as different user:
  - Yellow banner: "You're logged in as [other email]. Accept with this account
    or [Switch accounts]?"
  
  If ALREADY logged in as same email:
  - Shows: user avatar + name + "Accept as [name]?" confirmation
  - "[Brand logo] Join [Brand Name] as Editor" confirmation card (white, border)
  - "Accept Invitation" black button | "Decline" ghost

SCREEN B — INVITE ACCEPTED SUCCESS:
Full-page, centered card (white, max 480px, 16px radius, padding 40px):
  - ✅ checkmark icon (black circle, white check, 56px)
  - "Welcome to [Brand Name]!" (20px/500)
  - "You've joined as [Role]" (14px #6B7280)
  - Role permissions summary (3 bullets, 12px gray):
    e.g. "• You can create and schedule posts"
         "• Your posts require approval before publishing"
         "• You can view content analytics"
  - "[Brand avatar] [Brand Name]" row (visual confirmation)
  - "Go to Dashboard →" black button (full width)
  - "Complete your profile first" ghost link

SCREEN C — INVITE EXPIRED:
Centered card:
  - ⚠ warning icon (gray, 48px)
  - "This invitation has expired" (18px/500)
  - "Invitation links expire after 7 days. Ask [Inviter name] 
    to send a new invite." (13px #6B7280)
  - "Request new invite" ghost button (triggers email to inviter)
  - "Go to login" text link

SCREEN D — INVITE ALREADY USED:
  - "You're already a member" (18px/500)
  - "You already have access to [Brand Name] as [Role]." (13px gray)
  - "Go to Dashboard →" black button

EMAIL TEMPLATE PREVIEW (optional companion design):
- Shows the invitation email design (white bg, branded):
  - StreamHub logo top
  - "[Inviter] has invited you to [Brand]" header
  - Role badge (large, centered)
  - "Accept Invitation" big black button (CTA)
  - "Link expires in 7 days" footer note
  - Unsubscribe / ignore note

Font DM Sans. Split layout mirrors Login page exactly.
Invite cards: white bg. Left panel: #0A0A0A always. 0.5px borders.
Role badge in LEFT panel: large dark pill (#1E1E1E bg, #DDD text).