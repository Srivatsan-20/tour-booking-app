import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiCall, buildApiUrl } from '../config/api';

const SmartTourPlanner = () => {
    const navigate = useNavigate();

    // Simplified form state
    const [formData, setFormData] = useState({
        pickupLocation: '',
        placesToCover: '',
        numberOfDays: 3
    });

    // Component state
    const [loading, setLoading] = useState(false);
    const [planOptions, setPlanOptions] = useState([]);
    const [error, setError] = useState('');

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Generate AI tour plans
    const generateTourPlans = async () => {
        console.log('🎯 Generate button clicked!', formData);

        if (!formData.pickupLocation || !formData.placesToCover || !formData.numberOfDays) {
            setError('Please fill in all required fields');
            console.log('❌ Validation failed:', formData);
            return;
        }

        console.log('✅ Validation passed, starting API call...');
        setLoading(true);
        setError('');
        setPlanOptions([]);

        try {
            const requestData = {
                pickupLocation: formData.pickupLocation,
                placesToCover: formData.placesToCover.split(',').map(p => p.trim()),
                numberOfDays: parseInt(formData.numberOfDays)
            };

            console.log('📤 Sending request:', requestData);

            // Use centralized API call
            const result = await apiCall('/api/TourPlanner/generate-simple-plan', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });

            if (result.success) {
                console.log('✅ Plans received:', result.data);
                setPlanOptions(result.data);
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            console.error('❌ Error generating plans:', err);
            setError(`Failed to generate tour plans: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Use selected plan for booking
    const usePlanForBooking = (plan) => {
        const placesToCover = plan.route.map(day =>
            day.places.map(place => place.name).join(', ')
        ).join(', ');

        navigate('/booking', {
            state: {
                placesToCover: placesToCover,
                suggestedDays: formData.numberOfDays,
                tourPlan: plan
            }
        });
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={12}>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">🧠 AI Smart Tour Planner</h4>
                                    <small>Get intelligent route suggestions for your bus tours</small>
                                </div>
                                <Button variant="outline-light" onClick={() => navigate('/admin')}>
                                    ← Back to Dashboard
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}

                            {/* Simple Input Form */}
                            <Row className="mb-4">
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>Pickup/Drop Location</strong></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="pickupLocation"
                                            value={formData.pickupLocation}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Chennai, Dharmapuri"
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            Starting and ending point of the tour
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={5}>
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>Places to Cover</strong></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="placesToCover"
                                            value={formData.placesToCover}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Kanyakumari, Madurai, Kodaikanal, Rameshwaram"
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            Comma-separated list of tourist places
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>Number of Days</strong></Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="numberOfDays"
                                            value={formData.numberOfDays}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="15"
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            Total tour duration
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="text-center mb-4">
                                <Button
                                    variant="success"
                                    size="lg"
                                    onClick={generateTourPlans}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Generating Plans...
                                        </>
                                    ) : (
                                        <>
                                            🧠 Generate AI Tour Plans
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Plan Results */}
                            {planOptions.length > 0 && (
                                <div>
                                    <h5 className="mb-3">🎯 AI Generated Tour Plans</h5>
                                    <Row>
                                        {planOptions.map((plan, index) => (
                                            <Col md={4} key={index} className="mb-4">
                                                <Card className="h-100 border-primary">
                                                    <Card.Header className="bg-light">
                                                        <h6 className="mb-0">
                                                            <Badge bg="primary" className="me-2">Option {index + 1}</Badge>
                                                            {plan.planName}
                                                        </h6>
                                                        <small className="text-muted">{plan.description}</small>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="mb-3">
                                                            <strong>🗺️ Detailed Day-wise Itinerary:</strong>
                                                            <div className="mt-2">
                                                                {plan.route && plan.route.map((day, dayIndex) => (
                                                                    <div key={dayIndex} className="mb-3 p-2 border rounded">
                                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                                            <Badge bg="primary" className="me-2">Day {day.dayNumber}</Badge>
                                                                            {day.isRestDay && <Badge bg="info">Rest Day</Badge>}
                                                                            {day.isNightTravel && <Badge bg="warning">Night Travel</Badge>}
                                                                        </div>
                                                                        {day.places && day.places.length > 0 ? (
                                                                            <div>
                                                                                {day.places.map((place, placeIndex) => (
                                                                                    <div key={placeIndex} className="mb-2 p-2 bg-light rounded">
                                                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                                                            <strong className="text-primary">{place.name}</strong>
                                                                                            <Badge bg="success" className="small">{place.visitDuration}</Badge>
                                                                                        </div>
                                                                                        {place.pointsOfInterest && place.pointsOfInterest.length > 0 && (
                                                                                            <div className="small">
                                                                                                <strong className="text-muted">Points of Interest:</strong>
                                                                                                <ul className="list-unstyled mt-1 mb-0">
                                                                                                    {place.pointsOfInterest.slice(0, 3).map((poi, poiIndex) => (
                                                                                                        <li key={poiIndex} className="text-muted small">
                                                                                                            • {poi}
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                                {day.totalKilometers && (
                                                                                    <div className="small text-info mt-2">
                                                                                        📍 Total Distance: {day.totalKilometers} km
                                                                                        {day.isReturnDay && <span className="ms-2">(Return Journey)</span>}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ) : day.returnJourney ? (
                                                                            <div className="text-center p-2 bg-warning bg-opacity-25 rounded">
                                                                                <strong>🏠 {day.returnJourney}</strong>
                                                                                <div className="small text-muted mt-1">
                                                                                    Distance: {day.totalKilometers} km
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <small className="text-muted">Rest and relaxation day</small>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <strong>📊 Plan Details:</strong>
                                                            <ul className="list-unstyled mt-2 small">
                                                                <li>🚌 Total Distance: {plan.totalDistance} km</li>
                                                                <li>⏱️ Total Travel Time: {plan.totalTravelTime} hours</li>
                                                                <li>🏨 Rest Stops: {plan.restStops}</li>
                                                                <li>🌙 Night Travel: {plan.nightTravelHours} hours</li>
                                                            </ul>
                                                        </div>

                                                        <div className="mb-3">
                                                            <strong>💡 Key Features:</strong>
                                                            <ul className="list-unstyled mt-2 small">
                                                                {plan.features && plan.features.map((feature, fIndex) => (
                                                                    <li key={fIndex}>✓ {feature}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => usePlanForBooking(plan)}
                                                            className="w-100"
                                                        >
                                                            📝 Use This Plan for Booking
                                                        </Button>
                                                    </Card.Footer>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SmartTourPlanner;