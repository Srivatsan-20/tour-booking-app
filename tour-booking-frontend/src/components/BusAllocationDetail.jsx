import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Badge, Button, Spinner, Alert, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const BusAllocationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allocationStatuses = [
    { value: 1, label: "Allocated", color: "primary" },
    { value: 2, label: "In Progress", color: "success" },
    { value: 3, label: "Completed", color: "secondary" },
    { value: 4, label: "Cancelled", color: "danger" },
    { value: 5, label: "No Show", color: "warning" }
  ];

  useEffect(() => {
    const fetchAllocation = async () => {
      try {
        console.log("Fetching allocation details for ID:", id);
        const response = await fetch(`http://localhost:5050/api/BusAllocation/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched allocation details:", data);
          setAllocation(data);
        } else {
          setError(`Failed to fetch allocation details: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error("Error fetching allocation:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllocation();
  }, [id]);

  const getStatusBadge = (status) => {
    const statusInfo = allocationStatuses.find(s => s.value === status);
    return statusInfo ? (
      <Badge bg={statusInfo.color} className="fs-6">{statusInfo.label}</Badge>
    ) : (
      <Badge bg="secondary" className="fs-6">Unknown</Badge>
    );
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:5050/api/BusAllocation/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setAllocation(prev => ({ ...prev, status: newStatus }));
        alert('Status updated successfully!');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert(`Error updating status: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading allocation details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 p-4 border rounded shadow bg-light">
        <Alert variant="danger">
          <h5>Error Loading Allocation</h5>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/admin/bus-allocation')}>
            ← Back to Allocations
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!allocation) {
    return (
      <Container className="mt-5 p-4 border rounded shadow bg-light">
        <Alert variant="warning">
          <h5>Allocation Not Found</h5>
          <p>The allocation with ID {id} was not found.</p>
          <Button variant="outline-warning" onClick={() => navigate('/admin/bus-allocation')}>
            ← Back to Allocations
          </Button>
        </Alert>
      </Container>
    );
  }

  const tripDuration = Math.ceil((new Date(allocation.tripEndDate) - new Date(allocation.tripStartDate)) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-0">🚌 Bus Allocation Details</h2>
          <p className="text-muted">Allocation ID: {allocation.id}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate("/admin")}>
            ← Admin Dashboard
          </Button>
          <Button variant="outline-primary" onClick={() => navigate("/admin/bus-allocation")}>
            ← All Allocations
          </Button>
        </div>
      </div>

      {/* Status and Quick Actions */}
      <Card className="mb-4">
        <Card.Header className="bg-info text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📋 Allocation Status</h5>
            {getStatusBadge(allocation.status)}
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <p className="mb-2">
                <strong>Current Status:</strong> {allocationStatuses.find(s => s.value === allocation.status)?.label || 'Unknown'}
              </p>
              <p className="mb-0">
                <strong>Allocation Date:</strong> {new Date(allocation.allocationDate).toLocaleDateString()}
              </p>
            </Col>
            <Col md={4} className="text-end">
              <div className="d-flex gap-2 justify-content-end">
                {allocation.status === 1 && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusUpdate(2)}
                  >
                    ▶️ Start Trip
                  </Button>
                )}
                {allocation.status === 2 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleStatusUpdate(3)}
                  >
                    ✅ Complete Trip
                  </Button>
                )}
                {(allocation.status === 1 || allocation.status === 2) && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleStatusUpdate(4)}
                  >
                    ❌ Cancel
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Bus Information */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">🚌 Bus Information</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Registration Number:</strong></td>
                    <td>{allocation.bus?.registrationNumber || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Bus Type:</strong></td>
                    <td>{allocation.bus?.busType || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Make & Model:</strong></td>
                    <td>{allocation.bus ? `${allocation.bus.make} ${allocation.bus.model}` : 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Seating Capacity:</strong></td>
                    <td>{allocation.bus?.seatingCapacity || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
                    <td>
                      <Badge bg={allocation.bus?.status === 'Available' ? 'success' : 'warning'}>
                        {allocation.bus?.status || 'N/A'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Daily Rent:</strong></td>
                    <td>₹{allocation.bus?.dailyRent?.toLocaleString() || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Customer & Booking Information */}
      <Card className="mb-4">
        <Card.Header className="bg-success text-white">
          <h5 className="mb-0">👤 Customer & Booking Information</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Customer Name:</strong></td>
                    <td>{allocation.booking?.customerName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>{allocation.booking?.phone || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{allocation.booking?.email || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Pickup Location:</strong></td>
                    <td>{allocation.booking?.pickupLocation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Drop Location:</strong></td>
                    <td>{allocation.booking?.dropLocation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Rent:</strong></td>
                    <td>₹{allocation.booking?.totalRent?.toLocaleString() || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Trip Details */}
      <Card className="mb-4">
        <Card.Header className="bg-warning text-dark">
          <h5 className="mb-0">📅 Trip Details</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Start Date:</strong></td>
                    <td>{new Date(allocation.tripStartDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>End Date:</strong></td>
                    <td>{new Date(allocation.tripEndDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Duration:</strong></td>
                    <td>{tripDuration} days</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Assigned Driver:</strong></td>
                    <td>{allocation.assignedDriver || 'Not assigned'}</td>
                  </tr>
                  <tr>
                    <td><strong>Driver Phone:</strong></td>
                    <td>{allocation.driverPhone || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Planned Revenue:</strong></td>
                    <td>₹{allocation.plannedRevenue?.toLocaleString() || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          {allocation.notes && (
            <Row className="mt-3">
              <Col>
                <strong>Notes:</strong>
                <p className="mt-1 p-2 bg-light rounded">{allocation.notes}</p>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <div className="text-center">
        <Button 
          variant="outline-secondary" 
          className="me-2"
          onClick={() => navigate("/admin")}
        >
          ← Admin Dashboard
        </Button>
        <Button 
          variant="outline-primary" 
          className="me-2"
          onClick={() => navigate("/admin/bus-allocation")}
        >
          ← All Allocations
        </Button>
        <Button 
          variant="outline-info" 
          onClick={() => navigate(`/admin/bus-fleet/${allocation.busId}`)}
        >
          🚌 View Bus Details
        </Button>
      </div>
    </Container>
  );
};

export default BusAllocationDetail;
