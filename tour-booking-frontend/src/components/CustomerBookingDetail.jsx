import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Table, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CustomerBookingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5050/api/Bookings/${id}`);

      if (response.ok) {
        const bookingData = await response.json();
        setBooking(bookingData);
      } else {
        throw new Error(`Failed to fetch booking: ${response.status}`);
      }
    } catch (err) {
      setError('Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { bg: 'success', text: 'Confirmed' },
      upcoming: { bg: 'primary', text: 'Upcoming' },
      in_progress: { bg: 'warning', text: 'In Progress' },
      completed: { bg: 'secondary', text: 'Completed' },
      cancelled: { bg: 'danger', text: 'Cancelled' }
    };

    const config = statusConfig[status] || { bg: 'secondary', text: 'Unknown' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const calculateBalance = () => {
    return booking.totalRent - booking.advancePaid;
  };

  const calculatePaymentProgress = () => {
    return (booking.advancePaid / booking.totalRent) * 100;
  };

  const getTripDuration = () => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading booking details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 p-4 border rounded shadow bg-light">
        <Alert variant="danger">
          <h5>Error Loading Booking</h5>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/customer')}>
            ← Back to Dashboard
          </Button>
        </Alert>
      </Container>
    );
  }

  const balance = calculateBalance();
  const paymentProgress = calculatePaymentProgress();
  const tripDuration = getTripDuration();

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-0">🎫 Booking Details</h2>
          <p className="text-muted">Booking ID: #{booking.id}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate("/customer")}>
            ← Customer Dashboard
          </Button>
          {getStatusBadge(booking.status)}
        </div>
      </div>

      {/* Booking Status & Payment */}
      <Card className="mb-4">
        <Card.Header className="bg-info text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📋 Booking Status & Payment</h5>
            {balance > 0 && (
              <Button
                variant="light"
                size="sm"
                onClick={() => navigate(`/customer/payment/${booking.id}`)}
              >
                💳 Make Payment
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Booking Date:</strong></td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
                    <td>{getStatusBadge(booking.status)}</td>
                  </tr>
                  <tr>
                    <td><strong>Trip Status:</strong></td>
                    <td>{getStatusBadge(booking.tripStatus)}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small><strong>Payment Progress</strong></small>
                  <small>{paymentProgress.toFixed(1)}%</small>
                </div>
                <ProgressBar
                  now={paymentProgress}
                  variant={paymentProgress === 100 ? 'success' : 'warning'}
                />
              </div>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Total Amount:</strong></td>
                    <td>₹{booking.totalRent.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Paid:</strong></td>
                    <td className="text-success">₹{booking.advancePaid.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Balance:</strong></td>
                    <td className={balance > 0 ? 'text-danger' : 'text-success'}>
                      ₹{balance.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Trip Information */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">🗺️ Trip Information</h6>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Route:</strong></td>
                    <td>{booking.pickupLocation} → {booking.dropLocation}</td>
                  </tr>
                  <tr>
                    <td><strong>Start Date:</strong></td>
                    <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>End Date:</strong></td>
                    <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Duration:</strong></td>
                    <td>{tripDuration} days</td>
                  </tr>
                  <tr>
                    <td><strong>Pickup Location:</strong></td>
                    <td>{booking.pickupLocation}</td>
                  </tr>
                  <tr>
                    <td><strong>Drop Location:</strong></td>
                    <td>{booking.dropLocation}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h6 className="mb-0">🚌 Bus & Driver Information</h6>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Bus Type:</strong></td>
                    <td>{booking.busType}</td>
                  </tr>
                  <tr>
                    <td><strong>Bus Registration:</strong></td>
                    <td>{booking.busRegistration}</td>
                  </tr>
                  <tr>
                    <td><strong>Number of Buses:</strong></td>
                    <td>{booking.numberOfBuses}</td>
                  </tr>
                  <tr>
                    <td><strong>Driver Name:</strong></td>
                    <td>{booking.driverName}</td>
                  </tr>
                  <tr>
                    <td><strong>Driver Phone:</strong></td>
                    <td>
                      <a href={`tel:${booking.driverPhone}`} className="text-decoration-none">
                        {booking.driverPhone}
                      </a>
                    </td>
                  </tr>
                  {booking.estimatedArrival && (
                    <tr>
                      <td><strong>Est. Arrival:</strong></td>
                      <td>{new Date(booking.estimatedArrival).toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Customer Information */}
      <Card className="mb-4">
        <Card.Header className="bg-warning text-dark">
          <h6 className="mb-0">👤 Customer Information</h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Name:</strong></td>
                    <td>{booking.customerName}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>{booking.phone}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{booking.email}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={8}>
              {booking.notes && (
                <div>
                  <strong>Special Notes:</strong>
                  <p className="mt-1 p-2 bg-light rounded">{booking.notes}</p>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Payment History */}
      <Card className="mb-4">
        <Card.Header className="bg-secondary text-white">
          <h6 className="mb-0">💳 Payment History</h6>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {booking.paymentHistory.map(payment => (
                <tr key={payment.id}>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                  <td>₹{payment.amount.toLocaleString()}</td>
                  <td>{payment.method}</td>
                  <td>
                    <Badge bg={payment.status === 'completed' ? 'success' : 'warning'}>
                      {payment.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => navigate(`/customer/receipt/${booking.id}/${payment.id}`)}
                    >
                      📄 Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <div className="text-center">
        <Button
          variant="outline-secondary"
          className="me-2"
          onClick={() => navigate("/customer")}
        >
          ← Customer Dashboard
        </Button>
        {balance > 0 && (
          <Button
            variant="success"
            className="me-2"
            onClick={() => navigate(`/customer/payment/${booking.id}`)}
          >
            💳 Make Payment
          </Button>
        )}
        <Button
          variant="outline-primary"
          className="me-2"
          onClick={() => navigate(`/customer/receipt/${booking.id}`)}
        >
          📄 Download Receipt
        </Button>
        <Button
          variant="outline-info"
          onClick={() => navigate('/customer/support')}
        >
          🎧 Contact Support
        </Button>
      </div>
    </Container>
  );
};

export default CustomerBookingDetail;
