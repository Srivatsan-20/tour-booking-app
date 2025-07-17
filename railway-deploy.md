# Railway Deployment Guide

## 🚀 Deploy Tour Booking App to Railway

### Prerequisites
1. GitHub account
2. Railway account (sign up at railway.app)
3. Your code pushed to GitHub

### Step 1: Prepare Backend for Railway

Create `railway.json` in TourBookingAPI/TourBookingAPI/:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "dotnet run --urls=http://0.0.0.0:$PORT",
    "healthcheckPath": "/health"
  }
}
```

### Step 2: Update Connection String for Railway
In `appsettings.json`, add Railway database support:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=tour_booking.db",
    "PostgreSQL": "${DATABASE_URL}"
  }
}
```

### Step 3: Deploy Backend
1. Go to railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select TourBookingAPI/TourBookingAPI folder
6. Railway will auto-detect .NET and deploy

### Step 4: Deploy Frontend
1. Create new Railway service
2. Select same repository
3. Choose tour-booking-frontend folder
4. Add environment variable: REACT_APP_API_BASE_URL=https://your-backend-url.railway.app
5. Deploy

### Step 5: Add Database
1. In Railway dashboard, click "Add Service"
2. Select "PostgreSQL"
3. Railway will provide DATABASE_URL automatically

### Expected URLs:
- Backend: https://your-app-name-backend.railway.app
- Frontend: https://your-app-name-frontend.railway.app
- Database: Managed by Railway

### Cost: FREE
- $5 monthly credit
- Enough for development/small production use
