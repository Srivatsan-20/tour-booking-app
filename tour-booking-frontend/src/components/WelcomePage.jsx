import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const WelcomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🏛️',
      title: 'Temple Tours',
      description: 'Sacred journeys to ancient temples and spiritual destinations across India',
      color: '#8B4513'
    },
    {
      icon: '🙏',
      title: 'Pilgrimage Packages',
      description: 'Complete pilgrimage experiences with comfortable accommodation and guidance',
      color: '#FFD700'
    },
    {
      icon: '🎭',
      title: 'Cultural Tours',
      description: 'Explore rich heritage, traditions, and cultural landmarks',
      color: '#8B4513'
    },
    {
      icon: '👥',
      title: 'Group Bookings',
      description: 'Special packages for families, communities, and organizations',
      color: '#FFD700'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Chennai',
      text: 'Excellent service! The temple tour was well organized and spiritually fulfilling.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      name: 'Priya Sharma',
      location: 'Bangalore',
      text: 'Professional staff and comfortable buses. Highly recommended for family trips.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      name: 'Venkatesh Iyer',
      location: 'Mumbai',
      text: 'Amazing cultural tour experience. Every detail was perfectly planned.',
      rating: '⭐⭐⭐⭐⭐'
    }
  ];

  return (
    <div style={{ backgroundColor: '#F5F5DC', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
          color: 'white',
          padding: '80px 0',
          textAlign: 'center'
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="mb-4">
                <Logo size="xlarge" showText={true} variant="dark" />
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>
                Welcome to Sri Sai Senthil Tours
              </h1>
              <p style={{ fontSize: '1.3rem', marginBottom: '30px', opacity: 0.9 }}>
                Your trusted partner for spiritual journeys and cultural experiences across India
              </p>
              <div style={{ fontSize: '1.1rem', marginBottom: '40px', color: '#FFD700' }}>
                <strong>ஸ்ரீ சாயி செந்தில் டூர்ஸ் அண்ட் ட்ராவல்ஸ்</strong>
              </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  size="lg"
                  onClick={() => navigate('/booking')}
                  style={{
                    backgroundColor: '#FFD700',
                    borderColor: '#FFD700',
                    color: '#8B4513',
                    fontWeight: 'bold',
                    padding: '12px 30px',
                    fontSize: '1.1rem'
                  }}
                >
                  🚌 Book Your Tour
                </Button>
                <Button
                  size="lg"
                  variant="outline-light"
                  onClick={() => navigate('/admin')}
                  style={{
                    borderColor: '#FFD700',
                    color: '#FFD700',
                    fontWeight: 'bold',
                    padding: '12px 30px',
                    fontSize: '1.1rem'
                  }}
                >
                  📊 Dashboard
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container style={{ padding: '80px 0' }}>
        <Row className="text-center mb-5">
          <Col>
            <h2 style={{ color: '#8B4513', fontWeight: 'bold', fontSize: '2.5rem' }}>
              Our Services
            </h2>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>
              Experience divine journeys with comfort and devotion
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col md={6} lg={3} key={index}>
              <Card 
                className="h-100 text-center"
                style={{
                  border: `2px solid ${feature.color}`,
                  borderRadius: '15px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(139, 69, 19, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Card.Body style={{ padding: '30px 20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
                    {feature.icon}
                  </div>
                  <Card.Title style={{ color: feature.color, fontWeight: 'bold' }}>
                    {feature.title}
                  </Card.Title>
                  <Card.Text style={{ color: '#666' }}>
                    {feature.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Testimonials Section */}
      <div style={{ backgroundColor: '#8B4513', color: 'white', padding: '80px 0' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
                What Our Customers Say
              </h2>
              <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                Blessed journeys, happy travelers
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            {testimonials.map((testimonial, index) => (
              <Col md={4} key={index}>
                <Card 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '15px',
                    color: 'white'
                  }}
                >
                  <Card.Body style={{ padding: '25px' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
                      {testimonial.rating}
                    </div>
                    <Card.Text style={{ fontSize: '1rem', marginBottom: '20px', fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Card.Text>
                    <div>
                      <strong>{testimonial.name}</strong>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                        {testimonial.location}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Contact Section */}
      <Container style={{ padding: '80px 0' }}>
        <Row className="text-center">
          <Col lg={8} className="mx-auto">
            <div className="mb-4">
              <Logo size="medium" showText={true} variant="default" />
            </div>
            <h2 style={{ color: '#8B4513', fontWeight: 'bold', marginBottom: '30px' }}>
              Ready to Start Your Journey?
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '30px' }}>
              Contact us today to plan your perfect spiritual and cultural tour experience
            </p>
            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📞</div>
                <strong style={{ color: '#8B4513' }}>+91-1800-SAI-TOURS</strong>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📧</div>
                <strong style={{ color: '#8B4513' }}>bookings@srisaisenthil.com</strong>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>⏰</div>
                <strong style={{ color: '#8B4513' }}>24/7 Support</strong>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => navigate('/booking')}
              style={{
                backgroundColor: '#8B4513',
                borderColor: '#8B4513',
                color: 'white',
                fontWeight: 'bold',
                padding: '15px 40px',
                fontSize: '1.2rem',
                borderRadius: '25px'
              }}
            >
              🙏 Book Your Blessed Journey
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WelcomePage;
