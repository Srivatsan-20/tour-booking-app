import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      style={{
        backgroundColor: '#2C1810', // Dark brown
        color: '#F5F5DC', // Cream
        borderTop: '3px solid #FFD700', // Gold border
        marginTop: 'auto',
        padding: '40px 0 20px 0'
      }}
    >
      <Container>
        <Row>
          {/* Company Info */}
          <Col md={4} className="mb-4">
            <div className="mb-3">
              <Logo 
                size="medium" 
                showText={true} 
                variant="dark"
              />
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#D4C4A8' }}>
              Your trusted partner for spiritual and cultural tours across India. 
              Experience divine journeys with comfort and devotion.
            </p>
            <div style={{ fontSize: '12px', color: '#FFD700' }}>
              <strong>ஸ்ரீ சாயி செந்தில் டூர்ஸ் அண்ட் ட்ராவல்ஸ்</strong>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={2} className="mb-4">
            <h6 style={{ color: '#FFD700', marginBottom: '15px', fontWeight: 'bold' }}>
              Quick Links
            </h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                { label: 'Home', icon: '🏠' },
                { label: 'Book Tour', icon: '🚌' },
                { label: 'View Bookings', icon: '📋' },
                { label: 'Trip Accounts', icon: '💰' }
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <a 
                    href="#" 
                    style={{ 
                      color: '#D4C4A8', 
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.target.style.color = '#D4C4A8'}
                  >
                    <span style={{ marginRight: '8px' }}>{link.icon}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Services */}
          <Col md={3} className="mb-4">
            <h6 style={{ color: '#FFD700', marginBottom: '15px', fontWeight: 'bold' }}>
              Our Services
            </h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                { label: 'Temple Tours', icon: '🏛️' },
                { label: 'Pilgrimage Packages', icon: '🙏' },
                { label: 'Cultural Tours', icon: '🎭' },
                { label: 'Group Bookings', icon: '👥' },
                { label: 'Custom Itineraries', icon: '📝' }
              ].map((service, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#D4C4A8', fontSize: '14px' }}>
                    <span style={{ marginRight: '8px' }}>{service.icon}</span>
                    {service.label}
                  </span>
                </li>
              ))}
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={3} className="mb-4">
            <h6 style={{ color: '#FFD700', marginBottom: '15px', fontWeight: 'bold' }}>
              Contact Us
            </h6>
            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <div style={{ marginBottom: '8px', color: '#D4C4A8' }}>
                <span style={{ marginRight: '8px' }}>📞</span>
                <strong>+91-1800-SAI-TOURS</strong>
              </div>
              <div style={{ marginBottom: '8px', color: '#D4C4A8' }}>
                <span style={{ marginRight: '8px' }}>📧</span>
                bookings@srisaisenthil.com
              </div>
              <div style={{ marginBottom: '8px', color: '#D4C4A8' }}>
                <span style={{ marginRight: '8px' }}>🌐</span>
                www.srisaisenthiltours.com
              </div>
              <div style={{ marginBottom: '8px', color: '#D4C4A8' }}>
                <span style={{ marginRight: '8px' }}>⏰</span>
                24/7 Customer Support
              </div>
            </div>

            {/* Social Media */}
            <div style={{ marginTop: '15px' }}>
              <h6 style={{ color: '#FFD700', fontSize: '14px', marginBottom: '10px' }}>
                Follow Us
              </h6>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['📘', '📷', '🐦', '📺'].map((icon, index) => (
                  <div
                    key={index}
                    style={{
                      width: '35px',
                      height: '35px',
                      backgroundColor: '#8B4513',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: '2px solid #FFD700'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#FFD700';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#8B4513';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <hr style={{ borderColor: '#8B4513', margin: '30px 0 20px 0' }} />
        <Row>
          <Col md={6}>
            <p style={{ fontSize: '12px', color: '#D4C4A8', margin: 0 }}>
              © {currentYear} Sri Sai Senthil Tours & Travels. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-end">
            <p style={{ fontSize: '12px', color: '#D4C4A8', margin: 0 }}>
              <span style={{ marginRight: '15px' }}>Privacy Policy</span>
              <span style={{ marginRight: '15px' }}>Terms of Service</span>
              <span>🙏 Blessed Journeys</span>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
