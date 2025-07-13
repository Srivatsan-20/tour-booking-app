import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDriverAssignments();
  }, []);

  const fetchDriverAssignments = async () => {
    try {
      // Mock data for driver assignments
      // In production, this would fetch from API based on driver ID
      const mockAssignments = [
        {
          id: 1,
          bookingId: 29,
          busRegistration: 'MH-01-AB-1234',
          customerName: 'jaina',
          route: 'Mumbai → Goa',
          startDate: '2025-08-01',
          endDate: '2025-08-09',
          status: 'upcoming',
          phone: '+91-9876543210'
        },
        {
          id: 2,
          bookingId: 27,
          busRegistration: 'DL-07-MN-1357',
          customerName: 'mani',
          route: 'Delhi → Manali',
          startDate: '2025-07-20',
          endDate: '2025-07-25',
          status: 'in_progress',
          phone: '+91-9876543211'
        }
      ];

      setAssignments(mockAssignments);
    } catch (err) {
      setError('Failed to fetch assignments');
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

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your assignments...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">🚛 Driver Dashboard</h2>
          <p className="text-muted">Welcome back, {user?.name}!</p>
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
              <h4 className="text-primary">{assignments.filter(a => a.status === 'upcoming').length}</h4>
              <small className="text-muted">Upcoming Trips</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
            <Card.Body>
              <h4 className="text-success">{assignments.filter(a => a.status === 'in_progress').length}</h4>
              <small className="text-muted">Active Trips</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-secondary">
            <Card.Body>
              <h4 className="text-secondary">{assignments.filter(a => a.status === 'completed').length}</h4>
              <small className="text-muted">Completed</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info">
            <Card.Body>
              <h4 className="text-info">{assignments.length}</h4>
              <small className="text-muted">Total Assignments</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Trip Assignments */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">🚌 Your Trip Assignments</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {assignments.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">No trip assignments found.</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Bus</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(assignment => (
                  <tr key={assignment.id}>
                    <td>
                      <strong>{assignment.busRegistration}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{assignment.customerName}</strong>
                        <br />
                        <small className="text-muted">{assignment.phone}</small>
                      </div>
                    </td>
                    <td>{assignment.route}</td>
                    <td>
                      <div>
                        {new Date(assignment.startDate).toLocaleDateString()}
                        <br />
                        <small className="text-muted">
                          to {new Date(assignment.endDate).toLocaleDateString()}
                        </small>
                      </div>
                    </td>
                    <td>{getStatusBadge(assignment.status)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/driver/trip/${assignment.id}`)}
                          title="View Details"
                        >
                          👁️
                        </Button>
                        {assignment.status === 'in_progress' && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => navigate(`/driver/expenses/${assignment.id}`)}
                            title="Update Expenses"
                          >
                            💸
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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
                  onClick={() => navigate('/driver/trips')}
                >
                  📋 View All Trips
                </Button>
                <Button 
                  variant="outline-success"
                  onClick={() => navigate('/driver/expenses')}
                >
                  💸 Manage Expenses
                </Button>
                <Button 
                  variant="outline-info"
                  onClick={() => navigate('/driver/profile')}
                >
                  👤 Update Profile
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DriverDashboard;
