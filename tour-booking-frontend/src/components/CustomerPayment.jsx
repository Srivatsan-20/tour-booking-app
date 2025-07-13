import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert, Table, Badge, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CustomerPayment = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'upi',
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      // Mock booking data
      const mockBooking = {
        id: parseInt(bookingId),
        customerName: 'Priya Sharma',
        totalRent: 35000,
        advancePaid: 15000,
        route: 'Delhi → Manali',
        startDate: '2025-08-15',
        endDate: '2025-08-20'
      };

      setBooking(mockBooking);
      setPaymentData(prev => ({
        ...prev,
        amount: (mockBooking.totalRent - mockBooking.advancePaid).toString()
      }));
    } catch (err) {
      console.error('Error fetching booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (paymentData.method === 'upi' && !paymentData.upiId) {
      alert('Please enter UPI ID');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      alert(`Payment of ₹${parseFloat(paymentData.amount).toLocaleString()} processed successfully!`);
      navigate(`/customer/booking/${bookingId}`);
      setProcessing(false);
    }, 2000);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading payment details...</p>
      </Container>
    );
  }

  const balance = booking ? booking.totalRent - booking.advancePaid : 0;

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-0">💳 Make Payment</h2>
          <p className="text-muted">Booking ID: #{bookingId} | {booking?.route}</p>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate(`/customer/booking/${bookingId}`)}>
          ← Back to Booking
        </Button>
      </div>

      {/* Booking Summary */}
      <Card className="mb-4">
        <Card.Header className="bg-info text-white">
          <h5 className="mb-0">📋 Payment Summary</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Customer:</strong></td>
                    <td>{booking?.customerName}</td>
                  </tr>
                  <tr>
                    <td><strong>Trip:</strong></td>
                    <td>{booking?.route}</td>
                  </tr>
                  <tr>
                    <td><strong>Dates:</strong></td>
                    <td>
                      {booking && new Date(booking.startDate).toLocaleDateString()} - {booking && new Date(booking.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Total Amount:</strong></td>
                    <td>₹{booking?.totalRent.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Already Paid:</strong></td>
                    <td className="text-success">₹{booking?.advancePaid.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Outstanding Balance:</strong></td>
                    <td className="text-danger">
                      <strong>₹{balance.toLocaleString()}</strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Alert variant="info">
        <h5>🚧 Demo Payment System</h5>
        <p>This is a demo payment interface. In production, this would integrate with payment gateways like Razorpay, Stripe, or PayU.</p>
      </Alert>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Payment Details</h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                  >
                    <option value="upi">UPI</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="netbanking">Net Banking</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {paymentData.method === 'upi' && (
              <Form.Group className="mb-3">
                <Form.Label>UPI ID</Form.Label>
                <Form.Control
                  type="text"
                  value={paymentData.upiId}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, upiId: e.target.value }))}
                  placeholder="Enter UPI ID"
                />
              </Form.Group>
            )}

            <div className="text-center">
              <Button
                variant="success"
                onClick={handlePayment}
                disabled={processing}
                className="px-4"
              >
                {processing ? 'Processing...' : 'Make Payment'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CustomerPayment;
