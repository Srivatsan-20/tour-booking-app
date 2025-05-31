import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin_Dashboard from "./components/Admin_Dashboard";
import BookingForm from "./components/BookingForm";
import UpcomingToursList from "./components/UpcomingToursList";
import TourDetail from "./components/TourDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Admin_Dashboard />} />
        <Route path="/" element={<Admin_Dashboard />} /> // Make this the home
        <Route path="/admin" element={<Admin_Dashboard />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/admin/upcoming-tours" element={<UpcomingToursList />} />
        <Route path="/admin/tour/:id" element={<TourDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
