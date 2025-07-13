import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomerBookings();
  }, []);

  const fetchCustomerBookings = async () => {
    try {
      // Mock data for customer bookings
      // In production, this would fetch from API based on customer ID
      const mockBookings = [
        {
          id: 30,
          customerName: 'Priya Sharma',
          startDate: '2025-01-15',
          endDate: '2025-01-20',
          pickupLocation: 'Mumbai',
          dropLocation: 'Goa',
          numberOfBuses: 1,
          busType: 'AC Sleeper',
          totalRent: 25000,
          advancePaid: 10000,
          status: 'confirmed',
          busRegistration: 'MH-01-AB-1234'
        },
        {
          id: 35,
          customerName: 'Priya Sharma',
          startDate: '2025-08-15',
          endDate: '2025-08-20',
          pickupLocation: 'Delhi',
          dropLocation: 'Manali',
          numberOfBuses: 1,
          busType: 'AC Seater',
          totalRent: 35000,
          advancePaid: 15000,
          status: 'upcoming',
          busRegistration: 'DL-07-MN-1357'
        }
      ];

      setBookings(mockBookings);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { bg: 'success', text: 'Confirmed' },
      upcoming: { bg: 'primary', text: 'Upcoming' },
      in_progress: { bg: 'warning', text: 'In Progress' },
      completed: { bg: 'secondary', text: 'Completed' },
      cancelled: { bg: 'danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: 'Unknown' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const calculateBalance = (total, advance) => {
    return total - advance;
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your bookings...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">🎫 Customer Dashboard</h2>
          <p className="text-muted">Welcome back, {user?.name}!</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="success"
            onClick={() => navigate('/booking')}
          >
            ➕ New Booking
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary">
            <Card.Body>
              <h4 className="text-primary">{bookings.filter(b => b.status === 'upcoming').length}</h4>
              <small className="text-muted">Upcoming Trips</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
            <Card.Body>
              <h4 className="text-success">{bookings.filter(b => b.status === 'confirmed').length}</h4>
              <small className="text-muted">Confirmed</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-secondary">
            <Card.Body>
              <h4 className="text-secondary">{bookings.filter(b => b.status === 'completed').length}</h4>
              <small className="text-muted">Completed</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h4 className="text-warning">
                ₹{bookings.reduce((sum, b) => sum + calculateBalance(b.totalRent, b.advancePaid), 0).toLocaleString()}
              </h4>
              <small className="text-muted">Total Balance</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* My Bookings */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">📋 My Bookings</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {bookings.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">No bookings found.</p>
              <Button 
                variant="primary"
                onClick={() => navigate('/booking')}
              >
                Create Your First Booking
              </Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Booking ID</th>
                  <th>Route</th>
                  <th>Dates</th>
                  <th>Bus Details</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => {
                  const balance = calculateBalance(booking.totalRent, booking.advancePaid);
                  const days = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                  
                  return (
                    <tr key={booking.id}>
                      <td>
                        <strong>#{booking.id}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{booking.pickupLocation} → {booking.dropLocation}</strong>
                          <br />
                          <small className="text-muted">{days} days</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {new Date(booking.startDate).toLocaleDateString()}
                          <br />
                          <small className="text-muted">
                            to {new Date(booking.endDate).toLocaleDateString()}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{booking.busType}</strong>
                          <br />
                          <small className="text-muted">{booking.busRegistration}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>₹{booking.totalRent.toLocaleString()}</strong>
                          <br />
                          <small className="text-muted">
                            Paid: ₹{booking.advancePaid.toLocaleString()}
                          </small>
                          <br />
                          <small className={balance > 0 ? 'text-danger' : 'text-success'}>
                            Balance: ₹{balance.toLocaleString()}
                          </small>
                        </div>
                      </td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => navigate(`/customer/booking/${booking.id}`)}
                            title="View Details"
                          >
                            👁️
                          </Button>
                          {balance > 0 && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => navigate(`/customer/payment/${booking.id}`)}
                              title="Make Payment"
                            >
                              💳
                            </Button>
                          )}
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => navigate(`/customer/receipt/${booking.id}`)}
                            title="Download Receipt"
                          >
                            📄
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Quick Actions */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h6 className="mb-0">⚡ Quick Actions</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-2 flex-wrap">
                <Button 
                  variant="outline-primary"
                  onClick={() => navigate('/booking')}
                >
                  ➕ New Booking
                </Button>
                <Button 
                  variant="outline-success"
                  onClick={() => navigate('/customer/payments')}
                >
                  💳 Payment History
                </Button>
                <Button 
                  variant="outline-info"
                  onClick={() => navigate('/customer/profile')}
                >
                  👤 Update Profile
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={() => navigate('/customer/support')}
                >
                  🎧 Support
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerDashboard;
