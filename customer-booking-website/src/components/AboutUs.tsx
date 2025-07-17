import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutUs: React.FC = () => {
  return (
    <div className="about-page" style={{ paddingTop: '120px' }}>
      <Container>
        <Row>
          <Col>
            <h2 className="text-center mb-5">About Sri Sai Senthil Tours</h2>
          </Col>
        </Row>
        
        <Row>
          <Col lg={8} className="mx-auto">
            <Card>
              <Card.Body>
                <p className="lead">
                  Sri Sai Senthil Tours & Travels has been serving customers with reliable and comfortable bus rental services across South India for over a decade.
                </p>
                
                <h4>Our Mission</h4>
                <p>
                  To provide safe, comfortable, and affordable transportation solutions that exceed customer expectations while maintaining the highest standards of service quality.
                </p>
                
                <h4>Our Vision</h4>
                <p>
                  To be the leading bus rental service provider in South India, known for reliability, customer satisfaction, and innovative travel solutions.
                </p>
                
                <h4>Why Choose Us?</h4>
                <ul>
                  <li>Modern and well-maintained fleet</li>
                  <li>Experienced and professional drivers</li>
                  <li>24/7 customer support</li>
                  <li>Competitive pricing</li>
                  <li>Flexible booking options</li>
                  <li>Safety-first approach</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;
