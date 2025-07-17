import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const ContactUs: React.FC = () => {
  return (
    <div className="contact-page" style={{ paddingTop: '120px' }}>
      <Container>
        <Row>
          <Col>
            <h2 className="text-center mb-5">Contact Us</h2>
          </Col>
        </Row>
        
        <Row>
          <Col lg={8} className="mx-auto">
            <Card>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" required />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control type="text" required />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control as="textarea" rows={5} required />
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button type="submit" variant="primary">Send Message</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={4} className="text-center mb-4">
            <i className="fas fa-phone fa-2x text-primary mb-3"></i>
            <h5>Phone</h5>
            <p>+91 98765 43210</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <i className="fas fa-envelope fa-2x text-primary mb-3"></i>
            <h5>Email</h5>
            <p>info@srisaisenthil.com</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <i className="fas fa-map-marker-alt fa-2x text-primary mb-3"></i>
            <h5>Address</h5>
            <p>Dharmapuri, Tamil Nadu</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
