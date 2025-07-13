import React from 'react';
import { Container, Alert, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CustomerSupport = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">🎧 Customer Support</h2>
        <Button variant="outline-secondary" onClick={() => navigate("/customer")}>
          ← Customer Dashboard
        </Button>
      </div>

      <Alert variant="info">
        <h5>🚧 Customer Support Center</h5>
        <p>This page will provide comprehensive customer support features.</p>
      </Alert>

      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>📞 Contact Information</Card.Header>
            <Card.Body>
              <p><strong>Phone:</strong> +91-1800-123-4567</p>
              <p><strong>Email:</strong> support@tourbooking.com</p>
              <p><strong>Hours:</strong> 24/7 Support Available</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>❓ Quick Help</Card.Header>
            <Card.Body>
              <ul>
                <li>How to make a booking</li>
                <li>Payment and refund policies</li>
                <li>Trip modifications</li>
                <li>Emergency contact during trips</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerSupport;
