# Sri Sai Senthil Tours - Complete Booking System

A comprehensive tour booking system with separate back-office management and customer-facing website.

## 🚀 Quick Start (F5 Experience)

### Option 1: Using NPM Scripts (Recommended)
```bash
npm start
```
This will start all three applications simultaneously:
- Backend API (http://localhost:5050)
- Back Office (http://localhost:3001) 
- Customer Website (http://localhost:3000)

### Option 2: Using Batch Script (Windows)
```bash
start-all.bat
```

### Option 3: Using PowerShell Script
```powershell
.\start-all.ps1
```

### Option 4: Using Visual Studio
1. Open `TourBookingSystem.sln` in Visual Studio
2. Press F5 to run the backend API
3. Open two additional terminals and run:
   ```bash
   cd tour-booking-frontend && npm start
   cd customer-booking-website && npm start
   ```

## 📋 System Components

### 🔧 Backend API
- **Technology**: ASP.NET Core 8 Web API
- **Database**: SQL Server with Entity Framework Core
- **Port**: http://localhost:5050
- **Swagger**: http://localhost:5050/swagger

### 🏢 Back Office (Admin System)
- **Technology**: React 18 with TypeScript
- **Purpose**: Internal management system
- **Port**: http://localhost:3001
- **Features**: Bus management, bookings, trip accounts, user management

### 🌐 Customer Website
- **Technology**: React 18 with TypeScript
- **Purpose**: Public-facing booking website
- **Port**: http://localhost:3000
- **Features**: Bus search, booking, customer accounts, reviews

## 🛠️ Prerequisites

### Required Software
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **.NET 8 SDK**
- **SQL Server** (LocalDB or full instance)

### Installation
1. Clone the repository
2. Install root dependencies:
   ```bash
   npm install
   ```
3. Install all project dependencies:
   ```bash
   npm run setup
   ```

## 📁 Project Structure

```
tour-booking-app/
├── TourBookingAPI/              # Backend API
│   └── TourBookingAPI/
│       ├── Controllers/         # API Controllers
│       ├── Models/             # Data Models
│       ├── Services/           # Business Logic
│       └── Data/               # Database Context
├── tour-booking-frontend/       # Back Office (Admin)
│   ├── src/
│   │   ├── components/         # React Components
│   │   ├── pages/              # Page Components
│   │   └── services/           # API Services
├── customer-booking-website/    # Customer Website
│   ├── src/
│   │   ├── components/         # React Components
│   │   └── services/           # API Services
├── start-all.bat               # Windows Batch Script
├── start-all.ps1               # PowerShell Script
├── package.json                # Root Package Configuration
└── TourBookingSystem.sln       # Visual Studio Solution
```

## 🔗 Available Scripts

### Root Level Scripts
- `npm start` - Start all applications
- `npm run dev` - Start with colored output and labels
- `npm run build` - Build all frontend applications
- `npm run test` - Run all tests
- `npm run setup` - Install all dependencies
- `npm run clean` - Clean all node_modules

### Individual Application Scripts
- `npm run start:backend` - Start only backend API
- `npm run start:backoffice` - Start only back office
- `npm run start:customer` - Start only customer website

## 🌐 Application URLs

| Application | URL | Purpose |
|-------------|-----|---------|
| Backend API | http://localhost:5050 | REST API |
| Swagger Docs | http://localhost:5050/swagger | API Documentation |
| Back Office | http://localhost:3001 | Admin Management |
| Customer Site | http://localhost:3000 | Public Booking |

## 🗄️ Database Setup

The system uses SQL Server with Entity Framework Core migrations.

### First Time Setup
1. Ensure SQL Server is running
2. Update connection string in `appsettings.json` if needed
3. Run migrations:
   ```bash
   cd TourBookingAPI/TourBookingAPI
   dotnet ef database update
   ```

### Database Features
- **Bus Management** - Fleet information and availability
- **Booking System** - Both admin and customer bookings
- **User Management** - Admin users and customer accounts
- **Trip Accounts** - Expense tracking and financial management
- **Reviews & Ratings** - Customer feedback system
- **Photo Management** - Bus image storage and organization

## 🎯 Key Features

### Back Office Features
- ✅ Bus fleet management
- ✅ Booking management and tracking
- ✅ Trip expense accounting
- ✅ User role management
- ✅ Smart tour planner with Google Maps
- ✅ Financial dashboard and reporting
- ✅ PDF generation for contracts

### Customer Website Features
- ✅ Bus search and filtering
- ✅ Real-time availability checking
- ✅ Online booking system
- ✅ Customer account management
- ✅ Review and rating system
- ✅ Responsive mobile design
- ✅ Professional UI/UX

### API Features
- ✅ RESTful API design
- ✅ Swagger documentation
- ✅ CORS enabled for frontend integration
- ✅ Entity Framework Core with migrations
- ✅ Comprehensive error handling
- ✅ Photo upload capabilities

## 🔧 Development

### Adding New Features
1. **Backend**: Add controllers, services, and models in `TourBookingAPI`
2. **Back Office**: Add components in `tour-booking-frontend/src`
3. **Customer Site**: Add components in `customer-booking-website/src`

### Running Tests
```bash
npm test                    # All tests
npm run test:backoffice    # Back office tests only
npm run test:customer      # Customer website tests only
```

### Building for Production
```bash
npm run build              # Build all frontend apps
```

## 🚀 Deployment

### Development Environment
- All applications run on localhost with different ports
- Hot reload enabled for frontend applications
- Swagger UI available for API testing

### Production Considerations
- Configure proper connection strings
- Set up reverse proxy (nginx/IIS)
- Enable HTTPS
- Configure environment variables
- Set up proper logging and monitoring

## 📞 Support

For technical support or questions about the system, please refer to the documentation or contact the development team.

## 🎉 Success!

When you run `npm start` or press F5, you should see:
1. ✅ Backend API starting on port 5050
2. ✅ Back Office starting on port 3001  
3. ✅ Customer Website starting on port 3000
4. ✅ All applications opening in your browser automatically

**The complete Sri Sai Senthil Tours booking system is now ready for use!**
