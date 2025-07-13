import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading } = useAuth();
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signIn(credentials);
      
      if (result.success) {
        // Redirect to intended destination
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const fillDemoCredentials = (role) => {
    const demoCredentials = {
      admin: { username: 'admin', password: 'admin123' },
      manager: { username: 'manager', password: 'manager123' },
      driver: { username: 'driver1', password: 'driver123' },
      customer: { username: 'customer1', password: 'customer123' }
    };
    
    setCredentials(demoCredentials[role]);
    setError('');
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h3 className="mb-0">🚌 Tour Booking System</h3>
              <p className="mb-0">Sign in to your account</p>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    disabled={isSubmitting}
                    autoComplete="username"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Form>

              {/* Demo Credentials */}
              <div className="mt-4">
                <h6 className="text-muted mb-3">Demo Accounts:</h6>
                <Row className="g-2">
                  <Col xs={6}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100"
                      onClick={() => fillDemoCredentials('admin')}
                      disabled={isSubmitting}
                    >
                      <Badge bg="danger" className="me-1">Admin</Badge>
                      <br />
                      <small>Full Access</small>
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="w-100"
                      onClick={() => fillDemoCredentials('manager')}
                      disabled={isSubmitting}
                    >
                      <Badge bg="warning" className="me-1">Manager</Badge>
                      <br />
                      <small>Operations</small>
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="w-100"
                      onClick={() => fillDemoCredentials('driver')}
                      disabled={isSubmitting}
                    >
                      <Badge bg="info" className="me-1">Driver</Badge>
                      <br />
                      <small>Trip Updates</small>
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="w-100"
                      onClick={() => fillDemoCredentials('customer')}
                      disabled={isSubmitting}
                    >
                      <Badge bg="success" className="me-1">Customer</Badge>
                      <br />
                      <small>Bookings</small>
                    </Button>
                  </Col>
                </Row>
              </div>

              <div className="mt-4 text-center">
                <small className="text-muted">
                  Click on any demo account above to auto-fill credentials
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
