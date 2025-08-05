# 📣 NotifyOps – Scalable Email & SMS Notification System

A full-stack, production-ready notification platform for sending, scheduling, and managing email/SMS notifications at scale. Built using **Node.js, Redis, PostgreSQL, and Next.js** with clean authentication, background job processing, and analytics.

> ⚙️ Clean architecture · 🚀 Deployed to Vercel & Railway · 🔐 Auth-secured · 📊 Real-time dashboard

---

## 🔗 Live Links

- **Frontend**: [notifyops.vercel.app](https://notifyopss.vercel.app)
- **API**: [dheenotifications-api.railway.app](https://dheenotifications-api.railway.app)

---

## ✨ Features

### ✅ Core Functionality
- 🔐 JWT-based auth (register/login)
- 📤 Send single or bulk notifications
- ⏰ Schedule notifications for future
- 💾 Background queue via Redis + BullMQ
- 🧠 Retry logic, error handling, rate limiting
- 📊 Analytics: Success rate, charts, trends
- 🔍 Logs: Status, attempts, error details

### 📦 Channels Supported
- ✉️ **Email** (SMTP-based)
- 📱 **SMS** (Twilio)

---

## 🛠 Tech Stack

| Frontend     | Backend        | Infra & DevOps       |
|--------------|----------------|-----------------------|
| Next.js (App Router) | Node.js + Express | PostgreSQL (Prisma ORM) |
| Tailwind CSS + Chart.js | Redis + BullMQ | Docker + Railway |
| Axios + Toasts | JWT, bcrypt, Helmet | Vercel (Frontend) |


---

## ⚙️ Quickstart

### 🔧 Backend

```bash
cd backend
cp .env.example .env          # Setup your environment variables
npm install
npx prisma migrate dev        # Apply DB migrations
npm run dev                   # Start API server
````

### 💻 Frontend

```bash
cd frontend
cp .env.example .env.local    # Configure NEXT_PUBLIC_API_URL
npm install
npm run dev                   # Runs on http://localhost:3000
```

### 🧵 Start Queue Worker

```bash
cd backend
npm run worker                # Processes notifications from Redis queue
```

---

## 🧪 Example `.env` Files

### backend/.env

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/dheenotifications
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your_app_password

TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

PORT=5000
```

### frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🔒 Security Highlights

* Secure password hashing (`bcryptjs`)
* Environment-based secrets (`dotenv`)
* CORS restrictions + Helmet headers
* API rate limiting
* Centralized error handling

---

## 🧾 API Endpoints

### Auth

* `POST /auth/register`
* `POST /auth/login`
* `GET /auth/profile`

### Notify

* `POST /notify/send` – send immediately
* `POST /notify/schedule` – delay message
* `POST /notify/bulk` – upload CSV

### Logs

* `GET /logs` – paginated logs
* `GET /logs/analytics` – charts data

---

## 📊 Dashboard

* Real-time success/failure metrics
* Channel distribution charts
* Date-wise trends
* Interactive filters and pagination

---


## 👨‍💻 Author

**Dheemanth Madaiah**
[Portfolio](https://dheemanthmadaiah.vercel.app) · [Email](mailto:dheemanthmadaiah@gmail.com)

---




