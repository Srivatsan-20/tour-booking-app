#!/bin/bash

echo "Starting Tour Booking Application..."
echo

echo "[1/2] Starting Backend API..."
cd TourBookingAPI/TourBookingAPI
dotnet run &
BACKEND_PID=$!

echo "[2/2] Starting Frontend..."
cd ../../tour-booking-frontend
sleep 3
npm run dev &
FRONTEND_PID=$!

echo
echo "✅ Both services are starting..."
echo
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:5051"
echo "📚 API Docs: http://localhost:5051/swagger"
echo
echo "Press Ctrl+C to stop both services..."

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
