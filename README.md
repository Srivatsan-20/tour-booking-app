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

### Option 1: VS Code One-Click Setup (Recommended)

1. **Open in VS Code:**
   ```bash
   code .
   ```

2. **Install recommended extensions** when prompted

3. **Run the application:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Tasks: Run Task"
   - Select "Start Full Application"

   **OR**

   - Press `F5` and select "Launch Full Application"

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5050
   - API Docs: http://localhost:5050/swagger

### Option 2: Manual Setup

#### 1. Backend Setup (.NET API)

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

#### 2. Frontend Setup (React)

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

### VS Code Features

This project includes VS Code configuration for the best development experience:

- **One-click run**: Press `F5` to start both backend and frontend
- **Integrated debugging**: Debug both .NET and React code
- **Task runner**: Use `Ctrl+Shift+P` → "Tasks: Run Task" for various operations
- **Recommended extensions**: Auto-suggested when opening the project
- **IntelliSense**: Full code completion for C# and JavaScript/React

### Available VS Code Tasks

- **Start Full Application**: Runs both backend and frontend
- **Start Backend API**: Runs only the .NET API
- **Start Frontend**: Runs only the React app
- **Setup Project**: Installs all dependencies
- **Install Backend Dependencies**: Restores NuGet packages
- **Install Frontend Dependencies**: Installs npm packages

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
