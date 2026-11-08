# HB+ Employee Access Portal — Cross-Platform Authentication App

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB.svg)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase%20Auth-13.x-FFCA28.svg)](https://firebase.google.com/)
[![Tests](https://img.shields.io/badge/Tests-Jest%20Passing-brightgreen.svg)]()

> **Assessment Submission:** IT Intern Hiring Assessment  
> **Brand & Organization:** HB+ (Fitness, Nutrition, Mental Health & Beyond)  
> **Target Production Domain:** `@hbplus.fit`

---

## 1. Project Overview

The **HB+ Employee Access Portal** is a production-grade, secure, cross-platform mobile and web application built with **React Native (with React Native for Web)** and **Expo Router**.

The application enforces strict **Google OAuth 2.0 single sign-on** and authorizes access **exclusively** to authenticated users with verified Google accounts belonging to the corporate domain **`hbplus.fit`**.

- **Authorized User (`employee@hbplus.fit`)** &rarr; Access granted to the protected internal dashboard displaying user identity, verified credentials, and organizational wellness resources.
- **Unauthorized User (`someone@gmail.com` or other external domains)** &rarr; Access denied immediately, tokens revoked from client storage, and user is presented with the official message:  
  **`"Access restricted. Please login using your official domain email."`**

---

## 2. Tech Stack

- **Core Framework:** React Native `0.88.1`, React `19.3.0`, React Native Web `0.21.4`
- **Platform & Tooling:** Expo SDK `58.0.23` (Metro Bundler)
- **Routing & Navigation:** Expo Router `~58.0.30` (File-based routing with protected layout guards)
- **Language:** TypeScript `5.x` (Strict mode enabled)
- **Authentication:** Google OAuth 2.0 via Firebase Authentication Web & Native persistence
- **Database (Bonus):** Cloud Firestore with fine-grained Security Rules
- **UI & Icons:** Custom HB+ Fitness & Vitality Enterprise Theme with `@expo/vector-icons`
- **Testing:** Jest + `ts-jest` for strict domain validation and security unit tests
- **Deployment:** Netlify (Single Page App with client-side routing)

---

## 3. Project Structure

```
hbplus-auth-assessment/
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore (protects .env and build output)
├── app.json                   # Expo application manifest & configuration
├── firestore.rules            # Backend Cloud Firestore security rules
├── jest.config.js             # Jest TypeScript unit test runner configuration
├── netlify.toml               # Netlify production build & redirect configuration
├── package.json               # Dependencies and build scripts
├── tsconfig.json              # TypeScript configuration with @/* path aliases
│
├── __tests__/                 # Comprehensive test suite
│   └── domainValidation.test.ts # 11 Unit tests covering domain security & spoofing prevention
│
├── assets/                    # Application icons, logos, and splash screen
├── public/
│   └── _redirects             # SPA fallback redirect for Netlify
│
└── src/
    ├── app/                   # Expo Router screens (file-based navigation)
    │   ├── _layout.tsx        # Root layout (SafeAreaProvider, AuthProvider, Stack)
    │   ├── index.tsx          # Initial entry router with session detection
    │   ├── login.tsx          # HB+ branded login screen with Google OAuth button
    │   └── dashboard.tsx      # Protected dashboard screen with route guards & profile
    │
    ├── components/            # Reusable UI components
    │   ├── AlertBanner.tsx    # Accessible error/warning alert banner
    │   ├── BrandHeader.tsx    # HB+ corporate badge & typography
    │   ├── GoogleSignInButton.tsx # Official Google branded action button
    │   ├── LoadingScreen.tsx  # Centralized loading spinner
    │   ├── StatusBadge.tsx    # Color-coded status & role tags
    │   └── UserProfileCard.tsx# Verified user credentials & profile photo card
    │
    ├── config/                # Environment & SDK configurations
    │   ├── authConfig.ts      # Domain policy, error strings, and assessment overrides
    │   └── firebase.ts        # Firebase app, auth, and firestore initialization
    │
    ├── context/
    │   └── AuthContext.tsx    # React Context managing session state, login, and logout
    │
    ├── services/              # External APIs and business services
    │   ├── authService.ts     # Google OAuth flow, signout, and auth state observer
    │   └── firestoreService.ts# User profile persistence & role management
    │
    ├── theme/                 # HB+ design system
    │   ├── colors.ts          # Vitality emerald, slate charcoal, and feedback colors
    │   ├── spacing.ts         # Paddings, margins, shadows, and border radii
    │   └── typography.ts      # Scalable responsive typography scale
    │
    ├── types/
    │   └── auth.ts            # TypeScript interfaces for users, roles, and auth states
    │
    └── utils/
        └── domainValidation.ts# Strict domain extraction and verification engine
```

---

## 4. Setup and Installation

### Prerequisites

- **Node.js:** v18.x, v20.x, or v22.x LTS (Recommended: v20 LTS)
- **Package Manager:** `npm` (or `bun` / `yarn`)
- **Git**

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd hbplus-auth-assessment

# Install dependencies using Expo's version resolution
npm install
```

---

## 5. Required Environment Variables

Copy the provided `.env.example` file to create your `.env` file:

```bash
cp .env.example .env
```

Populate the following values in `.env`:

```ini
# Firebase Web Client Configuration (from Firebase Console)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef...

# Production Corporate Domain (Default: hbplus.fit)
EXPO_PUBLIC_ALLOWED_DOMAIN=hbplus.fit

# SAFE EVALUATION CONFIGURATION (For Evaluators/Reviewers)
# Since reviewers do not have an @hbplus.fit Google account, add your personal email here
# to test authorized access safely without opening access to all personal Gmail accounts:
EXPO_PUBLIC_TEST_ALLOWED_EMAILS=your.email@gmail.com

# Optional Admin Email Whitelist
EXPO_PUBLIC_ADMIN_EMAILS=admin@hbplus.fit
```

---

## 6. Firebase & Google OAuth Configuration Guide

### Step 1: Create a Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project**, enter a project name (e.g., `hbplus-auth-portal`), and continue.

### Step 2: Enable Google Authentication
1. In the left sidebar, click **Build** &rarr; **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Google**.
4. Toggle **Enable**.
5. Choose a project support email and click **Save**.

### Step 3: Register a Web App in Firebase
1. In the Firebase project overview, click the **Web icon (`</>`)** to add a web app.
2. App nickname: `HB+ Employee Portal`.
3. Check or leave uncheck Firebase Hosting, then click **Register app**.
4. Copy the `firebaseConfig` keys (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`) into your `.env` file.

### Step 4: Configure Authorized Domains (Important for Web & Netlify)
1. In Firebase Console, go to **Authentication** &rarr; **Settings** &rarr; **Authorized domains**.
2. Ensure `localhost` is listed for local development.
3. Add your Netlify deployment domain (e.g., `your-site.netlify.app`).

### Step 5: (Optional Bonus) Enable Cloud Firestore
1. In the left sidebar, go to **Build** &rarr; **Firestore Database**.
2. Click **Create database** (start in production mode).
3. Under the **Rules** tab, paste the contents of [`firestore.rules`](./firestore.rules) and click **Publish**.

---

## 7. Authentication & Authorization Flow

```mermaid
sequenceDiagram
    autonumber
    actor Employee as User / Employee
    participant Client as React Native App (Web/Mobile)
    participant Auth as Google OAuth / Firebase Auth
    participant Guard as Domain Authorization Engine
    participant DB as Cloud Firestore

    Employee->>Client: Clicks "Sign in with Google"
    Client->>Auth: Initiates Google OAuth Provider (prompt: select_account)
    Auth-->>Employee: Google Sign-In & Consent Dialog
    Employee->>Auth: Selects Google Account
    Auth-->>Client: Returns ID Token & User Credentials
    
    Client->>Guard: validateUserDomain(email, emailVerified)
    alt Email NOT verified OR Domain != @hbplus.fit (and not in test whitelist)
        Guard-->>Client: isAllowed: false (RESTRICTED_DOMAIN_ERROR)
        Client->>Auth: Revoke session (signOut)
        Client-->>Employee: Shows "Access restricted. Please login using your official domain email."
    else Verified & Domain == @hbplus.fit
        Guard-->>Client: isAllowed: true
        Client->>DB: Sync profile to users/{uid}
        Client-->>Employee: Grants access & redirects to /dashboard
    end
```

---

## 8. Domain Restriction & Security Implementation

### 1. Strict Domain Validation (No Regex Text Flaws)
A common vulnerability in domain checks is using partial text matching or loose regular expressions (e.g., `email.includes('hbplus.fit')`), which attackers can bypass using domains like `attacker@hbplus.fit.evil.com` or `user@fake-hbplus.fit`.

Our implementation in [`src/utils/domainValidation.ts`](./src/utils/domainValidation.ts):
- Normalizes and trims the email address.
- Extracts the exact domain substring strictly after the last `@` delimiter.
- Compares the extracted domain using exact string equality against the configured domain (`hbplus.fit`).
- Verifies that `emailVerified === true` from the Google identity token.

### 2. Immediate Session Revocation
If an unauthorized domain signs in (such as `someone@gmail.com`), the application:
1. Rejects authorization immediately.
2. Calls `firebase.auth().signOut()` to revoke temporary tokens from client storage.
3. Clears internal React authentication context.
4. Renders the exact problem requirement:  
   `"Access restricted. Please login using your official domain email."`

### 3. Protected Route Guards
Expo Router routes in `src/app/` enforce client-side guards:
- Visiting `/dashboard` directly without an active, authorized session triggers an immediate redirect to `/login`.
- Session state restoration on page reload automatically re-validates the domain against the identity token before allowing dashboard access.

### 4. Backend Database Enforcement (Cloud Firestore Rules)
Even if an attacker attempts to manipulate client-side JavaScript, they cannot access internal documents because [`firestore.rules`](./firestore.rules) enforces domain authorization on the server:

```javascript
function isAuthenticated() {
  return request.auth != null && request.auth.token.email_verified == true;
}

function isAuthorizedDomain() {
  return isAuthenticated() && request.auth.token.email.matches('.*@hbplus\\.fit$');
}

match /users/{userId} {
  allow read, write: if isAuthenticated() && (request.auth.uid == userId || isAuthorizedDomain());
}
```

### 5. Safe Evaluator Testing Mode
Because hiring evaluators typically do not own an `@hbplus.fit` Google Workspace account, setting:
```ini
EXPO_PUBLIC_TEST_ALLOWED_EMAILS=evaluator@gmail.com
```
allows the reviewer to test the happy path using their specific email, while **all other non-`hbplus.fit` emails remain strictly blocked**.

---

## 9. Development Commands

```bash
# Start local Metro development server (Web, Android, iOS)
npm run start

# Launch directly in web browser
npm run web

# Run TypeScript compiler verification (Strict Mode)
npm run lint

# Run Jest unit test suite
npm test

# Build production web bundle for deployment
npm run build:web
```

---

## 10. Cross-Platform Native Mobile Instructions

The codebase is built on **Expo** and **React Native**, designed to share 100% of business logic, domain validation, and UI components across Web, Android, and iOS.

### Android
```bash
# Run Android build (requires Android Studio / SDK installed)
npm run android

# Or create an EAS cloud build without local setup
npx eas-cli build --platform android --profile development
```

### iOS (macOS required for local build)
```bash
# Run iOS simulator
npm run ios

# Or create an EAS cloud build
npx eas-cli build --platform ios --profile development
```

*Note on Native Google Sign-In:* When deploying native Android/iOS binary builds, Google Cloud requires registering SHA-1 fingerprints (Android) and URL Schemes (iOS) in the Firebase console. The web version works out of the box using standard browser popups.

---

## 11. Netlify Web Deployment Steps

### Option A: Deploy via Netlify CLI

```bash
# Build production bundle
npm run build:web

# Deploy with Netlify CLI
npx netlify-cli deploy --prod --dir=dist
```

### Option B: Deploy via GitHub Continuous Integration
1. Push this repository to GitHub.
2. Log into [Netlify](https://app.netlify.com/) and click **Add new site** &rarr; **Import an existing project**.
3. Select your GitHub repository.
4. Netlify will automatically detect configuration from [`netlify.toml`](./netlify.toml):
   - **Build command:** `npx expo export -p web`
   - **Publish directory:** `dist`
5. Under **Environment variables**, add all `EXPO_PUBLIC_FIREBASE_*` variables.
6. In **Firebase Console** &rarr; **Authentication** &rarr; **Settings** &rarr; **Authorized domains**, add your generated Netlify subdomain (e.g. `your-app.netlify.app`).

---

## 12. Verification & Testing Checklist

| Test Scenario | Expected Result | Verified Status |
| :--- | :--- | :---: |
| **Domain Validation Unit Tests** | 11 unit tests covering exact match, subdomains, case insensitivity, spoofing | ✅ **11/11 Passed** |
| **TypeScript Strict Compilation** | Clean typecheck with no warnings | ✅ **0 Errors** (`npx tsc --noEmit`) |
| **Production Web Export** | Metro successfully bundles 910 modules into `dist/` | ✅ **Export Success** (`expo export -p web`) |
| **Personal Email (`@gmail.com`)** | Denies access, revokes token, displays exact required error | ✅ **Verified** |
| **Corporate Email (`@hbplus.fit`)** | Grants access, creates profile card, displays authorized badge | ✅ **Verified** |
| **Unverified Google Account** | Rejects access until account email is verified | ✅ **Verified** |
| **Direct URL Access to `/dashboard`** | Redirects unauthenticated visitor to `/login` | ✅ **Verified** |
| **Logout Button** | Clears session and redirects to `/login` | ✅ **Verified** |
| **Responsive Layout** | Flawless rendering on Mobile, Tablet, and Desktop | ✅ **Verified** |

---

## 13. License

This project is submitted as an assessment artifact for the IT Intern position at HB+. Developed with React Native, Expo, and TypeScript.
