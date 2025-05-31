# 🛸 Sri Sai Senthil Tour Booking App

A full-stack application for managing tour bookings, buses, and trip accounts built with React and ASP.NET Core.

---

## 📁 Project Structure

```
tour-booking-app/
🔹 tour-booking-frontend/   # React frontend (Tailwind + Bootstrap)
🔹 tour-booking-backend/    # ASP.NET Core backend
```

---

## 💠 Local Setup Instructions

### ⚙ Prerequisites

Make sure these tools are installed:

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (for backend) with ASP.NET workload
- [.NET SDK 7.0+](https://dotnet.microsoft.com/download)
- [Git](https://git-scm.com/)
- Optional: SQL Server (or use SQLite)

---

## 🔄 Clone the Repository

```bash
git clone https://github.com/your-username/tour-booking-app.git
cd tour-booking-app
```

---

## 🔷 Setup Frontend (React)

```bash
cd tour-booking-frontend
npm install
npm run dev
```

- Runs on: `http://localhost:5173`
- API is expected at: `https://localhost:7040`

---

## ⚙️ Setup Backend (ASP.NET Core)

```bash
cd ../tour-booking-backend
dotnet restore
dotnet build
dotnet run
```

- Runs on: `https://localhost:7040`
- Swagger UI available at: `https://localhost:7040/swagger`

---

## 🌟 Key Features

### Booking Form
- Customer details
- Tour route
- Date validations
- Required field checks
- Booking success/failure alerts

### Admin Dashboard
- 🗕 View count of upcoming tours
- 📋 See detailed list of bookings
- 🔍 View full details per tour
- 📟 Export tour details as PDF (with logo, amount, balance info)
- 🔀 Navigate between dashboard and form

---

## 🖼 Logo

Your logo image is placed in:
```
tour-booking-frontend/public/logo.png
```

It is used in PDF export for branding.

---

## 🔪 Testing the App

1. Open Swagger UI: `https://localhost:7040/swagger`
2. POST a booking to `/api/Bookings`
3. Visit `http://localhost:5173/admin` to see the dashboard
4. Submit a booking or view existing ones

---

## ✏️ Customize Booking Rates (PDF)

To include custom booking charges (rent per bus, total rent, advance, balance):
- Go to: `TourDetail.jsx`
- Adjust `generatePDF` function logic and fields

---

## 📋 Sample Admin Navigation

- `/` → Admin Dashboard
- `/booking` → New Booking Form
- `/admin/upcoming-tours` → Upcoming Bookings
- `/admin/tour/:id` → Full Tour Detail + PDF Export

---

## ✍️ Author

**M.Srivatsan**  
Email: `manivannansrivatsan@gmail.com`  
Built for: **Sri Sai Senthil Tours & Travels**

---

## 🚀 Future Enhancements

- Bus availability calendar
- Admin login (auth)
- Trip-wise expenses breakdown
- Payment tracking dashboard

---

## ✅ Done Setting Up?

🔄 Commit your code:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/tour-booking-app.git
git push -u origin master
