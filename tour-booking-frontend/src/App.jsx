import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import NavigationHeader from "./components/NavigationHeader";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./components/SignIn";
import Admin_Dashboard from "./components/Admin_Dashboard";
import DriverDashboard from "./components/DriverDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import BookingForm from "./components/BookingForm";
import UpcomingToursList from "./components/UpcomingToursList";
import TourDetail from "./components/TourDetail";
import AddTripAccount from "./components/AddTripAccount";
import TripAccountsList from "./components/TripAccountsList";
import TripAccountDetail from "./components/TripAccountDetail";
import EditTripAccount from "./components/EditTripAccount";
import PDFPreview from "./components/PDFPreview";
import BusOnboarding from "./components/BusOnboarding";
import BusFleetManagement from "./components/BusFleetManagement";
import BusAllocationDashboard from "./components/BusAllocationDashboard";
import BusAllocationDetail from "./components/BusAllocationDetail";
import BusDetails from "./components/BusDetails";
import BusEdit from "./components/BusEdit";
import DriverTripDetail from "./components/DriverTripDetail";
import DriverExpenseManagement from "./components/DriverExpenseManagement";
import CustomerBookingDetail from "./components/CustomerBookingDetail";
import CustomerPayment from "./components/CustomerPayment";
import UserProfile from "./components/UserProfile";
import SmartTourPlanner from "./components/SmartTourPlanner";
import AdminUserManagement from "./components/AdminUserManagement";
import DriverTrips from "./components/DriverTrips";
import CustomerSupport from "./components/CustomerSupport";
import BusAvailabilityCalendar from "./components/BusAvailabilityCalendar";

// Public Components
import PublicLayout from "./components/PublicLayout";
import PublicHomepage from "./components/PublicHomepage";
import PublicSearchResults from "./components/PublicSearchResults";
import PublicBooking from "./components/PublicBooking";
import PublicAbout from "./components/PublicAbout";
import PublicContact from "./components/PublicContact";
import PublicRegister from "./components/PublicRegister";
import BookingConfirmation from "./components/BookingConfirmation";

// Component to handle role-based dashboard routing
const DashboardRouter = () => {
  const { user, hasRole } = useAuth();

  if (hasRole('admin') || hasRole('manager')) {
    return <Admin_Dashboard />;
  } else if (hasRole('driver')) {
    return <DriverDashboard />;
  } else if (hasRole('customer')) {
    return <CustomerDashboard />;
  } else {
    return <Navigate to="/signin" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<PublicHomepage />} />
            <Route path="search" element={<PublicHomepage />} />
            <Route path="search-results" element={<PublicSearchResults />} />
            <Route path="book" element={<PublicBooking />} />
            <Route path="booking-confirmation" element={<BookingConfirmation />} />
            <Route path="about" element={<PublicAbout />} />
            <Route path="contact" element={<PublicContact />} />
            <Route path="register" element={<PublicRegister />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />

          {/* Admin Dashboard Routes */}
          <Route path="/admin/*" element={
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <NavigationHeader />
              <main style={{ flex: 1 }}>
                <ProtectedRoute>
                  <Routes>
                    <Route index element={<DashboardRouter />} />
                    <Route path="upcoming-tours" element={<UpcomingToursList />} />
                    <Route path="tour/:id" element={<TourDetail />} />
                    <Route path="bus-fleet" element={<BusFleetManagement />} />
                    <Route path="bus-onboarding" element={<BusOnboarding />} />
                    <Route path="bus-allocation" element={<BusAllocationDashboard />} />
                    <Route path="bus-allocation/:id" element={<BusAllocationDetail />} />
                    <Route path="bus/:id" element={<BusDetails />} />
                    <Route path="bus/:id/edit" element={<BusEdit />} />
                    <Route path="bus-calendar" element={<BusAvailabilityCalendar />} />
                    <Route path="trip-accounts" element={<TripAccountsList />} />
                    <Route path="trip-accounts/add" element={<AddTripAccount />} />
                    <Route path="trip-accounts/:id" element={<TripAccountDetail />} />
                    <Route path="trip-accounts/:id/edit" element={<EditTripAccount />} />
                    <Route path="users" element={<AdminUserManagement />} />
                    <Route path="pdf-preview" element={<PDFPreview />} />
                    <Route path="settings" element={<div>Settings Page</div>} />
                  </Routes>
                </ProtectedRoute>
              </main>
              <Footer />
            </div>
          } />

          {/* Other Protected Routes */}
          <Route path="/booking" element={
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <NavigationHeader />
              <main style={{ flex: 1 }}>
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              </main>
              <Footer />
            </div>
          } />

          <Route path="/tour-planner" element={
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <NavigationHeader />
              <main style={{ flex: 1 }}>
                <ProtectedRoute>
                  <SmartTourPlanner />
                </ProtectedRoute>
              </main>
              <Footer />
            </div>
          } />

          <Route path="/profile" element={
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <NavigationHeader />
              <main style={{ flex: 1 }}>
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              </main>
              <Footer />
            </div>
          } />

          {/* Driver Routes */}
          <Route path="/driver/*" element={
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <NavigationHeader />
              <main style={{ flex: 1 }}>
                <ProtectedRoute>
                  <Routes>
                    <Route index element={<DriverDashboard />} />
                    <Route path="trips" element={<DriverTrips />} />
                    <Route path="trips/:id" element={<DriverTripDetail />} />
                    <Route path="expenses" element={<DriverExpenseManagement />} />
                  </Routes>
                </ProtectedRoute>
              </main>
              <Footer />
            </div>
          } />

          {/* Customer Routes */}
          <Route path="/customer/*" element={
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <NavigationHeader />
              <main style={{ flex: 1 }}>
                <ProtectedRoute>
                  <Routes>
                    <Route index element={<CustomerDashboard />} />
                    <Route path="bookings" element={<div>Customer Bookings</div>} />
                    <Route path="bookings/:id" element={<CustomerBookingDetail />} />
                    <Route path="payment" element={<CustomerPayment />} />
                    <Route path="support" element={<CustomerSupport />} />
                  </Routes>
                </ProtectedRoute>
              </main>
              <Footer />
            </div>
          } />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
