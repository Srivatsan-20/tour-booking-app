import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DriverTripDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      // Mock trip data - in production, fetch from API
      const mockTrip = {
        id: parseInt(id),
        bookingId: 29,
        busRegistration: 'MH-01-AB-1234',
        busType: 'AC Sleeper',
        customerName: 'jaina',
        customerPhone: '+91-9876543210',
        route: 'Mumbai → Goa',
        pickupLocation: 'Mumbai Central Station',
        dropLocation: 'Goa Beach Resort',
        startDate: '2025-08-01',
        endDate: '2025-08-09',
        status: 'upcoming',
        totalRent: 45000,
        driverBatta: 3500,
        plannedDays: 9,
        startingOdometer: 45000,
        endingOdometer: null,
        currentOdometer: 45000,
        notes: 'Beach resort pickup required. Customer prefers early morning departure.',
        expenses: [
          { id: 1, type: 'fuel', description: 'Mumbai Petrol Pump', amount: 2500, date: '2025-08-01' },
          { id: 2, type: 'toll', description: 'Highway Toll', amount: 800, date: '2025-08-01' }
        ]
      };

      setTrip(mockTrip);
    } catch (err) {
      setError('Failed to fetch trip details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { bg: 'primary', text: 'Upcoming' },
      in_progress: { bg: 'success', text: 'In Progress' },
      completed: { bg: 'secondary', text: 'Completed' },
      cancelled: { bg: 'danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: 'Unknown' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const handleStatusUpdate = (newStatus) => {
    setTrip(prev => ({ ...prev, status: newStatus }));
    alert(`Trip status updated to: ${newStatus}`);
  };

  const handleOdometerUpdate = () => {
    const newReading = prompt('Enter current odometer reading:');
    if (newReading && !isNaN(newReading)) {
      setTrip(prev => ({ ...prev, currentOdometer: parseInt(newReading) }));
      alert('Odometer reading updated successfully!');
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading trip details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 p-4 border rounded shadow bg-light">
        <Alert variant="danger">
          <h5>Error Loading Trip</h5>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/driver')}>
            ← Back to Dashboard
          </Button>
        </Alert>
      </Container>
    );
  }

  const tripDuration = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  const totalExpenses = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-0">🚛 Trip Details</h2>
          <p className="text-muted">Trip ID: {trip.id} | Booking: #{trip.bookingId}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate("/driver")}>
            ← Driver Dashboard
          </Button>
          {getStatusBadge(trip.status)}
        </div>
      </div>

      {/* Trip Status & Actions */}
      <Card className="mb-4">
        <Card.Header className="bg-info text-white">
          <h5 className="mb-0">📋 Trip Status & Actions</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <p className="mb-2"><strong>Current Status:</strong> {trip.status}</p>
              <p className="mb-0"><strong>Driver:</strong> {user?.name}</p>
            </Col>
            <Col md={4} className="text-end">
              <div className="d-flex gap-2 justify-content-end flex-wrap">
                {trip.status === 'upcoming' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusUpdate('in_progress')}
                  >
                    🚀 Start Trip
                  </Button>
                )}
                {trip.status === 'in_progress' && (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={handleOdometerUpdate}
                    >
                      📊 Update Odometer
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusUpdate('completed')}
                    >
                      ✅ Complete Trip
                    </Button>
                  </>
                )}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/driver/expenses/${trip.id}`)}
                >
                  💸 Manage Expenses
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Trip Information */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">🚌 Bus & Route Information</h6>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Bus:</strong></td>
                    <td>{trip.busRegistration} ({trip.busType})</td>
                  </tr>
                  <tr>
                    <td><strong>Route:</strong></td>
                    <td>{trip.route}</td>
                  </tr>
                  <tr>
                    <td><strong>Pickup:</strong></td>
                    <td>{trip.pickupLocation}</td>
                  </tr>
                  <tr>
                    <td><strong>Drop:</strong></td>
                    <td>{trip.dropLocation}</td>
                  </tr>
                  <tr>
                    <td><strong>Duration:</strong></td>
                    <td>{tripDuration} days</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h6 className="mb-0">👤 Customer Information</h6>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Customer:</strong></td>
                    <td>{trip.customerName}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>{trip.customerPhone}</td>
                  </tr>
                  <tr>
                    <td><strong>Start Date:</strong></td>
                    <td>{new Date(trip.startDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>End Date:</strong></td>
                    <td>{new Date(trip.endDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Rent:</strong></td>
                    <td>₹{trip.totalRent.toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Odometer & Expenses */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h6 className="mb-0">📊 Odometer Readings</h6>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Starting:</strong></td>
                    <td>{trip.startingOdometer?.toLocaleString() || 'Not set'} KM</td>
                  </tr>
                  <tr>
                    <td><strong>Current:</strong></td>
                    <td>{trip.currentOdometer?.toLocaleString() || 'Not set'} KM</td>
                  </tr>
                  <tr>
                    <td><strong>Distance:</strong></td>
                    <td>
                      {trip.currentOdometer && trip.startingOdometer 
                        ? `${(trip.currentOdometer - trip.startingOdometer).toLocaleString()} KM`
                        : 'N/A'
                      }
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Driver Batta:</strong></td>
                    <td>₹{trip.driverBatta.toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header className="bg-danger text-white">
              <h6 className="mb-0">💸 Expense Summary</h6>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Total Expenses:</strong></td>
                    <td>₹{totalExpenses.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Fuel Expenses:</strong></td>
                    <td>₹{trip.expenses.filter(e => e.type === 'fuel').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Other Expenses:</strong></td>
                    <td>₹{trip.expenses.filter(e => e.type !== 'fuel').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Entries:</strong></td>
                    <td>{trip.expenses.length} items</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Notes */}
      {trip.notes && (
        <Card className="mb-4">
          <Card.Header className="bg-info text-white">
            <h6 className="mb-0">📝 Trip Notes</h6>
          </Card.Header>
          <Card.Body>
            <p className="mb-0">{trip.notes}</p>
          </Card.Body>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="text-center">
        <Button 
          variant="outline-secondary" 
          className="me-2"
          onClick={() => navigate("/driver")}
        >
          ← Driver Dashboard
        </Button>
        <Button 
          variant="outline-primary" 
          className="me-2"
          onClick={() => navigate(`/driver/expenses/${trip.id}`)}
        >
          💸 Manage Expenses
        </Button>
        <Button 
          variant="outline-info"
          onClick={() => navigate(`/driver/trips`)}
        >
          📋 All Trips
        </Button>
      </div>
    </Container>
  );
};

export default DriverTripDetail;
