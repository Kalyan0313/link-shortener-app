# TinyLink - Frontend

React frontend for the TinyLink URL shortener.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# For local development, create .env.local
VITE_API_URL=http://localhost:5000/api

# For production, use .env.production (already configured)
VITE_API_URL=https://bitly-assignment.onrender.com/api
```

3. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The production build will automatically use the `.env.production` file.

## Features

- Create short links with auto-generated or custom codes
- View all links in a table
- Search and filter links
- View individual link statistics
- Copy short URLs to clipboard
- Delete links

## Configuration

The API URL is configured via environment variables:
- **Development**: Create `.env.local` with `VITE_API_URL=http://localhost:5000/api`
- **Production**: Uses `.env.production` with deployed backend URL

