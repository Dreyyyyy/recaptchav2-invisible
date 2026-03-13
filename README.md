# recaptchav2-invisible

A minimal playground for **reCAPTCHA v2 Invisible**: React (Vite) frontend and Node (Express) backend, with server-side token verification.

## What’s implemented

- **Frontend (React + Vite + TypeScript)**  
  - Form with a submit button bound to reCAPTCHA v2 Invisible (no checkbox; small badge only).  
  - On submit, reCAPTCHA runs (invisibly or with a challenge), then a global callback receives the token and sends it to the backend.

- **Backend (Node + Express)**  
  - `POST /api/verify-recaptcha`: accepts `{ token }`, calls Google’s `siteverify` API with the secret key, and returns the result (e.g. `{ success, ... }`).  
  - CORS enabled for the frontend dev server.  
  - Health check: `GET /` returns `OK`.

- **Flow**  
  1. User clicks Submit → reCAPTCHA executes.  
  2. On success, callback gets the token and `fetch`es `/api/verify-recaptcha`.  
  3. Backend verifies the token with Google and responds; frontend can allow or block the action based on `success`.

## Prerequisites

- Node.js (backend uses built-in `fetch`; Node 18+ recommended).  
- A reCAPTCHA v2 **Invisible** site in the [reCAPTCHA Admin](https://admin.google.com/recaptcha) (not checkbox, not v3). Add `localhost` (and any other domains) to the site’s domains.

## Environment variables

- **Frontend** (`frontend/.env`):  
  - `VITE_RECAPTCHA_SITE_KEY` — reCAPTCHA site key (public).

- **Backend** (`backend/.env`):  
  - `SECRET_KEY` — reCAPTCHA secret key (never commit).  
  - Optional: `PORT` (default `3000`).

## Project structure

```
recaptchav2-invisible/
├── frontend/          # React + Vite app
│   ├── .env
│   ├── index.html     # loads reCAPTCHA api.js
│   └── src/
│       └── App.tsx    # form, g-recaptcha button, callback, fetch to backend
├── backend/
│   ├── .env
│   ├── server.js      # Express app, /api/verify-recaptcha, siteverify call
│   └── package.json
└── README.md
```

## How to run

1. **Backend** (keep this terminal open):

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   You should see “Server file loaded (JS)” and “Server is running on port 3000”. Visit `http://localhost:3000/` to confirm.

2. **Frontend** (separate terminal):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open the URL Vite prints (e.g. `http://localhost:5173/`), use the form, and check the browser console for the token and the backend verification result.

## References

- [Invisible reCAPTCHA (Google)](https://developers.google.com/recaptcha/docs/invisible)  
- [Verify the user’s response](https://developers.google.com/recaptcha/docs/verify) (server-side)
