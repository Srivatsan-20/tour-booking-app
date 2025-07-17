# Development Guide

## 🚀 Quick Setup for New Developers

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
./setup.sh
```

### Option 2: Manual Setup

Follow the detailed instructions in [README.md](README.md)

## 🏃‍♂️ Running the Application

### Start Both Services

**Terminal 1 - Backend:**
```bash
cd TourBookingAPI/TourBookingAPI
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd tour-booking-frontend
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5051
- **API Documentation:** http://localhost:5051/swagger

## 🔧 Development Workflow

### Making Changes

1. **Backend Changes:**
   - Edit files in `TourBookingAPI/TourBookingAPI/`
   - The API will auto-reload on file changes
   - Test endpoints using Swagger UI

2. **Frontend Changes:**
   - Edit files in `tour-booking-frontend/src/`
   - Vite will auto-reload the browser
   - Check browser console for errors

### Database Changes

1. **Add new model or modify existing:**
   ```bash
   cd TourBookingAPI/TourBookingAPI
   dotnet ef migrations add YourMigrationName
   dotnet ef database update
   ```

2. **Reset database (if needed):**
   ```bash
   dotnet ef database drop
   dotnet ef database update
   ```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Dashboard loads and shows tour count
- [ ] Can create new booking via form
- [ ] Upcoming tours list displays bookings
- [ ] Can view individual tour details
- [ ] All navigation buttons work
- [ ] No console errors in browser

### API Testing

Use Swagger UI at http://localhost:5050/swagger to test:
- GET `/api/Bookings/Upcoming`
- POST `/api/Bookings`
- GET `/api/Bookings/{id}`

## 🐛 Common Issues & Solutions

### Backend Issues

**Issue:** `dotnet ef` command not found
**Solution:** Install EF Core tools globally:
```bash
dotnet tool install --global dotnet-ef
```

**Issue:** Database connection failed
**Solution:** 
- Ensure SQL Server is running
- Check connection string in `appsettings.json`
- Try using SQL Server Express LocalDB

**Issue:** Port 5051 already in use
**Solution:** Change port in `launchSettings.json`

### Frontend Issues

**Issue:** "Failed to fetch" errors
**Solution:**
- Ensure backend is running on port 5051
- Check browser console for CORS errors
- Verify API URLs in components

**Issue:** npm install fails
**Solution:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📁 Project Structure Details

### Backend (`TourBookingAPI/`)
```
TourBookingAPI/
├── Controllers/
│   ├── BookingsController.cs    # API endpoints
│   └── WeatherForecastController.cs
├── Models/
│   └── Booking.cs              # Data model
├── Data/
│   └── AppDbContext.cs         # Database context
├── Migrations/                 # EF Core migrations
├── Program.cs                  # App configuration
└── appsettings.json           # Configuration
```

### Frontend (`tour-booking-frontend/`)
```
src/
├── components/
│   ├── Admin_Dashboard.jsx     # Main dashboard
│   ├── BookingForm.jsx        # Booking form
│   ├── UpcomingToursList.jsx  # Tours list
│   └── TourDetail.jsx         # Tour details
├── App.jsx                    # Main app & routing
└── main.jsx                   # Entry point
```

## 🔄 Git Workflow

### Before Making Changes
```bash
git pull origin main
git checkout -b feature/your-feature-name
```

### After Making Changes
```bash
git add .
git commit -m "Description of changes"
git push origin feature/your-feature-name
```

### Create Pull Request
- Go to GitHub repository
- Create pull request from your branch to main
- Add description of changes
- Request review

## 🚀 Deployment

### Production Considerations

1. **Environment Variables:**
   - Update connection strings for production database
   - Configure CORS for production frontend URL

2. **Build Commands:**
   ```bash
   # Backend
   dotnet publish -c Release
   
   # Frontend
   npm run build
   ```

3. **Database:**
   - Run migrations in production
   - Ensure SQL Server is configured properly

## 📞 Support

If you encounter issues:
1. Check this development guide
2. Review the main README.md
3. Check browser console and API logs
4. Create an issue in the GitHub repository
