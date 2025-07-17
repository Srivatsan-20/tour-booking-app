import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const BookingConfirmation: React.FC = () => {
  const { bookingNumber } = useParams<{ bookingNumber: string }>();
  const navigate = useNavigate();

  return (
    <div className="booking-confirmation-page" style={{ paddingTop: '120px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="text-center">
              <Card.Body className="py-5">
                <div className="mb-4">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="text-success mb-3">Booking Confirmed!</h2>
                <p className="lead mb-4">
                  Your booking has been successfully created.
                </p>
                
                <Alert variant="info" className="mb-4">
                  <h5>Booking Number: {bookingNumber}</h5>
                  <p className="mb-0">Please save this booking number for future reference.</p>
                </Alert>

                <div className="mb-4">
                  <p>
                    A confirmation email has been sent to your registered email address with all the booking details.
                    Our team will contact you shortly to confirm the pickup details and payment information.
                  </p>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/')}
                  >
                    Back to Home
                  </Button>
                  <Button 
                    variant="outline-primary"
                    onClick={() => navigate('/search')}
                  >
                    Book Another Bus
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BookingConfirmation;
