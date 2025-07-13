import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BusAllocationDashboard = () => {
  const navigate = useNavigate();
  const [allocations, setAllocations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    busId: '',
    dateRange: 'all'
  });

  const allocationStatuses = [
    { value: 1, label: "Allocated", color: "primary" },
    { value: 2, label: "In Progress", color: "success" },
    { value: 3, label: "Completed", color: "secondary" },
    { value: 4, label: "Cancelled", color: "danger" },
    { value: 5, label: "No Show", color: "warning" }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch allocations
      const allocationsResponse = await fetch('http://localhost:5050/api/BusAllocation');
      if (!allocationsResponse.ok) throw new Error('Failed to fetch allocations');
      const allocationsData = await allocationsResponse.json();
      console.log('🚌 Fetched allocations:', allocationsData.length, allocationsData);
      setAllocations(allocationsData);

      // Fetch buses
      const busesResponse = await fetch('http://localhost:5050/api/Bus');
      if (!busesResponse.ok) throw new Error('Failed to fetch buses');
      const busesData = await busesResponse.json();
      setBuses(busesData);

      // Fetch bookings without allocations
      const bookingsResponse = await fetch('http://localhost:5050/api/Bookings/Upcoming');
      if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings');
      const bookingsData = await bookingsResponse.json();

      // Filter bookings that don't have allocations yet
      const allocatedBookingIds = allocationsData.map(a => a.bookingId);
      const unallocatedBookings = bookingsData.filter(b => !allocatedBookingIds.includes(b.id));
      setBookings(unallocatedBookings);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusInfo = allocationStatuses.find(s => s.value === status);
    return statusInfo ? (
      <Badge bg={statusInfo.color}>{statusInfo.label}</Badge>
    ) : (
      <Badge bg="secondary">Unknown</Badge>
    );
  };

  const handleAllocateBus = (booking) => {
    setSelectedBooking(booking);
    setShowAllocationModal(true);
  };

  const handleStatusUpdate = async (allocationId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5050/api/BusAllocation/${allocationId}/Status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          reason: newStatus === 4 ? 'Manual cancellation' : null,
          cancelledBy: 'Admin'
        }),
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert('Status updated successfully!');
      } else {
        const errorText = await response.text();
        alert(`Failed to update status: ${errorText}`);
      }
    } catch (error) {
      alert(`Error updating status: ${error.message}`);
    }
  };

  const filteredAllocations = allocations.filter(allocation => {
    if (filters.status && allocation.status !== parseInt(filters.status)) {
      return false;
    }
    if (filters.busId && allocation.busId !== parseInt(filters.busId)) {
      return false;
    }
    if (filters.dateRange === 'upcoming') {
      return new Date(allocation.tripStartDate) >= new Date();
    }
    if (filters.dateRange === 'current') {
      const today = new Date();
      return new Date(allocation.tripStartDate) <= today && new Date(allocation.tripEndDate) >= today;
    }
    if (filters.dateRange === 'past') {
      return new Date(allocation.tripEndDate) < new Date();
    }
    return true;
  });

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading bus allocations...</p>
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
              <h2 className="text-primary">📅 Bus Allocation Dashboard</h2>
              <p className="text-muted">Manage bus assignments and track allocations</p>
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
                🚌 Manage Fleet
              </Button>
              <Button
                variant="success"
                onClick={() => setShowAllocationModal(true)}
              >
                ➕ New Allocation
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          Error: {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary">
            <Card.Body>
              <h4 className="text-primary">{allocations.filter(a => a.status === 1).length}</h4>
              <small className="text-muted">Allocated</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
            <Card.Body>
              <h4 className="text-success">{allocations.filter(a => a.status === 2).length}</h4>
              <small className="text-muted">In Progress</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-secondary">
            <Card.Body>
              <h4 className="text-secondary">{allocations.filter(a => a.status === 3).length}</h4>
              <small className="text-muted">Completed</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h4 className="text-warning">{bookings.length}</h4>
              <small className="text-muted">Unallocated Bookings</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Unallocated Bookings */}
      {bookings.length > 0 && (
        <Card className="mb-4">
          <Card.Header className="bg-warning text-dark">
            <h5 className="mb-0">⚠️ Unallocated Bookings ({bookings.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Customer</th>
                  <th>Start Date</th>
                  <th>Duration</th>
                  <th>Buses Needed</th>
                  <th>Bus Type</th>
                  <th>Route</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => {
                  const days = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                  return (
                    <tr key={booking.id}>
                      <td>
                        <strong>{booking.customerName}</strong>
                        <br />
                        <small className="text-muted">{booking.phone}</small>
                      </td>
                      <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                      <td>{days} days</td>
                      <td>
                        <Badge bg="info">{booking.numberOfBuses || 1}</Badge>
                      </td>
                      <td>{booking.busType}</td>
                      <td>
                        <small>
                          {booking.pickupLocation} → {booking.dropLocation}
                        </small>
                      </td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleAllocateBus(booking)}
                        >
                          🚌 Allocate Bus
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                {allocationStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.busId}
                onChange={(e) => setFilters(prev => ({ ...prev, busId: e.target.value }))}
              >
                <option value="">All Buses</option>
                {buses.map(bus => (
                  <option key={bus.id} value={bus.id}>{bus.registrationNumber}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              >
                <option value="upcoming">Upcoming Trips</option>
                <option value="current">Current Trips</option>
                <option value="past">Past Trips</option>
                <option value="all">All Trips</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <div className="text-muted">
                Showing {filteredAllocations.length} of {allocations.length} allocations
                {filters.dateRange !== 'all' && (
                  <Badge bg="info" className="ms-2">
                    {filters.dateRange === 'upcoming' ? 'Upcoming' :
                      filters.dateRange === 'current' ? 'Current' : 'Past'} Only
                  </Badge>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Allocations Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Bus Allocations ({filteredAllocations.length})</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredAllocations.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">No allocations found matching your criteria.</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Bus</th>
                  <th>Customer</th>
                  <th>Trip Dates</th>
                  <th>Duration</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Revenue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllocations.map(allocation => (
                  <tr key={allocation.id}>
                    <td>
                      <strong>{allocation.bus?.registrationNumber}</strong>
                      <br />
                      <small className="text-muted">{allocation.bus?.busType}</small>
                    </td>
                    <td>
                      <strong>{allocation.booking?.customerName}</strong>
                      <br />
                      <small className="text-muted">{allocation.booking?.phone}</small>
                    </td>
                    <td>
                      <div>
                        {new Date(allocation.tripStartDate).toLocaleDateString()}
                        <br />
                        <small className="text-muted">
                          to {new Date(allocation.tripEndDate).toLocaleDateString()}
                        </small>
                      </div>
                    </td>
                    <td>{allocation.plannedDays} days</td>
                    <td>
                      {allocation.assignedDriver ? (
                        <div>
                          <div>{allocation.assignedDriver}</div>
                          {allocation.driverPhone && (
                            <small className="text-muted">{allocation.driverPhone}</small>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">Not assigned</span>
                      )}
                    </td>
                    <td>{getStatusBadge(allocation.status)}</td>
                    <td>
                      {allocation.plannedRevenue ? (
                        <span>₹{allocation.plannedRevenue.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {allocation.status === 1 && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleStatusUpdate(allocation.id, 2)}
                            title="Start Trip"
                          >
                            ▶️
                          </Button>
                        )}
                        {allocation.status === 2 && (
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleStatusUpdate(allocation.id, 3)}
                            title="Complete Trip"
                          >
                            ✅
                          </Button>
                        )}
                        {(allocation.status === 1 || allocation.status === 2) && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleStatusUpdate(allocation.id, 4)}
                            title="Cancel Allocation"
                          >
                            ❌
                          </Button>
                        )}
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/admin/bus-allocation/${allocation.id}`)}
                          title="View Details"
                        >
                          👁️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Allocation Modal - We'll implement this next */}
      <BusAllocationModal
        show={showAllocationModal}
        onHide={() => {
          setShowAllocationModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        buses={buses.filter(b => b.status === 1)} // Only available buses
        onSuccess={() => {
          fetchData();
          setShowAllocationModal(false);
          setSelectedBooking(null);
        }}
      />
    </Container>
  );
};

// Bus Allocation Modal Component
const BusAllocationModal = ({ show, onHide, booking, buses, onSuccess }) => {
  const [formData, setFormData] = useState({
    busId: '',
    assignedDriver: '',
    driverPhone: '',
    allocatedPerDayRent: '',
    allocatedMountainRent: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (booking && show) {
      // Pre-fill with booking data
      setFormData(prev => ({
        ...prev,
        allocatedPerDayRent: booking.perDayRent || '',
        allocatedMountainRent: booking.mountainRent || ''
      }));
    }
  }, [booking, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.busId) {
      setError('Please select a bus');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5050/api/BusAllocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          busId: parseInt(formData.busId),
          bookingId: booking.id,
          tripStartDate: booking.startDate,
          tripEndDate: booking.endDate,
          allocatedPerDayRent: formData.allocatedPerDayRent ? parseFloat(formData.allocatedPerDayRent) : null,
          allocatedMountainRent: formData.allocatedMountainRent ? parseFloat(formData.allocatedMountainRent) : null,
          assignedDriver: formData.assignedDriver || null,
          driverPhone: formData.driverPhone || null,
          notes: formData.notes
        }),
      });

      if (response.ok) {
        onSuccess();
        alert('Bus allocated successfully!');
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>🚌 Allocate Bus</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {booking && (
          <div className="mb-3 p-3 bg-light rounded">
            <h6>Booking Details:</h6>
            <p className="mb-1"><strong>Customer:</strong> {booking.customerName}</p>
            <p className="mb-1"><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
            <p className="mb-0"><strong>Route:</strong> {booking.pickupLocation} → {booking.dropLocation}</p>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Select Bus *</Form.Label>
                <Form.Select
                  value={formData.busId}
                  onChange={(e) => setFormData(prev => ({ ...prev, busId: e.target.value }))}
                  required
                >
                  <option value="">Choose a bus...</option>
                  {buses.map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.registrationNumber} - {bus.busType} (Capacity: {bus.seatingCapacity + bus.sleeperCapacity})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Assigned Driver</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.assignedDriver}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedDriver: e.target.value }))}
                  placeholder="Driver name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Driver Phone</Form.Label>
                <Form.Control
                  type="tel"
                  value={formData.driverPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, driverPhone: e.target.value }))}
                  placeholder="Driver contact number"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Per Day Rent (₹)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.allocatedPerDayRent}
                  onChange={(e) => setFormData(prev => ({ ...prev, allocatedPerDayRent: e.target.value }))}
                  placeholder="Daily rent for this allocation"
                  step="0.01"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mountain Rent (₹)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.allocatedMountainRent}
                  onChange={(e) => setFormData(prev => ({ ...prev, allocatedMountainRent: e.target.value }))}
                  placeholder="Mountain terrain rent"
                  step="0.01"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Special instructions or notes"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Allocating...
            </>
          ) : (
            'Allocate Bus'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BusAllocationDashboard;
