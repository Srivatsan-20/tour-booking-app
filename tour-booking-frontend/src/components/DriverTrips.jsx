import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DriverTrips = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">🚛 All Trips</h2>
        <Button variant="outline-secondary" onClick={() => navigate("/driver")}>
          ← Driver Dashboard
        </Button>
      </div>

      <Alert variant="info">
        <h5>🚧 Driver Trips Management</h5>
        <p>This page will show all trips assigned to the driver with filtering and search capabilities.</p>
        <p>Features to be implemented:</p>
        <ul>
          <li>Trip history with status filters</li>
          <li>Search by customer or route</li>
          <li>Trip details and expense tracking</li>
          <li>Performance metrics</li>
        </ul>
      </Alert>
    </Container>
  );
};

export default DriverTrips;
