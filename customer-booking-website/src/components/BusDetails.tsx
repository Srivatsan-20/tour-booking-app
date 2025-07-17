import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tab, Tabs } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const BusDetails: React.FC = () => {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();
  const [bus, setBus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock bus details
    setBus({
      busId: parseInt(busId || '1'),
      busName: "Luxury AC Sleeper",
      busType: "AC Sleeper",
      capacity: 32,
      description: "Experience ultimate comfort with our luxury AC sleeper bus featuring modern amenities and spacious berths.",
      pricePerDay: 8000,
      averageRating: 4.8,
      reviewCount: 156,
      photos: ["/images/bus-luxury-sleeper.jpg"],
      amenities: ["AC", "WiFi", "Entertainment", "Charging Points", "Reading Lights"],
      reviews: []
    });
    setLoading(false);
  }, [busId]);

  if (loading) {
    return (
      <div className="text-center py-5" style={{ paddingTop: '120px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bus-details-page" style={{ paddingTop: '120px' }}>
      <Container>
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Img variant="top" src={bus.photos[0]} alt={bus.busName} />
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <Card.Title className="h3">{bus.busName}</Card.Title>
                    <Badge bg="primary" className="mb-2">{bus.busType}</Badge>
                  </div>
                  <div className="text-end">
                    <h4 className="text-primary">₹{bus.pricePerDay.toLocaleString()}/day</h4>
                    <small className="text-muted">*Excluding taxes</small>
                  </div>
                </div>
                
                <p>{bus.description}</p>
                
                <Tabs defaultActiveKey="amenities" className="mb-3">
                  <Tab eventKey="amenities" title="Amenities">
                    <div className="amenities-grid">
                      {bus.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} bg="light" text="dark" className="me-2 mb-2">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </Tab>
                  <Tab eventKey="reviews" title="Reviews">
                    <p>No reviews yet.</p>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="sticky-top" style={{ top: '120px' }}>
              <Card.Body>
                <h5>Book This Bus</h5>
                <div className="mb-3">
                  <strong>Capacity:</strong> {bus.capacity} seats
                </div>
                <div className="mb-3">
                  <strong>Rating:</strong> {bus.averageRating}/5 ({bus.reviewCount} reviews)
                </div>
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => navigate(`/booking/${busId}`)}
                  >
                    Book Now
                  </Button>
                  <Button 
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Back to Search
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BusDetails;
