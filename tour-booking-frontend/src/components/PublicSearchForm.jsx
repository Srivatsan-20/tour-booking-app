import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const PublicSearchForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    passengers: 1
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.from || !formData.to || !formData.departureDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.from === formData.to) {
      setError('Departure and destination cities cannot be the same');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (formData.departureDate < today) {
      setError('Departure date cannot be in the past');
      return;
    }

    // Navigate to search results with query parameters
    const searchParams = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      date: formData.departureDate,
      passengers: formData.passengers
    });

    navigate(`/search-results?${searchParams.toString()}`);
  };

  const popularRoutes = [
    { from: 'Chennai', to: 'Bangalore' },
    { from: 'Chennai', to: 'Coimbatore' },
    { from: 'Bangalore', to: 'Mysore' },
    { from: 'Chennai', to: 'Pondicherry' },
    { from: 'Bangalore', to: 'Ooty' },
    { from: 'Chennai', to: 'Tirupati' }
  ];

  const handlePopularRouteClick = (route) => {
    setFormData(prev => ({
      ...prev,
      from: route.from,
      to: route.to
    }));
  };

  return (
    <div>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={3} md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-primary" />
                From
              </Form.Label>
              <Form.Control
                type="text"
                name="from"
                value={formData.from}
                onChange={handleInputChange}
                placeholder="Departure city"
                required
              />
            </Form.Group>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-primary" />
                To
              </Form.Label>
              <Form.Control
                type="text"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="Destination city"
                required
              />
            </Form.Group>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center">
                <FaCalendarAlt className="me-2 text-primary" />
                Departure Date
              </Form.Label>
              <Form.Control
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>
          </Col>

          <Col lg={2} md={4} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center">
                <FaUsers className="me-2 text-primary" />
                Passengers
              </Form.Label>
              <Form.Select
                name="passengers"
                value={formData.passengers}
                onChange={handleInputChange}
              >
                {[...Array(50)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col lg={1} md={2} className="mb-3 d-flex align-items-end">
            <Button type="submit" variant="primary" className="w-100">
              <FaSearch />
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Popular Routes */}
      <div className="mt-4">
        <h6 className="text-muted mb-3">Popular Routes:</h6>
        <div className="d-flex flex-wrap gap-2">
          {popularRoutes.map((route, index) => (
            <Button
              key={index}
              variant="outline-primary"
              size="sm"
              onClick={() => handlePopularRouteClick(route)}
              className="rounded-pill"
            >
              {route.from} → {route.to}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicSearchForm;
