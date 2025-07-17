import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';

const PublicContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
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

      // Mock API call - replace with actual contact form API
      console.log('Contact form data:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-4">Contact Us</h1>
            <p className="lead text-muted">
              Get in touch with us for any queries, bookings, or assistance. We're here to help!
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Contact Information */}
        <Col lg={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Get In Touch</h5>
              
              <div className="d-flex align-items-start mb-4">
                <FaPhone className="text-primary me-3 mt-1" />
                <div>
                  <h6 className="mb-1">Phone</h6>
                  <p className="text-muted mb-0">+91 98765 43210</p>
                  <p className="text-muted mb-0">+91 87654 32109</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-4">
                <FaEnvelope className="text-primary me-3 mt-1" />
                <div>
                  <h6 className="mb-1">Email</h6>
                  <p className="text-muted mb-0">info@srisaisenthil.com</p>
                  <p className="text-muted mb-0">bookings@srisaisenthil.com</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-4">
                <FaMapMarkerAlt className="text-primary me-3 mt-1" />
                <div>
                  <h6 className="mb-1">Address</h6>
                  <p className="text-muted mb-0">
                    123 Main Street<br />
                    T. Nagar, Chennai<br />
                    Tamil Nadu - 600017<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="d-flex align-items-start">
                <FaClock className="text-primary me-3 mt-1" />
                <div>
                  <h6 className="mb-1">Business Hours</h6>
                  <p className="text-muted mb-1">Monday - Saturday: 6:00 AM - 10:00 PM</p>
                  <p className="text-muted mb-0">Sunday: 7:00 AM - 9:00 PM</p>
                  <small className="text-success">24/7 Emergency Support Available</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Contact Form */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Send us a Message</h5>
              
              {success && (
                <Alert variant="success" className="mb-4">
                  <strong>Thank you!</strong> Your message has been sent successfully. 
                  We'll get back to you within 24 hours.
                </Alert>
              )}
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
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
                        placeholder="Enter your email address"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        maxLength="10"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Subject</Form.Label>
                      <Form.Select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a subject</option>
                        <option value="booking">Booking Inquiry</option>
                        <option value="cancellation">Cancellation/Refund</option>
                        <option value="complaint">Complaint</option>
                        <option value="feedback">Feedback</option>
                        <option value="general">General Inquiry</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={12} className="mb-4">
                    <Form.Group>
                      <Form.Label>Message *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Enter your message here..."
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg"
                  disabled={loading}
                  className="d-flex align-items-center"
                >
                  <FaPaperPlane className="me-2" />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Information */}
      <Row className="mt-5">
        <Col>
          <Card className="bg-light border-0">
            <Card.Body className="p-4">
              <Row>
                <Col lg={4} className="mb-3">
                  <h6 className="fw-bold text-primary">Emergency Contact</h6>
                  <p className="text-muted mb-0">
                    For urgent assistance during travel, call our 24/7 emergency helpline:
                    <br /><strong>+91 98765 43210</strong>
                  </p>
                </Col>
                
                <Col lg={4} className="mb-3">
                  <h6 className="fw-bold text-primary">Booking Support</h6>
                  <p className="text-muted mb-0">
                    For booking assistance and modifications:
                    <br /><strong>bookings@srisaisenthil.com</strong>
                  </p>
                </Col>
                
                <Col lg={4} className="mb-3">
                  <h6 className="fw-bold text-primary">Corporate Inquiries</h6>
                  <p className="text-muted mb-0">
                    For corporate travel solutions and partnerships:
                    <br /><strong>corporate@srisaisenthil.com</strong>
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicContact;
