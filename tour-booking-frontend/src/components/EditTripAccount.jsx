import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner, Card, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditTripAccount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tripAccount, setTripAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const [formData, setFormData] = useState({
    bookingId: "",
    busExpenses: []
  });

  // Fetch trip account details
  useEffect(() => {
    const fetchTripAccount = async () => {
      try {
        console.log("Fetching trip account for editing, ID:", id);

        // First get all trip accounts to find the booking ID
        const listResponse = await fetch("http://localhost:5050/api/TripExpenses");
        if (listResponse.ok) {
          const allTrips = await listResponse.json();
          const trip = allTrips.find(t => t.id === parseInt(id));

          if (trip) {
            // Now get detailed trip account by booking ID
            const detailResponse = await fetch(`http://localhost:5050/api/TripExpenses/ByBooking/${trip.bookingId}`);
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              console.log("Fetched trip account for editing:", detailData);
              setTripAccount(detailData);

              // Convert to form format
              const busExpenses = detailData.busExpenses.map(bus => ({
                id: bus.id,
                busNumber: bus.busNumber,
                driverBatta: bus.driverBatta.toString(),
                numberOfDays: bus.numberOfDays.toString(),
                startingOdometer: bus.startingOdometer?.toString() || "",
                endingOdometer: bus.endingOdometer?.toString() || "",
                fuelEntries: bus.fuelEntries.length > 0
                  ? bus.fuelEntries.map(fuel => ({
                    id: fuel.id,
                    location: fuel.location,
                    liters: fuel.liters.toString(),
                    cost: fuel.cost.toString()
                  }))
                  : [{ location: "", liters: "", cost: "" }],
                otherExpenses: bus.otherExpenses.length > 0
                  ? bus.otherExpenses.map(expense => ({
                    id: expense.id,
                    description: expense.description,
                    amount: expense.amount.toString()
                  }))
                  : [{ description: "", amount: "" }]
              }));

              setFormData({
                bookingId: detailData.bookingId.toString(),
                busExpenses: busExpenses
              });
            } else {
              setError("Failed to fetch trip account details");
            }
          } else {
            setError("Trip account not found");
          }
        } else {
          setError("Failed to fetch trip accounts list");
        }
      } catch (err) {
        console.error("Error fetching trip account:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTripAccount();
  }, [id]);

  // Handle form field changes
  const handleBusFieldChange = (busIndex, field, value) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex][field] = value;
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Handle fuel entry changes
  const handleFuelEntryChange = (busIndex, fuelIndex, field, value) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex].fuelEntries[fuelIndex][field] = value;
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Handle other expense changes
  const handleOtherExpenseChange = (busIndex, expenseIndex, field, value) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex].otherExpenses[expenseIndex][field] = value;
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Add fuel entry
  const addFuelEntry = (busIndex) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex].fuelEntries.push({ location: "", liters: "", cost: "" });
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Remove fuel entry
  const removeFuelEntry = (busIndex, fuelIndex) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex].fuelEntries.splice(fuelIndex, 1);
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Add other expense
  const addOtherExpense = (busIndex) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex].otherExpenses.push({ description: "", amount: "" });
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Remove other expense
  const removeOtherExpense = (busIndex, expenseIndex) => {
    const updatedBusExpenses = [...formData.busExpenses];
    updatedBusExpenses[busIndex].otherExpenses.splice(expenseIndex, 1);
    setFormData({ ...formData, busExpenses: updatedBusExpenses });
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);

    try {
      // Prepare data for API
      const updateData = {
        bookingId: parseInt(formData.bookingId),
        busExpenses: formData.busExpenses.map(bus => ({
          id: bus.id,
          busNumber: bus.busNumber,
          driverBatta: parseFloat(bus.driverBatta) || 0,
          numberOfDays: parseInt(bus.numberOfDays) || 0,
          startingOdometer: bus.startingOdometer ? parseFloat(bus.startingOdometer) : null,
          endingOdometer: bus.endingOdometer ? parseFloat(bus.endingOdometer) : null,
          fuelEntries: bus.fuelEntries
            .filter(fuel => fuel.location || fuel.liters || fuel.cost)
            .map(fuel => ({
              id: fuel.id,
              location: fuel.location || "",
              liters: parseFloat(fuel.liters) || 0,
              cost: parseFloat(fuel.cost) || 0
            })),
          otherExpenses: bus.otherExpenses
            .filter(expense => expense.description || expense.amount)
            .map(expense => ({
              id: expense.id,
              description: expense.description || "",
              amount: parseFloat(expense.amount) || 0
            }))
        }))
      };

      console.log("Updating trip account with data:", updateData);

      const response = await fetch(`http://localhost:5050/api/TripExpenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setStatusMessage({
          type: "success",
          message: "🎉 Trip account updated successfully!"
        });

        // Navigate back to details page after a short delay
        setTimeout(() => {
          navigate(`/admin/trip-accounts/${id}`);
        }, 2000);
      } else {
        const errorText = await response.text();
        setStatusMessage({
          type: "danger",
          message: `Failed to update trip account: ${errorText}`
        });
      }
    } catch (error) {
      console.error("Error updating trip account:", error);
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
        <p className="mt-2">Loading trip account details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 p-4 border rounded shadow bg-light">
        <Alert variant="danger">
          <h5>Error Loading Trip Account</h5>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/admin/trip-accounts')}>
            ← Back to Trip Accounts
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-0">✏️ Edit Trip Account</h2>
          <p className="text-muted">Modify expenses for {tripAccount?.customerName}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate("/admin")}>
            ← Admin Dashboard
          </Button>
          <Button variant="outline-primary" onClick={() => navigate("/admin/trip-accounts")}>
            ← Trip Accounts
          </Button>
          <Button variant="outline-info" onClick={() => navigate(`/admin/trip-accounts/${id}`)}>
            👁️ View Details
          </Button>
        </div>
      </div>

      {statusMessage && (
        <Alert variant={statusMessage.type} className="mb-4">
          {statusMessage.message}
        </Alert>
      )}

      {/* Trip Information */}
      {tripAccount && (
        <Card className="mb-4">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">📋 Trip Information</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <strong>Customer:</strong> {tripAccount.customerName}
              </Col>
              <Col md={3}>
                <strong>Route:</strong> {tripAccount.pickupLocation} → {tripAccount.dropLocation}
              </Col>
              <Col md={3}>
                <strong>Dates:</strong> {new Date(tripAccount.startDate).toLocaleDateString()} - {new Date(tripAccount.endDate).toLocaleDateString()}
              </Col>
              <Col md={3}>
                <strong>Total Rent:</strong> ₹{tripAccount.totalRent?.toLocaleString()}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Form>
        {/* Bus Expenses */}
        {formData.busExpenses.map((bus, busIndex) => (
          <Card key={busIndex} className="mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">🚌 {bus.busNumber} Expenses</h5>
            </Card.Header>
            <Card.Body>
              {/* Basic Bus Information */}
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Driver Batta (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      value={bus.driverBatta}
                      onChange={(e) => handleBusFieldChange(busIndex, "driverBatta", e.target.value)}
                      placeholder="Enter driver batta"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Number of Days</Form.Label>
                    <Form.Control
                      type="number"
                      value={bus.numberOfDays}
                      onChange={(e) => handleBusFieldChange(busIndex, "numberOfDays", e.target.value)}
                      placeholder="Enter number of days"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Starting Odometer (KM)</Form.Label>
                    <Form.Control
                      type="number"
                      value={bus.startingOdometer}
                      onChange={(e) => handleBusFieldChange(busIndex, "startingOdometer", e.target.value)}
                      placeholder="Starting KM"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Ending Odometer (KM)</Form.Label>
                    <Form.Control
                      type="number"
                      value={bus.endingOdometer}
                      onChange={(e) => handleBusFieldChange(busIndex, "endingOdometer", e.target.value)}
                      placeholder="Ending KM"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Fuel Entries */}
              <h6 className="text-success mb-3">⛽ Fuel Entries</h6>
              {bus.fuelEntries.map((fuel, fuelIndex) => (
                <Row key={fuelIndex} className="mb-2 align-items-end">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        value={fuel.location}
                        onChange={(e) => handleFuelEntryChange(busIndex, fuelIndex, "location", e.target.value)}
                        placeholder="Fuel station location"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Liters</Form.Label>
                      <Form.Control
                        type="number"
                        value={fuel.liters}
                        onChange={(e) => handleFuelEntryChange(busIndex, fuelIndex, "liters", e.target.value)}
                        placeholder="Liters"
                        step="0.01"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Cost (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        value={fuel.cost}
                        onChange={(e) => handleFuelEntryChange(busIndex, fuelIndex, "cost", e.target.value)}
                        placeholder="Total cost"
                        step="0.01"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <div className="d-flex gap-1">
                      {fuelIndex === bus.fuelEntries.length - 1 && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => addFuelEntry(busIndex)}
                          title="Add fuel entry"
                        >
                          ➕
                        </Button>
                      )}
                      {bus.fuelEntries.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFuelEntry(busIndex, fuelIndex)}
                          title="Remove fuel entry"
                        >
                          ➖
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              ))}

              {/* Other Expenses */}
              <h6 className="text-warning mb-3 mt-4">💸 Other Expenses</h6>
              {bus.otherExpenses.map((expense, expenseIndex) => (
                <Row key={expenseIndex} className="mb-2 align-items-end">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        value={expense.description}
                        onChange={(e) => handleOtherExpenseChange(busIndex, expenseIndex, "description", e.target.value)}
                        placeholder="Expense description"
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
                        placeholder="Amount"
                        step="0.01"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <div className="d-flex gap-1">
                      {expenseIndex === bus.otherExpenses.length - 1 && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => addOtherExpense(busIndex)}
                          title="Add other expense"
                        >
                          ➕
                        </Button>
                      )}
                      {bus.otherExpenses.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeOtherExpense(busIndex, expenseIndex)}
                          title="Remove other expense"
                        >
                          ➖
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              ))}

              {/* Bus Summary */}
              <div className="mt-4 p-3 bg-light rounded">
                <Row>
                  <Col md={3}>
                    <strong>Total Distance:</strong> {
                      bus.startingOdometer && bus.endingOdometer
                        ? `${(parseFloat(bus.endingOdometer) - parseFloat(bus.startingOdometer)).toFixed(1)} KM`
                        : 'N/A'
                    }
                  </Col>
                  <Col md={3}>
                    <strong>Total Fuel Cost:</strong> ₹{
                      bus.fuelEntries
                        .filter(f => f.cost)
                        .reduce((sum, f) => sum + parseFloat(f.cost || 0), 0)
                        .toFixed(2)
                    }
                  </Col>
                  <Col md={3}>
                    <strong>Total Other Expenses:</strong> ₹{
                      bus.otherExpenses
                        .filter(e => e.amount)
                        .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
                        .toFixed(2)
                    }
                  </Col>
                  <Col md={3}>
                    <strong>Bus Total:</strong> ₹{
                      (parseFloat(bus.driverBatta || 0) +
                        bus.fuelEntries.filter(f => f.cost).reduce((sum, f) => sum + parseFloat(f.cost || 0), 0) +
                        bus.otherExpenses.filter(e => e.amount).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
                      ).toFixed(2)
                    }
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        ))}

        {/* Action Buttons */}
        <div className="text-center mt-4">
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={() => navigate("/admin")}
          >
            ← Admin Dashboard
          </Button>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => navigate(`/admin/trip-accounts/${id}`)}
          >
            👁️ View Details
          </Button>
          <Button
            variant="secondary"
            className="me-3"
            onClick={() => navigate("/admin/trip-accounts")}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            disabled={saving}
            onClick={handleSave}
            className="px-4"
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              "💾 Save Changes"
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditTripAccount;
