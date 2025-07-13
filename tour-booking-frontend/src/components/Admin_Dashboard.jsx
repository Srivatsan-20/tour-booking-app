import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const Admin_Dashboard = () => {
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/Bookings/Upcoming");
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = data.filter((booking) => {
          const isValid = booking.customerName && booking.customerName.toLowerCase() !== "string";
          const startDate = new Date(booking.startDate);
          startDate.setHours(0, 0, 0, 0);
          return isValid && startDate >= today;
        });

        setUpcomingCount(upcoming.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      {/* Header with Logo */}
      <div className="text-center mb-4">
        <Logo size="large" showText={true} variant="default" />
        <h2 className="mt-3" style={{ color: '#8B4513', fontWeight: 'bold' }}>
          📊 Admin Dashboard
        </h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage your tours and travel operations
        </p>
      </div>
      <Row className="g-4">
        <Col md={6}>
          <div className="p-3 border rounded bg-white">
            <h5>Upcoming Tours</h5>
            {loading ? (
              <Spinner animation="border" />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : (
              <>
                <p>{upcomingCount} tours scheduled.</p>
                <Button variant="primary" onClick={() => navigate("/admin/upcoming-tours")}>View Upcoming Tours</Button>
              </>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div className="p-3 border rounded bg-white">
            <h5>🚌 Bus Management</h5>
            <p>Manage your bus fleet, onboard new buses, and track allocations.</p>
            <div className="d-flex gap-2 flex-wrap">
              <Button variant="primary" size="sm" onClick={() => navigate("/admin/bus-fleet")}>
                🚌 Fleet Management
              </Button>
              <Button variant="success" size="sm" onClick={() => navigate("/admin/bus-onboarding")}>
                ➕ Onboard Bus
              </Button>
              <Button variant="info" size="sm" onClick={() => navigate("/admin/bus-allocation")}>
                📅 Allocations
              </Button>
            </div>
          </div>
        </Col>
        <Col md={12}>
          <div className="p-3 border rounded bg-white">
            <h5>Trip Accounts</h5>
            <p>Track income vs expenses (diesel, driver, etc.) and calculate profits.</p>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={() => navigate("/admin/trip-accounts")}>📊 View All Trip Accounts</Button>
              <Button variant="warning" onClick={() => navigate("/admin/trip-accounts/add")}>💰 Add Trip Account</Button>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-3 border rounded bg-white">
            <h5>Booking</h5>
            <p>Navigate to book a new tour.</p>
            <Button variant="success" onClick={() => navigate("/booking")}>+ Go to Tour Booking Form</Button>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-3 border rounded bg-white">
            <h5>📄 PDF Generator</h5>
            <p>Test and preview the beautiful PDF generation feature.</p>
            <Button variant="info" onClick={() => navigate("/pdf-preview")}>🎨 View PDF Preview</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin_Dashboard;
