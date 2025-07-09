import React, { useState, useEffect } from "react";
import { Container, Card, Table, Spinner, Alert, Button, Badge, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const TripAccountDetail = () => {
  const [tripAccount, setTripAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTripAccount = async () => {
      try {
        console.log("Fetching trip account detail for ID:", id);

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
              console.log("Fetched trip account details:", detailData);
              setTripAccount(detailData);
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

  const getProfitLossVariant = (profitOrLoss) => {
    if (profitOrLoss > 0) return "success";
    if (profitOrLoss < 0) return "danger";
    return "secondary";
  };

  const getProfitLossText = (profitOrLoss) => {
    if (profitOrLoss > 0) return `+₹${profitOrLoss.toFixed(2)} Profit`;
    if (profitOrLoss < 0) return `-₹${Math.abs(profitOrLoss).toFixed(2)} Loss`;
    return `₹${profitOrLoss.toFixed(2)} Break Even`;
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Loading trip account details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate("/admin/trip-accounts")}>
          ⬅️ Back to Trip Accounts
        </Button>
      </Container>
    );
  }

  if (!tripAccount) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Trip account not found</Alert>
        <Button variant="secondary" onClick={() => navigate("/admin/trip-accounts")}>
          ⬅️ Back to Trip Accounts
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">💰 Trip Account Details</h2>
        <div>
          <Button variant="secondary" className="me-2" onClick={() => navigate("/admin/trip-accounts")}>
            ⬅️ Back to List
          </Button>
          <Button variant="warning" onClick={() => navigate(`/admin/trip-accounts/${id}/edit`)}>
            ✏️ Edit Account
          </Button>
        </div>
      </div>

      {/* Booking Information */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">🚌 Booking Information</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Customer:</strong> {tripAccount.booking.customerName}</p>
              <p><strong>Start Date:</strong> {new Date(tripAccount.booking.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(tripAccount.booking.endDate).toLocaleDateString()}</p>
            </Col>
            <Col md={6}>
              <p><strong>Total Rent:</strong> ₹{(tripAccount.booking.totalRent || 0).toFixed(2)}</p>
              <p><strong>Total Driver Batta:</strong> ₹{(tripAccount.totalDriverBatta || 0).toFixed(2)}</p>
              <p><strong>Number of Buses:</strong> {tripAccount.booking.numberOfBuses || tripAccount.totalBuses || 1}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Financial Summary */}
      <Card className="mb-4">
        <Card.Header className="bg-info text-white">
          <h5 className="mb-0">💰 Financial Summary</h5>
        </Card.Header>
        <Card.Body>
          <Table bordered>
            <tbody>
              <tr>
                <td><strong>Total Revenue:</strong></td>
                <td className="text-end">₹{(tripAccount.booking.totalRent || 0).toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Total Fuel Cost:</strong></td>
                <td className="text-end">₹{tripAccount.totalFuelCost.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Total Other Expenses:</strong></td>
                <td className="text-end">₹{tripAccount.totalOtherExpenses.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Total Driver Batta:</strong></td>
                <td className="text-end">₹{(tripAccount.totalDriverBatta || 0).toFixed(2)}</td>
              </tr>
              <tr className="table-warning">
                <td><strong>Total Expenses:</strong></td>
                <td className="text-end"><strong>₹{tripAccount.totalExpenses.toFixed(2)}</strong></td>
              </tr>
              <tr className={tripAccount.profitOrLoss >= 0 ? "table-success" : "table-danger"}>
                <td><strong>Net Profit/Loss:</strong></td>
                <td className="text-end">
                  <Badge bg={getProfitLossVariant(tripAccount.profitOrLoss)} className="fs-6">
                    {getProfitLossText(tripAccount.profitOrLoss)}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Bus-wise Details */}
      {tripAccount.busExpenses && tripAccount.busExpenses.map((bus, busIndex) => (
        <Card key={bus.id} className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">🚌 {bus.busNumber} Details</h5>
          </Card.Header>
          <Card.Body>
            {/* Bus Summary */}
            <Row className="mb-3">
              <Col md={6}>
                <p><strong>Driver Batta:</strong> ₹{bus.driverBatta.toFixed(2)}</p>
                <p><strong>Number of Days:</strong> {bus.numberOfDays}</p>
              </Col>
              <Col md={6}>
                <p><strong>Total Bus Expenses:</strong> ₹{bus.totalBusExpenses.toFixed(2)}</p>
                {bus.startingOdometer && bus.endingOdometer && (
                  <>
                    <p><strong>Distance Traveled:</strong> {bus.totalDistance?.toFixed(2) || 'N/A'} KM</p>
                    <p><strong>Fuel Efficiency:</strong> {bus.fuelEfficiency?.toFixed(2) || 'N/A'} KM/L</p>
                  </>
                )}
              </Col>
            </Row>

            {/* Mileage Details */}
            {(bus.startingOdometer || bus.endingOdometer) && (
              <Card className="mb-3">
                <Card.Header className="bg-info text-white">
                  <h6 className="mb-0">📊 Mileage Tracking</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3}>
                      <p><strong>Starting Odometer:</strong><br />{bus.startingOdometer?.toFixed(2) || 'N/A'} KM</p>
                    </Col>
                    <Col md={3}>
                      <p><strong>Ending Odometer:</strong><br />{bus.endingOdometer?.toFixed(2) || 'N/A'} KM</p>
                    </Col>
                    <Col md={3}>
                      <p><strong>Distance Traveled:</strong><br />{bus.totalDistance?.toFixed(2) || 'N/A'} KM</p>
                    </Col>
                    <Col md={3}>
                      <p><strong>Fuel Efficiency:</strong><br />{bus.fuelEfficiency?.toFixed(2) || 'N/A'} KM/L</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Fuel Entries for this bus */}
            <Card className="mb-3">
              <Card.Header className="bg-warning text-dark">
                <h6 className="mb-0">⛽ Fuel Entries ({bus.fuelEntries.length})</h6>
              </Card.Header>
              <Card.Body>
                {bus.fuelEntries.length === 0 ? (
                  <Alert variant="info">No fuel entries recorded for this bus</Alert>
                ) : (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th>Liters</th>
                        <th>Cost</th>
                        <th>Rate per Liter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bus.fuelEntries.map((entry) => (
                        <tr key={entry.id}>
                          <td>{entry.location}</td>
                          <td>{entry.liters} L</td>
                          <td>₹{entry.cost.toFixed(2)}</td>
                          <td>₹{(entry.cost / entry.liters).toFixed(2)}/L</td>
                        </tr>
                      ))}
                      <tr className="table-secondary">
                        <td><strong>Total</strong></td>
                        <td><strong>{bus.fuelEntries.reduce((sum, entry) => sum + entry.liters, 0)} L</strong></td>
                        <td><strong>₹{bus.totalFuelCost.toFixed(2)}</strong></td>
                        <td>-</td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>

            {/* Other Expenses for this bus */}
            <Card className="mb-3">
              <Card.Header className="bg-secondary text-white">
                <h6 className="mb-0">💸 Other Expenses ({bus.otherExpenses.length})</h6>
              </Card.Header>
              <Card.Body>
                {bus.otherExpenses.length === 0 ? (
                  <Alert variant="info">No other expenses recorded for this bus</Alert>
                ) : (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bus.otherExpenses.map((expense) => (
                        <tr key={expense.id}>
                          <td>{expense.description}</td>
                          <td>₹{expense.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="table-secondary">
                        <td><strong>Total</strong></td>
                        <td><strong>₹{bus.totalOtherExpenses.toFixed(2)}</strong></td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      ))}


    </Container>
  );
};

export default TripAccountDetail;
