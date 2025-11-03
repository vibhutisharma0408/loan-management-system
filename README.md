# Loan Management System
project link - https://loan-app-cyan.vercel.app/
Modern loan management web app built with React, Vite, Chakra UI, and Firebase.

## Overview

This application enables users to register/login, apply for loans via a guided multi-step form, compare loan options, and track repayment schedules. Authenticated routes are protected using a custom `PrivateRoute` with context-driven Firebase Auth.

## Features

- **Authentication**: Firebase Email/Password auth via `src/context/AuthContext.jsx` and route protection in `src/components/PrivateRoute.jsx`.
- **Multi-step Loan Application**: Personal, financial, and document upload steps under `src/components/loan-application/*` and `src/pages/LoanApplication.jsx`.
- **Loan Comparison**: Compare loan options on `src/pages/LoanComparison.jsx`.
- **Repayment Calendar**: View repayment plan on `src/pages/RepaymentCalendar.jsx`.
- **Dashboard**: Authenticated user dashboard at `src/pages/Dashboard.jsx`.
- **Responsive UI**: Built with Chakra UI components.
- **Routing**: React Router v6 with protected routes.

## Tech Stack

- **Frontend**: React 19, Vite 6, Chakra UI
- **Routing**: React Router v6
- **State/Auth**: Firebase Auth with React Context
- **Data**: Firebase Firestore, Realtime Database, Storage, Analytics
- **Tooling**: ESLint 9, Vite plugin for React

## Project Structure

```
src/
  App.jsx
  main.jsx
  context/
    AuthContext.jsx
  config/
    firebase.js
  components/
    Navbar.jsx
    PrivateRoute.jsx
    loan-application/
      PersonalInfo.jsx
      FinancialInfo.jsx
      DocumentUpload.jsx
      Review.jsx
      LoanDetails.jsx
  pages/
    Home.jsx
    Login.jsx
    Register.jsx
    Dashboard.jsx
    LoanApplication.jsx
    LoanComparison.jsx
    RepaymentCalendar.jsx
  styles/
    main.css
```

## Environment Variables

Create a `.env.local` (not committed) based on `.env.example` with your Firebase configuration. These variables are read in `src/config/firebase.js`:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

## Getting Started

- **Prerequisites**
  - Node.js LTS (>=18 recommended)
  - npm 9+

- **Install dependencies**
  ```bash
  npm install
  ```

- **Environment setup**
  1. Copy `.env.example` to `.env.local`.
  2. Fill in Firebase values from your Firebase project settings.

- **Run locally**
  ```bash
  npm run dev
  ```
  App runs with Vite dev server. Open the printed local URL in your browser.

## Available Scripts

- `npm run dev` – Start Vite dev server
- `npm run build` – Production build to `dist/`
- `npm run preview` – Preview the production build locally
- `npm run lint` – Lint the codebase with ESLint

## Routing and Auth

- Public routes: `/`, `/login`, `/register`
- Protected routes (require login): `/dashboard`, `/apply`, `/repayment`, `/compare`
- Protection implemented by wrapping route elements with `PrivateRoute` in `src/App.jsx`.

## Deployment

The repository includes `vercel.json` configured for a Vite SPA build and SPA rewrites:

- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite: all routes rewrite to `/index.html`

You can deploy on Vercel by importing the repo and setting the same environment variables there.

## License

This project is provided as-is. Add a license file if you intend to open-source under a specific license.
