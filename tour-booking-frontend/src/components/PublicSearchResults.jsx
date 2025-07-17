import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaBus, FaClock, FaMapMarkerAlt, FaRupeeSign, FaUsers, FaWifi, FaSnowflake } from 'react-icons/fa';

const PublicSearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchData = {
    places: searchParams.get('places'),
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    buses: parseInt(searchParams.get('buses')) || 1
  };

  useEffect(() => {
    fetchBuses();
  }, [searchParams]);

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end days
  };

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError('');

      // Call real API for tour packages
      const searchRequest = {
        pickupLocation: searchData.places || "Any",
        destination: searchData.places || "Any",
        departureDate: searchData.startDate,
        returnDate: searchData.endDate,
        passengerCount: searchData.buses * 40 // Estimate passengers per bus
      };

      console.log('🔍 Searching with request:', searchRequest);

      const response = await fetch('http://localhost:5051/api/public/booking/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchRequest)
      });

      if (response.ok) {
        const tourPackages = await response.json();
        console.log('✅ Received tour packages:', tourPackages);
        setBuses(tourPackages);
      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

    } catch (err) {
      setError('Failed to fetch bus information. Please try again.');
      setLoading(false);
    }
  };

  const handleBookNow = (tourPackage) => {
    // Navigate to booking page with tour package details
    navigate('/book', {
      state: {
        tourPackage,
        searchData
      }
    });
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'ac':
        return <FaSnowflake className="me-1" />;
      case 'wifi':
        return <FaWifi className="me-1" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Searching for buses...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Search Summary */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h5 className="mb-0">
                <FaMapMarkerAlt className="text-primary me-2" />
                Tour: {searchData.places}
              </h5>
              <p className="text-muted mb-0">
                {new Date(searchData.startDate).toLocaleDateString('en-IN')} to{' '}
                {new Date(searchData.endDate).toLocaleDateString('en-IN')} • {searchData.buses} bus{searchData.buses > 1 ? 'es' : ''} required
              </p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button variant="outline-primary" onClick={() => navigate('/search')}>
                Modify Search
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Results */}
      <Row>
        <Col>
          <h6 className="text-muted mb-3">
            {buses.length} tour package{buses.length !== 1 ? 's' : ''} available
          </h6>

          {buses.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <FaBus size={50} className="text-muted mb-3" />
                <h5>No tour packages found</h5>
                <p className="text-muted">
                  Try searching for different places or dates.
                </p>
                <Button variant="primary" onClick={() => navigate('/search')}>
                  Search Again
                </Button>
              </Card.Body>
            </Card>
          ) : (
            buses.map((tourPackage) => (
              <Card key={tourPackage.id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col lg={8}>
                      <div className="d-flex align-items-center mb-2">
                        <h5 className="mb-0 me-3">{tourPackage.name}</h5>
                        <Badge bg="secondary">{tourPackage.busType}</Badge>
                        <div className="ms-auto d-flex align-items-center">
                          <span className="text-warning me-1">★</span>
                          <span className="small">{tourPackage.rating}</span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <FaUsers className="text-primary me-2" />
                        <span className="fw-bold">Capacity: {tourPackage.capacity}</span>
                        <span className="text-muted ms-3">Duration: {tourPackage.totalDays} days</span>
                      </div>

                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {tourPackage.amenities.map((amenity, index) => (
                          <Badge key={index} bg="light" text="dark" className="d-flex align-items-center">
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-muted mb-1">{tourPackage.description}</p>
                      <small className="text-muted">by {tourPackage.operator}</small>
                    </Col>

                    <Col lg={4} className="text-lg-end">
                      <div className="mb-2">
                        <h4 className="mb-0">
                          <FaRupeeSign className="small" />{tourPackage.pricePerDay}
                        </h4>
                        <small className="text-muted">per day per bus</small>
                      </div>

                      <div className="mb-2">
                        <strong className="text-primary">
                          Total: ₹{tourPackage.pricePerDay * tourPackage.totalDays * searchData.buses}
                        </strong>
                        <br />
                        <small className="text-muted">
                          ({searchData.buses} bus{searchData.buses > 1 ? 'es' : ''} × {tourPackage.totalDays} days)
                        </small>
                      </div>

                      <Button
                        variant="primary"
                        onClick={() => handleBookNow(tourPackage)}
                      >
                        Book Now
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PublicSearchResults;
