# TinyLink - Frontend

React frontend for the TinyLink URL shortener.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Features

- Create short links with auto-generated or custom codes
- View all links in a table
- Search and filter links
- View individual link statistics
- Copy short URLs to clipboard
- Delete links

## Configuration

Backend API is proxied through Vite (see `vite.config.js`).
