# Running Backend Services on Netlify

## Overview

Your Express server has been converted to **Netlify Functions** (serverless functions). Netlify doesn't support running Express servers directly, but all your API endpoints are now available as serverless functions.

## ✅ Converted Endpoints

All your Express routes are now available as Netlify Functions:

### Authentication
- `POST /api/auth/login` → `netlify/functions/api/auth/login.js`
- `GET /api/auth/profile` → `netlify/functions/api/auth/profile.js`
- `PATCH /api/auth/password` → `netlify/functions/api/auth/password.js`

### Projects (Admin)
- `GET /api/projects` → `netlify/functions/api/projects/index.js`
- `POST /api/projects` → `netlify/functions/api/projects/index.js`
- `PUT /api/projects/:id` → `netlify/functions/api/projects/index.js`
- `DELETE /api/projects/:id` → `netlify/functions/api/projects/index.js`

### Public APIs
- `GET /api/public/projects` → `netlify/functions/api/public/projects.js`
- `GET /api/public/customizations` → `netlify/functions/api/public/customizations.js`

### Health Check
- `GET /health` → `netlify/functions/health.js`

## 📦 Required Dependencies

The Netlify Functions need these packages. Add them to your root `package.json`:

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.2"
  }
}
```

These are already in your `server/package.json`, but Netlify Functions use the root `package.json` dependencies.

## 🔧 Environment Variables

Set these in **Netlify Dashboard** → **Site settings** → **Environment variables**:

### Required
- `JWT_SECRET` - Secret key for JWT tokens (use a strong random string)
- `JWT_EXPIRES_IN` - Token expiration (default: `24h`)

### Optional
- `NODE_ENV` - Set to `production` for production

## ⚠️ Important Limitations

### 1. File Writes Don't Persist

**Problem**: Netlify Functions run in a read-only filesystem (except `/tmp`). Writing to files like `admin_users.json` or `projects.js` won't persist between function invocations.

**Solutions**:
- **Option A**: Use a database (recommended)
  - [Fauna](https://fauna.com/) - Serverless database
  - [Supabase](https://supabase.com/) - PostgreSQL
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - MongoDB
  - [PlanetScale](https://planetscale.com/) - MySQL

- **Option B**: Use external storage
  - [Netlify Blobs](https://docs.netlify.com/blobs/overview/) - Key-value store
  - [GitHub API](https://docs.github.com/en/rest) - Store in repo (read-only in production)

- **Option C**: Keep using separate server
  - Deploy Express server separately (Railway, Render, Fly.io)
  - Update `VITE_ADMIN_API_URL` to point to the server

### 2. Admin Users

The `admin_users.json` file is read-only in Netlify Functions. Password updates won't persist.

**Workaround**: 
- For password changes, manually update `server/config/admin_users.json` in your repo and redeploy
- Or migrate to a database

### 3. Projects Data

Project CRUD operations won't persist. Changes are lost after the function execution.

**Workaround**: 
- Use a database for projects
- Or use GitHub API to commit changes to `src/data/projects.js`

## 🚀 Deployment Steps

1. **Install dependencies** (if not already):
   ```bash
   npm install jsonwebtoken bcryptjs
   ```

2. **Set environment variables in Netlify**:
   - Go to Netlify Dashboard → Your Site → Site settings → Environment variables
   - Add `JWT_SECRET` (generate a strong random string)
   - Add `JWT_EXPIRES_IN` (optional, default: `24h`)

3. **Deploy to Netlify**:
   - Connect your repository
   - Netlify will auto-detect `netlify.toml`
   - Build will run automatically

4. **Update frontend environment variables**:
   - In Netlify, set `VITE_ADMIN_API_URL` to your Netlify site URL
   - Example: `https://your-site.netlify.app`
   - This makes the admin panel use Netlify Functions instead of localhost

## 🔄 Alternative: Deploy Express Server Separately

If you need persistent file writes, deploy the Express server separately:

### Option 1: Railway
1. Create account at [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Set root directory to `server/`
4. Add environment variables
5. Deploy

### Option 2: Render
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Set root directory to `server/`
5. Add environment variables
6. Deploy

### Option 3: Fly.io
1. Install Fly CLI
2. Run `fly launch` in `server/` directory
3. Deploy with `fly deploy`

Then update `VITE_ADMIN_API_URL` in Netlify to point to your server URL.

## 🧪 Testing

After deployment, test the endpoints:

```bash
# Health check
curl https://your-site.netlify.app/health

# Login
curl -X POST https://your-site.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hamza.dev","password":"your-password"}'

# Get profile (with token)
curl https://your-site.netlify.app/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Notes

- All functions are automatically available at `/api/*` paths
- Functions have a 10-second timeout (can be increased to 26s on Pro plan)
- Cold starts may add 1-2 seconds latency on first request
- Functions scale automatically

## 🎯 Recommended Approach

For production, I recommend:

1. **Use Netlify Functions for authentication** (read-only, works fine)
2. **Use a database for projects** (Fauna or Supabase are easy to set up)
3. **Keep admin_users.json in repo** (read-only, update via git)

This gives you the best of both worlds: serverless scaling with persistent data.

