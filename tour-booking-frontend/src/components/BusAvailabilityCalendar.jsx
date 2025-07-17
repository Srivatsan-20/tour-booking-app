import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BusAvailabilityCalendar = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // July 2025 where we have data
  const [buses, setBuses] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReallocationModal, setShowReallocationModal] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [targetBusId, setTargetBusId] = useState('');

  useEffect(() => {
    fetchBusesAndAllocations();
  }, [currentDate]);

  const fetchBusesAndAllocations = async () => {
    try {
      console.log('🔄 Fetching buses and allocations for calendar...');

      // Fetch real buses from API
      const busResponse = await fetch('http://localhost:5050/api/Bus');
      if (!busResponse.ok) throw new Error('Failed to fetch buses');
      const busesData = await busResponse.json();
      console.log('📋 Fetched buses:', busesData.length, busesData);

      // Fetch real allocations from API
      const allocationResponse = await fetch('http://localhost:5050/api/BusAllocation');
      if (!allocationResponse.ok) throw new Error('Failed to fetch allocations');
      const allocationsData = await allocationResponse.json();
      console.log('📅 Fetched allocations:', allocationsData.length, allocationsData);

      // Transform allocation data to match calendar format
      const transformedAllocations = allocationsData.map(allocation => ({
        id: allocation.id,
        busId: allocation.busId,
        bookingId: allocation.bookingId,
        customerName: allocation.booking?.customerName || 'Unknown Customer',
        tripStartDate: allocation.tripStartDate,
        tripEndDate: allocation.tripEndDate,
        status: getStatusFromAllocationStatus(allocation.status)
      }));

      console.log('🔄 Transformed allocations:', transformedAllocations);
      console.log('📅 Current calendar month:', currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

      setBuses(busesData);
      setAllocations(transformedAllocations);
    } catch (err) {
      console.error('❌ Error fetching data:', err);

      // Handle API error - show empty state instead of mock data
      console.error('Failed to load calendar data, showing empty state');
      setError(`Failed to load calendar data: ${err.message}`);
      setBuses([]);
      setAllocations([]);
    } finally {
      setLoading(false);
    }
  };

  // Convert allocation status numbers to calendar status strings
  const getStatusFromAllocationStatus = (status) => {
    const statusMap = {
      1: 'allocated',    // Allocated
      2: 'in_progress',  // In Progress
      3: 'completed',    // Completed
      4: 'cancelled',    // Cancelled
      5: 'no_show'       // No Show
    };
    return statusMap[status] || 'allocated';
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const isDateInRange = (date, startDate, endDate) => {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize all dates to midnight
    checkDate.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const isInRange = checkDate >= start && checkDate <= end;

    // Debug logging
    if (isInRange) {
      console.log(`📅 Date ${checkDate.toDateString()} is in range ${start.toDateString()} to ${end.toDateString()}`);
    }

    return isInRange;
  };

  const getAllocationForBusAndDate = (busId, date) => {
    const allocation = allocations.find(allocation =>
      allocation.busId === busId &&
      isDateInRange(date, allocation.tripStartDate, allocation.tripEndDate)
    );

    // Debug logging for first few checks
    if (date.getDate() <= 3) {
      console.log(`🔍 Checking bus ${busId} for date ${date.toDateString()}:`, allocation ? 'FOUND' : 'NOT FOUND');
      if (allocation) {
        console.log(`   📋 Allocation:`, allocation);
      }
    }

    return allocation;
  };

  const getStatusColor = (status) => {
    const colors = {
      allocated: 'warning',
      in_progress: 'success',
      completed: 'secondary'
    };
    return colors[status] || 'primary';
  };

  const handleReallocation = (allocation) => {
    setSelectedAllocation(allocation);
    setTargetBusId('');
    setShowReallocationModal(true);
  };

  const executeReallocation = async () => {
    if (!targetBusId || !selectedAllocation) {
      alert('Please select a target bus');
      return;
    }

    // Check if target bus is available for the same dates
    const conflictingAllocation = allocations.find(allocation =>
      allocation.busId === parseInt(targetBusId) &&
      allocation.id !== selectedAllocation.id &&
      (
        isDateInRange(selectedAllocation.tripStartDate, allocation.tripStartDate, allocation.tripEndDate) ||
        isDateInRange(selectedAllocation.tripEndDate, allocation.tripStartDate, allocation.tripEndDate) ||
        isDateInRange(allocation.tripStartDate, selectedAllocation.tripStartDate, selectedAllocation.tripEndDate)
      )
    );

    if (conflictingAllocation) {
      alert(`Target bus is already allocated to ${conflictingAllocation.customerName} during this period!`);
      return;
    }

    // Update allocation
    setAllocations(prev => prev.map(allocation =>
      allocation.id === selectedAllocation.id
        ? { ...allocation, busId: parseInt(targetBusId) }
        : allocation
    ));

    setShowReallocationModal(false);
    setSelectedAllocation(null);
    setTargetBusId('');
    alert('Bus reallocation completed successfully!');
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading bus availability...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-0">📅 Bus Availability Calendar</h2>
          <p className="text-muted">Visual bus allocation and availability management</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate("/admin")}>
            ← Admin Dashboard
          </Button>
          <Button variant="outline-primary" onClick={() => navigate("/admin/bus-allocation")}>
            🚌 Allocations
          </Button>
        </div>
      </div>

      {/* Month Navigation */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <Button variant="light" size="sm" onClick={() => navigateMonth(-1)}>
              ← Previous
            </Button>
            <h4 className="mb-0">{monthYear}</h4>
            <Button variant="light" size="sm" onClick={() => navigateMonth(1)}>
              Next →
            </Button>
          </div>
        </Card.Header>
      </Card>

      {/* Legend */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex gap-3 align-items-center">
            <span><Badge bg="light" text="dark">Available</Badge> Available</span>
            <span><Badge bg="warning">Allocated</Badge> Allocated</span>
            <span><Badge bg="success">In Progress</Badge> In Progress</span>
            <span><Badge bg="secondary">Completed</Badge> Completed</span>
          </div>
        </Card.Body>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🗓️ {monthYear} - Bus Availability Matrix</h5>
          <small className="text-muted">
            📌 Headers are frozen for easy scrolling
          </small>
        </Card.Header>
        <Card.Body className="p-0">
          <div
            className="table-responsive"
            style={{
              maxHeight: '70vh',
              overflowY: 'auto',
              overflowX: 'auto',
              border: '1px solid #dee2e6',
              borderRadius: '0.375rem'
            }}
          >
            <Table bordered hover className="mb-0" style={{ fontSize: '0.85rem' }}>
              <thead className="table-dark" style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'box-shadow 0.2s ease'
              }}>
                <tr>
                  <th style={{
                    minWidth: '80px',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: '#212529',
                    zIndex: 11
                  }}>
                    Date
                  </th>
                  {buses.map(bus => (
                    <th key={bus.id} style={{ minWidth: '120px' }} className="text-center">
                      <div>
                        <strong>{bus.registrationNumber}</strong>
                        <br />
                        <small>{bus.busType}</small>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day.toISOString()}>
                    <td className="fw-bold" style={{
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#f8f9fa',
                      zIndex: 5,
                      borderRight: '2px solid #dee2e6'
                    }}>
                      {day.getDate()}
                      <br />
                      <small className="text-muted">
                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      </small>
                    </td>
                    {buses.map(bus => {
                      const allocation = getAllocationForBusAndDate(bus.id, day);
                      return (
                        <td key={`${bus.id}-${day.toISOString()}`} className="text-center p-1">
                          {allocation ? (
                            <div>
                              <Badge
                                bg={getStatusColor(allocation.status)}
                                className="w-100 mb-1"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleReallocation(allocation)}
                                title="Click to reallocate"
                              >
                                #{allocation.bookingId}
                              </Badge>
                              <br />
                              <small style={{ fontSize: '0.7rem' }}>
                                {allocation.customerName}
                              </small>
                            </div>
                          ) : (
                            <Badge bg="light" text="dark" className="w-100">
                              Available
                            </Badge>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Reallocation Modal */}
      <Modal show={showReallocationModal} onHide={() => setShowReallocationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>🔄 Reallocate Bus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAllocation && (
            <div>
              <Alert variant="info">
                <strong>Current Allocation:</strong><br />
                Booking #{selectedAllocation.bookingId} - {selectedAllocation.customerName}<br />
                Dates: {new Date(selectedAllocation.tripStartDate).toLocaleDateString()} to {new Date(selectedAllocation.tripEndDate).toLocaleDateString()}<br />
                Current Bus: {buses.find(b => b.id === selectedAllocation.busId)?.registrationNumber}
              </Alert>

              <Form.Group>
                <Form.Label>Select Target Bus:</Form.Label>
                <Form.Select
                  value={targetBusId}
                  onChange={(e) => setTargetBusId(e.target.value)}
                >
                  <option value="">Choose a bus...</option>
                  {buses
                    .filter(bus => bus.id !== selectedAllocation.busId)
                    .map(bus => (
                      <option key={bus.id} value={bus.id}>
                        {bus.registrationNumber} - {bus.busType}
                      </option>
                    ))
                  }
                </Form.Select>
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReallocationModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={executeReallocation}>
            🔄 Reallocate Bus
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BusAvailabilityCalendar;
