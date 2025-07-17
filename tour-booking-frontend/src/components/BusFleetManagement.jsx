import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BusFleetManagement = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    busType: '',
    status: '',
    sortBy: 'registrationNumber'
  });

  const busTypes = [
    "AC Sleeper", "Non-AC Sleeper", "AC Seater", "Non-AC Seater",
    "Mini Bus", "Luxury Coach", "Volvo", "Mercedes"
  ];

  const statusOptions = [
    { value: 1, label: "Available", color: "success" },
    { value: 2, label: "On Trip", color: "primary" },
    { value: 3, label: "Under Maintenance", color: "warning" },
    { value: 4, label: "Out of Service", color: "danger" },
    { value: 5, label: "Reserved", color: "info" }
  ];

  useEffect(() => {
    fetchBuses();
    fetchDashboard();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [buses, filters]);

  const fetchBuses = async () => {
    try {
      const response = await fetch('http://localhost:5051/api/Bus');
      if (!response.ok) throw new Error('Failed to fetch buses');
      const data = await response.json();
      setBuses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await fetch('http://localhost:5051/api/Bus/Dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboard(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...buses];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(bus =>
        bus.registrationNumber.toLowerCase().includes(searchTerm) ||
        bus.make.toLowerCase().includes(searchTerm) ||
        bus.model.toLowerCase().includes(searchTerm) ||
        (bus.assignedDriver && bus.assignedDriver.toLowerCase().includes(searchTerm))
      );
    }

    // Bus type filter
    if (filters.busType) {
      filtered = filtered.filter(bus => bus.busType === filters.busType);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(bus => bus.status === parseInt(filters.status));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'registrationNumber':
          return a.registrationNumber.localeCompare(b.registrationNumber);
        case 'busType':
          return a.busType.localeCompare(b.busType);
        case 'capacity':
          return (b.seatingCapacity + b.sleeperCapacity) - (a.seatingCapacity + a.sleeperCapacity);
        case 'year':
          return b.year - a.year;
        default:
          return 0;
      }
    });

    setFilteredBuses(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    const statusInfo = statusOptions.find(s => s.value === status);
    return statusInfo ? (
      <Badge bg={statusInfo.color}>{statusInfo.label}</Badge>
    ) : (
      <Badge bg="secondary">Unknown</Badge>
    );
  };

  const handleDeleteBus = async (busId, registrationNumber) => {
    if (!window.confirm(`Are you sure you want to delete bus ${registrationNumber}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5051/api/Bus/${busId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setBuses(prev => prev.filter(bus => bus.id !== busId));
        alert(`Bus ${registrationNumber} deleted successfully!`);
      } else {
        const errorText = await response.text();
        alert(`Failed to delete bus: ${errorText}`);
      }
    } catch (error) {
      alert(`Error deleting bus: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading bus fleet...</p>
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
              <h2 className="text-primary">🚌 Bus Fleet Management</h2>
              <p className="text-muted">Manage your bus fleet and track availability</p>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/admin')}
                className="px-3"
              >
                ← Admin Dashboard
              </Button>
              <Button
                variant="success"
                onClick={() => navigate('/admin/bus-onboarding')}
                className="px-4"
              >
                ➕ Add New Bus
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

      {/* Dashboard Cards */}
      {dashboard && (
        <Row className="mb-4">
          <Col md={2}>
            <Card className="text-center border-primary">
              <Card.Body>
                <h4 className="text-primary">{dashboard.totalBuses}</h4>
                <small className="text-muted">Total Buses</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center border-success">
              <Card.Body>
                <h4 className="text-success">{dashboard.availableBuses}</h4>
                <small className="text-muted">Available</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center border-info">
              <Card.Body>
                <h4 className="text-info">{dashboard.busesOnTrip}</h4>
                <small className="text-muted">On Trip</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center border-warning">
              <Card.Body>
                <h4 className="text-warning">{dashboard.busesUnderMaintenance}</h4>
                <small className="text-muted">Maintenance</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center border-danger">
              <Card.Body>
                <h4 className="text-danger">{dashboard.busesNeedingMaintenance}</h4>
                <small className="text-muted">Need Service</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center border-secondary">
              <Card.Body>
                <h4 className="text-secondary">{dashboard.utilizationRate.toFixed(1)}%</h4>
                <small className="text-muted">Utilization</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search buses..."
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                name="busType"
                value={filters.busType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {busTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value="registrationNumber">Sort by Registration</option>
                <option value="busType">Sort by Type</option>
                <option value="capacity">Sort by Capacity</option>
                <option value="year">Sort by Year</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <div className="text-muted">
                Showing {filteredBuses.length} of {buses.length} buses
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Bus List Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Bus Fleet ({filteredBuses.length})</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredBuses.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">No buses found matching your criteria.</p>
              <Button
                variant="primary"
                onClick={() => navigate('/admin/bus-onboarding')}
              >
                Add Your First Bus
              </Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Registration</th>
                  <th>Type</th>
                  <th>Make/Model</th>
                  <th>Year</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Driver</th>
                  <th>Daily Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.map(bus => (
                  <tr key={bus.id}>
                    <td>
                      <strong>{bus.registrationNumber}</strong>
                    </td>
                    <td>{bus.busType}</td>
                    <td>{bus.make} {bus.model}</td>
                    <td>{bus.year}</td>
                    <td>
                      <span title={`${bus.seatingCapacity} seats + ${bus.sleeperCapacity} sleepers`}>
                        {bus.seatingCapacity + bus.sleeperCapacity}
                      </span>
                    </td>
                    <td>{getStatusBadge(bus.status)}</td>
                    <td>
                      {bus.assignedDriver ? (
                        <div>
                          <div>{bus.assignedDriver}</div>
                          {bus.driverPhone && (
                            <small className="text-muted">{bus.driverPhone}</small>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">Not assigned</span>
                      )}
                    </td>
                    <td>₹{bus.defaultPerDayRent.toLocaleString()}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/admin/bus-fleet/${bus.id}`)}
                          title="View Details"
                        >
                          👁️
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => navigate(`/admin/bus-fleet/${bus.id}/edit`)}
                          title="Edit Bus"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteBus(bus.id, bus.registrationNumber)}
                          title="Delete Bus"
                        >
                          🗑️
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
    </Container>
  );
};

export default BusFleetManagement;
