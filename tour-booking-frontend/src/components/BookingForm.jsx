import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
  const initialState = {
    customerName: "",
    phone: "",
    email: "",
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropLocation: "",
    busType: "AC Sleeper",
    numberOfBuses: 1,
    placesToCover: "",
    preferredRoute: "",
    specialRequirements: "",
    paymentMode: "Online",
    language: "English",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Customer name is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.startDate) newErrors.startDate = "Start date is required.";
    if (!formData.endDate) newErrors.endDate = "End date is required.";
    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = "Pickup location is required.";
    if (!formData.dropLocation.trim()) newErrors.dropLocation = "Drop location is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrors({});

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setErrors({ endDate: "End Date must be after Start Date." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5050/api/Bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setStatusMessage({ type: "success", message: `Booking submitted! Reference ID: ${result.id}` });
        setFormData(initialState);
      } else {
        const errorText = await response.text();
        setStatusMessage({ type: "error", message: `Booking failed: ${errorText}` });
      }
    } catch (error) {
      setStatusMessage({ type: "error", message: `Submission error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <h2 className="text-center mb-4 text-primary">🚌 Tour Booking Form</h2>

      <div className="text-end mb-3">
        <Button variant="secondary" onClick={() => navigate("/")}>
          ⬅️ Back to Home
        </Button>
      </div>

      {statusMessage && (
        <Alert variant={statusMessage.type === "success" ? "success" : "danger"} className="text-center">
          {statusMessage.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name *</Form.Label>
              <Form.Control name="customerName" value={formData.customerName} onChange={handleChange} isInvalid={!!errors.customerName} />
              <Form.Control.Feedback type="invalid">{errors.customerName}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Phone *</Form.Label>
              <Form.Control name="phone" value={formData.phone} onChange={handleChange} isInvalid={!!errors.phone} />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date *</Form.Label>
              <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleChange} isInvalid={!!errors.startDate} />
              <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>End Date *</Form.Label>
              <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} isInvalid={!!errors.endDate} />
              <Form.Control.Feedback type="invalid">{errors.endDate}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Pickup Location *</Form.Label>
              <Form.Control name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} isInvalid={!!errors.pickupLocation} />
              <Form.Control.Feedback type="invalid">{errors.pickupLocation}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Drop Location *</Form.Label>
              <Form.Control name="dropLocation" value={formData.dropLocation} onChange={handleChange} isInvalid={!!errors.dropLocation} />
              <Form.Control.Feedback type="invalid">{errors.dropLocation}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Bus Type</Form.Label>
              <Form.Select name="busType" value={formData.busType} onChange={handleChange}>
                <option>AC Sleeper</option>
                <option>Non-AC Sleeper</option>
                <option>Mini Bus</option>
                <option>Luxury Coach</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Number of Buses</Form.Label>
              <Form.Control type="number" name="numberOfBuses" value={formData.numberOfBuses} onChange={handleChange} min="1" />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Places to Cover</Form.Label>
          <Form.Control as="textarea" rows={2} name="placesToCover" value={formData.placesToCover} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Preferred Route</Form.Label>
          <Form.Control as="textarea" rows={2} name="preferredRoute" value={formData.preferredRoute} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Special Requirements</Form.Label>
          <Form.Control as="textarea" rows={2} name="specialRequirements" value={formData.specialRequirements} onChange={handleChange} />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Payment Mode</Form.Label>
              <Form.Select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
                <option>Online</option>
                <option>UPI</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Select name="language" value={formData.language} onChange={handleChange}>
                <option>English</option>
                <option>Tamil</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? (<><Spinner animation="border" size="sm" className="me-2" />Submitting...</>) : "Submit Booking"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default BookingForm;
