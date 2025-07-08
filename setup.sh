#!/bin/bash

echo "========================================"
echo "Tour Booking Application Setup"
echo "========================================"
echo

echo "[1/4] Setting up Backend (.NET API)..."
cd TourBookingAPI/TourBookingAPI

echo "Restoring NuGet packages..."
dotnet restore
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to restore NuGet packages"
    exit 1
fi

echo "Updating database..."
dotnet ef database update
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to update database"
    echo "Make sure SQL Server is running"
    exit 1
fi

echo "Backend setup complete!"
echo

echo "[2/4] Setting up Frontend (React)..."
cd ../../tour-booking-frontend

echo "Installing npm packages..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install npm packages"
    exit 1
fi

echo "Frontend setup complete!"
echo

echo "[3/4] Setup Summary:"
echo "✓ Backend dependencies installed"
echo "✓ Database created/updated"
echo "✓ Frontend dependencies installed"
echo

echo "[4/4] Ready to run!"
echo
echo "To start the application:"
echo "1. Backend: cd TourBookingAPI/TourBookingAPI && dotnet run"
echo "2. Frontend: cd tour-booking-frontend && npm run dev"
echo
echo "URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:5050"
echo "- API Docs: http://localhost:5050/swagger"
echo

cd ..
echo "Setup completed successfully!"
