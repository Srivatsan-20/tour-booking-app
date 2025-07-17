import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="privacy-page" style={{ paddingTop: '120px' }}>
      <Container>
        <Row>
          <Col>
            <h2 className="text-center mb-5">Privacy Policy</h2>
          </Col>
        </Row>
        
        <Row>
          <Col lg={10} className="mx-auto">
            <Card>
              <Card.Body>
                <h4>Information We Collect</h4>
                <p>We collect personal information necessary for booking and providing our services, including name, contact details, and travel preferences.</p>
                
                <h4>How We Use Your Information</h4>
                <p>Your information is used to process bookings, communicate with you about your travel, and improve our services.</p>
                
                <h4>Information Sharing</h4>
                <p>We do not share your personal information with third parties except as necessary to provide our services or as required by law.</p>
                
                <h4>Data Security</h4>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                
                <h4>Contact Us</h4>
                <p>If you have any questions about this privacy policy, please contact us at info@srisaisenthil.com</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
