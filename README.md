# Muzan Hackathon 2026 🚀

Welcome to the **Muzan Hackathon 2026** platform! This is a modern, high-performance, mobile-responsive event management system designed to handle the entire lifecycle of a hackathon. 

Built on the latest **Next.js 14 App Router** and powered entirely by **Firebase (Free Tier)**, this application is incredibly fast, real-time, and costs $0 to host.

## 🌟 Key Features

### 1. Role-Based Access Control
The application automatically routes users to customized dashboards based on their roles:
- **Organizer Dashboard**: Real-time stats, live check-in feed, track distribution charts, and a one-click QR code scanner.
- **Participant Dashboard**: View team status, submit projects, access the generated digital ID (QR Code), and receive live announcements.
- **Judge Dashboard**: (WIP) Grade submissions, view leaderboards, and evaluate projects.

### 2. Seamless QR Code Check-in
No more long lines at the registration desk. 
- Participants are automatically issued a unique QR code upon registration.
- Organizers can switch to the **"Scan Check-in"** page on their mobile phones and instantly scan participants' digital badges using their camera. The database updates in real-time!

### 3. Cyberpunk "Hackathon" Aesthetic
- Immersive, terminal-inspired UI with smooth glass-morphism, animated background terminal logs, and neon accents.
- Fully responsive design — looks just as good on a mobile phone as it does on a desktop.

### 4. 100% Free Firebase Backend
- **Firebase Auth**: Secure Email/Password authentication.
- **Firestore Database**: Real-time, scalable NoSQL database storing users, teams, submissions, and check-ins.
- We completely stripped out heavy SQL dependencies (like Prisma) to keep the repository under 1 MB and entirely serverless.

---

## 🛠️ Local Development Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Environment Variables
Rename the `.env.local.example` to `.env.local` (or create a new `.env.local` file) and fill in your Firebase credentials. 

Your `.env.local` should look like this:

```env
# Next.js / React Config (Firebase Client Setup)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Firebase Admin / Backend Config (Service Account)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nSuper\nLong\nKey\n-----END PRIVATE KEY-----\n"
```
*(Make sure to keep the exact `\n` characters in your private key string!)*

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🚀 Deployment (Free on Vercel)

Because this app utilizes Next.js App Router API routes, it is strongly recommended to host the frontend on **Vercel** rather than Firebase Hosting. Firebase Hosting requires upgrading to the paid "Blaze" plan to run Next.js backend code. Vercel is 100% free.

1. Create a free account on [Vercel](https://vercel.com/).
2. Click **Add New Project** and import your GitHub repository.
3. Open the **Environment Variables** tab and paste the entire contents of your `.env.local` file.
4. Click **Deploy**. Your app will be live globally in under a minute!

---

## 🏗️ Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion
- **Icons:** Lucide React
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Data Visualization:** Recharts
- **QR Engine:** react-qr-code & @yudiel/react-qr-scanner
