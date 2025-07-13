import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/booking', label: 'Book Tour', icon: '🚌' },
    { path: '/bookings', label: 'View Bookings', icon: '📋' },
    { path: '/trip-accounts', label: 'Trip Accounts', icon: '💰' },
    { path: '/admin', label: 'Admin Dashboard', icon: '⚙️' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar 
      expand="lg" 
      style={{
        backgroundColor: '#8B4513', // Maroon
        boxShadow: '0 2px 10px rgba(139, 69, 19, 0.3)',
        borderBottom: '3px solid #FFD700' // Gold border
      }}
      variant="dark"
    >
      <Container>
        {/* Logo and Brand */}
        <Navbar.Brand 
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', padding: '8px 0' }}
        >
          <Logo 
            size="medium" 
            showText={true} 
            variant="dark"
            onClick={() => navigate('/')}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {navItems.map((item) => (
              <Nav.Link
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  color: isActive(item.path) ? '#FFD700' : '#F5F5DC', // Gold if active, cream if not
                  fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  backgroundColor: isActive(item.path) ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                  borderRadius: '6px',
                  margin: '0 4px',
                  padding: '8px 16px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: isActive(item.path) ? '1px solid #FFD700' : '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.backgroundColor = 'rgba(245, 245, 220, 0.1)';
                    e.target.style.color = '#FFD700';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#F5F5DC';
                  }
                }}
              >
                <span style={{ marginRight: '8px' }}>{item.icon}</span>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
