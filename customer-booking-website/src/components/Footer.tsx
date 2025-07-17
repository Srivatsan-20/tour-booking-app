import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-main">
        <Container>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="footer-section">
                <h5 className="footer-title">Sri Sai Senthil Tours</h5>
                <p className="footer-description">
                  Your trusted partner for comfortable and reliable bus travel across South India.
                  We provide premium bus rental services with a focus on safety, comfort, and customer satisfaction.
                </p>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={2} md={6} className="mb-4">
              <div className="footer-section">
                <h6 className="footer-subtitle">Quick Links</h6>
                <ul className="footer-links">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/search">Search Buses</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
            </Col>

            <Col lg={3} md={6} className="mb-4">
              <div className="footer-section">
                <h6 className="footer-subtitle">Services</h6>
                <ul className="footer-links">
                  <li><a href="#">Bus Rental</a></li>
                  <li><a href="#">Tour Packages</a></li>
                  <li><a href="#">Corporate Travel</a></li>
                  <li><a href="#">Event Transportation</a></li>
                </ul>
              </div>
            </Col>

            <Col lg={3} md={6} className="mb-4">
              <div className="footer-section">
                <h6 className="footer-subtitle">Contact Info</h6>
                <div className="contact-info">
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Dharmapuri, Tamil Nadu, India</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <a href="mailto:info@srisaisenthil.com">info@srisaisenthil.com</a>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-clock"></i>
                    <span>24/7 Customer Support</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <p className="copyright">
                © 2024 Sri Sai Senthil Tours. All rights reserved.
              </p>
            </Col>
            <Col md={6}>
              <div className="footer-bottom-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms & Conditions</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
