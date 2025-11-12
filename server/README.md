# Admin Server (JSON Auth Only)

This backend provides authentication for the admin panel using a local JSON file. No database is required.

## 1. Install dependencies

```bash
cd server
npm install
```

## 2. Configure environment variables

Create a `.env` file in `server/`:

```
PORT=3001
NODE_ENV=development
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
```

## 3. Admin users JSON

Credentials are stored in `server/config/admin_users.json` as bcrypt hashes. Example:

```json
[
  {
    "id": 1,
    "email": "admin@hamza.dev",
    "password_hash": "$2b$12$..."
  }
]
```

To generate a hash:

```bash
node -e "require('bcryptjs').hash('YourNewPassword', 12).then(h=>console.log(h))"
```

Replace the `password_hash` in `admin_users.json` with the printed hash.

## 4. Run the server

```bash
npm run dev
```

Server runs at `http://localhost:3001`.

## 5. Connect the frontend

In the frontend project `.env.local`:

```
VITE_ADMIN_API_URL=http://localhost:3001
VITE_PUBLIC_API_URL=http://localhost:3001
```

Restart the frontend dev server and open the admin at `/admin`.

---

## Available API routes

- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PATCH /api/auth/password`
- `GET /health`

All private routes require a valid bearer token.


