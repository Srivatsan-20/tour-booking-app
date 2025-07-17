import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchForm from './SearchForm';

interface SearchData {
  pickupLocation: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengerCount: number;
  isRoundTrip: boolean;
}

interface Bus {
  busId: number;
  busName: string;
  busType: string;
  capacity: number;
  primaryImageUrl: string;
  pricePerDay: number;
  totalPrice: number;
  numberOfDays: number;
  averageRating: number;
  reviewCount: number;
  keyAmenities: string[];
}

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState<SearchData | null>(location.state as SearchData);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchData) {
      searchBuses(searchData);
    }
  }, [searchData]);

  const searchBuses = async (data: SearchData) => {
    setLoading(true);
    setError(null);

    try {
      // Call real API for bus search
      const searchRequest = {
        pickupLocation: searchParams.from || "Any",
        destination: searchParams.to || "Any",
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate,
        passengerCount: parseInt(searchParams.passengers) || 1
      };

      console.log('🔍 Customer website searching with:', searchRequest);

      const response = await fetch('http://localhost:5051/api/public/booking/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchRequest)
      });

      if (response.ok) {
        const buses = await response.json();
        console.log('✅ Customer website received buses:', buses);
        setBuses(buses);
      } else {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setError('Failed to search buses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = (data: SearchData) => {
    setSearchData(data);
  };

  const handleBookBus = (busId: number) => {
    navigate(`/booking/${busId}`, { state: { searchData, busId } });
  };

  const handleViewDetails = (busId: number) => {
    navigate(`/bus/${busId}`);
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

  return (
    <div className="search-results-page" style={{ paddingTop: '120px' }}>
      <Container>
        {/* Search Form */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <SearchForm onSearch={handleNewSearch} initialData={searchData || undefined} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Search Results */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Searching for available buses...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger">
            <Alert.Heading>Search Error</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

        {!loading && !error && buses.length > 0 && (
          <>
            <Row className="mb-3">
              <Col>
                <h4>Available Buses ({buses.length} found)</h4>
                {searchData && (
                  <p className="text-muted">
                    {searchData.pickupLocation} → {searchData.destination} | {searchData.departureDate.toDateString()} | {searchData.passengerCount} passengers
                  </p>
                )}
              </Col>
            </Row>

            <Row>
              {buses.map((bus) => (
                <Col lg={6} className="mb-4" key={bus.busId}>
                  <Card className="h-100 shadow-sm">
                    <Row className="g-0">
                      <Col md={4}>
                        <img
                          src={bus.primaryImageUrl}
                          alt={bus.busName}
                          className="img-fluid rounded-start h-100"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/default-bus.jpg';
                          }}
                        />
                      </Col>
                      <Col md={8}>
                        <Card.Body className="d-flex flex-column h-100">
                          <div>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <Card.Title className="mb-1">{bus.busName}</Card.Title>
                              <Badge bg="primary">{bus.busType}</Badge>
                            </div>

                            <div className="mb-2">
                              <div className="d-flex align-items-center mb-1">
                                {renderStars(bus.averageRating)}
                                <small className="text-muted ms-2">
                                  {bus.averageRating.toFixed(1)} ({bus.reviewCount} reviews)
                                </small>
                              </div>
                              <small className="text-muted">
                                <i className="fas fa-users me-1"></i>
                                {bus.capacity} seats
                              </small>
                            </div>

                            <div className="amenities mb-3">
                              {bus.keyAmenities.map((amenity, index) => (
                                <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h5 className="text-primary mb-0">₹{bus.totalPrice.toLocaleString()}</h5>
                                <small className="text-muted">Total price</small>
                              </div>
                              <div>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleViewDetails(bus.busId)}
                                >
                                  View Details
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleBookBus(bus.busId)}
                                >
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {!loading && !error && buses.length === 0 && searchData && (
          <div className="text-center py-5">
            <i className="fas fa-bus fa-3x text-muted mb-3"></i>
            <h4>No buses found</h4>
            <p className="text-muted">
              No buses are available for your selected route and date.
              Please try different dates or contact us for assistance.
            </p>
            <Button variant="primary" onClick={() => navigate('/contact')}>
              Contact Us
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SearchResults;
