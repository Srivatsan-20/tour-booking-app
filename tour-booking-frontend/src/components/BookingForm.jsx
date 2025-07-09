import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { generateBookingPDF } from "../utils/pdfGenerator";
import { generateSimpleBookingPDF } from "../utils/simplePdfGenerator";

const BookingForm = () => {
  const initialState = {
    customerName: "",
    phone: "",
    email: "",
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropLocation: "",
    numberOfPassengers: 1,
    busType: "AC Sleeper",
    numberOfBuses: 1,
    placesToCover: "",
    preferredRoute: "",
    specialRequirements: "",
    paymentMode: "Online",
    language: "English",
    perDayRent: "",
    mountainRent: "",
    hasMountainRent: false,
    advancePaid: "",
    totalRent: "",
    useIndividualBusRates: false,
    busRents: [],
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

    // Validate rent configuration
    if (!formData.useIndividualBusRates) {
      // Uniform rates validation
      if (!formData.perDayRent || formData.perDayRent <= 0) newErrors.perDayRent = "Per day rent is required and must be greater than 0.";
      if (formData.hasMountainRent && (!formData.mountainRent || formData.mountainRent <= 0)) {
        newErrors.mountainRent = "Mountain rent is required when mountain rent is enabled.";
      }
    } else {
      // Individual rates validation
      if (!formData.busRents || formData.busRents.length === 0) {
        newErrors.busRents = "Bus rent configuration is required.";
      } else {
        formData.busRents.forEach((bus, index) => {
          if (!bus.perDayRent || bus.perDayRent <= 0) {
            newErrors[`busRent_${index}`] = `Per day rent is required for ${bus.busNumber}.`;
          }
        });
      }
    }

    if (!formData.advancePaid || formData.advancePaid < 0) newErrors.advancePaid = "Advance paid is required and cannot be negative.";
    return newErrors;
  };

  // Initialize bus rent configurations
  const initializeBusRents = (numberOfBuses) => {
    const busRents = [];
    for (let i = 0; i < numberOfBuses; i++) {
      busRents.push({
        busNumber: `Bus ${i + 1}`,
        busType: formData.busType || "AC Sleeper",
        perDayRent: "",
        mountainRent: "",
        hasMountainRent: false
      });
    }
    return busRents;
  };

  // Calculate total rent automatically
  const calculateTotalRent = (data = formData) => {
    const numberOfDays = data.startDate && data.endDate
      ? Math.max(1, Math.ceil((new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24)) + 1)
      : 1;

    if (data.useIndividualBusRates && data.busRents && data.busRents.length > 0) {
      // Calculate using individual bus rates
      return data.busRents.reduce((total, bus) => {
        const busPerDayRent = parseFloat(bus.perDayRent) || 0;
        const busMountainRent = bus.hasMountainRent ? (parseFloat(bus.mountainRent) || 0) : 0;
        return total + (busPerDayRent * numberOfDays) + busMountainRent;
      }, 0);
    } else {
      // Calculate using uniform rates
      const perDayRent = parseFloat(data.perDayRent) || 0;
      const mountainRent = data.hasMountainRent ? (parseFloat(data.mountainRent) || 0) : 0;
      const numberOfBuses = parseInt(data.numberOfBuses) || 1;

      return (numberOfBuses * perDayRent * numberOfDays) + (numberOfBuses * mountainRent);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    const updatedData = { ...formData, [name]: newValue };

    // Handle special cases
    if (name === 'numberOfBuses') {
      // Initialize bus rents when number of buses changes
      if (updatedData.useIndividualBusRates) {
        updatedData.busRents = initializeBusRents(parseInt(value) || 1);
      }
    } else if (name === 'useIndividualBusRates') {
      // Initialize bus rents when switching to individual rates
      if (checked) {
        updatedData.busRents = initializeBusRents(parseInt(updatedData.numberOfBuses) || 1);
      } else {
        updatedData.busRents = [];
      }
    }

    // Auto-calculate total rent when relevant fields change
    if (['startDate', 'endDate', 'numberOfBuses', 'perDayRent', 'mountainRent', 'hasMountainRent', 'useIndividualBusRates'].includes(name)) {
      updatedData.totalRent = calculateTotalRent(updatedData);
    }

    setFormData(updatedData);
    setErrors({ ...errors, [name]: "" });
  };

  // Handle individual bus rent changes
  const handleBusRentChange = (busIndex, field, value) => {
    const updatedBusRents = [...formData.busRents];
    if (field === 'hasMountainRent') {
      updatedBusRents[busIndex][field] = value;
      if (!value) {
        updatedBusRents[busIndex].mountainRent = "";
      }
    } else {
      updatedBusRents[busIndex][field] = value;
    }

    const updatedData = { ...formData, busRents: updatedBusRents };
    updatedData.totalRent = calculateTotalRent(updatedData);

    setFormData(updatedData);
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
      // Prepare data for submission
      const submissionData = {
        ...formData,
        numberOfPassengers: parseInt(formData.numberOfPassengers) || 1,
        numberOfBuses: parseInt(formData.numberOfBuses) || 1,
        perDayRent: parseFloat(formData.perDayRent) || 0,
        mountainRent: formData.hasMountainRent ? (parseFloat(formData.mountainRent) || 0) : null,
        advancePaid: parseFloat(formData.advancePaid) || 0,
        totalRent: parseFloat(formData.totalRent) || 0,
        useIndividualBusRates: formData.useIndividualBusRates,
      };

      // Prepare individual bus rent data if using individual rates
      if (formData.useIndividualBusRates && formData.busRents) {
        submissionData.busRents = formData.busRents.map(bus => ({
          busNumber: bus.busNumber,
          busType: bus.busType,
          perDayRent: parseFloat(bus.perDayRent) || 0,
          mountainRent: bus.hasMountainRent ? (parseFloat(bus.mountainRent) || 0) : null
        }));
      }

      // Remove frontend-only fields
      delete submissionData.hasMountainRent;

      const response = await fetch("http://localhost:5050/api/Bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const result = await response.json();

        // Generate beautiful PDF
        try {
          generateBookingPDF(submissionData, result.id);
          setStatusMessage({
            type: "success",
            message: `🎉 Booking confirmed! Reference ID: ${result.id}. Beautiful PDF confirmation has been downloaded automatically.`
          });
        } catch (pdfError) {
          console.error("Advanced PDF generation error:", pdfError);

          // Try simple PDF as fallback
          try {
            generateSimpleBookingPDF(submissionData, result.id);
            setStatusMessage({
              type: "success",
              message: `✅ Booking confirmed! Reference ID: ${result.id}. PDF confirmation has been downloaded.`
            });
          } catch (simplePdfError) {
            console.error("Simple PDF generation error:", simplePdfError);
            setStatusMessage({
              type: "success",
              message: `✅ Booking confirmed! Reference ID: ${result.id}. (PDF generation failed, but booking is successful)`
            });
          }
        }

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

        {/* Detailed Rent Calculation */}
        <div className="border rounded p-3 mb-4 bg-light">
          <h5 className="mb-3 text-primary">💰 Rent Calculation</h5>

          {/* Rent Configuration Type */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  name="useIndividualBusRates"
                  checked={formData.useIndividualBusRates}
                  onChange={handleChange}
                  label="🚌 Use different rent rates for each bus"
                  className="mb-2"
                />
                <small className="text-muted">
                  {formData.useIndividualBusRates
                    ? "You can set individual rent rates for each bus"
                    : "Same rent rate will be applied to all buses"}
                </small>
              </Form.Group>
            </Col>
          </Row>

          {!formData.useIndividualBusRates ? (
            // Uniform rent rates for all buses
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Per Day Rent (₹ per bus) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="perDayRent"
                      value={formData.perDayRent}
                      onChange={handleChange}
                      placeholder="Enter rent per bus per day"
                      min="0"
                      step="0.01"
                      isInvalid={!!errors.perDayRent}
                    />
                    <Form.Control.Feedback type="invalid">{errors.perDayRent}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="hasMountainRent"
                      checked={formData.hasMountainRent}
                      onChange={handleChange}
                      label="Include Mountain Rent"
                      className="mb-2"
                    />
                    {formData.hasMountainRent && (
                      <Form.Control
                        type="number"
                        name="mountainRent"
                        value={formData.mountainRent}
                        onChange={handleChange}
                        placeholder="Enter mountain rent per bus"
                        min="0"
                        step="0.01"
                        isInvalid={!!errors.mountainRent}
                      />
                    )}
                    <Form.Control.Feedback type="invalid">{errors.mountainRent}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  {/* Calculation Summary */}
                  <div className="bg-white border rounded p-3">
                    <h6 className="mb-2">📊 Calculation Summary</h6>
                    <small className="text-muted">
                      <div>Number of Days: {formData.startDate && formData.endDate
                        ? Math.max(1, Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1)
                        : 'Select dates'}</div>
                      <div>Number of Buses: {formData.numberOfBuses}</div>
                      <div>Per Day Rent: ₹{formData.perDayRent || 0}</div>
                      {formData.hasMountainRent && <div>Mountain Rent: ₹{formData.mountainRent || 0}</div>}
                      <hr className="my-2" />
                      <div><strong>Total Rent: ₹{formData.totalRent || 0}</strong></div>
                      <div><strong>Advance Paid: ₹{formData.advancePaid || 0}</strong></div>
                      <div className="text-primary"><strong>Balance: ₹{(parseFloat(formData.totalRent) || 0) - (parseFloat(formData.advancePaid) || 0)}</strong></div>
                    </small>
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            // Individual rent rates for each bus
            <div>
              <h6 className="mb-3 text-info">🚌 Individual Bus Rent Configuration</h6>
              {formData.busRents.map((bus, index) => (
                <div key={index} className="border rounded p-3 mb-3 bg-white">
                  <h6 className="mb-2 text-primary">{bus.busNumber}</h6>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Bus Type</Form.Label>
                        <Form.Select
                          value={bus.busType}
                          onChange={(e) => handleBusRentChange(index, 'busType', e.target.value)}
                        >
                          <option>AC Sleeper</option>
                          <option>Non-AC Sleeper</option>
                          <option>AC Seater</option>
                          <option>Non-AC Seater</option>
                          <option>Luxury</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Per Day Rent (₹) *</Form.Label>
                        <Form.Control
                          type="number"
                          value={bus.perDayRent}
                          onChange={(e) => handleBusRentChange(index, 'perDayRent', e.target.value)}
                          placeholder="Enter per day rent"
                          min="0"
                          step="0.01"
                          isInvalid={!!errors[`busRent_${index}`]}
                        />
                        <Form.Control.Feedback type="invalid">{errors[`busRent_${index}`]}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          checked={bus.hasMountainRent}
                          onChange={(e) => handleBusRentChange(index, 'hasMountainRent', e.target.checked)}
                          label="Mountain Rent"
                          className="mb-2"
                        />
                        {bus.hasMountainRent && (
                          <Form.Control
                            type="number"
                            value={bus.mountainRent}
                            onChange={(e) => handleBusRentChange(index, 'mountainRent', e.target.value)}
                            placeholder="Enter mountain rent"
                            min="0"
                            step="0.01"
                          />
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-muted small">
                    <strong>Bus Total:</strong> ₹{
                      ((parseFloat(bus.perDayRent) || 0) *
                        (formData.startDate && formData.endDate
                          ? Math.max(1, Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1)
                          : 1)) +
                      (bus.hasMountainRent ? (parseFloat(bus.mountainRent) || 0) : 0)
                    }
                  </div>
                </div>
              ))}

              {/* Overall Summary for Individual Rates */}
              <div className="bg-info text-white rounded p-3">
                <h6 className="mb-2">📊 Overall Summary</h6>
                <div>Number of Days: {formData.startDate && formData.endDate
                  ? Math.max(1, Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1)
                  : 'Select dates'}</div>
                <div>Number of Buses: {formData.numberOfBuses}</div>
                <hr className="my-2" />
                <div><strong>Total Rent: ₹{formData.totalRent || 0}</strong></div>
                <div><strong>Advance Paid: ₹{formData.advancePaid || 0}</strong></div>
                <div><strong>Balance: ₹{(parseFloat(formData.totalRent) || 0) - (parseFloat(formData.advancePaid) || 0)}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Advance Paid - Always visible */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Advance Paid (₹) *</Form.Label>
              <Form.Control
                type="number"
                name="advancePaid"
                value={formData.advancePaid}
                onChange={handleChange}
                placeholder="Enter advance amount paid"
                min="0"
                step="0.01"
                isInvalid={!!errors.advancePaid}
              />
              <Form.Control.Feedback type="invalid">{errors.advancePaid}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            {/* Final Balance Display */}
            <div className="bg-success text-white rounded p-3">
              <h6 className="mb-2">💰 Final Summary</h6>
              <div><strong>Total Rent: ₹{formData.totalRent || 0}</strong></div>
              <div><strong>Advance Paid: ₹{formData.advancePaid || 0}</strong></div>
              <div><strong>Balance to Pay: ₹{(parseFloat(formData.totalRent) || 0) - (parseFloat(formData.advancePaid) || 0)}</strong></div>
            </div>
          </Col>
        </Row>

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
    </Container >
  );
};

export default BookingForm;
