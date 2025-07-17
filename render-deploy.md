# Render Deployment Guide

## 🌟 Deploy Tour Booking App to Render (100% FREE)

### Step 1: Create render.yaml
Create this file in your project root:

```yaml
services:
  # Backend API
  - type: web
    name: tour-booking-api
    env: dotnet
    buildCommand: cd TourBookingAPI/TourBookingAPI && dotnet publish -c Release -o out
    startCommand: cd TourBookingAPI/TourBookingAPI/out && dotnet TourBookingAPI.dll --urls=http://0.0.0.0:$PORT
    envVars:
      - key: ASPNETCORE_ENVIRONMENT
        value: Production
      - key: DATABASE_URL
        fromDatabase:
          name: tour-booking-db
          property: connectionString

  # Frontend
  - type: web
    name: tour-booking-frontend
    env: node
    buildCommand: cd tour-booking-frontend && npm install && npm run build
    startCommand: cd tour-booking-frontend && npx serve -s build -l $PORT
    envVars:
      - key: REACT_APP_API_BASE_URL
        value: https://tour-booking-api.onrender.com

databases:
  - name: tour-booking-db
    databaseName: tour_booking
    user: tour_user
```

### Step 2: Deploy to Render
1. Go to render.com
2. Sign up with GitHub
3. Click "New +"
4. Select "Blueprint"
5. Connect your GitHub repository
6. Render will read render.yaml and deploy everything

### Expected URLs:
- Backend: https://tour-booking-api.onrender.com
- Frontend: https://tour-booking-frontend.onrender.com
- Database: Managed PostgreSQL

### Cost: 100% FREE
- No credit limits
- Free PostgreSQL for 90 days
- Free SSL certificates
