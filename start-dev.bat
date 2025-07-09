@echo off
echo Starting Tour Booking Application...
echo.

echo [1/2] Starting Backend API...
start "Backend API" cmd /k "cd TourBookingAPI\TourBookingAPI && dotnet run"

echo [2/2] Starting Frontend...
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd tour-booking-frontend && npm run dev"

echo.
echo ✅ Both services are starting...
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:5050
echo 📚 API Docs: http://localhost:5050/swagger
echo.
echo Press any key to close this window...
pause >nul
