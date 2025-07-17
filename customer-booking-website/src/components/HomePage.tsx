import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SearchForm from './SearchForm';
import FeaturedBuses from './FeaturedBuses';
import Testimonials from './Testimonials';
import WhyChooseUs from './WhyChooseUs';
import HowItWorks from './HowItWorks';
import './HomePage.css';

interface SearchData {
  pickupLocation: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengerCount: number;
  isRoundTrip: boolean;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBuses: 0,
    happyCustomers: 0,
    citiesCovered: 0,
    yearsExperience: 0
  });

  useEffect(() => {
    // Load statistics
    setStats({
      totalBuses: 25,
      happyCustomers: 1500,
      citiesCovered: 50,
      yearsExperience: 10
    });
  }, []);

  const handleSearch = (searchData: SearchData) => {
    navigate('/search-results', { state: searchData });
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <h1 className="hero-title">
                  Book Your Perfect Tour Bus
                </h1>
                <p className="hero-subtitle">
                  Comfortable, reliable, and affordable bus rentals for your next adventure
                </p>
                <div className="hero-search-form">
                  <SearchForm onSearch={handleSearch} />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section py-5">
        <Container>
          <Row className="text-center">
            <Col md={3} sm={6} className="mb-4">
              <div className="stat-item">
                <div className="stat-number">{stats.totalBuses}+</div>
                <div className="stat-label">Premium Buses</div>
              </div>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <div className="stat-item">
                <div className="stat-number">{stats.happyCustomers}+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <div className="stat-item">
                <div className="stat-number">{stats.citiesCovered}+</div>
                <div className="stat-label">Cities Covered</div>
              </div>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <div className="stat-item">
                <div className="stat-number">{stats.yearsExperience}+</div>
                <div className="stat-label">Years Experience</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Buses Section */}
      <section className="featured-section py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="section-title">Our Premium Fleet</h2>
              <p className="section-subtitle">
                Choose from our wide range of comfortable and well-maintained buses
              </p>
            </Col>
          </Row>
          <FeaturedBuses />
          <Row className="mt-4">
            <Col className="text-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/buses')}
              >
                View All Buses
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="section-title">Why Choose Sri Sai Senthil Tours?</h2>
              <p className="section-subtitle">
                We provide the best bus rental experience with unmatched service quality
              </p>
            </Col>
          </Row>
          <WhyChooseUs />
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">
                Book your bus in just 3 simple steps
              </p>
            </Col>
          </Row>
          <HowItWorks />
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="section-title">What Our Customers Say</h2>
              <p className="section-subtitle">
                Read reviews from our satisfied customers
              </p>
            </Col>
          </Row>
          <Testimonials />
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="mb-3">Ready to Book Your Next Trip?</h2>
              <p className="mb-4 lead">
                Get instant quotes and book your perfect bus today
              </p>
              <div className="cta-buttons">
                <Button 
                  variant="light" 
                  size="lg" 
                  className="me-3 mb-2"
                  onClick={() => navigate('/search')}
                >
                  Search Buses
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  className="mb-2"
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quick Links Section */}
      <section className="quick-links-section py-4 bg-dark text-white">
        <Container>
          <Row className="text-center">
            <Col md={3} sm={6} className="mb-3">
              <div className="quick-link">
                <i className="fas fa-phone fa-2x mb-2"></i>
                <h5>24/7 Support</h5>
                <p>Call us anytime</p>
                <Badge bg="success">+91 9876543210</Badge>
              </div>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <div className="quick-link">
                <i className="fas fa-shield-alt fa-2x mb-2"></i>
                <h5>Safe & Secure</h5>
                <p>Verified drivers</p>
                <Badge bg="info">100% Safe</Badge>
              </div>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <div className="quick-link">
                <i className="fas fa-money-bill-wave fa-2x mb-2"></i>
                <h5>Best Prices</h5>
                <p>Competitive rates</p>
                <Badge bg="warning">No Hidden Fees</Badge>
              </div>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <div className="quick-link">
                <i className="fas fa-clock fa-2x mb-2"></i>
                <h5>On Time</h5>
                <p>Punctual service</p>
                <Badge bg="success">Always On Time</Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
