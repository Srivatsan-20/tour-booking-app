import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus } from 'react-icons/fa';

const PublicRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Mock API call - replace with actual registration API
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'customer'
      };

      console.log('Registration data:', registrationData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page or login
      navigate('/signin', { 
        state: { 
          message: 'Registration successful! Please sign in with your credentials.' 
        } 
      });
      
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={6} md={8}>
          <Card className="shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <FaUserPlus size={50} className="text-primary mb-3" />
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Join Sri Sai Senthil Tours for easy booking and exclusive offers</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaUser className="me-2 text-primary" />
                    Full Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaEnvelope className="me-2 text-primary" />
                    Email Address *
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaPhone className="me-2 text-primary" />
                    Phone Number *
                  </Form.Label>
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

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaLock className="me-2 text-primary" />
                    Password *
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password (min 6 characters)"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaLock className="me-2 text-primary" />
                    Confirm Password *
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    label={
                      <span>
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary">
                          Terms & Conditions
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary">
                          Privacy Policy
                        </Link>
                      </span>
                    }
                    required
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-primary text-decoration-none">
                      Sign In
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Benefits */}
          <Card className="mt-4 border-0 bg-light">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3">Benefits of Creating an Account:</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">✓ Quick and easy booking process</li>
                <li className="mb-2">✓ View booking history and manage trips</li>
                <li className="mb-2">✓ Exclusive offers and discounts</li>
                <li className="mb-2">✓ Priority customer support</li>
                <li className="mb-0">✓ Personalized travel recommendations</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicRegister;
