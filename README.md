# Fahad Al Noman — Portfolio & Digital Agency Platform

A high-performance, modern web application and portfolio for **Fahad Al Noman** — Full-Stack Developer & Business Automation Consultant based in Qormi, Malta.

The platform showcases custom web and mobile app development, CRM/ERP solutions, AI automation workflows, and technical SEO/digital marketing services for clients worldwide.

---

## ⚡ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool & Bundler**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Studio CSS Tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components & Icons**: [Radix UI](https://www.radix-ui.com/) Primitives & [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) (with route-level code splitting)
- **Markdown & Content**: `react-markdown`, `remark-gfm`, `rehype-raw`, `rehype-sanitize`
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **SEO & Pre-rendering**: Static route pre-rendering engine (`prerender.cjs`) + Dynamic XML Sitemap generation

---

## 🌟 Key Features

1. **Interactive Studio Showcase**
   - High-end aesthetics with custom smooth animations and glassmorphism.
   - Comprehensive service categories: Business Automation, Custom CRM/ERP, Web & App Development, UI/UX Design, and SEO.
   - 20+ practical business automation examples.
   - Voice assistant tour integration with transcript synchronization.

2. **Full Page Experience**
   - **Home**: Dynamic interactive introduction, services breakdown, project highlights, and FAQs.
   - **Services**: Detailed service descriptions, technology stacks, and implementation scopes.
   - **Portfolio**: Filterable real-world project catalog with direct links and deliverables.
   - **Pricing**: Transparent pricing tiers, modular add-ons, and estimate calculator.
   - **Blog**: Markdown-powered article system with syntax rendering and SEO metadata.
   - **About**: Professional background, career timeline, DevOps experience, and verified certifications.
   - **Contact**: Direct communication form, live WhatsApp chat modal, and active social channels.

3. **SEO & Structured Data Engine**
   - Automated pre-rendering (`prerender.cjs`) ensuring all pages are 100% crawlable without client-side JavaScript.
   - Rich JSON-LD Structured Data: `Person`, `WebSite`, `WebPage`, `OfferCatalog`, `Service`, `ItemList`, and `FAQPage`.
   - Open Graph and Twitter Card tags across all pages.
   - Automated sitemap generator (`scripts/generate-sitemap.cjs`) and validation tests (`scripts/verify-home-seo.mjs`).

4. **Privacy & Analytics Compliance**
   - Built-in GDPR cookie consent banner with granular analytics/marketing preferences.
   - Google Analytics 4 (GA4) integration gated strictly by user consent.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **npm**: `v9.0.0` or higher

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/fahadnomanofficial/portfolio.git

# Navigate to project directory
cd portfolio

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Define the backend API URL:

```env
VITE_API_URL=https://admin.zurvix.com/api
```

---

## 💻 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173/`. |
| `npm run build` | Compiles TypeScript, runs Vite production build, generates HTML prerendered pages, and updates the sitemap. |
| `npm run preview` | Locally serves the production build in `./dist`. |
| `npm run sitemap` | Regenerates `public/sitemap.xml` and updates `public/robots.txt`. |
| `node scripts/verify-home-seo.mjs` | Runs SEO assertion suite verifying schemas, meta tags, and crawlable markup. |

---

## ☁️ Deploying to Vercel

This repository is optimized for one-click deployment on [Vercel](https://vercel.com/).

### Deployment Steps:

1. **Push to GitHub**:
   Ensure all changes are committed and pushed to your GitHub repository:
   ```bash
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository: `fahadnomanofficial/portfolio`.

3. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://admin.zurvix.com/api`

5. **Deploy**:
   Click **Deploy**. Vercel will build the application, pre-render the static HTML files, and deploy to their global Edge network.

### Routing Configuration (`vercel.json`)

Single Page Application (SPA) routing is handled by [`vercel.json`](./vercel.json):
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📁 Project Structure

```text
├── .21st/                     # Design tokens & specifications
├── public/                    # Static assets (images, icons, robots.txt, sitemap.xml)
├── scripts/
│   ├── generate-sitemap.cjs   # Automated sitemap generator script
│   └── verify-home-seo.mjs    # Automated SEO assertion suite
├── src/
│   ├── api/                   # REST API client & endpoints
│   ├── components/            # UI & portfolio feature components
│   │   └── portfolio/         # Studio sections, tour, header, footer, modals
│   ├── hooks/                 # Custom React hooks (SEO, cookies, state)
│   ├── lib/                   # Project utilities and schema definitions
│   ├── pages/                 # Route pages (Home, About, Services, Pricing, etc.)
│   ├── App.tsx                # App router, suspense fallbacks, analytics listener
│   ├── main.tsx               # React DOM entry point
│   └── style.css              # Global styles and Tailwind base
├── index.html                 # HTML shell with default meta tags & JSON-LD
├── prerender.cjs              # Post-build static HTML pre-rendering script
├── tsconfig.json              # TypeScript compiler configuration
├── vercel.json                # Vercel deployment rewrites configuration
├── vite.config.ts             # Vite configuration with Tailwind v4 & chunk splitting
└── package.json               # Dependencies and build scripts
```

---

## 📬 Contact & Inquiries

- **Author**: Fahad Al Noman
- **Website**: [fahadalnoman.com](https://fahadalnoman.com/)
- **Email**: [hello@fahadalnoman.com](mailto:hello@fahadalnoman.com)
- **LinkedIn**: [linkedin.com/in/fahad-al-noman-555039411](https://www.linkedin.com/in/fahad-al-noman-555039411/)
- **Location**: Qormi, Malta

---

## 📄 License

This project is proprietary and all rights are reserved by Fahad Al Noman.
