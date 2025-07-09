import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin_Dashboard from "./components/Admin_Dashboard";
import BookingForm from "./components/BookingForm";
import UpcomingToursList from "./components/UpcomingToursList";
import TourDetail from "./components/TourDetail";
import AddTripAccount from "./components/AddTripAccount";
import TripAccountsList from "./components/TripAccountsList";
import TripAccountDetail from "./components/TripAccountDetail";
import EditTripAccount from "./components/EditTripAccount";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Admin_Dashboard />} />
        <Route path="/admin" element={<Admin_Dashboard />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/admin/upcoming-tours" element={<UpcomingToursList />} />
        <Route path="/admin/tour/:id" element={<TourDetail />} />
        <Route path="/admin/trip-accounts" element={<TripAccountsList />} />
        <Route path="/admin/trip-accounts/add" element={<AddTripAccount />} />
        <Route path="/admin/trip-accounts/:id" element={<TripAccountDetail />} />
        <Route path="/admin/trip-accounts/:id/edit" element={<EditTripAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
