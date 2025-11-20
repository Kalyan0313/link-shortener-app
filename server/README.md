# TinyLink - URL Shortener

A simple URL shortener application built with Node.js, Express, and PostgreSQL.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (see `.env.example`):
```env
DATABASE_URL=postgresql://username:password@localhost:5432/tinylink
PORT=5000
NODE_ENV=development
```

3. Setup database:
```bash
npm run db:setup
```

4. Start server:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

- `POST /api/links` - Create short link
- `GET /api/links` - Get all links
- `GET /api/links/:code` - Get link details
- `DELETE /api/links/:code` - Delete link
- `GET /:code` - Redirect to target URL
- `GET /healthz` - Health check

## Environment Variables

See `.env.example` for required variables.
