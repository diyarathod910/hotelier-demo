# 🏨 Hotelier

A modern hospitality-focused hotel search and comparison platform built with React, Supabase Authentication, Express.js, and the Hotelbeds API.

---

## 🌐 Live Demo

**Frontend:** https://hotelier-demo-mfao.vercel.app

---

## 📖 Overview

Hotelier is a hotel discovery and comparison application that allows users to search for hotels using real-time data from the Hotelbeds API.

Users can:

- Create an account and log in securely using Supabase Authentication.
- Search hotels based on travel dates, guests, rooms, and star ratings.
- View hotel information fetched from Hotelbeds.
- Enjoy a clean, responsive, and user-friendly experience.

The application uses a React frontend and an Express.js backend that securely communicates with the Hotelbeds API.

---

## ✨ Features

### 🔐 Authentication

- User Registration
- User Login
- Secure Session Management
- Protected Routes
- Supabase Authentication

### 🏨 Hotel Search

- Destination Search
- Check-in & Check-out Selection
- Guest Selection
- Room Selection
- Star Rating Filters
- Real-time Hotel Search

### 📋 Hotel Information

- Hotel Details
- Hotel Ratings
- Hotel Categories
- Descriptions
- Images
- Hotel Content from Hotelbeds

### 🎨 User Experience

- Responsive Design
- Modern UI
- Loading States
- Error Handling
- Fast Search Experience

---

## 🏗️ Architecture

```text
┌─────────────────────┐
│     React App       │
│     (Frontend)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Express Backend   │
│      (Render)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Hotelbeds API     │
└─────────────────────┘
```

Authentication Flow:

```text
User
  │
  ▼
Supabase Authentication
  │
  ▼
Authenticated Session
```

---

## 🛠️ Tech Stack

### Frontend

- React 18
- React Router DOM
- Tailwind CSS
- Axios
- Recharts

### Backend

- Node.js
- Express.js
- CORS
- Crypto-JS

### Authentication

- Supabase

### External API

- Hotelbeds API

### Deployment

- Vercel (Frontend)
- Render (Backend)

---

## 📂 Project Structure

```text
hotelier-demo/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   ├── hooks/
│   ├── assets/
│   ├── App.js
│   └── index.js
│
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

Backend Structure:

```text
backend/
│
├── server.js
├── package.json
└── .env
```

---

## ⚙️ Environment Variables

### Frontend (.env)

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=https://your-render-backend.onrender.com/api
```

### Backend (.env)

```env
HOTELBEDS_API_KEY=your_hotelbeds_api_key
HOTELBEDS_SECRET=your_hotelbeds_secret
PORT=4000
```

---

## 🚀 Local Development

### Clone Repository

```bash
git clone https://github.com/diyarathod910/hotelier-demo.git

cd hotelier-demo
```

### Install Frontend Dependencies

```bash
npm install
```

### Run Frontend

```bash
npm start
```

Application runs on:

```text
http://localhost:3000
```

---

## 🚀 Backend Setup

Navigate to backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Run server:

```bash
npm start
```

Backend runs on:

```text
http://localhost:4000
```

---

## 🔐 Supabase Setup

### Create Project

1. Create a Supabase project.
2. Open Authentication.
3. Enable Email Authentication.
4. Copy:

- Project URL
- Anon Key

5. Add them to frontend `.env`.

---

## 🏨 Hotelbeds Setup

### Create Developer Account

1. Register on Hotelbeds Developer Portal.
2. Generate API Key.
3. Generate Secret.
4. Add credentials to backend `.env`.

Example:

```env
HOTELBEDS_API_KEY=xxxxxxxx
HOTELBEDS_SECRET=xxxxxxxx
```

---

## 🌍 Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub.
2. Import repository in Vercel.
3. Add environment variables.
4. Deploy.

Frontend URL:

```text
https://your-app.vercel.app
```

---

### Backend Deployment (Render)

1. Create a Web Service.
2. Connect GitHub repository.
3. Configure:

```text
Build Command: npm install
Start Command: npm start
```

4. Add environment variables.
5. Deploy.

Backend URL:

```text
https://your-backend.onrender.com
```

---

## 🔒 Security

Sensitive credentials are stored using environment variables:

- Supabase Keys
- Hotelbeds API Keys
- Hotelbeds Secret Keys

No secrets are exposed to the frontend.

---

## 🎯 Future Improvements

- Hotel Detail Pages
- Favorites / Wishlist
- Booking Integration
- Search History
- User Profiles
- Advanced Filters
- Pagination
- Hotel Map View
- Price Comparison
- Multi-language Support

---
## Interview Notes
Auth flow: Supabase issues a JWT on sign-in, stored in localStorage by the SDK. AuthContext listens via onAuthStateChange. ProtectedRoute checks user before rendering pages.

API integration: hotelbeds.js generates a SHA256 signature per request. useInfiniteHotels hook manages pagination state and triggers searchHotels() via IntersectionObserver.

State management: Context API for auth + compare. useInfiniteHotels local state for hotel results. Compare selections persisted to localStorage.

Assumptions made:

Hotelbeds sandbox used in place of Amadeus/Sabre (both inaccessible for new registrations)
7-night rate trend chart uses simulated variance from base rate (Hotelbeds does not expose multi-date pricing in a single call without looping)



## 📄 License

This project is intended for educational and learning purposes.

---

## 👨‍💻 Author

### Diya Rathod

GitHub: https://github.com/diyarathod910

---

⭐ If you found this project helpful, consider giving it a star on GitHub.