import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Modal, Alert, Badge } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DriverExpenseManagement = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newExpense, setNewExpense] = useState({
    type: 'fuel',
    description: '',
    amount: '',
    location: '',
    liters: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTripAndExpenses();
  }, [tripId]);

  const fetchTripAndExpenses = async () => {
    try {
      // Mock data - in production, fetch from API
      const mockTrip = {
        id: parseInt(tripId),
        bookingId: 29,
        busRegistration: 'MH-01-AB-1234',
        customerName: 'jaina',
        route: 'Mumbai → Goa',
        status: 'in_progress'
      };

      const mockExpenses = [
        {
          id: 1,
          type: 'fuel',
          description: 'Mumbai Petrol Pump',
          location: 'Mumbai Central',
          amount: 2500,
          liters: 30,
          date: '2025-08-01',
          submittedBy: user?.name
        },
        {
          id: 2,
          type: 'toll',
          description: 'Highway Toll',
          location: 'Mumbai-Pune Highway',
          amount: 800,
          date: '2025-08-01',
          submittedBy: user?.name
        },
        {
          id: 3,
          type: 'food',
          description: 'Driver Meals',
          location: 'Pune',
          amount: 300,
          date: '2025-08-01',
          submittedBy: user?.name
        }
      ];

      setTrip(mockTrip);
      setExpenses(mockExpenses);
    } catch (err) {
      setError('Failed to fetch trip expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      liters: newExpense.liters ? parseFloat(newExpense.liters) : null,
      submittedBy: user?.name
    };

    setExpenses(prev => [...prev, expense]);
    setNewExpense({
      type: 'fuel',
      description: '',
      amount: '',
      location: '',
      liters: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
    alert('Expense added successfully!');
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setNewExpense({
      type: expense.type,
      description: expense.description,
      amount: expense.amount.toString(),
      location: expense.location || '',
      liters: expense.liters?.toString() || '',
      date: expense.date
    });
    setShowAddModal(true);
  };

  const handleUpdateExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedExpense = {
      ...editingExpense,
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      liters: newExpense.liters ? parseFloat(newExpense.liters) : null
    };

    setExpenses(prev => prev.map(exp => 
      exp.id === editingExpense.id ? updatedExpense : exp
    ));
    
    setEditingExpense(null);
    setNewExpense({
      type: 'fuel',
      description: '',
      amount: '',
      location: '',
      liters: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
    alert('Expense updated successfully!');
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
      alert('Expense deleted successfully!');
    }
  };

  const getExpenseTypeBadge = (type) => {
    const typeConfig = {
      fuel: { bg: 'primary', text: '⛽ Fuel' },
      toll: { bg: 'warning', text: '🛣️ Toll' },
      food: { bg: 'success', text: '🍽️ Food' },
      maintenance: { bg: 'danger', text: '🔧 Maintenance' },
      parking: { bg: 'info', text: '🅿️ Parking' },
      other: { bg: 'secondary', text: '📝 Other' }
    };
    
    const config = typeConfig[type] || typeConfig.other;
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const fuelExpenses = expenses.filter(e => e.type === 'fuel').reduce((sum, e) => sum + e.amount, 0);
  const otherExpenses = totalExpenses - fuelExpenses;

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading expenses...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-0">💸 Expense Management</h2>
          <p className="text-muted">Trip: {trip?.route} | Bus: {trip?.busRegistration}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate("/driver")}>
            ← Driver Dashboard
          </Button>
          <Button variant="outline-info" onClick={() => navigate(`/driver/trip/${tripId}`)}>
            👁️ Trip Details
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Expense Summary */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary">
            <Card.Body>
              <h4 className="text-primary">₹{totalExpenses.toLocaleString()}</h4>
              <small className="text-muted">Total Expenses</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h4 className="text-warning">₹{fuelExpenses.toLocaleString()}</h4>
              <small className="text-muted">Fuel Expenses</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
            <Card.Body>
              <h4 className="text-success">₹{otherExpenses.toLocaleString()}</h4>
              <small className="text-muted">Other Expenses</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info">
            <Card.Body>
              <h4 className="text-info">{expenses.length}</h4>
              <small className="text-muted">Total Entries</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Expense Button */}
      <div className="mb-4">
        <Button 
          variant="success" 
          onClick={() => setShowAddModal(true)}
        >
          ➕ Add New Expense
        </Button>
      </div>

      {/* Expenses Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">📋 Expense Entries</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {expenses.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">No expenses recorded yet.</p>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                Add Your First Expense
              </Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Amount</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{getExpenseTypeBadge(expense.type)}</td>
                    <td><strong>{expense.description}</strong></td>
                    <td>{expense.location || 'N/A'}</td>
                    <td>₹{expense.amount.toLocaleString()}</td>
                    <td>
                      {expense.type === 'fuel' && expense.liters && (
                        <small className="text-muted">{expense.liters}L</small>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditExpense(expense)}
                          title="Edit"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id)}
                          title="Delete"
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Expense Modal */}
      <Modal show={showAddModal} onHide={() => {
        setShowAddModal(false);
        setEditingExpense(null);
        setNewExpense({
          type: 'fuel',
          description: '',
          amount: '',
          location: '',
          liters: '',
          date: new Date().toISOString().split('T')[0]
        });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingExpense ? '✏️ Edit Expense' : '➕ Add New Expense'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expense Type</Form.Label>
                  <Form.Select
                    value={newExpense.type}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="fuel">⛽ Fuel</option>
                    <option value="toll">🛣️ Toll</option>
                    <option value="food">🍽️ Food</option>
                    <option value="maintenance">🔧 Maintenance</option>
                    <option value="parking">🅿️ Parking</option>
                    <option value="other">📝 Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter expense description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={newExpense.location}
                onChange={(e) => setNewExpense(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location (optional)"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              {newExpense.type === 'fuel' && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Liters</Form.Label>
                    <Form.Control
                      type="number"
                      value={newExpense.liters}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, liters: e.target.value }))}
                      placeholder="Enter liters"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>
              )}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={editingExpense ? handleUpdateExpense : handleAddExpense}
          >
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DriverExpenseManagement;
