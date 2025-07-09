import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UpcomingToursList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
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
      <h2 className="text-center mb-4 text-primary">📅 Upcoming Tours</h2>
      <Button variant="secondary" className="mb-3" onClick={() => navigate("/admin")}>
        ⬅️ Back to Dashboard
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : bookings.length === 0 ? (
        <Alert variant="info">No upcoming tours found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Start Date</th>
              <th>Days</th>
              <th>Buses</th>
              <th>Total Rent</th>
              <th>Advance Paid</th>
              <th>Balance</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.customerName}</td>
                <td>{new Date(b.startDate).toLocaleDateString()}</td>
                <td>{b.numberOfDays || 'N/A'}</td>
                <td>{b.numberOfBuses || 1}</td>
                <td>₹{(b.totalRent || 0).toFixed(2)}</td>
                <td>₹{(b.advancePaid || 0).toFixed(2)}</td>
                <td className={b.balanceToBePaid > 0 ? 'text-danger fw-bold' : 'text-success'}>
                  ₹{(b.balanceToBePaid || 0).toFixed(2)}
                </td>
                <td>{b.phone}</td>
                <td>
                  <Button variant="info" size="sm" onClick={() => navigate(`/admin/tour/${b.id}`)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UpcomingToursList;
