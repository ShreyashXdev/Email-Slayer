# ⚔️ Email Slayers

> **A 2D Action "Catch-and-Shoot" Gamified Productivity App for Email Inbox Zero.**

Transform your dreaded email inbox chore into an arcade vertical action game. Unread emails fall from the sky as colorful rock monsters (Geodude-style) displaying the sender's name. Control a martial artist hero at the bottom of the screen to shoot junk emails straight into the trash or trap important emails in a net for final review!

---

## 🕹️ Controls & Battle Rules

| Control / Input | Character Action | Monster Effect | Real Email Action |
| :--- | :--- | :--- | :--- |
| **Move**<br>`← / → Arrow Keys` | Moves the Jin Kazama-style character left & right | Lines up beneath falling rock monsters | Lets you read the **Sender Name** hovering above the monster. |
| **KILL**<br>`Z Key` or `[KILL] Button` | Character shoots gun upward | Destroys monster with gunshot & explosion sound | Moves the email directly to **Recycle Bin / Trash**. |
| **CAPTURE**<br>`X Key` or `[CAPTURE] Button` | Character throws net upward | Traps monster with netting visual & chime sound | Saves the email for the **Post-Game Review Room**. |
| **Review Room**<br>`End-of-Game Dashboard` | Inspect captured monsters in a grid | Choose to **KILL** or **RELEASE** each email | **KILL** deletes to Trash; **RELEASE** safely archives in Inbox. |

---

## 🚀 Game Loop & Features

1. **Start Screen (Main Menu)**: Massive glowing arcade title with pulsating neon blue backlight effects and retro arcade sound synthesizer.
2. **Phase 1: 2D Canvas Engine**: 60 FPS HTML5 Canvas engine with sprite animations, particle explosions, muzzle flashes, and dynamic audio synthesized via Web Audio API.
3. **Phase 2: State & API Layer**: In-memory state tracking populated by 20 unread email objects, with extensible REST route handlers (`/api/emails`, `/api/emails/trash`, `/api/emails/archive`).
4. **Phase 3: Post-Game Dashboard**:
   - **Scoreboard**: Detailed kill vs. capture breakdown with percentage gauges.
   - **The Review Room**: Grid of captured emails with one-click **KILL** or **RELEASE** options.
   - **OAuth / IMAP Ready**: Pre-wired handler stubs ready for Google OAuth (Gmail API), Microsoft Graph (Outlook), or direct IMAP credentials.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Game Engine**: HTML5 Canvas with custom 2D physics, sprite renderer, and particle system
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom neon arcade theme & CRT scanline overlays
- **Audio**: Web Audio API procedural sound synthesizer (No external audio asset dependencies)
- **Backend / Integration**: Next.js Route Handlers (`app/api/emails/*`) with OAuth/IMAP integration placeholders

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18.0 or higher recommended)
- `npm` or `pnpm`

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ShreyashXdev/Email-Slayer.git
   cd Email-Slayer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) and press **ENTER** or click **PLAY GAME**!

---

## 🔐 Environment & OAuth Integration

Placeholders for production OAuth credentials can be configured in a `.env.local` file (automatically ignored by Git):

```env
# Google / Gmail API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google

# Microsoft Graph / Outlook
AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret
AZURE_TENANT_ID=your_azure_tenant_id
```

---

## 📜 License
MIT License. Built for hackathons, productivity gaming, and inbox zero warriors!
