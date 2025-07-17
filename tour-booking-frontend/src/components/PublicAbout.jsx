import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaShieldAlt, FaClock, FaUsers, FaAward, FaBus, FaRoute } from 'react-icons/fa';

const PublicAbout = () => {
  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-4">About Sri Sai Senthil Tours</h1>
            <p className="lead text-muted">
              Your trusted partner for comfortable and safe bus travel across South India since 2010.
            </p>
          </div>
        </Col>
      </Row>

      {/* Our Story */}
      <Row className="mb-5">
        <Col lg={6}>
          <h2 className="fw-bold mb-4">Our Story</h2>
          <p className="text-muted mb-3">
            Founded in 2010, Sri Sai Senthil Tours began as a small family business with a simple mission: 
            to provide safe, comfortable, and reliable bus transportation services across South India.
          </p>
          <p className="text-muted mb-3">
            Over the years, we have grown from a single bus operation to a fleet of modern, 
            well-maintained vehicles serving thousands of satisfied customers. Our commitment to 
            excellence and customer satisfaction has made us one of the most trusted names in 
            the transportation industry.
          </p>
          <p className="text-muted">
            Today, we continue to uphold our founding values while embracing modern technology 
            to enhance your travel experience. Every journey with us is a testament to our 
            dedication to quality service and passenger safety.
          </p>
        </Col>
        <Col lg={6}>
          <div className="text-center">
            <FaBus size={200} className="text-primary opacity-75" />
          </div>
        </Col>
      </Row>

      {/* Our Values */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center fw-bold mb-5">Our Core Values</h2>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <FaShieldAlt size={50} className="text-primary mb-3" />
                  <h5 className="fw-bold mb-3">Safety First</h5>
                  <p className="text-muted">
                    Safety is our top priority. All our buses undergo regular maintenance 
                    and safety checks. Our drivers are trained professionals with clean 
                    driving records.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6} className="mb-4">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <FaClock size={50} className="text-primary mb-3" />
                  <h5 className="fw-bold mb-3">Punctuality</h5>
                  <p className="text-muted">
                    We respect your time and ensure our buses depart and arrive on schedule. 
                    Our efficient route planning minimizes delays and ensures timely travel.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6} className="mb-4">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <FaUsers size={50} className="text-primary mb-3" />
                  <h5 className="fw-bold mb-3">Customer Care</h5>
                  <p className="text-muted">
                    Our dedicated customer service team is available 24/7 to assist you. 
                    We go the extra mile to ensure your journey is comfortable and hassle-free.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Statistics */}
      <Row className="mb-5 bg-light rounded p-4">
        <Col>
          <h2 className="text-center fw-bold mb-5">Our Achievements</h2>
          <Row className="text-center">
            <Col lg={3} md={6} className="mb-4">
              <div>
                <h2 className="text-primary fw-bold">14+</h2>
                <p className="text-muted">Years of Service</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div>
                <h2 className="text-primary fw-bold">50,000+</h2>
                <p className="text-muted">Happy Customers</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div>
                <h2 className="text-primary fw-bold">25+</h2>
                <p className="text-muted">Modern Buses</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div>
                <h2 className="text-primary fw-bold">100+</h2>
                <p className="text-muted">Routes Covered</p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Services */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center fw-bold mb-5">What We Offer</h2>
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaBus size={30} className="text-primary me-3" />
                    <h5 className="fw-bold mb-0">Modern Fleet</h5>
                  </div>
                  <p className="text-muted">
                    Our fleet consists of modern, well-maintained buses equipped with 
                    comfortable seating, air conditioning, and safety features.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaRoute size={30} className="text-primary me-3" />
                    <h5 className="fw-bold mb-0">Extensive Network</h5>
                  </div>
                  <p className="text-muted">
                    We cover major cities and towns across South India with regular 
                    services and flexible scheduling options.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaAward size={30} className="text-primary me-3" />
                    <h5 className="fw-bold mb-0">Quality Service</h5>
                  </div>
                  <p className="text-muted">
                    Our commitment to quality has earned us numerous awards and 
                    recognition in the transportation industry.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaUsers size={30} className="text-primary me-3" />
                    <h5 className="fw-bold mb-0">Professional Team</h5>
                  </div>
                  <p className="text-muted">
                    Our team of experienced drivers and support staff are dedicated 
                    to providing you with the best travel experience.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Mission & Vision */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100 bg-primary text-white">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">Our Mission</h4>
              <p className="mb-0">
                To provide safe, comfortable, and reliable bus transportation services 
                that exceed customer expectations while maintaining the highest standards 
                of safety and professionalism.
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card className="h-100 bg-secondary text-white">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">Our Vision</h4>
              <p className="mb-0">
                To be the leading bus transportation company in South India, known for 
                innovation, reliability, and exceptional customer service while contributing 
                to sustainable and eco-friendly travel solutions.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicAbout;
