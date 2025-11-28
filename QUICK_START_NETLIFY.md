# Quick Start: Deploy Backend to Netlify

## ✅ What's Done

Your Express server has been converted to **Netlify Functions**. All API endpoints are now serverless functions.

## 🚀 Quick Deployment Steps

### 1. Install Dependencies
```bash
npm install
```
(This installs `jsonwebtoken` and `bcryptjs` which are needed for the functions)

### 2. Set Environment Variables in Netlify

Go to **Netlify Dashboard** → **Your Site** → **Site settings** → **Environment variables** and add:

- `JWT_SECRET` - Generate a strong random string (e.g., use `openssl rand -hex 32`)
- `JWT_EXPIRES_IN` - Optional, default is `24h`
- `VITE_ADMIN_API_URL` - Your Netlify site URL (e.g., `https://your-site.netlify.app`)

### 3. Deploy

Just push to your repository. Netlify will:
- Build your site
- Deploy functions automatically
- Make APIs available at `/api/*`

## 📍 API Endpoints

All endpoints work the same as before:

- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile
- `PATCH /api/auth/password` - Update password
- `GET /api/projects` - List projects (admin)
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)
- `GET /api/public/projects` - Public projects list
- `GET /api/public/customizations` - Public customizations
- `GET /health` - Health check

## ⚠️ Important Notes

1. **File writes don't persist** - Password updates and project changes won't save. See `NETLIFY_BACKEND_GUIDE.md` for solutions.

2. **Admin users** - Read from `server/config/admin_users.json` (read-only)

3. **Projects** - Read from `src/data/projects.js` (read-only for writes)

## 🔄 Alternative: Separate Server

If you need persistent writes, deploy the Express server separately:
- **Railway**: https://railway.app
- **Render**: https://render.com  
- **Fly.io**: https://fly.io

Then update `VITE_ADMIN_API_URL` to point to your server.

## 📚 Full Documentation

See `NETLIFY_BACKEND_GUIDE.md` for complete details, limitations, and solutions.

