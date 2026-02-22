# Jad Ghader Portfolio

Personal portfolio website for `jadghader.com`, built with React + TypeScript and deployed on Firebase Hosting.

## Live Website

- https://jadghader.com

## Overview

This project is my personal portfolio to showcase:

- Professional experience
- Featured projects
- Technical skills
- Contact and collaboration channels

The UI is built with a modern animated style, theme support, and responsive layouts for desktop and mobile.

## Dynamic Firebase Content (Highlighted)

This portfolio is built around a **dynamic content architecture using Firebase Firestore**.

- Core website sections are loaded from Firestore at runtime.
- Content can be updated in Firestore without redeploying frontend code.
- The UI components render Firestore-driven data with loading skeletons and safe fallbacks.

Primary collection pattern used:

- `siteContent/hero`
- `siteContent/about`
- `siteContent/experience`
- `siteContent/projects`
- `siteContent/skills`
- `siteContent/contact`
- `siteContent/navbar`

## Features

- Multi-section one-page portfolio:
  - Hero
  - About
  - Experience
  - Projects
  - Skills
  - Contact
- **Dynamic content fetched from Firestore (`siteContent` documents)**
- **Content-first workflow: update data in Firebase to refresh portfolio content without code edits**
- Contact form powered by EmailJS
- WhatsApp quick contact CTA
- Dark/light theme toggle with persisted preference
- Animated interactions with Motion
- Reusable skeleton loaders while content is loading
- Firebase Hosting deployment configuration for SPA routing

## Tech Stack

- React 18
- TypeScript
- Styled Components
- Motion / Framer Motion
- Firebase (Firestore, Analytics, Hosting)
- EmailJS
- Lucide + React Icons

## Project Structure

```txt
src/
  components/        # Portfolio sections and UI pieces
  context/           # Theme context/provider
  firebase/          # Firestore helpers
  interfaces/        # Type definitions for Firestore content
  styles/            # Global styles, theme tokens, mixins
  utils/             # Utility helpers
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env.local` file in the project root:

```env
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
```

### 3) Run locally

```bash
npm start
```

The app will run at `http://localhost:3000`.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build production bundle into `build/`
- `npm test` - Run tests

## Content Management

Most portfolio content is read from Firestore documents under `siteContent` (for example: hero, about, projects, skills, contact, navbar).

This makes it easy to update portfolio content without changing component code.

Content flow:

1. Update document content in Firestore
2. App fetches data via `src/firebase/firestore.ts`
3. Sections render updated content dynamically

## Deployment

Production is configured via Firebase Hosting (`firebase.json`) with SPA rewrites:

- `public` directory: `build`
- all routes rewrite to `index.html`

Typical deployment flow:

```bash
npm run build
firebase deploy --only hosting:prod
```

## License

This project is licensed under the MIT License. See `LICENSE` for details.
