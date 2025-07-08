# Tour Booking Application

A full-stack tour booking application built with React frontend and .NET Core Web API backend.

## 🚀 Quick Start

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server** (LocalDB or SQL Server Express) - [Download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Git** - [Download here](https://git-scm.com/)

### 📥 Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/tour-booking-app.git
cd tour-booking-app
```

## 🏗️ Project Structure

```
tour-booking-app/
├── TourBookingAPI/          # Backend (.NET Core Web API)
│   ├── TourBookingAPI/      # Main API project
│   │   ├── Controllers/     # API controllers
│   │   ├── Models/         # Data models
│   │   ├── Data/           # Database context
│   │   └── Program.cs      # Application entry point
│   └── TourBookingAPI.sln  # Solution file
├── tour-booking-frontend/   # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # React components
│   │   └── App.jsx        # Main app component
│   └── package.json       # Node.js dependencies
└── README.md              # This file
```

## 🛠️ Setup Instructions

### 1. Backend Setup (.NET API)

1. **Navigate to the API directory:**
   ```bash
   cd TourBookingAPI/TourBookingAPI
   ```

2. **Restore NuGet packages:**
   ```bash
   dotnet restore
   ```

3. **Update database connection string (if needed):**
   - Open `appsettings.json`
   - Modify the connection string if your SQL Server setup is different:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=TourBookingDB;Trusted_Connection=True;TrustServerCertificate=True;"
     }
   }
   ```

4. **Create and update the database:**
   ```bash
   dotnet ef database update
   ```

5. **Run the API:**
   ```bash
   dotnet run
   ```

   The API will start on: `http://localhost:5050`
   Swagger UI available at: `http://localhost:5050/swagger`

### 2. Frontend Setup (React)

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd tour-booking-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on: `http://localhost:5173`

## 🌐 Application URLs

- **Frontend (React):** http://localhost:5173
- **Backend API:** http://localhost:5050
- **API Documentation (Swagger):** http://localhost:5050/swagger

## 📱 Features

- **Admin Dashboard:** Overview of upcoming tours and bookings
- **Tour Booking Form:** Create new tour bookings
- **Upcoming Tours List:** View all scheduled tours
- **Tour Details:** View detailed information for each booking
- **Responsive Design:** Works on desktop and mobile devices

## 🗄️ Database

The application uses SQL Server with Entity Framework Core. The database will be automatically created when you run `dotnet ef database update`.

### Database Schema

- **Bookings Table:** Stores all tour booking information
  - Customer details (name, phone)
  - Tour dates (start, end)
  - Locations (pickup, drop)
  - Bus information (type, count)
  - Passenger count and places to cover

## 🔧 Development

### API Endpoints

- `GET /api/Bookings/Upcoming` - Get upcoming bookings
- `POST /api/Bookings` - Create new booking
- `GET /api/Bookings/{id}` - Get booking by ID

### Frontend Components

- `Admin_Dashboard.jsx` - Main dashboard
- `BookingForm.jsx` - Tour booking form
- `UpcomingToursList.jsx` - List of upcoming tours
- `TourDetail.jsx` - Individual tour details

## 🚨 Troubleshooting

### Common Issues

1. **API not starting:**
   - Ensure SQL Server is running
   - Check connection string in `appsettings.json`
   - Run `dotnet ef database update`

2. **Frontend "Failed to fetch" errors:**
   - Ensure API is running on port 5050
   - Check browser console for CORS errors

3. **Database connection issues:**
   - Verify SQL Server is installed and running
   - Update connection string for your environment

### Port Configuration

- **API Port:** 5050 (configured in `launchSettings.json`)
- **Frontend Port:** 5173 (default Vite port)
- **CORS:** Configured to allow frontend on port 5173

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
