import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaInfoCircle, FaPhone, FaSignInAlt, FaUserPlus, FaBars } from 'react-icons/fa';
import Logo from './Logo';

const PublicHeader = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleCloseMobileMenu = () => setShowMobileMenu(false);
  const handleShowMobileMenu = () => setShowMobileMenu(true);

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm sticky-top">
        <Container>
          {/* Brand Logo */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <Logo />
            <div className="ms-2">
              <div className="fw-bold text-primary fs-5">Sri Sai Senthil</div>
              <div className="text-muted small">Tours & Travels</div>
            </div>
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="d-flex align-items-center">
                <FaHome className="me-1" />
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/search" className="d-flex align-items-center">
                <FaSearch className="me-1" />
                Book Tour Buses
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="d-flex align-items-center">
                <FaInfoCircle className="me-1" />
                About Us
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="d-flex align-items-center">
                <FaPhone className="me-1" />
                Contact
              </Nav.Link>
            </Nav>

            <Nav>
              <Nav.Link as={Link} to="/signin" className="d-flex align-items-center">
                <FaSignInAlt className="me-1" />
                Login
              </Nav.Link>
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
                className="ms-2"
              >
                <FaUserPlus className="me-1" />
                Register
              </Button>
            </Nav>
          </Navbar.Collapse>

          {/* Mobile Menu Button */}
          <Button
            variant="outline-primary"
            className="d-lg-none"
            onClick={handleShowMobileMenu}
          >
            <FaBars />
          </Button>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={showMobileMenu} onHide={handleCloseMobileMenu} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <div className="d-flex align-items-center">
              <Logo />
              <div className="ms-2">
                <div className="fw-bold text-primary">Sri Sai Senthil</div>
                <div className="text-muted small">Tours & Travels</div>
              </div>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" onClick={handleCloseMobileMenu} className="d-flex align-items-center py-3">
              <FaHome className="me-2" />
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/search" onClick={handleCloseMobileMenu} className="d-flex align-items-center py-3">
              <FaSearch className="me-2" />
              Book Tour Buses
            </Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={handleCloseMobileMenu} className="d-flex align-items-center py-3">
              <FaInfoCircle className="me-2" />
              About Us
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={handleCloseMobileMenu} className="d-flex align-items-center py-3">
              <FaPhone className="me-2" />
              Contact
            </Nav.Link>
            <hr />
            <Nav.Link as={Link} to="/signin" onClick={handleCloseMobileMenu} className="d-flex align-items-center py-3">
              <FaSignInAlt className="me-2" />
              Login
            </Nav.Link>
            <Button
              variant="primary"
              onClick={() => {
                handleCloseMobileMenu();
                navigate('/register');
              }}
              className="mt-2"
            >
              <FaUserPlus className="me-1" />
              Register
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default PublicHeader;
