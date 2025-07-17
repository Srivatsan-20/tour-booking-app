import React, { useState } from 'react';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import './SearchForm.css';

interface SearchData {
  pickupLocation: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengerCount: number;
  isRoundTrip: boolean;
}

interface SearchFormProps {
  onSearch: (data: SearchData) => void;
  initialData?: Partial<SearchData>;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, initialData }) => {
  const [searchData, setSearchData] = useState<SearchData>({
    pickupLocation: initialData?.pickupLocation || '',
    destination: initialData?.destination || '',
    departureDate: initialData?.departureDate || new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    returnDate: initialData?.returnDate || undefined,
    passengerCount: initialData?.passengerCount || 1,
    isRoundTrip: initialData?.isRoundTrip || false
  });

  const [isLoading, setIsLoading] = useState(false);

  const popularDestinations = [
    'Chennai', 'Kanyakumari', 'Madurai', 'Kodaikanal', 'Ooty',
    'Rameshwaram', 'Thanjavur', 'Palani', 'Coimbatore', 'Trichy'
  ];

  const handleInputChange = (field: keyof SearchData, value: any) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (value: string, field: 'departureDate' | 'returnDate') => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setSearchData(prev => ({
        ...prev,
        [field]: date
      }));
    }
  };

  const handleRoundTripToggle = (isRoundTrip: boolean) => {
    setSearchData(prev => ({
      ...prev,
      isRoundTrip,
      returnDate: isRoundTrip ? (prev.returnDate || new Date(prev.departureDate.getTime() + 24 * 60 * 60 * 1000)) : undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchData.pickupLocation.trim() || !searchData.destination.trim()) {
      alert('Please enter both pickup location and destination');
      return;
    }

    if (searchData.isRoundTrip && searchData.returnDate && searchData.returnDate <= searchData.departureDate) {
      alert('Return date must be after departure date');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSearch(searchData);
    } catch (error) {
      console.error('Search error:', error);
      alert('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const swapLocations = () => {
    setSearchData(prev => ({
      ...prev,
      pickupLocation: prev.destination,
      destination: prev.pickupLocation
    }));
  };

  return (
    <div className="search-form-container">
      <Form onSubmit={handleSubmit}>
        {/* Trip Type Toggle */}
        <Row className="mb-3">
          <Col>
            <div className="trip-type-toggle">
              <Button
                variant={!searchData.isRoundTrip ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => handleRoundTripToggle(false)}
                className="me-2"
              >
                One Way
              </Button>
              <Button
                variant={searchData.isRoundTrip ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => handleRoundTripToggle(true)}
              >
                Round Trip
              </Button>
            </div>
          </Col>
        </Row>

        {/* Location Fields */}
        <Row className="mb-3">
          <Col md={5}>
            <Form.Group>
              <Form.Label className="form-label">
                <i className="fas fa-map-marker-alt me-2"></i>
                From
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter pickup location"
                value={searchData.pickupLocation}
                onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                list="pickup-suggestions"
                className="location-input"
                required
              />
              <datalist id="pickup-suggestions">
                <option value="Dharmapuri" />
                {popularDestinations.map(dest => (
                  <option key={dest} value={dest} />
                ))}
              </datalist>
            </Form.Group>
          </Col>

          <Col md={2} className="d-flex align-items-end justify-content-center">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={swapLocations}
              className="swap-button"
              type="button"
            >
              <i className="fas fa-exchange-alt"></i>
            </Button>
          </Col>

          <Col md={5}>
            <Form.Group>
              <Form.Label className="form-label">
                <i className="fas fa-map-marker-alt me-2"></i>
                To
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter destination"
                value={searchData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                list="destination-suggestions"
                className="location-input"
                required
              />
              <datalist id="destination-suggestions">
                {popularDestinations.map(dest => (
                  <option key={dest} value={dest} />
                ))}
              </datalist>
            </Form.Group>
          </Col>
        </Row>

        {/* Date and Passenger Fields */}
        <Row className="mb-3">
          <Col md={searchData.isRoundTrip ? 4 : 6}>
            <Form.Group>
              <Form.Label className="form-label">
                <i className="fas fa-calendar-alt me-2"></i>
                Departure Date
              </Form.Label>
              <Form.Control
                type="date"
                value={searchData.departureDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e.target.value, 'departureDate')}
                min={new Date().toISOString().split('T')[0]}
                className="date-input"
                required
              />
            </Form.Group>
          </Col>

          {searchData.isRoundTrip && (
            <Col md={4}>
              <Form.Group>
                <Form.Label className="form-label">
                  <i className="fas fa-calendar-alt me-2"></i>
                  Return Date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={searchData.returnDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateChange(e.target.value, 'returnDate')}
                  min={searchData.departureDate.toISOString().split('T')[0]}
                  className="date-input"
                  required={searchData.isRoundTrip}
                />
              </Form.Group>
            </Col>
          )}

          <Col md={searchData.isRoundTrip ? 4 : 6}>
            <Form.Group>
              <Form.Label className="form-label">
                <i className="fas fa-users me-2"></i>
                Passengers
              </Form.Label>
              <InputGroup>
                <Button
                  variant="outline-secondary"
                  onClick={() => handleInputChange('passengerCount', Math.max(1, searchData.passengerCount - 1))}
                  disabled={searchData.passengerCount <= 1}
                  type="button"
                >
                  <i className="fas fa-minus"></i>
                </Button>
                <Form.Control
                  type="number"
                  value={searchData.passengerCount}
                  onChange={(e) => handleInputChange('passengerCount', Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="100"
                  className="text-center passenger-input"
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleInputChange('passengerCount', Math.min(100, searchData.passengerCount + 1))}
                  disabled={searchData.passengerCount >= 100}
                  type="button"
                >
                  <i className="fas fa-plus"></i>
                </Button>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        {/* Search Button */}
        <Row>
          <Col>
            <div className="d-grid">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="search-button"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search me-2"></i>
                    Search Available Buses
                  </>
                )}
              </Button>
            </div>
          </Col>
        </Row>

        {/* Quick Search Suggestions */}
        <Row className="mt-3">
          <Col>
            <div className="quick-suggestions">
              <small className="text-muted">Popular destinations:</small>
              <div className="suggestion-tags mt-1">
                {popularDestinations.slice(0, 5).map(dest => (
                  <Button
                    key={dest}
                    variant="outline-secondary"
                    size="sm"
                    className="suggestion-tag me-1 mb-1"
                    onClick={() => handleInputChange('destination', dest)}
                    type="button"
                  >
                    {dest}
                  </Button>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchForm;
