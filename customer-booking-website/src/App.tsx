import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';
import BusDetails from './components/BusDetails';
import BookingForm from './components/BookingForm';
import BookingConfirmation from './components/BookingConfirmation';
import CustomerLogin from './components/CustomerLogin';
import CustomerRegister from './components/CustomerRegister';
import CustomerDashboard from './components/CustomerDashboard';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/bus/:busId" element={<BusDetails />} />
            <Route path="/booking/:busId" element={<BookingForm />} />
            <Route path="/booking-confirmation/:bookingNumber" element={<BookingConfirmation />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/register" element={<CustomerRegister />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
