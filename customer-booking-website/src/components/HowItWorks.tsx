import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import './HowItWorks.css';

interface Step {
  number: number;
  icon: string;
  title: string;
  description: string;
}

const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      icon: 'fas fa-search',
      title: 'Search & Select',
      description: 'Enter your travel details and browse through our available buses. Compare prices, amenities, and reviews.'
    },
    {
      number: 2,
      icon: 'fas fa-calendar-check',
      title: 'Book & Pay',
      description: 'Choose your preferred bus, fill in passenger details, and make secure payment online or pay advance.'
    },
    {
      number: 3,
      icon: 'fas fa-bus',
      title: 'Travel & Enjoy',
      description: 'Receive confirmation details, board your bus on time, and enjoy a comfortable journey to your destination.'
    }
  ];

  return (
    <div className="how-it-works">
      <Row className="justify-content-center">
        {steps.map((step, index) => (
          <Col lg={4} md={6} className="mb-4" key={step.number}>
            <Card className="step-card h-100">
              <Card.Body className="text-center">
                <div className="step-number-container mb-3">
                  <div className="step-number">{step.number}</div>
                </div>
                <div className="step-icon-container mb-3">
                  <i className={`${step.icon} step-icon`}></i>
                </div>
                <Card.Title className="step-title">
                  {step.title}
                </Card.Title>
                <Card.Text className="step-description">
                  {step.description}
                </Card.Text>
              </Card.Body>
              {index < steps.length - 1 && (
                <div className="step-connector d-none d-lg-block">
                  <i className="fas fa-arrow-right"></i>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HowItWorks;
