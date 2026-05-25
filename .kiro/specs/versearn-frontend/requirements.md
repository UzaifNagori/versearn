# VerseEarn Web Frontend — Requirements

## Overview
VerseEarn ka pura Next.js web frontend banana hai. Ye Pakistani earning + NFT platform hai jahan users VERSE tokens kamate hain. Abhi sirf frontend (UI) banana hai — backend baad mein. Sab API calls mock/placeholder rahenge pehle.

## Tech Stack (Already Setup)
- Next.js 16 (App Router)
- Tailwind CSS v4
- lucide-react (icons)
- react-hot-toast (notifications)
- @supabase/supabase-js (baad mein use hoga)
- axios (baad mein use hoga)

## Color Theme
- Primary: Purple/Violet (#7C3AED)
- Accent: Gold/Yellow (#F59E0B)
- Background: Dark (#0F0F0F)
- Card: Dark gray (#1A1A2E)
- Text: White / Light gray
- Success: Green (#10B981)
- Danger: Red (#EF4444)

---

## Pages & Requirements

### REQ-01: Landing Page (/)
- Hero section: VerseEarn logo, tagline "Ghar Baithe Kamao VERSE Tokens"
- Features section: 5 earning methods (Ads, Surveys, Walk, Check-in, Referral)
- Stats section: Total users, Total VERSE earned, NFTs minted
- How it works: 3 steps (Register → Earn → Withdraw)
- NFT showcase section
- CTA buttons: "Abhi Join Karo" → /register
- Navbar: Logo + Login + Register buttons
- Footer: Links, social media

### REQ-02: Auth Pages
#### /login
- Email + Password form
- Google login button (UI only)
- "Forgot Password" link
- Link to /register
- Form validation with error messages

#### /register
- Username, Email, Password, Confirm Password fields
- Referral code field (optional, pre-filled if ?ref= in URL)
- Terms & Conditions checkbox
- Google signup button (UI only)
- Link to /login

### REQ-03: Dashboard (/dashboard)
- Protected route (redirect to /login if not logged in)
- VERSE balance — large, prominent display
- Today's earnings breakdown (Ads, Survey, Walk, Check-in)
- Quick action cards: Watch Ad, Daily Check-in, Walk, Create NFT
- Recent transactions list (last 10)
- Daily progress bars (how much of daily limit used)

### REQ-04: Earn Page (/earn)
- 4 earning sections:
  1. **Watch Ads** — Ad placeholder box, 30-sec timer, "+1 VERSE" button
  2. **Daily Check-in** — Big button, shows if done today, streak counter
  3. **Surveys** — List of available surveys with VERSE reward shown
  4. **Walk to Earn** — Info card (redirects to mobile app)
- Daily limits shown for each section
- Earning history for today

### REQ-05: NFT Pages
#### /nft (My Collection)
- Grid view of user's NFTs
- Each card: image, title, price if listed, "List for Sale" button
- "Create New NFT" button → /nft/create
- Empty state if no NFTs

#### /nft/create
- Image upload OR AI generate option
- AI generate: text prompt input + style selector + "Generate" button
- Preview of generated image
- Title + Description fields
- "Mint NFT" button (costs 10 VERSE shown)
- Loading states for generation and minting

#### /nft/[id]
- Full NFT detail: large image, title, description, owner
- If owner: "List for Sale" button with price input
- If listed: "Cancel Listing" button
- If not owner: "Buy Now" button with price
- Transaction history for this NFT

### REQ-06: Marketplace (/marketplace)
- Grid of all listed NFTs
- Filter bar: price range, newest, cheapest
- Search by title
- Each card: image, title, seller, price in VERSE
- "Buy Now" button on each card
- Pagination

### REQ-07: Profile Page (/profile)
- User info: username, email, avatar (initials fallback)
- Stats: Total earned, Total referrals, NFTs owned
- Referral section:
  - Unique referral link
  - Copy button
  - WhatsApp share button
  - Referral stats table
- Wallet address input (for crypto withdrawal)
- Edit profile form

### REQ-08: Withdraw Page (/withdraw)
- Method selector: EasyPaisa / JazzCash / USDT
- Amount input (in VERSE)
- Shows equivalent PKR/USD value
- Account number / wallet address field
- Minimum withdrawal notice
- Submit button
- Withdrawal history table (status: pending/approved/rejected)

### REQ-09: Transactions Page (/transactions)
- Full transaction history
- Filter by type: all, earn, withdrawal, nft
- Each row: date, type, amount, status
- Pagination

### REQ-10: Admin Panel (/admin)
- Password protected (simple check)
- Sidebar navigation

#### /admin/dashboard
- Stats cards: Total users, Total VERSE in circulation, Daily active users, Pending withdrawals
- Charts: Daily earnings, New users per day

#### /admin/withdrawals
- Table: user, method, amount, date, status
- Approve / Reject buttons with note input

#### /admin/users
- Search by username/email
- Table: username, balance, total earned, joined date, status
- Ban/Unban button

#### /admin/transactions
- All transactions log with filters

#### /admin/nfts
- All minted NFTs grid

---

## Shared Components Needed
- Navbar (public + authenticated versions)
- Sidebar (dashboard layout)
- VERSE balance display widget
- Transaction row component
- NFT card component
- Loading spinner
- Empty state component
- Modal component
- Toast notifications (react-hot-toast already installed)
- Protected route wrapper

## Layout Structure
- Public pages: Simple navbar + footer
- Dashboard pages: Sidebar + top navbar layout
- Admin pages: Admin sidebar layout

## Responsive Design
- Mobile first
- Sidebar collapses on mobile (hamburger menu)
- NFT grid: 1 col mobile, 2 col tablet, 3-4 col desktop
