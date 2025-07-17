import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './FeaturedBuses.css';

interface Bus {
  busId: number;
  busName: string;
  busType: string;
  capacity: number;
  primaryImageUrl: string;
  pricePerDay: number;
  averageRating: number;
  reviewCount: number;
  keyAmenities: string[];
}

const FeaturedBuses: React.FC = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeaturedBuses();
  }, []);

  const loadFeaturedBuses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API
      const response = await fetch('http://localhost:5051/api/public/booking/featured');

      if (response.ok) {
        const data = await response.json();
        setBuses(data);
      } else {
        console.error('Failed to load featured buses:', response.status);
        setBuses([]);
        setError('Failed to load featured buses');
      }
    } catch (error) {
      console.error('Error loading featured buses:', error);
      setBuses([]);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };



  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-warning"></i>);
    }

    return stars;
  };

  const handleViewDetails = (busId: number) => {
    navigate(`/bus/${busId}`);
  };

  const handleBookNow = (busId: number) => {
    navigate('/search', { state: { selectedBusId: busId } });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading featured buses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>Unable to load buses</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-warning" onClick={loadFeaturedBuses}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="featured-buses">
      <Row>
        {buses.map((bus) => (
          <Col lg={4} md={6} className="mb-4" key={bus.busId}>
            <Card className="bus-card h-100">
              <div className="bus-image-container">
                <Card.Img
                  variant="top"
                  src={bus.primaryImageUrl}
                  alt={bus.busName}
                  className="bus-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/default-bus.jpg';
                  }}
                />
                <div className="bus-type-badge">
                  <Badge bg="primary">{bus.busType}</Badge>
                </div>
                <div className="capacity-badge">
                  <Badge bg="info">
                    <i className="fas fa-users me-1"></i>
                    {bus.capacity} seats
                  </Badge>
                </div>
              </div>

              <Card.Body className="d-flex flex-column">
                <div className="bus-header mb-3">
                  <Card.Title className="bus-name">{bus.busName}</Card.Title>
                  <div className="rating-section">
                    <div className="stars">
                      {renderStars(bus.averageRating)}
                    </div>
                    <small className="text-muted ms-2">
                      {bus.averageRating.toFixed(1)} ({bus.reviewCount} reviews)
                    </small>
                  </div>
                </div>

                <div className="amenities-section mb-3">
                  <h6 className="amenities-title">Key Features:</h6>
                  <div className="amenities-list">
                    {bus.keyAmenities.map((amenity, index) => (
                      <Badge key={index} bg="light" text="dark" className="amenity-badge me-1 mb-1">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="price-section mt-auto">
                  <div className="price-display">
                    <span className="price-amount">₹{bus.pricePerDay.toLocaleString()}</span>
                    <span className="price-period">/day</span>
                  </div>
                  <small className="text-muted">*Excluding taxes and tolls</small>
                </div>

                <div className="action-buttons mt-3">
                  <Row>
                    <Col>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="w-100"
                        onClick={() => handleViewDetails(bus.busId)}
                      >
                        <i className="fas fa-eye me-1"></i>
                        View Details
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-100"
                        onClick={() => handleBookNow(bus.busId)}
                      >
                        <i className="fas fa-calendar-check me-1"></i>
                        Book Now
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {buses.length === 0 && !loading && (
        <div className="text-center py-5">
          <i className="fas fa-bus fa-3x text-muted mb-3"></i>
          <h4>No buses available</h4>
          <p className="text-muted">Please check back later or contact us for assistance.</p>
          <Button variant="primary" onClick={() => navigate('/contact')}>
            Contact Us
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeaturedBuses;
