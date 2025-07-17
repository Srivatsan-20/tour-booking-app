import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaBus } from 'react-icons/fa';

const PublicSearchForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    placesToCover: '',
    startDate: '',
    endDate: '',
    busesRequired: 1
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
    if (!formData.placesToCover || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (formData.startDate < today) {
      setError('Start date cannot be in the past');
      return;
    }

    if (formData.endDate < formData.startDate) {
      setError('End date cannot be before start date');
      return;
    }

    // Navigate to search results with query parameters
    const searchParams = new URLSearchParams({
      places: formData.placesToCover,
      startDate: formData.startDate,
      endDate: formData.endDate,
      buses: formData.busesRequired
    });

    navigate(`/search-results?${searchParams.toString()}`);
  };

  const popularTours = [
    'Chennai, Mahabalipuram, Pondicherry',
    'Bangalore, Mysore, Ooty, Kodaikanal',
    'Chennai, Tirupati, Tirumala',
    'Madurai, Rameshwaram, Kanyakumari',
    'Coimbatore, Ooty, Coonoor',
    'Chennai, Thanjavur, Trichy, Madurai'
  ];

  const handlePopularTourClick = (tour) => {
    setFormData(prev => ({
      ...prev,
      placesToCover: tour
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
          <Col lg={4} md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-primary" />
                Places to Cover *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="placesToCover"
                value={formData.placesToCover}
                onChange={handleInputChange}
                placeholder="e.g., Chennai, Mahabalipuram, Pondicherry, Thanjavur"
                required
              />
              <Form.Text className="text-muted">
                Enter all places you want to visit, separated by commas
              </Form.Text>
            </Form.Group>
          </Col>

          <Col lg={2} md={3} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center">
                <FaCalendarAlt className="me-2 text-primary" />
                Start Date *
              </Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>
          </Col>

          <Col lg={2} md={3} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center">
                <FaCalendarAlt className="me-2 text-primary" />
                End Date *
              </Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>
          </Col>

          <Col lg={2} md={4} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center">
                <FaBus className="me-2 text-primary" />
                Buses Required *
              </Form.Label>
              <Form.Select
                name="busesRequired"
                value={formData.busesRequired}
                onChange={handleInputChange}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Bus' : 'Buses'}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col lg={2} md={2} className="mb-3 d-flex align-items-end">
            <Button type="submit" variant="primary" className="w-100">
              <FaSearch className="me-1" />
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Popular Tours */}
      <div className="mt-4">
        <h6 className="text-muted mb-3">Popular Tour Packages:</h6>
        <div className="d-flex flex-wrap gap-2">
          {popularTours.map((tour, index) => (
            <Button
              key={index}
              variant="outline-primary"
              size="sm"
              onClick={() => handlePopularTourClick(tour)}
              className="rounded-pill"
            >
              {tour}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicSearchForm;
