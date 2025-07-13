import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, ListGroup, Accordion, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { runAllTests } from '../utils/testGoogleMapsAPI';
import ApiTestComponent from './ApiTestComponent';

const SmartTourPlanner = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    startingPoint: 'Dharmapuri',
    places: [],
    numberOfDays: 2,
    maxDrivingHoursPerDay: 10,
    returnDeadline: '',
    tripName: ''
  });

  // Component state
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [feasibilityCheck, setFeasibilityCheck] = useState(null);
  const [showFeasibilityModal, setShowFeasibilityModal] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [testing, setTesting] = useState(false);

  // Load available places on component mount
  useEffect(() => {
    loadAvailablePlaces();
  }, []);

  const loadAvailablePlaces = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/TourPlanner/places');

      if (response.ok) {
        const places = await response.json();
        setAvailablePlaces(places);
      } else {
        console.error('Failed to load places');
        // Fallback data
        setAvailablePlaces([
          { id: 1, name: 'Kanyakumari', category: 'Beach/Temple', state: 'Tamil Nadu', defaultVisitDurationMinutes: 360, description: 'Southernmost tip of India' },
          { id: 2, name: 'Chennai', category: 'City', state: 'Tamil Nadu', defaultVisitDurationMinutes: 480, description: 'Capital city with beaches and temples' },
          { id: 3, name: 'Madurai', category: 'Temple/Heritage', state: 'Tamil Nadu', defaultVisitDurationMinutes: 360, description: 'Temple city with Meenakshi Amman Temple' },
          { id: 4, name: 'Kodaikanal', category: 'Hill Station', state: 'Tamil Nadu', defaultVisitDurationMinutes: 480, description: 'Princess of Hill Stations' },
          { id: 5, name: 'Rameshwaram', category: 'Temple/Island', state: 'Tamil Nadu', defaultVisitDurationMinutes: 300, description: 'Sacred island temple' },
          { id: 6, name: 'Thanjavur', category: 'Temple/Heritage', state: 'Tamil Nadu', defaultVisitDurationMinutes: 240, description: 'Ancient city with Brihadeeswarar Temple' },
          { id: 7, name: 'Palani', category: 'Temple/Hill', state: 'Tamil Nadu', defaultVisitDurationMinutes: 180, description: 'Hill temple dedicated to Lord Murugan' },
          { id: 8, name: 'Pondicherry', category: 'Beach/Heritage', state: 'Puducherry', defaultVisitDurationMinutes: 360, description: 'French colonial heritage' }
        ]);
      }
    } catch (error) {
      console.error('Error loading places:', error);
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  // Handle place selection
  const handlePlaceSelection = (place, isSelected) => {
    if (isSelected) {
      setSelectedPlaces(prev => [...prev, {
        placeName: place.name,
        customVisitDurationMinutes: place.defaultVisitDurationMinutes,
        priority: 1
      }]);
    } else {
      setSelectedPlaces(prev => prev.filter(p => p.placeName !== place.name));
    }
  };

  // Update visit duration for a place
  const updateVisitDuration = (placeName, duration) => {
    setSelectedPlaces(prev => prev.map(p =>
      p.placeName === placeName
        ? { ...p, customVisitDurationMinutes: parseInt(duration) }
        : p
    ));
  };

  // Update priority for a place
  const updatePriority = (placeName, priority) => {
    setSelectedPlaces(prev => prev.map(p =>
      p.placeName === placeName
        ? { ...p, priority: parseInt(priority) }
        : p
    ));
  };

  // Quick feasibility check
  const checkFeasibility = async () => {
    if (selectedPlaces.length === 0) {
      setError('Please select at least one place');
      return;
    }

    try {
      setLoading(true);
      const request = {
        startingPoint: formData.startingPoint,
        places: selectedPlaces,
        numberOfDays: formData.numberOfDays,
        maxDrivingHoursPerDay: formData.maxDrivingHoursPerDay
      };

      const response = await fetch('http://localhost:5050/api/TourPlanner/feasibility-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (response.ok) {
        const result = await response.json();
        setFeasibilityCheck(result);
        setShowFeasibilityModal(true);
      } else {
        setError('Failed to check feasibility');
      }
    } catch (error) {
      setError('Error checking feasibility');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Generate full tour plan
  const generateTourPlan = async () => {
    if (selectedPlaces.length === 0) {
      setError('Please select at least one place');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const request = {
        startingPoint: formData.startingPoint,
        places: selectedPlaces,
        numberOfDays: formData.numberOfDays,
        maxDrivingHoursPerDay: formData.maxDrivingHoursPerDay,
        tripName: formData.tripName || `Tour from ${formData.startingPoint}`,
        returnDeadline: formData.returnDeadline ? new Date(formData.returnDeadline).toISOString() : null
      };

      console.log('🚀 Generating smart tour plan...', request);

      const response = await fetch('http://localhost:5050/api/TourPlanner/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (response.ok) {
        const result = await response.json();
        setResult(result);
        console.log('✅ Smart tour plan generated:', result);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to generate tour plan');
      }
    } catch (error) {
      setError('Error generating tour plan');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Use tour plan for booking
  const useForBooking = () => {
    if (!result || !result.dayItineraries) return;

    const placesToCover = result.dayItineraries
      .flatMap(day => day.stops.filter(stop => stop.stopType === 'Visit'))
      .map(stop => stop.placeName)
      .join(', ');

    navigate('/booking', {
      state: {
        placesToCover: placesToCover,
        suggestedDays: result.totalDays,
        smartTourPlan: result,
        startingPoint: formData.startingPoint
      }
    });
  };

  // Test Google Maps API integration
  const testGoogleMapsIntegration = async () => {
    setTesting(true);
    try {
      const results = await runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test error:', error);
      setTestResults({ allPassed: false, hasGoogleMaps: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  // Format time for display
  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format duration
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="text-center mb-3">
            <Logo />
          </div>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h3 className="mb-0">🧠 Smart Tour Planner</h3>
              <small>AI-powered itinerary optimization with Google Maps integration</small>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-3">
                <strong>🎯 Intelligent Features:</strong> Route optimization • Time constraints • Return-to-base by 1:00 AM • Real-time distance calculation • Automatic place exclusion when needed
              </Alert>

              {/* Google Maps API Test */}
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={testGoogleMapsIntegration}
                  disabled={testing}
                >
                  {testing ? <Spinner size="sm" /> : '🧪'} Test Google Maps API
                </Button>

                {testResults && (
                  <Badge bg={testResults.allPassed ? (testResults.hasGoogleMaps ? 'success' : 'warning') : 'danger'}>
                    {testResults.allPassed
                      ? (testResults.hasGoogleMaps ? '✅ Google Maps Active' : '⚠️ Fallback Mode')
                      : '❌ API Error'
                    }
                  </Badge>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* API Test Component */}
      <Row className="mb-3">
        <Col>
          <ApiTestComponent />
        </Col>
      </Row>

      <Row>
        {/* Input Form */}
        <Col lg={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h5 className="mb-0">📝 Plan Your Smart Tour</h5>
            </Card.Header>
            <Card.Body>
              {/* Basic Settings */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Starting Point</Form.Label>
                    <Form.Control
                      type="text"
                      name="startingPoint"
                      value={formData.startingPoint}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Number of Days</Form.Label>
                    <Form.Control
                      type="number"
                      name="numberOfDays"
                      value={formData.numberOfDays}
                      onChange={handleInputChange}
                      min="1"
                      max="30"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Max Driving Hours/Day</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxDrivingHoursPerDay"
                      value={formData.maxDrivingHoursPerDay}
                      onChange={handleInputChange}
                      min="6"
                      max="16"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Return Deadline (Optional)</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="returnDeadline"
                      value={formData.returnDeadline}
                      onChange={handleInputChange}
                    />
                    <Form.Text className="text-muted">Default: 1:00 AM next day</Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Trip Name (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="tripName"
                  value={formData.tripName}
                  onChange={handleInputChange}
                  placeholder="e.g., South India Temple Tour"
                />
              </Form.Group>

              {/* Place Selection */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Select Places to Visit
                  <Badge bg="info" className="ms-2">{selectedPlaces.length} selected</Badge>
                </Form.Label>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="border rounded p-2">
                  {availablePlaces.map(place => {
                    const isSelected = selectedPlaces.some(sp => sp.placeName === place.name);
                    return (
                      <div key={place.id} className="mb-2">
                        <Form.Check
                          type="checkbox"
                          id={`place-${place.id}`}
                          checked={isSelected}
                          onChange={(e) => handlePlaceSelection(place, e.target.checked)}
                          label={
                            <div>
                              <strong>{place.name}</strong>
                              <Badge bg="secondary" className="ms-2">{place.state}</Badge>
                              <Badge bg="info" className="ms-1">{place.category}</Badge>
                              <Badge bg="warning" className="ms-1">{formatDuration(place.defaultVisitDurationMinutes)}</Badge>
                              <br />
                              <small className="text-muted">{place.description}</small>
                            </div>
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </Form.Group>

              {/* Selected Places Configuration */}
              {selectedPlaces.length > 0 && (
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">🎯 Selected Places Configuration</h6>
                  </Card.Header>
                  <Card.Body>
                    {selectedPlaces.map((place, index) => (
                      <Row key={index} className="mb-2 align-items-center">
                        <Col md={4}>
                          <strong>{place.placeName}</strong>
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            type="number"
                            size="sm"
                            value={place.customVisitDurationMinutes}
                            onChange={(e) => updateVisitDuration(place.placeName, e.target.value)}
                            min="30"
                            max="720"
                          />
                          <Form.Text>Visit duration (minutes)</Form.Text>
                        </Col>
                        <Col md={4}>
                          <Form.Select
                            size="sm"
                            value={place.priority}
                            onChange={(e) => updatePriority(place.placeName, e.target.value)}
                          >
                            <option value={1}>High Priority</option>
                            <option value={2}>Medium Priority</option>
                            <option value={3}>Low Priority</option>
                          </Form.Select>
                        </Col>
                      </Row>
                    ))}
                  </Card.Body>
                </Card>
              )}

              {/* Action Buttons */}
              <Row className="mb-3">
                <Col md={6}>
                  <Button
                    variant="outline-primary"
                    onClick={checkFeasibility}
                    disabled={loading || selectedPlaces.length === 0}
                    className="w-100"
                  >
                    {loading ? <Spinner size="sm" /> : '🔍'} Quick Check
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    variant="success"
                    onClick={generateTourPlan}
                    disabled={loading || selectedPlaces.length === 0}
                    className="w-100"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Generating...
                      </>
                    ) : (
                      '🧠 Generate Smart Plan'
                    )}
                  </Button>
                </Col>
              </Row>

              {/* Navigation */}
              <Row>
                <Col>
                  <Button variant="outline-secondary" onClick={() => navigate('/')}>
                    🏠 Home
                  </Button>
                </Col>
                <Col className="text-end">
                  <Button variant="outline-primary" onClick={() => navigate('/booking')}>
                    📝 Direct Booking
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Results */}
        <Col lg={6}>
          {/* Error Display */}
          {error && (
            <Alert variant="danger" className="mb-3">
              <Alert.Heading>⚠️ Error</Alert.Heading>
              {error}
            </Alert>
          )}

          {/* Success Result */}
          {result && (
            <Card className="shadow-sm">
              <Card.Header className={`text-white ${result.isFeasible ? 'bg-success' : 'bg-warning'}`}>
                <h5 className="mb-0">
                  {result.isFeasible ? '✅ Smart Itinerary Generated' : '⚠️ Partially Feasible Plan'}
                </h5>
              </Card.Header>
              <Card.Body>
                {/* Summary */}
                <Alert variant={result.isFeasible ? 'success' : 'warning'} className="mb-3">
                  <Row>
                    <Col><strong>Trip:</strong> {result.tripName}</Col>
                    <Col><strong>Days:</strong> {result.totalDays}</Col>
                  </Row>
                  <Row>
                    <Col><strong>Distance:</strong> {result.totalDistanceKm} km</Col>
                    <Col><strong>Driving:</strong> {result.totalDrivingHours}h</Col>
                  </Row>
                  <Row>
                    <Col><strong>Fuel Cost:</strong> ₹{result.estimatedFuelCost}</Col>
                    <Col><strong>Return:</strong> {result.summary?.returnTime ? formatTime(result.summary.returnTime) : 'N/A'}</Col>
                  </Row>
                </Alert>

                {/* Warnings */}
                {result.warnings && result.warnings.length > 0 && (
                  <Alert variant="warning" className="mb-3">
                    <strong>⚠️ Warnings:</strong>
                    <ul className="mb-0 mt-1">
                      {result.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

                {/* Excluded Places */}
                {result.excludedPlaces && result.excludedPlaces.length > 0 && (
                  <Alert variant="info" className="mb-3">
                    <strong>ℹ️ Excluded Places:</strong>
                    <ul className="mb-0 mt-1">
                      {result.excludedPlaces.map((excluded, index) => (
                        <li key={index}>{excluded}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

                {/* Day-wise Itinerary */}
                <Accordion>
                  {result.dayItineraries && result.dayItineraries.map((day, index) => (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header>
                        <strong>Day {day.dayNumber}</strong> - {day.summary}
                      </Accordion.Header>
                      <Accordion.Body>
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>Time</th>
                              <th>Activity</th>
                              <th>Duration</th>
                              <th>Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.stops && day.stops.map((stop, stopIndex) => (
                              <tr key={stopIndex}>
                                <td>
                                  {formatTime(stop.startTime)} - {formatTime(stop.endTime)}
                                </td>
                                <td>
                                  {stop.stopType === 'Travel' ? (
                                    <span className="text-muted">
                                      🚗 {stop.fromLocation} → {stop.toLocation}
                                    </span>
                                  ) : (
                                    <span className="text-primary">
                                      📍 <strong>{stop.placeName}</strong>
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {formatDuration(stop.durationMinutes)}
                                  {stop.distanceKm && (
                                    <><br /><small>{stop.distanceKm} km</small></>
                                  )}
                                </td>
                                <td>
                                  <small>{stop.notes}</small>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>

                {/* Use for Booking Button */}
                <div className="d-grid mt-3">
                  <Button variant="primary" size="lg" onClick={useForBooking}>
                    📝 Use This Smart Plan for Booking
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Feasibility Check Modal */}
      <Modal show={showFeasibilityModal} onHide={() => setShowFeasibilityModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🔍 Feasibility Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {feasibilityCheck && (
            <>
              <Alert variant={feasibilityCheck.isFeasible ? 'success' : 'warning'}>
                <h5>{feasibilityCheck.isFeasible ? '✅ Tour is Feasible!' : '⚠️ Tour Needs Adjustment'}</h5>
                <p className="mb-0">{feasibilityCheck.recommendation}</p>
              </Alert>

              <Table striped>
                <tbody>
                  <tr>
                    <td><strong>Time Utilization</strong></td>
                    <td>{feasibilityCheck.utilizationPercentage}%</td>
                  </tr>
                  <tr>
                    <td><strong>Total Time Needed</strong></td>
                    <td>{formatDuration(feasibilityCheck.totalTimeNeeded)}</td>
                  </tr>
                  <tr>
                    <td><strong>Available Time</strong></td>
                    <td>{formatDuration(feasibilityCheck.availableTime)}</td>
                  </tr>
                  <tr>
                    <td><strong>Visit Time</strong></td>
                    <td>{formatDuration(feasibilityCheck.estimatedVisitTime)}</td>
                  </tr>
                  <tr>
                    <td><strong>Travel Time</strong></td>
                    <td>{formatDuration(feasibilityCheck.estimatedTravelTime)}</td>
                  </tr>
                  <tr>
                    <td><strong>Valid Places</strong></td>
                    <td>{feasibilityCheck.validPlaces} / {feasibilityCheck.validPlaces + feasibilityCheck.invalidPlaces}</td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeasibilityModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={() => { setShowFeasibilityModal(false); generateTourPlan(); }}>
            Generate Full Plan
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SmartTourPlanner;
