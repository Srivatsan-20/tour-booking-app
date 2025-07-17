import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import './Testimonials.css';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  tripDetails: string;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      location: 'Chennai',
      rating: 5,
      comment: 'Excellent service! The bus was clean, comfortable, and arrived on time. The driver was very professional and courteous. Highly recommended for family trips.',
      avatar: '/images/avatar-male-1.jpg',
      tripDetails: 'Chennai to Kanyakumari'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      location: 'Bangalore',
      rating: 5,
      comment: 'Amazing experience with Sri Sai Senthil Tours. The booking process was smooth, and the bus had all the amenities as promised. Will definitely book again!',
      avatar: '/images/avatar-female-1.jpg',
      tripDetails: 'Bangalore to Ooty'
    },
    {
      id: 3,
      name: 'Arun Patel',
      location: 'Coimbatore',
      rating: 4,
      comment: 'Good value for money. The bus was comfortable and the journey was pleasant. Customer service was responsive and helpful throughout the trip.',
      avatar: '/images/avatar-male-2.jpg',
      tripDetails: 'Coimbatore to Kodaikanal'
    },
    {
      id: 4,
      name: 'Meera Nair',
      location: 'Kochi',
      rating: 5,
      comment: 'Outstanding service! The bus was luxurious and well-maintained. The staff was friendly and accommodating. Perfect for our group tour.',
      avatar: '/images/avatar-female-2.jpg',
      tripDetails: 'Kochi to Madurai'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      location: 'Delhi',
      rating: 5,
      comment: 'Fantastic experience! Booked for our college trip and everything was perfect. Punctual service, comfortable seats, and great customer support.',
      avatar: '/images/avatar-male-3.jpg',
      tripDetails: 'Multi-city South India Tour'
    },
    {
      id: 6,
      name: 'Lakshmi Devi',
      location: 'Hyderabad',
      rating: 4,
      comment: 'Very satisfied with the service. The bus was clean and comfortable. The driver was experienced and drove safely. Good experience overall.',
      avatar: '/images/avatar-female-3.jpg',
      tripDetails: 'Hyderabad to Tirupati'
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i < rating ? 'text-warning' : 'text-muted'}`}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div className="testimonials">
      <Row>
        {testimonials.map((testimonial) => (
          <Col lg={4} md={6} className="mb-4" key={testimonial.id}>
            <Card className="testimonial-card h-100">
              <Card.Body>
                <div className="testimonial-header mb-3">
                  <div className="customer-info">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="customer-avatar"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/default-avatar.jpg';
                      }}
                    />
                    <div className="customer-details">
                      <h6 className="customer-name">{testimonial.name}</h6>
                      <small className="customer-location text-muted">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {testimonial.location}
                      </small>
                    </div>
                  </div>
                  <div className="rating">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                
                <div className="testimonial-content">
                  <p className="testimonial-comment">
                    "{testimonial.comment}"
                  </p>
                  <div className="trip-details">
                    <small className="text-primary">
                      <i className="fas fa-route me-1"></i>
                      {testimonial.tripDetails}
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Testimonials;
