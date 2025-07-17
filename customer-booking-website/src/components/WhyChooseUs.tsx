import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import './WhyChooseUs.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const WhyChooseUs: React.FC = () => {
  const features: Feature[] = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Safe & Secure',
      description: 'All our buses are regularly maintained and driven by experienced, verified drivers with clean records.',
      color: '#28a745'
    },
    {
      icon: 'fas fa-clock',
      title: 'On-Time Service',
      description: 'We pride ourselves on punctuality. Your journey starts and ends exactly when promised.',
      color: '#007bff'
    },
    {
      icon: 'fas fa-money-bill-wave',
      title: 'Best Prices',
      description: 'Competitive pricing with no hidden fees. Get the best value for your money with transparent billing.',
      color: '#ffc107'
    },
    {
      icon: 'fas fa-headset',
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you before, during, and after your journey.',
      color: '#17a2b8'
    },
    {
      icon: 'fas fa-star',
      title: 'Premium Fleet',
      description: 'Modern, well-maintained buses with comfortable seating and latest amenities for your comfort.',
      color: '#fd7e14'
    },
    {
      icon: 'fas fa-route',
      title: 'Flexible Routes',
      description: 'Customizable routes and itineraries to match your specific travel needs and preferences.',
      color: '#6f42c1'
    }
  ];

  return (
    <div className="why-choose-us">
      <Row>
        {features.map((feature, index) => (
          <Col lg={4} md={6} className="mb-4" key={index}>
            <Card className="feature-card h-100">
              <Card.Body className="text-center">
                <div 
                  className="feature-icon-container mb-3"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <i 
                    className={`${feature.icon} feature-icon`}
                    style={{ color: feature.color }}
                  ></i>
                </div>
                <Card.Title className="feature-title">
                  {feature.title}
                </Card.Title>
                <Card.Text className="feature-description">
                  {feature.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default WhyChooseUs;
