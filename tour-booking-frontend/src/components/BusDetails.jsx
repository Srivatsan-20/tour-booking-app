import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const BusDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusOptions = [
    { value: 1, label: "Available", color: "success" },
    { value: 2, label: "On Trip", color: "primary" },
    { value: 3, label: "Under Maintenance", color: "warning" },
    { value: 4, label: "Out of Service", color: "danger" },
    { value: 5, label: "Reserved", color: "info" }
  ];

  useEffect(() => {
    fetchBusDetails();
  }, [id]);

  const fetchBusDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5050/api/Bus/${id}`);
      if (!response.ok) {
        throw new Error('Bus not found');
      }
      const data = await response.json();
      setBus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusInfo = statusOptions.find(s => s.value === status);
    return statusInfo ? (
      <Badge bg={statusInfo.color} className="fs-6">{statusInfo.label}</Badge>
    ) : (
      <Badge bg="secondary" className="fs-6">Unknown</Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return amount ? `₹${amount.toLocaleString()}` : 'Not set';
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading bus details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <h5>Error Loading Bus Details</h5>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/admin/bus-fleet')}>
            ← Back to Fleet
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary">🚌 Bus Details</h2>
              <p className="text-muted">Complete information for {bus.registrationNumber}</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/admin')}
              >
                ← Admin Dashboard
              </Button>
              <Button 
                variant="outline-primary" 
                onClick={() => navigate('/admin/bus-fleet')}
              >
                ← Fleet Management
              </Button>
              <Button 
                variant="warning" 
                onClick={() => navigate(`/admin/bus-fleet/${id}/edit`)}
              >
                ✏️ Edit Bus
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Basic Information */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">📋 Basic Information</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Registration Number:</strong></td>
                    <td className="text-primary fs-5">{bus.registrationNumber}</td>
                  </tr>
                  <tr>
                    <td><strong>Bus Type:</strong></td>
                    <td>{bus.busType}</td>
                  </tr>
                  <tr>
                    <td><strong>Make:</strong></td>
                    <td>{bus.make}</td>
                  </tr>
                  <tr>
                    <td><strong>Model:</strong></td>
                    <td>{bus.model}</td>
                  </tr>
                  <tr>
                    <td><strong>Year:</strong></td>
                    <td>{bus.year}</td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
                    <td>{getStatusBadge(bus.status)}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Capacity & Features */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">👥 Capacity & Features</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Seating Capacity:</strong></td>
                    <td>{bus.seatingCapacity} seats</td>
                  </tr>
                  <tr>
                    <td><strong>Sleeper Capacity:</strong></td>
                    <td>{bus.sleeperCapacity} berths</td>
                  </tr>
                  <tr>
                    <td><strong>Total Capacity:</strong></td>
                    <td className="text-success fs-5">
                      <strong>{bus.seatingCapacity + bus.sleeperCapacity} passengers</strong>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Features:</strong></td>
                    <td>
                      {bus.features ? (
                        <div>
                          {bus.features.split(',').map((feature, index) => (
                            <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                              {feature.trim()}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">No features listed</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Pricing Information */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">💰 Pricing Information</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Default Per Day Rent:</strong></td>
                    <td className="text-success fs-5">
                      <strong>{formatCurrency(bus.defaultPerDayRent)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Mountain Rent:</strong></td>
                    <td>{formatCurrency(bus.defaultMountainRent)}</td>
                  </tr>
                  <tr>
                    <td><strong>Rate per Passenger:</strong></td>
                    <td>
                      {bus.defaultPerDayRent && (bus.seatingCapacity + bus.sleeperCapacity) > 0 
                        ? `₹${Math.round(bus.defaultPerDayRent / (bus.seatingCapacity + bus.sleeperCapacity))}/passenger/day`
                        : 'N/A'
                      }
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Driver & Maintenance */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">👨‍✈️ Driver & Maintenance</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Assigned Driver:</strong></td>
                    <td>{bus.assignedDriver || <span className="text-muted">Not assigned</span>}</td>
                  </tr>
                  <tr>
                    <td><strong>Driver Phone:</strong></td>
                    <td>{bus.driverPhone || <span className="text-muted">Not available</span>}</td>
                  </tr>
                  <tr>
                    <td><strong>Current Odometer:</strong></td>
                    <td>{bus.currentOdometer ? `${bus.currentOdometer.toLocaleString()} KM` : 'Not recorded'}</td>
                  </tr>
                  <tr>
                    <td><strong>Last Maintenance:</strong></td>
                    <td>{formatDate(bus.lastMaintenanceDate)}</td>
                  </tr>
                  <tr>
                    <td><strong>Next Maintenance:</strong></td>
                    <td>
                      {bus.nextMaintenanceDate ? (
                        <span className={new Date(bus.nextMaintenanceDate) <= new Date() ? 'text-danger' : 'text-success'}>
                          {formatDate(bus.nextMaintenanceDate)}
                          {new Date(bus.nextMaintenanceDate) <= new Date() && (
                            <Badge bg="danger" className="ms-2">Overdue</Badge>
                          )}
                        </span>
                      ) : (
                        'Not scheduled'
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Additional Information */}
        <Col md={12} className="mb-4">
          <Card>
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">📝 Additional Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Maintenance Notes:</h6>
                  <p className="text-muted">
                    {bus.maintenanceNotes || 'No maintenance notes available'}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>General Notes:</h6>
                  <p className="text-muted">
                    {bus.notes || 'No additional notes available'}
                  </p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <small className="text-muted">
                    <strong>Created:</strong> {formatDate(bus.createdDate)}
                  </small>
                </Col>
                <Col md={6}>
                  <small className="text-muted">
                    <strong>Last Updated:</strong> {formatDate(bus.updatedDate)}
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Allocations History */}
        {bus.busAllocations && bus.busAllocations.length > 0 && (
          <Col md={12} className="mb-4">
            <Card>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">📅 Allocation History</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Booking ID</th>
                      <th>Trip Dates</th>
                      <th>Driver</th>
                      <th>Status</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bus.busAllocations.map(allocation => (
                      <tr key={allocation.id}>
                        <td>#{allocation.bookingId}</td>
                        <td>
                          {new Date(allocation.tripStartDate).toLocaleDateString()} - 
                          {new Date(allocation.tripEndDate).toLocaleDateString()}
                        </td>
                        <td>{allocation.assignedDriver || 'Not assigned'}</td>
                        <td>
                          <Badge bg={allocation.status === 1 ? 'primary' : allocation.status === 2 ? 'success' : 'secondary'}>
                            {allocation.status === 1 ? 'Allocated' : allocation.status === 2 ? 'In Progress' : 'Completed'}
                          </Badge>
                        </td>
                        <td>{formatCurrency(allocation.plannedRevenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default BusDetails;
