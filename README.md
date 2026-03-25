# Felich Portfolio Backend

## Quick Start
```
npm install
cp .env.example .env
# Edit .env with your Gmail + App Password
npm start
```

Backend on **http://localhost:3001**
- `POST /api/contact` - Form submissions
- `GET /api/contacts` - View all messages
- Serves static frontend from /

## Frontend Integration
Update form action to `http://localhost:3001/api/contact`

## Features
✅ Email notifications
✅ JSON persistence
✅ Rate limiting (10/min/IP)
✅ CORS + Helmet security
✅ Production ready

**Deploy**: Railway/Render/any Node host
