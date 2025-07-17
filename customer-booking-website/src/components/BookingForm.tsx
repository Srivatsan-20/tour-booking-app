import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const BookingForm: React.FC = () => {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    pickupLocation: '',
    destination: '',
    departureDate: '',
    passengerCount: 1,
    specialRequirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Mock booking creation
      const bookingNumber = `BK${Date.now()}`;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate(`/booking-confirmation/${bookingNumber}`);
    } catch (error) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-page" style={{ paddingTop: '120px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h4 className="mb-0">Book Your Bus</h4>
              </Card.Header>
              <Card.Body>
                {error && (
                  <Alert variant="danger">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Number of Passengers *</Form.Label>
                        <Form.Control
                          type="number"
                          name="passengerCount"
                          value={formData.passengerCount}
                          onChange={handleInputChange}
                          min="1"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Pickup Location *</Form.Label>
                        <Form.Control
                          type="text"
                          name="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Destination *</Form.Label>
                        <Form.Control
                          type="text"
                          name="destination"
                          value={formData.destination}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Departure Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Special Requirements</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or requests..."
                    />
                  </Form.Group>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate(-1)}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Booking...
                        </>
                      ) : (
                        'Create Booking'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BookingForm;
