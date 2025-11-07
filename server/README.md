# Admin Server Setup

This directory contains the Express/MySQL backend that powers the admin panel. Follow these steps to configure and run it locally:

## 1. Install dependencies

```bash
cd server
npm install
```

## 2. Configure environment variables

Create a `.env` file inside the `server/` directory with the following keys:

```
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_admin

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=24h

ADMIN_EMAIL=admin@hamzaarya.dev
ADMIN_PASSWORD=change_this_password

CORS_ORIGIN=http://localhost:5173
```

Adjust the values to match your local MySQL setup. The `ADMIN_EMAIL` and `ADMIN_PASSWORD` values seed the first admin account when the database is initialised.

## 3. Initialise the database

```bash
npm run init-db
```

This script will:

- Create the database (if it does not exist)
- Set up the required tables
- Seed/ensure the admin user defined in your `.env`

## 4. Run the server

```bash
npm run dev
```

The server will start on `http://localhost:3001` by default.

## 5. Connect the frontend

In the frontend project, define the following Vite environment variables (e.g. in `.env.local`):

```
VITE_ADMIN_API_URL=http://localhost:3001
VITE_PUBLIC_API_URL=http://localhost:3001
```

These values allow the portfolio UI and the admin panel to communicate with the backend.

---

### Available API routes

- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PATCH /api/auth/password`
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/order`
- `GET /api/customizations`
- `PUT /api/customizations/key/:key`
- `GET /api/customizations/projects/:projectId`
- `PUT /api/customizations/projects/:projectId`
- `GET /api/public/projects`
- `GET /api/public/customizations`

All private routes (everything except `/api/public/*` and `/health`) require a valid bearer token.


