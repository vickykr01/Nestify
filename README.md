# Nestify

Nestify is a full-stack PG discovery and booking platform with a React + Vite frontend and an Express + MongoDB backend. It lets users browse PG listings, filter by city, view property details, send booking requests, leave reviews, and contact the team. An admin can log in to manage listings, monitor bookings, and verify properties.

## Project Structure

```text
Nestify/
|-- Backend/    # Express API, MongoDB models, auth, bookings, contact, uploads
|-- Frontend/   # React + Vite client
|-- vercel.json
```

## Features

- Browse PG listings with search and city filters
- View property details, facilities, ratings, and reviews
- Submit booking requests
- Admin login with protected dashboard routes
- Add, edit, verify, and delete PG listings
- Upload listing images with Cloudinary
- Send contact notifications through email and WhatsApp when configured

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS, Leaflet
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer, Cloudinary
- Notifications: Nodemailer, Twilio WhatsApp

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string
- Cloudinary account for image uploads
- Optional: Gmail/SMTP credentials and Twilio WhatsApp credentials

## Environment Variables

Create `Backend/.env` and add the values your setup needs.

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

SMTP_USER=your_email@example.com
SMTP_PASS=your_email_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_FROM=your_email@example.com
CONTACT_NOTIFICATION_EMAIL=owner@example.com

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
CONTACT_WHATSAPP_TO=whatsapp:+91xxxxxxxxxx
```

Create `Frontend/.env` if you want the frontend to point to a separate backend origin in development or production.

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Installation

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd Frontend
npm install
```

## Running Locally

Start the backend:

```bash
cd Backend
node server.js
```

Start the frontend:

```bash
cd Frontend
npm run dev
```

By default:

- Frontend runs on Vite's local dev server
- Backend runs on `http://localhost:5000`

## API Overview

Main backend routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/pgs`
- `GET /api/pgs/:id`
- `POST /api/pgs`
- `PUT /api/pgs/:id`
- `DELETE /api/pgs/:id`
- `POST /api/pgs/:id/reviews`
- `DELETE /api/pgs/:id/reviews/:reviewId`
- `PUT /api/pgs/:id/verify`
- `POST /api/bookings`
- `GET /api/bookings`
- `PUT /api/bookings/:id`
- `POST /api/contact`

## Notes

- `MONGO_URL` and `JWT_SECRET` are required for the backend to start.
- Cloudinary credentials are required for PG image uploads.
- Contact form email and WhatsApp notifications work only when the related credentials are configured.
- Some admin actions are protected by JWT-based auth middleware.

