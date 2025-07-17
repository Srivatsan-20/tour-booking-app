import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="terms-page" style={{ paddingTop: '120px' }}>
      <Container>
        <Row>
          <Col>
            <h2 className="text-center mb-5">Terms & Conditions</h2>
          </Col>
        </Row>
        
        <Row>
          <Col lg={10} className="mx-auto">
            <Card>
              <Card.Body>
                <h4>1. Booking Terms</h4>
                <p>All bookings are subject to availability and confirmation by Sri Sai Senthil Tours.</p>
                
                <h4>2. Payment Terms</h4>
                <p>Advance payment is required to confirm the booking. Full payment must be made before the journey begins.</p>
                
                <h4>3. Cancellation Policy</h4>
                <p>Cancellations made 48 hours before the journey will receive a full refund minus processing charges.</p>
                
                <h4>4. Liability</h4>
                <p>Sri Sai Senthil Tours is not liable for any loss or damage to personal belongings during the journey.</p>
                
                <h4>5. Safety</h4>
                <p>Passengers must follow all safety instructions provided by the driver and company representatives.</p>
                
                <h4>6. Changes to Terms</h4>
                <p>These terms and conditions may be updated from time to time. Customers will be notified of any significant changes.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TermsAndConditions;
