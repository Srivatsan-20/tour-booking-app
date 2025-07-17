import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Logo from './Logo';

const PublicFooter = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row>
          {/* Company Info */}
          <Col lg={4} md={6} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <Logo />
              <div className="ms-2">
                <h5 className="text-primary mb-0">Sri Sai Senthil</h5>
                <small className="text-muted">Tours & Travels</small>
              </div>
            </div>
            <p className="text-muted">
              Your trusted partner for group tour bus rentals across South India.
              We provide reliable transportation for tour organizers with our modern fleet and
              professional drivers.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-primary">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-primary">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-primary">
                <FaInstagram size={20} />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-primary mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/search" className="text-muted text-decoration-none">
                  Book Tour Buses
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>

          {/* Services */}
          <Col lg={3} md={6} className="mb-4">
            <h6 className="text-primary mb-3">Our Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <span className="text-muted">Group Tour Buses</span>
              </li>
              <li className="mb-2">
                <span className="text-muted">Multi-Day Tours</span>
              </li>
              <li className="mb-2">
                <span className="text-muted">Corporate Outings</span>
              </li>
              <li className="mb-2">
                <span className="text-muted">Educational Trips</span>
              </li>
              <li className="mb-2">
                <span className="text-muted">Pilgrimage Tours</span>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={3} md={6} className="mb-4">
            <h6 className="text-primary mb-3">Contact Info</h6>
            <div className="d-flex align-items-center mb-2">
              <FaPhone className="text-primary me-2" />
              <span className="text-muted">+91 98765 43210</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope className="text-primary me-2" />
              <span className="text-muted">info@srisaisenthil.com</span>
            </div>
            <div className="d-flex align-items-start mb-2">
              <FaMapMarkerAlt className="text-primary me-2 mt-1" />
              <span className="text-muted">
                123 Main Street<br />
                Chennai, Tamil Nadu<br />
                India - 600001
              </span>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Bottom Footer */}
        <Row>
          <Col md={6}>
            <p className="text-muted mb-0">
              © 2024 Sri Sai Senthil Tours. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <Link to="/privacy" className="text-muted text-decoration-none me-3">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted text-decoration-none">
              Terms & Conditions
            </Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default PublicFooter;
