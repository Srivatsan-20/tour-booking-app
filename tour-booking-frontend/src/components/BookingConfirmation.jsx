import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBus, FaCalendarAlt, FaUser, FaRupeeSign, FaDownload, FaHome } from 'react-icons/fa';
import { generateBookingConfirmationPDF } from '../utils/bookingConfirmationPDF';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Show demo data if no booking data (for direct URL access)
  const bookingData = booking || {
    bookingId: 'DEMO123456',
    tourPackage: {
      name: 'Premium Tour Package',
      busType: 'AC Luxury Coach',
      pricePerDay: 8000
    },
    searchData: {
      places: 'Chennai, Mahabalipuram, Pondicherry',
      startDate: '2025-01-20',
      endDate: '2025-01-22',
      buses: 1
    },
    organizerDetails: {
      organizerName: 'Demo User',
      email: 'demo@example.com',
      phone: '+91 98765 43210',
      groupSize: 25
    },
    totalAmount: 48000,
    totalDays: 3,
    status: 'confirmed'
  };

  const handleDownloadTicket = async () => {
    setDownloadingPDF(true);
    try {
      console.log('🎫 Starting PDF generation with data:', bookingData);
      const result = await generateBookingConfirmationPDF(bookingData);
      if (result && result.success) {
        // PDF download started automatically by the generator
        console.log('✅ PDF downloaded successfully:', result.fileName);
        // Optional: Show success message
        // alert('Booking confirmation PDF downloaded successfully!');
      } else {
        console.error('PDF generation failed:', result);
        alert('Failed to generate PDF: ' + (result?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Failed to download ticket: ' + error.message);
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Demo Notice */}
          {!booking && (
            <Alert variant="info" className="mb-4">
              <strong>Demo Mode:</strong> This is a preview of the booking confirmation page.
              In actual use, this page shows real booking details after completing a tour booking.
            </Alert>
          )}
          {/* Success Message */}
          <Card className="text-center mb-4 border-success">
            <Card.Body className="p-5">
              <FaCheckCircle size={80} className="text-success mb-4" />
              <h2 className="text-success fw-bold mb-3">Booking Confirmed!</h2>
              <p className="lead text-muted mb-4">
                Your bus ticket has been successfully booked. You will receive a confirmation
                email shortly with your ticket details.
              </p>
              <Alert variant="success" className="mb-0">
                <strong>Booking ID:</strong> {bookingData.bookingId}
              </Alert>
            </Card.Body>
          </Card>

          {/* Booking Details */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaBus className="me-2" />
                Booking Details
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Tour Package:</strong><br />
                    {bookingData.tourPackage.name} ({bookingData.tourPackage.busType})
                  </div>
                  <div className="mb-3">
                    <strong>Places to Cover:</strong><br />
                    {bookingData.searchData.places}
                  </div>
                  <div className="mb-3">
                    <strong>Tour Duration:</strong><br />
                    {new Date(bookingData.searchData.startDate).toLocaleDateString('en-IN')} to{' '}
                    {new Date(bookingData.searchData.endDate).toLocaleDateString('en-IN')}
                    <br />
                    <small className="text-muted">({bookingData.totalDays} days)</small>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Buses Required:</strong><br />
                    {bookingData.searchData.buses} bus{bookingData.searchData.buses > 1 ? 'es' : ''}
                  </div>
                  <div className="mb-3">
                    <strong>Total Amount:</strong><br />
                    <span className="text-primary fw-bold fs-5">₹{bookingData.totalAmount}</span>
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong><br />
                    <span className="badge bg-success">Confirmed</span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tour Organizer Details */}
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">
                <FaUser className="me-2" />
                Tour Organizer Information
              </h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Organizer Name:</strong> {bookingData.organizerDetails.organizerName}
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong> {bookingData.organizerDetails.email}
                  </div>
                  <div className="mb-2">
                    <strong>Phone:</strong> {bookingData.organizerDetails.phone}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Group Size:</strong> {bookingData.organizerDetails.groupSize} people
                  </div>
                  {bookingData.organizerDetails.organizationName && (
                    <div className="mb-2">
                      <strong>Organization:</strong> {bookingData.organizerDetails.organizationName}
                    </div>
                  )}
                  {bookingData.organizerDetails.groupType && (
                    <div className="mb-2">
                      <strong>Group Type:</strong> {bookingData.organizerDetails.groupType}
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Important Information */}
          <Card className="mb-4 bg-light">
            <Card.Body>
              <h6 className="fw-bold mb-3">Important Information:</h6>
              <ul className="mb-0">
                <li className="mb-2">Please coordinate with our team 24 hours before tour start date</li>
                <li className="mb-2">Provide final passenger list and pickup points</li>
                <li className="mb-2">Keep your booking confirmation handy</li>
                <li className="mb-2">For any changes or cancellations, contact us at least 24 hours before tour start</li>
                <li className="mb-0">Customer support: +91 98765 43210</li>
              </ul>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          <div className="d-flex gap-3 justify-content-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownloadTicket}
              disabled={downloadingPDF}
            >
              {downloadingPDF ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FaDownload className="me-2" />
                  Download Ticket
                </>
              )}
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => navigate('/')}
            >
              <FaHome className="me-2" />
              Back to Home
            </Button>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-4">
            <p className="text-muted">
              Need help? Contact our support team at{' '}
              <a href="tel:+919876543210" className="text-primary">
                +91 98765 43210
              </a>{' '}
              or{' '}
              <a href="mailto:support@srisaisenthil.com" className="text-primary">
                support@srisaisenthil.com
              </a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingConfirmation;
