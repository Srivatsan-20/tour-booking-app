import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBus, FaUser, FaPhone, FaEnvelope, FaRupeeSign } from 'react-icons/fa';

const PublicBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tourPackage, searchData } = location.state || {};

  const [formData, setFormData] = useState({
    organizerName: '',
    organizationName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    groupSize: '',
    groupType: '',
    specialRequests: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if no tour package data
  if (!tourPackage || !searchData) {
    navigate('/search');
    return null;
  }

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const totalDays = calculateDays(searchData.startDate, searchData.endDate);
  const totalAmount = tourPackage.pricePerDay * totalDays * searchData.buses;
  const gst = Math.round(totalAmount * 0.05); // 5% GST
  const finalAmount = totalAmount + gst;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.organizerName || !formData.email || !formData.phone || !formData.groupSize) {
      setError('Please fill in all required fields');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create booking object
      const bookingData = {
        tourPackage,
        searchData,
        organizerDetails: formData,
        totalAmount: finalAmount,
        totalDays,
        bookingDate: new Date().toISOString(),
        status: 'pending'
      };

      // Mock API call - replace with actual booking API
      console.log('Booking data:', bookingData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to confirmation page
      navigate('/booking-confirmation', {
        state: {
          booking: {
            ...bookingData,
            bookingId: 'SRI' + Date.now(),
            status: 'confirmed'
          }
        }
      });

    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row>
        {/* Booking Form */}
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FaUser className="me-2" />
                Tour Organizer Details
              </h5>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Organizer Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="organizerName"
                        value={formData.organizerName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Organization/Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        placeholder="Enter organization name (optional)"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Email Address *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter 10-digit phone number"
                        maxLength="10"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Alternate Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleInputChange}
                        placeholder="Alternate phone number"
                        maxLength="10"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Total Group Size *</Form.Label>
                      <Form.Control
                        type="number"
                        name="groupSize"
                        value={formData.groupSize}
                        onChange={handleInputChange}
                        placeholder="Total number of people in group"
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Group Type</Form.Label>
                      <Form.Select
                        name="groupType"
                        value={formData.groupType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select group type</option>
                        <option value="family">Family Tour</option>
                        <option value="friends">Friends Group</option>
                        <option value="corporate">Corporate Trip</option>
                        <option value="school">School/College Trip</option>
                        <option value="religious">Religious/Pilgrimage</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Special Requests</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any special requirements, pickup points, or requests for your tour"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Booking Summary */}
        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header>
              <h6 className="mb-0">Tour Booking Summary</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="d-flex align-items-center">
                  <FaBus className="me-2 text-primary" />
                  {tourPackage.name}
                </h6>
                <small className="text-muted">{tourPackage.busType}</small>
              </div>

              <hr />

              <div className="mb-2">
                <strong>Places to Cover:</strong><br />
                {searchData.places}
              </div>

              <div className="mb-2">
                <strong>Tour Duration:</strong><br />
                {new Date(searchData.startDate).toLocaleDateString('en-IN')} to{' '}
                {new Date(searchData.endDate).toLocaleDateString('en-IN')}
                <br />
                <small className="text-muted">({totalDays} days)</small>
              </div>

              <div className="mb-2">
                <strong>Bus Capacity:</strong><br />
                {tourPackage.capacity}
              </div>

              <div className="mb-3">
                <strong>Buses Required:</strong> {searchData.buses}
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Rate per bus per day</span>
                <span>₹{tourPackage.pricePerDay}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Total ({searchData.buses} bus{searchData.buses > 1 ? 'es' : ''} × {totalDays} days)</span>
                <span>₹{totalAmount}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>GST (5%)</span>
                <span>₹{gst}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <strong>Total Amount</strong>
                <strong className="text-primary">₹{finalAmount}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicBooking;
