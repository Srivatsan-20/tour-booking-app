import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Spinner, Alert } from "react-bootstrap";

const Admin_Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("https://localhost:7040/api/Bookings/Upcoming");
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

        setBookings(upcoming);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <h2 className="text-center mb-4 text-primary">📊 Admin Dashboard</h2>
      <Row className="g-4">
        <Col md={6}>
          <div className="p-3 border rounded bg-white">
            <h5>Upcoming Tours</h5>
            {loading ? (
              <Spinner animation="border" />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : bookings.length === 0 ? (
              <p>No upcoming tours found.</p>
            ) : (
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Start Date</th>
                    <th>Pickup</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.customerName}</td>
                      <td>{new Date(b.startDate).toLocaleDateString()}</td>
                      <td>{b.pickupLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>

        <Col md={6}>
          <div className="p-3 border rounded bg-white">
            <h5>Bus Allocation</h5>
            <p>Assign buses to tours & view availability by date.</p>
          </div>
        </Col>

        <Col md={12}>
          <div className="p-3 border rounded bg-white">
            <h5>Trip Accounts</h5>
            <p>Track income vs expenses (diesel, driver, etc.) and calculate profits.</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin_Dashboard;
