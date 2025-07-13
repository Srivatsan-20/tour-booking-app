import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { generateBookingPDF } from "../utils/pdfGenerator";
import { generateSimpleBookingPDF } from "../utils/simplePdfGenerator";

const Admin_Dashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("Attempting to fetch from: http://localhost:5050/api/Bookings/Upcoming");
        const res = await fetch("http://localhost:5050/api/Bookings/Upcoming");
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status} ${res.statusText}`);
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
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDownloadPDF = async (booking) => {
    try {
      // Convert booking data to match the expected format
      const bookingData = {
        customerName: booking.customerName,
        phone: booking.phone || 'N/A',
        email: booking.email || 'N/A',
        startDate: booking.startDate,
        endDate: booking.endDate,
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        numberOfPassengers: booking.numberOfPassengers || 1,
        numberOfBuses: booking.numberOfBuses || 1,
        busType: booking.busType || 'Standard',
        placesToCover: booking.placesToCover || 'N/A',
        preferredRoute: booking.preferredRoute || 'N/A',
        specialRequirements: booking.specialRequirements || 'None',
        paymentMode: booking.paymentMode || 'Online',
        language: booking.language || 'English',
        useIndividualBusRates: booking.useIndividualBusRates || false,
        perDayRent: booking.perDayRent || 0,
        mountainRent: booking.mountainRent || 0,
        totalRent: booking.totalRent || 0,
        advancePaid: booking.advancePaid || 0,
        busRents: booking.busRents || []
      };

      try {
        generateBookingPDF(bookingData, booking.id);
      } catch (advancedError) {
        console.error('Advanced PDF generation error:', advancedError);
        // Try simple PDF as fallback
        generateSimpleBookingPDF(bookingData, booking.id);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0">📊 Upcoming Tours</h2>
        <Button
          variant="outline-secondary"
          onClick={() => navigate('/admin')}
        >
          ← Admin Dashboard
        </Button>
      </div>
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
                    <th>Days</th>
                    <th>Buses</th>
                    <th>Total Rent</th>
                    <th>Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const days = Math.ceil((new Date(b.endDate) - new Date(b.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                    const balance = (b.totalRent || 0) - (b.advancePaid || 0);

                    return (
                      <tr key={b.id}>
                        <td>{b.customerName}</td>
                        <td>{new Date(b.startDate).toLocaleDateString()}</td>
                        <td>{days}</td>
                        <td>{b.numberOfBuses || 1}</td>
                        <td>₹{(b.totalRent || 0).toLocaleString()}</td>
                        <td className={balance > 0 ? "text-danger" : "text-success"}>
                          ₹{balance.toLocaleString()}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleDownloadPDF(b)}
                            title="Download PDF Confirmation"
                          >
                            📄 PDF
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
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
