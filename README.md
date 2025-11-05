# 💰 Loan Management System

🔗 **Live Project:** [https://loan-app-cyan.vercel.app/](https://loan-app-cyan.vercel.app/)

A modern **Loan Management Web App** built with **React, Vite, Chakra UI, and Firebase**.

---

## 📘 Overview

**Loan Management System** allows users to register/login, apply for loans through a guided multi-step process, compare available loan options, and track repayment schedules.

Authenticated routes are protected using a custom `PrivateRoute` component powered by **Firebase Authentication** and **React Context**.

---

## ✨ Features

- 🔐 **Authentication:** Email/Password authentication using Firebase (`src/context/AuthContext.jsx`)  
  Route protection via `src/components/PrivateRoute.jsx`.

- 🧾 **Multi-step Loan Application:**  
  Personal info, financial details, document upload, and review steps managed under `src/components/loan-application/*` and `src/pages/LoanApplication.jsx`.

- ⚖️ **Loan Comparison:**  
  Compare available loan plans at `src/pages/LoanComparison.jsx`.

- 📆 **Repayment Calendar:**  
  View loan repayment schedules at `src/pages/RepaymentCalendar.jsx`.

- 🧭 **Dashboard:**  
  Authenticated user dashboard in `src/pages/Dashboard.jsx`.

- 📱 **Responsive UI:**  
  Fully responsive design built using **Chakra UI** components.

- 🧭 **Routing:**  
  Implemented with **React Router v6** and protected routes.

---

## 🧰 Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | React 19, Vite 6, Chakra UI |
| **Routing** | React Router v6 |
| **State/Auth** | Firebase Authentication + React Context |
| **Database & Storage** | Firestore, Realtime Database, Firebase Storage, Analytics |
| **Tooling** | ESLint 9, Vite Plugin for React |

---

## 📂 Project Structure

```bash
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
⚙️ Environment Variables

Create a .env.local file (excluded from Git) based on .env.example with your Firebase configuration.

These values are loaded in src/config/firebase.js:

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

🚀 Getting Started
🧩 Prerequisites

Node.js LTS (v18+)

npm v9+

🛠️ Installation
# Install dependencies
npm install

🔧 Environment Setup

Copy .env.example → .env.local

Fill in your Firebase project credentials.

▶️ Run Locally
npm run dev


App runs with Vite Dev Server.
Open the printed local URL (e.g., http://localhost:5173) in your browser.

🧾 Available Scripts
Command	Description
npm run dev	Start Vite dev server
npm run build	Build for production (output to /dist)
npm run preview	Preview the production build locally
npm run lint	Lint the codebase using ESLint
🔒 Routing & Authentication
Route Type	Path	Description
Public	/, /login, /register	Accessible without login
Protected	/dashboard, /apply, /compare, /repayment	Require authentication

Route protection is implemented by wrapping elements with PrivateRoute in src/App.jsx.

🌐 Deployment

Deployment Platform: Vercel

The repository includes a vercel.json configuration for Vite SPA builds with single-page route rewrites.

Setting	Value
Build Command	npm run build
Output Directory	dist
SPA Rewrites	All routes rewrite to /index.html

To deploy:

Import your GitHub repository into Vercel.

Add the same environment variables (.env.local) in your Vercel project settings.

Deploy automatically from the main branch.

📜 License

This project is provided as-is.
Add a LICENSE file if you intend to open-source it under a specific license.

👨‍💻 Author

Developed by: Vibhuti sharma
Role: Engineering | Fullstack Developer
🌐 WebMorcha.com

⭐ If you found this project helpful, please give it a star on GitHub! ⭐
