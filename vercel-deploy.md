# Vercel + Supabase Deployment

## 🚀 Modern Serverless Deployment (100% FREE)

### Why This Stack:
- **Vercel**: Free frontend hosting with global CDN
- **Supabase**: Free PostgreSQL database with 500MB storage
- **Railway**: Free .NET API hosting

### Step 1: Deploy Frontend to Vercel
1. Go to vercel.com
2. Import your GitHub repository
3. Select tour-booking-frontend folder
4. Add environment variables:
   - REACT_APP_API_BASE_URL: https://your-api.railway.app
5. Deploy

### Step 2: Setup Supabase Database
1. Go to supabase.com
2. Create new project
3. Get connection string from Settings > Database
4. Use this for your Railway API deployment

### Step 3: Deploy API to Railway
1. Use Railway for .NET API (as described above)
2. Use Supabase connection string for database

### Expected URLs:
- Frontend: https://your-app.vercel.app
- Backend: https://your-api.railway.app
- Database: Supabase managed PostgreSQL

### Benefits:
- Global CDN for frontend
- Serverless scaling
- Professional URLs
- 100% free for small apps
