import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const handleNavClick = (path: string) => {
    navigate(path);
    handleCloseOffcanvas();
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="custom-navbar shadow-sm" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <img
              src="/images/sri-sai-senthil-logo.png"
              alt="Sri Sai Senthil Tours"
              className="logo-image"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="brand-text">
              <span className="brand-name">Sri Sai Senthil</span>
              <span className="brand-tagline">Tours & Travels</span>
            </span>
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="nav-item">
                <i className="fas fa-home me-1"></i>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/search" className="nav-item">
                <i className="fas fa-search me-1"></i>
                Search Buses
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-item">
                <i className="fas fa-info-circle me-1"></i>
                About Us
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-item">
                <i className="fas fa-phone me-1"></i>
                Contact
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/login" className="nav-item">
                <i className="fas fa-sign-in-alt me-1"></i>
                Login
              </Nav.Link>
              <Button
                variant="primary"
                className="register-btn"
                onClick={() => navigate('/register')}
              >
                <i className="fas fa-user-plus me-1"></i>
                Register
              </Button>
            </Nav>
          </Navbar.Collapse>

          {/* Mobile Menu Toggle */}
          <Button
            variant="outline-primary"
            className="d-lg-none mobile-menu-btn"
            onClick={handleShowOffcanvas}
          >
            <i className="fas fa-bars"></i>
          </Button>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <span className="brand-text">
              <span className="brand-name">Sri Sai Senthil</span>
              <span className="brand-tagline">Tours & Travels</span>
            </span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link
              className="mobile-nav-item"
              onClick={() => handleNavClick('/')}
            >
              <i className="fas fa-home me-2"></i>
              Home
            </Nav.Link>
            <Nav.Link
              className="mobile-nav-item"
              onClick={() => handleNavClick('/search')}
            >
              <i className="fas fa-search me-2"></i>
              Search Buses
            </Nav.Link>
            <Nav.Link
              className="mobile-nav-item"
              onClick={() => handleNavClick('/about')}
            >
              <i className="fas fa-info-circle me-2"></i>
              About Us
            </Nav.Link>
            <Nav.Link
              className="mobile-nav-item"
              onClick={() => handleNavClick('/contact')}
            >
              <i className="fas fa-phone me-2"></i>
              Contact
            </Nav.Link>
            <hr />
            <Nav.Link
              className="mobile-nav-item"
              onClick={() => handleNavClick('/login')}
            >
              <i className="fas fa-sign-in-alt me-2"></i>
              Login
            </Nav.Link>
            <div className="d-grid mt-3">
              <Button
                variant="primary"
                onClick={() => handleNavClick('/register')}
              >
                <i className="fas fa-user-plus me-2"></i>
                Register
              </Button>
            </div>
          </Nav>

          {/* Contact Info in Mobile Menu */}
          <div className="mobile-contact-info mt-4 pt-4 border-top">
            <h6 className="text-muted">Contact Us</h6>
            <div className="contact-item">
              <i className="fas fa-phone text-primary me-2"></i>
              <a href="tel:+919876543210" className="text-decoration-none">
                +91 98765 43210
              </a>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope text-primary me-2"></i>
              <a href="mailto:info@srisaisenthil.com" className="text-decoration-none">
                info@srisaisenthil.com
              </a>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt text-primary me-2"></i>
              <span>Dharmapuri, Tamil Nadu</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="mobile-social-links mt-3">
            <h6 className="text-muted">Follow Us</h6>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Top Info Bar */}
      <div className="top-info-bar d-none d-md-block">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="contact-info">
              <span className="contact-item me-3">
                <i className="fas fa-phone me-1"></i>
                +91 98765 43210
              </span>
              <span className="contact-item">
                <i className="fas fa-envelope me-1"></i>
                info@srisaisenthil.com
              </span>
            </div>
            <div className="social-links">
              <a href="#" className="social-link me-2">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link me-2">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link me-2">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
