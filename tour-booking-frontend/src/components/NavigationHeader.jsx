import React from 'react';
import { Navbar, Nav, NavDropdown, Badge, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavigationHeader.css';

const NavigationHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, hasPermission, hasRole } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'danger',
      manager: 'warning',
      driver: 'info',
      customer: 'success'
    };
    return colors[role] || 'secondary';
  };

  const getRoleDisplayName = (role) => {
    const names = {
      admin: 'Administrator',
      manager: 'Manager',
      driver: 'Driver',
      customer: 'Customer'
    };
    return names[role] || role;
  };

  // Don't show navigation on sign in page
  if (location.pathname === '/signin') {
    return null;
  }

  return (
    <Navbar
      expand="lg"
      className="sri-sai-navbar shadow-sm"
      variant="dark"
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
          className="fw-bold"
        >
          <div className="sri-sai-logo-container">
            {/* Logo Image or Styled Fallback */}
            <div className="sri-sai-logo-image">
              <img
                src="/logo.png"
                alt="Sri Sai Senthil Tours"
                onError={(e) => {
                  // Fallback to styled logo if image fails
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Styled Fallback */}
              <div className="sri-sai-logo-fallback">
                <div style={{ fontSize: '12px' }}>🏛️</div>
                <div style={{ fontSize: '10px' }}>🚌</div>
                <div style={{ fontSize: '6px', lineHeight: '1' }}>SSS</div>
              </div>
            </div>

            {/* Company Text */}
            <div className="sri-sai-company-text">
              <div className="sri-sai-company-name">
                SRI SAI SENTHIL
              </div>
              <div className="sri-sai-company-tagline">
                TOURS & TRAVELS
              </div>
            </div>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Admin/Manager Navigation */}
            {hasRole(['admin', 'manager']) && (
              <>
                <Nav.Link
                  onClick={() => navigate('/admin')}
                  className={location.pathname === '/admin' ? 'active' : ''}
                  title="Dashboard"
                >
                  📊
                </Nav.Link>

                {hasPermission('manage_buses') && (
                  <NavDropdown
                    title="🚌"
                    id="bus-dropdown"
                  >
                    <NavDropdown.Item onClick={() => navigate('/admin/bus-fleet')}>
                      🚌 Fleet Management
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate('/admin/bus-onboarding')}>
                      ➕ Add New Bus
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate('/admin/bus-allocation')}>
                      📋 Allocations
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate('/admin/bus-calendar')}>
                      📅 Calendar
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {hasPermission('manage_bookings') && (
                  <NavDropdown title="📝" id="booking-dropdown">
                    <NavDropdown.Item onClick={() => navigate('/admin/upcoming-tours')}>
                      📅 Upcoming Tours
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate('/tour-planner')}>
                      🧠 Smart Tour Planner
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate('/booking')}>
                      ➕ New Booking
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {hasPermission('manage_trip_accounts') && (
                  <Nav.Link
                    onClick={() => navigate('/admin/trip-accounts')}
                    title="Trip Accounts"
                  >
                    💰
                  </Nav.Link>
                )}
              </>
            )}

            {/* Driver Navigation */}
            {hasRole('driver') && (
              <>
                <Nav.Link
                  onClick={() => navigate('/driver/trips')}
                  title="My Trips"
                >
                  🚛
                </Nav.Link>
                <Nav.Link
                  onClick={() => navigate('/driver/expenses')}
                  title="Expenses"
                >
                  💸
                </Nav.Link>
              </>
            )}

            {/* Admin Driver Access */}
            {hasRole('admin') && (
              <NavDropdown title="🚛" id="driver-admin-dropdown">
                <NavDropdown.Item onClick={() => navigate('/driver')}>
                  🚛 Driver Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/driver/trips')}>
                  📋 All Driver Trips
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {/* Customer Navigation */}
            {hasRole('customer') && (
              <>
                <Nav.Link
                  onClick={() => navigate('/customer/bookings')}
                  title="My Bookings"
                >
                  📋
                </Nav.Link>
                <Nav.Link
                  onClick={() => navigate('/tour-planner')}
                  title="Smart Tour Planner"
                >
                  🧠
                </Nav.Link>
                <Nav.Link
                  onClick={() => navigate('/booking')}
                  title="New Booking"
                >
                  ➕
                </Nav.Link>
              </>
            )}

            {/* Admin Customer Access */}
            {hasRole('admin') && (
              <NavDropdown title="👤" id="customer-admin-dropdown">
                <NavDropdown.Item onClick={() => navigate('/customer')}>
                  👤 Customer Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/customer/support')}>
                  🆘 Customer Support
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          {/* User Info and Sign Out */}
          <Nav>
            <NavDropdown
              title={
                <span>
                  👤 {user?.name || user?.username}
                  <Badge
                    bg={getRoleBadgeColor(user?.role)}
                    className="ms-2"
                  >
                    {getRoleDisplayName(user?.role)}
                  </Badge>
                </span>
              }
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item disabled>
                <small className="text-muted">
                  Signed in as: {user?.email}
                </small>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => navigate('/profile')}>
                👤 Profile
              </NavDropdown.Item>
              {hasPermission('manage_users') && (
                <NavDropdown.Item onClick={() => navigate('/admin/users')}>
                  👥 User Management
                </NavDropdown.Item>
              )}
              {hasRole(['admin', 'manager']) && (
                <NavDropdown.Item onClick={() => navigate('/admin/settings')}>
                  ⚙️ Settings
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleSignOut} className="text-danger">
                🚪 Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationHeader;
