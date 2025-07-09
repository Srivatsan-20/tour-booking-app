import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Button, Badge, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TripAccountsList = () => {
  const [tripAccounts, setTripAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripAccounts = async () => {
      try {
        const startTime = performance.now();
        console.log("Fetching trip accounts from:", "http://localhost:5050/api/TripExpenses");
        const response = await fetch("http://localhost:5050/api/TripExpenses");
        const fetchTime = performance.now() - startTime;
        console.log(`Response status: ${response.status}, Fetch time: ${fetchTime.toFixed(2)}ms`);

        if (response.ok) {
          const data = await response.json();
          const totalTime = performance.now() - startTime;
          console.log(`Fetched trip accounts: ${data.length} records in ${totalTime.toFixed(2)}ms`);
          setTripAccounts(data);
        } else {
          const errorText = await response.text();
          console.error("API Error:", response.status, errorText);
          setError(`Failed to fetch trip accounts: ${response.status} ${errorText}`);
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTripAccounts();
  }, []);

  const getProfitLossVariant = (profitOrLoss) => {
    if (profitOrLoss > 0) return "success";
    if (profitOrLoss < 0) return "danger";
    return "secondary";
  };

  const getProfitLossText = (profitOrLoss) => {
    if (profitOrLoss > 0) return `+₹${profitOrLoss.toFixed(2)}`;
    if (profitOrLoss < 0) return `-₹${Math.abs(profitOrLoss).toFixed(2)}`;
    return `₹${profitOrLoss.toFixed(2)}`;
  };

  const calculateSummary = () => {
    const totalRent = tripAccounts.reduce((sum, account) => sum + (account.totalRent || 0), 0);
    const totalExpenses = tripAccounts.reduce((sum, account) => sum + account.totalExpenses, 0);
    const totalProfit = tripAccounts.reduce((sum, account) => sum + account.profitOrLoss, 0);
    const profitableTrips = tripAccounts.filter(account => account.profitOrLoss > 0).length;
    const lossTrips = tripAccounts.filter(account => account.profitOrLoss < 0).length;

    return { totalRent, totalExpenses, totalProfit, profitableTrips, lossTrips };
  };

  const summary = calculateSummary();

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <h2 className="text-center mb-4 text-primary">💰 Trip Accounts Management</h2>

      <div className="d-flex justify-content-between mb-4">
        <Button variant="secondary" onClick={() => navigate("/admin")}>
          ⬅️ Back to Dashboard
        </Button>
        <Button variant="success" onClick={() => navigate("/admin/trip-accounts/add")}>
          ➕ Add New Trip Account
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-2">
          <Card className="text-center">
            <Card.Body>
              <h6>Total Trips</h6>
              <h4 className="text-primary">{tripAccounts.length}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-2">
          <Card className="text-center">
            <Card.Body>
              <h6>Total Revenue</h6>
              <h4 className="text-info">₹{summary.totalRent.toFixed(2)}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-2">
          <Card className="text-center">
            <Card.Body>
              <h6>Total Expenses</h6>
              <h4 className="text-warning">₹{summary.totalExpenses.toFixed(2)}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-2">
          <Card className="text-center">
            <Card.Body>
              <h6>Net Profit</h6>
              <h4 className={summary.totalProfit >= 0 ? "text-success" : "text-danger"}>
                {getProfitLossText(summary.totalProfit)}
              </h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-2">
          <Card className="text-center">
            <Card.Body>
              <h6>Profitable</h6>
              <h4 className="text-success">{summary.profitableTrips}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-2">
          <Card className="text-center">
            <Card.Body>
              <h6>Loss Making</h6>
              <h4 className="text-danger">{summary.lossTrips}</h4>
            </Card.Body>
          </Card>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading trip accounts...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : tripAccounts.length === 0 ? (
        <Alert variant="info">
          No trip accounts found. <Button variant="link" onClick={() => navigate("/admin/trip-accounts/add")}>Create your first trip account</Button>
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Customer</th>
              <th>Dates</th>
              <th>Revenue</th>
              <th>Expenses</th>
              <th>Profit/Loss</th>
              <th>Fuel Entries</th>
              <th>Other Expenses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tripAccounts.map((account) => (
              <tr key={account.id}>
                <td>
                  <strong>{account.customerName}</strong>
                </td>
                <td>
                  <small>
                    {new Date(account.startDate).toLocaleDateString()} - {new Date(account.endDate).toLocaleDateString()}
                  </small>
                </td>
                <td>₹{(account.totalRent || 0).toFixed(2)}</td>
                <td>₹{account.totalExpenses.toFixed(2)}</td>
                <td>
                  <Badge bg={getProfitLossVariant(account.profitOrLoss)}>
                    {getProfitLossText(account.profitOrLoss)}
                  </Badge>
                </td>
                <td className="text-center">
                  <Badge bg="info">{account.fuelEntriesCount}</Badge>
                </td>
                <td className="text-center">
                  <Badge bg="warning">{account.otherExpensesCount}</Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/admin/trip-accounts/${account.id}`)}
                  >
                    👁️ View
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => navigate(`/admin/trip-accounts/${account.id}/edit`)}
                  >
                    ✏️ Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default TripAccountsList;
