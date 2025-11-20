# TinyLink

A simple URL shortener application.

## Project Structure

- `/server` - Backend API (Node.js + Express + PostgreSQL)
- `/client` - Frontend UI (React + Vite)

## Quick Start

### Backend
```bash
cd server
npm install
# Configure .env file
npm run db:setup
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Access

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Redirects: http://localhost:5000/:code

## Features

- Create short links with auto-generated or custom codes
- HTTP 302 redirects
- Click tracking
- Search and filter links
- Delete links
- View link statistics

See individual README files in `/server` and `/client` for more details.
