import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaBus, FaRoute, FaShieldAlt, FaClock, FaUsers } from 'react-icons/fa';
import PublicSearchForm from './PublicSearchForm';

const PublicHomepage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Plan Your Perfect Tour
              </h1>
              <p className="lead mb-4">
                Book comfortable buses for your group tours across South India. From temple tours to
                hill station getaways, we provide reliable transportation for your travel groups.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/search" variant="light" size="lg">
                  <FaSearch className="me-2" />
                  Book Tour Buses
                </Button>
                <Button as={Link} to="/about" variant="outline-light" size="lg">
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <FaBus size={200} className="text-white opacity-75" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search Form Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="shadow">
                <Card.Body className="p-4">
                  <h3 className="text-center mb-4">Plan Your Group Tour</h3>
                  <PublicSearchForm />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold mb-3">Why Choose Sri Sai Senthil Tours?</h2>
              <p className="text-muted lead">
                We provide reliable bus transportation for tour groups with our commitment to safety, comfort, and professional service.
              </p>
            </Col>
          </Row>

          <Row>
            <Col lg={4} md={6} className="mb-4">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <FaShieldAlt size={50} className="text-primary mb-3" />
                  <h5 className="fw-bold mb-3">Safe & Secure</h5>
                  <p className="text-muted">
                    All our buses are regularly maintained and equipped with safety features.
                    Professional drivers ensure your safety throughout the journey.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <FaClock size={50} className="text-primary mb-3" />
                  <h5 className="fw-bold mb-3">On-Time Service</h5>
                  <p className="text-muted">
                    We value your time. Our buses depart and arrive on schedule,
                    ensuring you reach your destination as planned.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <FaUsers size={50} className="text-primary mb-3" />
                  <h5 className="fw-bold mb-3">Comfortable Travel</h5>
                  <p className="text-muted">
                    Spacious buses with comfortable seating, air conditioning, and modern amenities
                    ensure your tour group travels in comfort.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold mb-3">Our Services</h2>
              <p className="text-muted lead">
                Comprehensive bus rental solutions for all your group tour transportation needs.
              </p>
            </Col>
          </Row>

          <Row>
            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaBus size={30} className="text-primary me-3" />
                    <h5 className="fw-bold mb-0">Group Tours</h5>
                  </div>
                  <p className="text-muted">
                    Perfect for tour organizers planning group trips. We provide buses for
                    temple tours, hill station visits, corporate outings, and more.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaRoute size={30} className="text-primary me-3" />
                    <h5 className="fw-bold mb-0">Custom Itineraries</h5>
                  </div>
                  <p className="text-muted">
                    Need a specific itinerary? We offer customized bus rental solutions
                    tailored to your group's requirements and schedule.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="fw-bold mb-3">Ready to Start Your Journey?</h2>
              <p className="lead mb-4">
                Book buses for your group tour today and experience reliable service with Sri Sai Senthil Tours.
              </p>
              <Button as={Link} to="/search" variant="light" size="lg">
                <FaSearch className="me-2" />
                Plan Your Tour
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default PublicHomepage;
