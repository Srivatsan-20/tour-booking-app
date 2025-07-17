import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddTripAccount = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bookingId: "",
    busExpenses: [
      {
        busNumber: "Bus 1",
        driverBatta: "",
        numberOfDays: "",
        startingOdometer: "",
        endingOdometer: "",
        fuelEntries: [{ location: "", liters: "", cost: "" }],
        otherExpenses: [{ description: "", amount: "" }]
      }
    ]
  });

  // Fetch bookings for dropdown
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("Fetching bookings from:", "http://localhost:5051/api/Bookings/Upcoming");
        const response = await fetch("http://localhost:5051/api/Bookings/Upcoming");
        console.log("Response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched bookings:", data);
          setBookings(data);
        } else {
          console.error("Failed to fetch bookings:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  // Handle booking selection
  const handleBookingChange = (e) => {
    e.preventDefault();
    console.log("Booking selection changed:", e.target.value);
    const bookingId = e.target.value;

    if (bookingId) {
      const booking = bookings.find(b => b.id === parseInt(bookingId));
      console.log("Selected booking:", booking);
      setSelectedBooking(booking);

      // Create bus expenses based on numberOfBuses
      const numberOfBuses = booking.numberOfBuses || 1;
      const busExpenses = [];

      for (let i = 0; i < numberOfBuses; i++) {
        busExpenses.push({
          busNumber: `Bus ${i + 1}`,
          driverBatta: "",
          numberOfDays: "",
          startingOdometer: "",
          endingOdometer: "",
          fuelEntries: [{ location: "", liters: "", cost: "" }],
          otherExpenses: [{ description: "", amount: "" }]
        });
      }

      setFormData({ bookingId, busExpenses });
    } else {
      setSelectedBooking(null);
      setFormData({
        bookingId: "",
        busExpenses: [
          {
            busNumber: "Bus 1",
            driverBatta: "",
            numberOfDays: "",
            fuelEntries: [{ location: "", liters: "", cost: "" }],
            otherExpenses: [{ description: "", amount: "" }]
          }
        ]
      });
    }
  };

  // Handle bus field changes (driver batta, number of days)
  const handleBusFieldChange = (busIndex, field, value) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex][field] = value;
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Handle fuel entry changes
  const handleFuelEntryChange = (busIndex, entryIndex, field, value) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex].fuelEntries[entryIndex][field] = value;
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Add new fuel entry for specific bus
  const addFuelEntry = (busIndex) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex].fuelEntries.push({ location: "", liters: "", cost: "" });
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Remove fuel entry for specific bus
  const removeFuelEntry = (busIndex, entryIndex) => {
    const updatedBusExpenses = [...formData.busExpenses];
    if (updatedBusExpenses[busIndex].fuelEntries.length > 1) {
      updatedBusExpenses[busIndex].fuelEntries.splice(entryIndex, 1);
      setFormData({ ...formData, busExpenses: updatedBusExpenses });
    }
  };

  // Handle other expense changes
  const handleOtherExpenseChange = (busIndex, expenseIndex, field, value) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex].otherExpenses[expenseIndex][field] = value;
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Add new other expense for specific bus
  const addOtherExpense = (busIndex) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex].otherExpenses.push({ description: "", amount: "" });
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Remove other expense for specific bus
  const removeOtherExpense = (busIndex, expenseIndex) => {
    const updatedBusExpenses = [...formData.busExpenses];
    if (updatedBusExpenses[busIndex].otherExpenses.length > 1) {
      updatedBusExpenses[busIndex].otherExpenses.splice(expenseIndex, 1);
      setFormData({ ...formData, busExpenses: updatedBusExpenses });
    }
  };

  // Calculate totals for all buses
  const calculateTotalExpenses = () => {
    return formData.busExpenses.reduce((total, bus) => {
      const busDriverBatta = parseFloat(bus.driverBatta) || 0;
      const busFuelCost = bus.fuelEntries.reduce((fuelTotal, entry) => {
        return fuelTotal + (parseFloat(entry.cost) || 0);
      }, 0);
      const busOtherCost = bus.otherExpenses.reduce((otherTotal, expense) => {
        return otherTotal + (parseFloat(expense.amount) || 0);
      }, 0);
      return total + busDriverBatta + busFuelCost + busOtherCost;
    }, 0);
  };

  const calculateProfitOrLoss = () => {
    if (!selectedBooking) return 0;
    const totalRent = selectedBooking.totalRent || 0;
    const totalExpenses = calculateTotalExpenses();
    return totalRent - totalExpenses;
  };

  // Calculate totals for a specific bus
  const calculateBusTotal = (busIndex) => {
    const bus = formData.busExpenses[busIndex];
    const driverBatta = parseFloat(bus.driverBatta) || 0;
    const fuelCost = bus.fuelEntries.reduce((total, entry) => {
      return total + (parseFloat(entry.cost) || 0);
    }, 0);
    const otherCost = bus.otherExpenses.reduce((total, expense) => {
      return total + (parseFloat(expense.amount) || 0);
    }, 0);
    return driverBatta + fuelCost + otherCost;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setLoading(true);

    try {
      // Prepare data for API using new multi-bus format
      const submitData = {
        bookingId: parseInt(formData.bookingId),
        busExpenses: formData.busExpenses.map(bus => ({
          busNumber: bus.busNumber,
          driverBatta: parseFloat(bus.driverBatta) || 0,
          numberOfDays: parseInt(bus.numberOfDays) || 0,
          startingOdometer: bus.startingOdometer ? parseFloat(bus.startingOdometer) : null,
          endingOdometer: bus.endingOdometer ? parseFloat(bus.endingOdometer) : null,
          fuelEntries: bus.fuelEntries
            .filter(entry => entry.location && entry.liters && entry.cost)
            .map(entry => ({
              location: entry.location,
              liters: parseFloat(entry.liters),
              cost: parseFloat(entry.cost)
            })),
          otherExpenses: bus.otherExpenses
            .filter(expense => expense.description && expense.amount)
            .map(expense => ({
              description: expense.description,
              amount: parseFloat(expense.amount)
            }))
        }))
      };

      const response = await fetch("http://localhost:5050/api/TripExpenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const result = await response.json();
        setStatusMessage({
          type: "success",
          message: `Trip account created successfully! ID: ${result.id}`
        });

        // Reset form
        setFormData({
          bookingId: "",
          busExpenses: [
            {
              busNumber: "Bus 1",
              driverBatta: "",
              numberOfDays: "",
              startingOdometer: "",
              endingOdometer: "",
              fuelEntries: [{ location: "", liters: "", cost: "" }],
              otherExpenses: [{ description: "", amount: "" }]
            }
          ]
        });
        setSelectedBooking(null);
      } else {
        const errorText = await response.text();
        setStatusMessage({ type: "error", message: `Error: ${errorText}` });
      }
    } catch (error) {
      setStatusMessage({ type: "error", message: `Submission error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <h2 className="text-center mb-4 text-primary">💰 Add Trip Account</h2>

      <Button variant="secondary" className="mb-3" onClick={() => navigate("/admin")}>
        ⬅️ Back to Dashboard
      </Button>

      {statusMessage && (
        <Alert variant={statusMessage.type === "success" ? "success" : "danger"} className="mb-4">
          {statusMessage.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Booking Selection */}
        <Card className="mb-4">
          <Card.Header><strong>Select Tour</strong></Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tour Booking *</Form.Label>
              <Form.Select
                name="bookingId"
                value={formData.bookingId}
                onChange={handleBookingChange}
                required
              >
                <option value="">Select a tour...</option>
                {bookings.map(booking => (
                  <option key={booking.id} value={booking.id}>
                    {booking.customerName} - {new Date(booking.startDate).toLocaleDateString()}
                    (₹{booking.totalRent || 0})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {selectedBooking && (
              <Alert variant="info">
                <strong>Selected Tour:</strong> {selectedBooking.customerName}<br />
                <strong>Dates:</strong> {new Date(selectedBooking.startDate).toLocaleDateString()} to {new Date(selectedBooking.endDate).toLocaleDateString()}<br />
                <strong>Route:</strong> {selectedBooking.pickupLocation} → {selectedBooking.dropLocation}<br />
                <strong>Total Rent:</strong> ₹{selectedBooking.totalRent || 0}<br />
                <strong>Number of Buses:</strong> {selectedBooking.numberOfBuses || 1}
              </Alert>
            )}
          </Card.Body>
        </Card>

        {/* Multi-Bus Expenses */}
        {formData.busExpenses.map((bus, busIndex) => (
          <Card key={busIndex} className="mb-4">
            <Card.Header>
              <strong>{bus.busNumber} - Expenses</strong>
              <small className="text-muted ms-2">
                (Total: ₹{calculateBusTotal(busIndex).toFixed(2)})
              </small>
            </Card.Header>
            <Card.Body>
              {/* Bus Driver Details */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Driver Batta (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      value={bus.driverBatta}
                      onChange={(e) => handleBusFieldChange(busIndex, "driverBatta", e.target.value)}
                      placeholder="Enter driver batta amount"
                      min="0"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Number of Days</Form.Label>
                    <Form.Control
                      type="number"
                      value={bus.numberOfDays}
                      onChange={(e) => handleBusFieldChange(busIndex, "numberOfDays", e.target.value)}
                      placeholder="Enter number of days"
                      min="1"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Mileage Tracking */}
              <Row className="mb-3">
                <h6 className="mb-2">Mileage Tracking</h6>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Starting Odometer (KM)</Form.Label>
                    <Form.Control
                      type="number"
                      value={bus.startingOdometer}
                      onChange={(e) => handleBusFieldChange(busIndex, "startingOdometer", e.target.value)}
                      placeholder="Enter starting odometer reading"
                      min="0"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ending Odometer (KM)</Form.Label>
                    <Form.Control
                      type="number"
                      value={bus.endingOdometer}
                      onChange={(e) => handleBusFieldChange(busIndex, "endingOdometer", e.target.value)}
                      placeholder="Enter ending odometer reading"
                      min="0"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>
                {bus.startingOdometer && bus.endingOdometer && parseFloat(bus.endingOdometer) > parseFloat(bus.startingOdometer) && (
                  <div className="mb-2 text-success">
                    <small>
                      <strong>Distance Traveled:</strong> {(parseFloat(bus.endingOdometer) - parseFloat(bus.startingOdometer)).toFixed(2)} KM
                      {bus.fuelEntries.reduce((total, entry) => total + (parseFloat(entry.liters) || 0), 0) > 0 && (
                        <span> | <strong>Fuel Efficiency:</strong> {((parseFloat(bus.endingOdometer) - parseFloat(bus.startingOdometer)) / bus.fuelEntries.reduce((total, entry) => total + (parseFloat(entry.liters) || 0), 0)).toFixed(2)} KM/L</span>
                      )}
                    </small>
                  </div>
                )}
              </Row>

              {/* Fuel Entries for this bus */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Fuel Entries</h6>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => addFuelEntry(busIndex)}
                  >
                    + Add Fuel Entry
                  </Button>
                </div>
                {bus.fuelEntries.map((entry, entryIndex) => (
                  <Row key={entryIndex} className="mb-3 align-items-end">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          value={entry.location}
                          onChange={(e) => handleFuelEntryChange(busIndex, entryIndex, "location", e.target.value)}
                          placeholder="Enter location"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Liters</Form.Label>
                        <Form.Control
                          type="number"
                          value={entry.liters}
                          onChange={(e) => handleFuelEntryChange(busIndex, entryIndex, "liters", e.target.value)}
                          placeholder="Enter liters"
                          min="0"
                          step="0.01"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Cost (₹)</Form.Label>
                        <Form.Control
                          type="number"
                          value={entry.cost}
                          onChange={(e) => handleFuelEntryChange(busIndex, entryIndex, "cost", e.target.value)}
                          placeholder="Enter cost"
                          min="0"
                          step="0.01"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeFuelEntry(busIndex, entryIndex)}
                        disabled={bus.fuelEntries.length === 1}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
              </div>

              {/* Other Expenses for this bus */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Other Expenses</h6>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => addOtherExpense(busIndex)}
                  >
                    + Add Other Expense
                  </Button>
                </div>
                {bus.otherExpenses.map((expense, expenseIndex) => (
                  <Row key={expenseIndex} className="mb-3 align-items-end">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          value={expense.description}
                          onChange={(e) => handleOtherExpenseChange(busIndex, expenseIndex, "description", e.target.value)}
                          placeholder="Enter expense description"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Amount (₹)</Form.Label>
                        <Form.Control
                          type="number"
                          value={expense.amount}
                          onChange={(e) => handleOtherExpenseChange(busIndex, expenseIndex, "amount", e.target.value)}
                          placeholder="Enter amount"
                          min="0"
                          step="0.01"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeOtherExpense(busIndex, expenseIndex)}
                        disabled={bus.otherExpenses.length === 1}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
              </div>
            </Card.Body>
          </Card>
        ))}



        {/* Multi-Bus Financial Summary */}
        <Card className="mb-4 bg-light">
          <Card.Header><strong>💰 Financial Summary - All Buses</strong></Card.Header>
          <Card.Body>
            {/* Bus-wise breakdown */}
            {formData.busExpenses.map((bus, busIndex) => (
              <div key={busIndex} className="mb-3">
                <h6 className="text-primary">{bus.busNumber}</h6>
                <Table size="sm" bordered>
                  <tbody>
                    <tr>
                      <td>Driver Batta:</td>
                      <td className="text-end">₹{(parseFloat(bus.driverBatta) || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Fuel Cost:</td>
                      <td className="text-end">₹{bus.fuelEntries.reduce((total, entry) => total + (parseFloat(entry.cost) || 0), 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Other Expenses:</td>
                      <td className="text-end">₹{bus.otherExpenses.reduce((total, expense) => total + (parseFloat(expense.amount) || 0), 0).toFixed(2)}</td>
                    </tr>
                    {bus.startingOdometer && bus.endingOdometer && parseFloat(bus.endingOdometer) > parseFloat(bus.startingOdometer) && (
                      <>
                        <tr>
                          <td>Distance Traveled:</td>
                          <td className="text-end">{(parseFloat(bus.endingOdometer) - parseFloat(bus.startingOdometer)).toFixed(2)} KM</td>
                        </tr>
                        {bus.fuelEntries.reduce((total, entry) => total + (parseFloat(entry.liters) || 0), 0) > 0 && (
                          <tr>
                            <td>Fuel Efficiency:</td>
                            <td className="text-end">{((parseFloat(bus.endingOdometer) - parseFloat(bus.startingOdometer)) / bus.fuelEntries.reduce((total, entry) => total + (parseFloat(entry.liters) || 0), 0)).toFixed(2)} KM/L</td>
                          </tr>
                        )}
                      </>
                    )}
                    <tr className="table-info">
                      <td><strong>Bus Total:</strong></td>
                      <td className="text-end"><strong>₹{calculateBusTotal(busIndex).toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            ))}

            {/* Overall totals */}
            <Table bordered>
              <tbody>
                <tr className="table-warning">
                  <td><strong>Total Expenses (All Buses):</strong></td>
                  <td className="text-end"><strong>₹{calculateTotalExpenses().toFixed(2)}</strong></td>
                </tr>
                {selectedBooking && (
                  <>
                    <tr>
                      <td><strong>Total Rent:</strong></td>
                      <td className="text-end">₹{(selectedBooking.totalRent || 0).toFixed(2)}</td>
                    </tr>
                    <tr className={calculateProfitOrLoss() >= 0 ? "table-success" : "table-danger"}>
                      <td><strong>Profit/Loss:</strong></td>
                      <td className="text-end">
                        <strong>
                          {calculateProfitOrLoss() >= 0 ? "+" : ""}₹{calculateProfitOrLoss().toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || !formData.bookingId}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creating Trip Account...
              </>
            ) : (
              "Create Trip Account"
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddTripAccount;
