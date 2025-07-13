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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NavigationHeader />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/signin" element={<SignIn />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />

              {/* Admin/Manager Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole={['admin', 'manager']}>
                    <Admin_Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/upcoming-tours"
                element={
                  <ProtectedRoute requiredPermission="manage_bookings">
                    <UpcomingToursList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/tour/:id"
                element={
                  <ProtectedRoute requiredPermission="manage_bookings">
                    <TourDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/trip-accounts"
                element={
                  <ProtectedRoute requiredPermission="manage_trip_accounts">
                    <TripAccountsList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/trip-accounts/add"
                element={
                  <ProtectedRoute requiredPermission="manage_trip_accounts">
                    <AddTripAccount />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/trip-accounts/:id"
                element={
                  <ProtectedRoute requiredPermission="manage_trip_accounts">
                    <TripAccountDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/trip-accounts/:id/edit"
                element={
                  <ProtectedRoute requiredPermission="manage_trip_accounts">
                    <EditTripAccount />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/bus-onboarding"
                element={
                  <ProtectedRoute requiredPermission="manage_buses">
                    <BusOnboarding />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/bus-fleet"
                element={
                  <ProtectedRoute requiredPermission="view_buses">
                    <BusFleetManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/bus-fleet/:id"
                element={
                  <ProtectedRoute requiredPermission="view_buses">
                    <BusDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/bus-fleet/:id/edit"
                element={
                  <ProtectedRoute requiredPermission="manage_buses">
                    <BusEdit />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/bus-allocation"
                element={
                  <ProtectedRoute requiredPermission="manage_allocations">
                    <BusAllocationDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/bus-allocation/:id"
                element={
                  <ProtectedRoute requiredPermission="manage_allocations">
                    <BusAllocationDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/bus-calendar"
                element={
                  <ProtectedRoute requiredPermission="manage_allocations">
                    <BusAvailabilityCalendar />
                  </ProtectedRoute>
                }
              />

              {/* Booking Routes - Available to multiple roles */}
              <Route
                path="/booking"
                element={
                  <ProtectedRoute requiredPermission="create_booking">
                    <BookingForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tour-planner"
                element={
                  <ProtectedRoute requiredPermission="create_booking">
                    <SmartTourPlanner />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pdf-preview"
                element={
                  <ProtectedRoute>
                    <PDFPreview />
                  </ProtectedRoute>
                }
              />

              {/* Driver Routes - Admin can also access */}
              <Route
                path="/driver"
                element={
                  <ProtectedRoute requiredRole={['driver', 'admin']}>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/driver/trip/:id"
                element={
                  <ProtectedRoute requiredRole={['driver', 'admin']}>
                    <DriverTripDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/driver/expenses/:tripId"
                element={
                  <ProtectedRoute requiredRole={['driver', 'admin']}>
                    <DriverExpenseManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/driver/trips"
                element={
                  <ProtectedRoute requiredRole={['driver', 'admin']}>
                    <DriverTrips />
                  </ProtectedRoute>
                }
              />

              {/* Customer Routes - Admin can also access */}
              <Route
                path="/customer"
                element={
                  <ProtectedRoute requiredRole={['customer', 'admin']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customer/booking/:id"
                element={
                  <ProtectedRoute requiredRole={['customer', 'admin']}>
                    <CustomerBookingDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customer/payment/:bookingId"
                element={
                  <ProtectedRoute requiredRole={['customer', 'admin']}>
                    <CustomerPayment />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customer/support"
                element={
                  <ProtectedRoute requiredRole={['customer', 'admin']}>
                    <CustomerSupport />
                  </ProtectedRoute>
                }
              />

              {/* Admin User Management */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredPermission="manage_users">
                    <AdminUserManagement />
                  </ProtectedRoute>
                }
              />

              {/* Profile Route - Available to all authenticated users */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
