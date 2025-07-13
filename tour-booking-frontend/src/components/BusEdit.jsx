import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const BusEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    registrationNumber: "",
    busType: "AC Sleeper",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    seatingCapacity: 0,
    sleeperCapacity: 0,
    features: "",
    status: 1,
    currentOdometer: "",
    defaultPerDayRent: "",
    defaultMountainRent: "",
    assignedDriver: "",
    driverPhone: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  const busTypes = [
    "AC Sleeper",
    "Non-AC Sleeper",
    "AC Seater",
    "Non-AC Seater",
    "Mini Bus",
    "Luxury Coach",
    "Volvo",
    "Mercedes"
  ];

  const busStatuses = [
    { value: 1, label: "Available" },
    { value: 2, label: "On Trip" },
    { value: 3, label: "Under Maintenance" },
    { value: 4, label: "Out of Service" },
    { value: 5, label: "Reserved" }
  ];

  useEffect(() => {
    fetchBusDetails();
  }, [id]);

  const fetchBusDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5050/api/Bus/${id}`);
      if (!response.ok) {
        throw new Error('Bus not found');
      }
      const bus = await response.json();

      setFormData({
        registrationNumber: bus.registrationNumber || "",
        busType: bus.busType || "AC Sleeper",
        make: bus.make || "",
        model: bus.model || "",
        year: bus.year || new Date().getFullYear(),
        seatingCapacity: bus.seatingCapacity || 0,
        sleeperCapacity: bus.sleeperCapacity || 0,
        features: bus.features || "",
        status: bus.status || 1,
        currentOdometer: bus.currentOdometer || "",
        defaultPerDayRent: bus.defaultPerDayRent || "",
        defaultMountainRent: bus.defaultMountainRent || "",
        assignedDriver: bus.assignedDriver || "",
        driverPhone: bus.driverPhone || "",
        notes: bus.notes || ""
      });
    } catch (err) {
      setStatusMessage({
        type: "danger",
        message: `Failed to load bus details: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }
    if (!formData.make.trim()) {
      newErrors.make = "Make is required";
    }
    if (!formData.model.trim()) {
      newErrors.model = "Model is required";
    }
    if (formData.year < 1990 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = "Please enter a valid year";
    }
    if (formData.seatingCapacity < 0) {
      newErrors.seatingCapacity = "Seating capacity cannot be negative";
    }
    if (formData.sleeperCapacity < 0) {
      newErrors.sleeperCapacity = "Sleeper capacity cannot be negative";
    }
    if (formData.seatingCapacity + formData.sleeperCapacity === 0) {
      newErrors.capacity = "Total capacity must be greater than 0";
    }
    if (!formData.defaultPerDayRent || formData.defaultPerDayRent <= 0) {
      newErrors.defaultPerDayRent = "Default per day rent is required and must be greater than 0";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setStatusMessage({ type: "", message: "" });

    try {
      const response = await fetch(`http://localhost:5050/api/Bus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          currentOdometer: formData.currentOdometer ? parseFloat(formData.currentOdometer) : null,
          defaultPerDayRent: parseFloat(formData.defaultPerDayRent),
          defaultMountainRent: formData.defaultMountainRent ? parseFloat(formData.defaultMountainRent) : null
        }),
      });

      if (response.ok) {
        setStatusMessage({
          type: "success",
          message: `🎉 Bus ${formData.registrationNumber} updated successfully!`
        });

        // Navigate back to details page after a short delay
        setTimeout(() => {
          navigate(`/admin/bus-fleet/${id}`);
        }, 2000);
      } else {
        const errorData = await response.text();
        setStatusMessage({
          type: "danger",
          message: `Failed to update bus: ${errorData}`
        });
      }
    } catch (error) {
      console.error("Error updating bus:", error);
      setStatusMessage({
        type: "danger",
        message: "Network error. Please check your connection and try again."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading bus details...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={10} className="mx-auto">
          <Card className="shadow">
            <Card.Header className="bg-warning text-dark">
              <h4 className="mb-0">✏️ Edit Bus Details</h4>
              <small>Update information for {formData.registrationNumber}</small>
            </Card.Header>
            <Card.Body>
              {statusMessage.message && (
                <Alert variant={statusMessage.type} className="mb-4">
                  {statusMessage.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <h5 className="text-primary mb-3">📋 Basic Information</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Registration Number *</Form.Label>
                      <Form.Control
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="e.g., MH-01-AB-1234"
                        isInvalid={!!errors.registrationNumber}
                        style={{ textTransform: 'uppercase' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.registrationNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bus Type *</Form.Label>
                      <Form.Select
                        name="busType"
                        value={formData.busType}
                        onChange={handleChange}
                      >
                        {busTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Make *</Form.Label>
                      <Form.Control
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                        placeholder="e.g., Tata, Ashok Leyland"
                        isInvalid={!!errors.make}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.make}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Model *</Form.Label>
                      <Form.Control
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="e.g., Starbus, Viking"
                        isInvalid={!!errors.model}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.model}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year *</Form.Label>
                      <Form.Control
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        isInvalid={!!errors.year}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.year}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Capacity Information */}
                <h5 className="text-primary mb-3 mt-4">👥 Capacity Information</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Seating Capacity</Form.Label>
                      <Form.Control
                        type="number"
                        name="seatingCapacity"
                        value={formData.seatingCapacity}
                        onChange={handleChange}
                        min="0"
                        placeholder="Number of seats"
                        isInvalid={!!errors.seatingCapacity}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.seatingCapacity}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sleeper Capacity</Form.Label>
                      <Form.Control
                        type="number"
                        name="sleeperCapacity"
                        value={formData.sleeperCapacity}
                        onChange={handleChange}
                        min="0"
                        placeholder="Number of sleeper berths"
                        isInvalid={!!errors.sleeperCapacity}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.sleeperCapacity}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {errors.capacity && (
                  <Alert variant="danger" className="mb-3">
                    {errors.capacity}
                  </Alert>
                )}

                <div className="mb-3 p-2 bg-light rounded">
                  <strong>Total Capacity: {formData.seatingCapacity + formData.sleeperCapacity} passengers</strong>
                </div>

                {/* Features & Status */}
                <h5 className="text-primary mb-3 mt-4">⚙️ Features & Status</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Features</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="features"
                        value={formData.features}
                        onChange={handleChange}
                        placeholder="e.g., AC, GPS, WiFi, Entertainment System, Reclining Seats"
                      />
                      <Form.Text className="text-muted">
                        List the key features of this bus
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        {busStatuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Current Odometer (KM)</Form.Label>
                      <Form.Control
                        type="number"
                        name="currentOdometer"
                        value={formData.currentOdometer}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        placeholder="Current odometer reading"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Pricing Information */}
                <h5 className="text-primary mb-3 mt-4">💰 Default Pricing</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Default Per Day Rent (₹) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="defaultPerDayRent"
                        value={formData.defaultPerDayRent}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="Default daily rent"
                        isInvalid={!!errors.defaultPerDayRent}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.defaultPerDayRent}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        This will be the default rate for bookings
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Default Mountain Rent (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        name="defaultMountainRent"
                        value={formData.defaultMountainRent}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="Additional mountain terrain rent"
                      />
                      <Form.Text className="text-muted">
                        Additional charge for mountain/difficult terrain
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Driver Information */}
                <h5 className="text-primary mb-3 mt-4">👨‍✈️ Driver Information</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Assigned Driver</Form.Label>
                      <Form.Control
                        type="text"
                        name="assignedDriver"
                        value={formData.assignedDriver}
                        onChange={handleChange}
                        placeholder="Driver name (optional)"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Driver Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="driverPhone"
                        value={formData.driverPhone}
                        onChange={handleChange}
                        placeholder="Driver contact number"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Additional Notes */}
                <h5 className="text-primary mb-3 mt-4">📝 Additional Information</h5>
                <Form.Group className="mb-4">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional notes about this bus (maintenance history, special requirements, etc.)"
                  />
                </Form.Group>
                <div className="text-center mt-4">
                  <Button
                    variant="outline-secondary"
                    className="me-2"
                    onClick={() => navigate('/admin')}
                  >
                    ← Admin Dashboard
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => navigate(`/admin/bus-fleet/${id}`)}
                  >
                    ← View Details
                  </Button>
                  <Button
                    variant="secondary"
                    className="me-3"
                    onClick={() => navigate('/admin/bus-fleet')}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="warning"
                    type="submit"
                    disabled={saving}
                    className="px-4"
                  >
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      "💾 Update Bus"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BusEdit;
