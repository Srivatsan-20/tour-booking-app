import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const CustomerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Mock login
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ paddingTop: '120px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7}>
            <Card>
              <Card.Header className="text-center">
                <h4>Customer Login</h4>
              </Card.Header>
              <Card.Body>
                {error && (
                  <Alert variant="danger">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-3">
                  <p>
                    Don't have an account? <Link to="/register">Register here</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CustomerLogin;
