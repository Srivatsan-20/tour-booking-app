import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const { user, roles } = useAuth();
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    name: '',
    role: 'customer',
    password: '',
    phone: '',
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('🔄 Fetching users from API...');
      const response = await fetch('http://localhost:5050/api/Users');

      if (response.ok) {
        const usersData = await response.json();
        console.log('✅ Fetched users:', usersData.length, usersData);
        setUsers(usersData);
      } else {
        console.error('❌ Failed to fetch users:', response.status);
        // Fallback to mock data if API fails
        const mockUsers = [
          {
            id: 1,
            username: 'admin',
            email: 'admin@tourbooking.com',
            name: 'System Administrator',
            role: 'admin',
            status: 'active',
            lastLogin: '2025-07-10T10:30:00',
            createdAt: '2025-01-01T00:00:00'
          },
          {
            id: 2,
            username: 'manager',
            email: 'manager@tourbooking.com',
            name: 'Operations Manager',
            role: 'manager',
            status: 'active',
            lastLogin: '2025-07-09T15:45:00',
            createdAt: '2025-01-15T00:00:00'
          }
        ];
        setUsers(mockUsers);
      }
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      // Fallback to empty array
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { bg: 'danger', text: 'Admin' },
      manager: { bg: 'warning', text: 'Manager' },
      driver: { bg: 'info', text: 'Driver' },
      customer: { bg: 'success', text: 'Customer' }
    };

    const config = roleConfig[role] || { bg: 'secondary', text: 'Unknown' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getStatusBadge = (status) => {
    return (
      <Badge bg={status === 'active' ? 'success' : 'secondary'}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.name || !newUser.password) {
      alert('Please fill in all required fields (username, email, name, password)');
      return;
    }

    try {
      console.log('🔄 Creating user:', newUser);
      const response = await fetch('http://localhost:5050/api/Users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          password: newUser.password,
          phone: newUser.phone,
          status: newUser.status,
          notes: newUser.notes
        })
      });

      if (response.ok) {
        const createdUser = await response.json();
        console.log('✅ User created:', createdUser);

        // Refresh the users list
        await fetchUsers();

        // Reset form
        setNewUser({
          username: '',
          email: '',
          name: '',
          role: 'customer',
          password: '',
          phone: '',
          status: 'active'
        });
        setShowAddModal(false);
        alert('User created successfully!');
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to create user:', response.status, errorText);
        alert(`Failed to create user: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error creating user:', error);
      alert('Error creating user. Please try again.');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      password: '',
      phone: user.phone || '',
      status: user.status
    });
    setShowAddModal(true);
  };

  const handleUpdateUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.name) {
      alert('Please fill in all required fields (username, email, name)');
      return;
    }

    try {
      console.log('🔄 Updating user:', editingUser.id, newUser);
      const response = await fetch(`http://localhost:5050/api/Users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          password: newUser.password || undefined, // Only send password if provided
          phone: newUser.phone,
          status: newUser.status,
          notes: newUser.notes
        })
      });

      if (response.ok) {
        console.log('✅ User updated successfully');

        // Refresh the users list
        await fetchUsers();

        // Reset form
        setEditingUser(null);
        setNewUser({
          username: '',
          email: '',
          name: '',
          role: 'customer',
          password: '',
          phone: '',
          status: 'active'
        });
        setShowAddModal(false);
        alert('User updated successfully!');
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to update user:', response.status, errorText);
        alert(`Failed to update user: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error updating user:', error);
      alert('Error updating user. Please try again.');
    }
  };

  const handleToggleStatus = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newStatus = user.status === 'active' ? 'inactive' : 'active';

    try {
      console.log(`🔄 Toggling user ${userId} status to ${newStatus}`);
      const response = await fetch(`http://localhost:5050/api/Users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          status: newStatus,
          notes: user.notes
        })
      });

      if (response.ok) {
        console.log('✅ User status updated');
        await fetchUsers(); // Refresh the list
        alert('User status updated!');
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to update user status:', response.status, errorText);
        alert(`Failed to update user status: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error updating user status:', error);
      alert('Error updating user status. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        console.log(`🔄 Deleting user ${userId}`);
        const response = await fetch(`http://localhost:5050/api/Users/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          console.log('✅ User deleted');
          await fetchUsers(); // Refresh the list
          alert('User deleted successfully!');
        } else {
          const errorText = await response.text();
          console.error('❌ Failed to delete user:', response.status, errorText);
          alert(`Failed to delete user: ${errorText}`);
        }
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    managers: users.filter(u => u.role === 'manager').length,
    drivers: users.filter(u => u.role === 'driver').length,
    customers: users.filter(u => u.role === 'customer').length
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading users...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-0">👥 User Management</h2>
          <p className="text-muted">Manage system users and their roles</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate("/admin")}>
            ← Admin Dashboard
          </Button>
          <Button variant="success" onClick={() => setShowAddModal(true)}>
            ➕ Add User
          </Button>
        </div>
      </div>

      {/* User Statistics */}
      <Row className="mb-4">
        <Col md={2}>
          <Card className="text-center border-primary">
            <Card.Body>
              <h4 className="text-primary">{userStats.total}</h4>
              <small className="text-muted">Total Users</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-success">
            <Card.Body>
              <h4 className="text-success">{userStats.active}</h4>
              <small className="text-muted">Active</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-danger">
            <Card.Body>
              <h4 className="text-danger">{userStats.admins}</h4>
              <small className="text-muted">Admins</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h4 className="text-warning">{userStats.managers}</h4>
              <small className="text-muted">Managers</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-info">
            <Card.Body>
              <h4 className="text-info">{userStats.drivers}</h4>
              <small className="text-muted">Drivers</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-secondary">
            <Card.Body>
              <h4 className="text-secondary">{userStats.customers}</h4>
              <small className="text-muted">Customers</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Users Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">👤 System Users</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div>
                      <strong>{user.name}</strong>
                      <br />
                      <small className="text-muted">{user.email}</small>
                      <br />
                      <small className="text-muted">@{user.username}</small>
                    </div>
                  </td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : 'Never'
                    }
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        ✏️
                      </Button>
                      <Button
                        variant={user.status === 'active' ? 'outline-warning' : 'outline-success'}
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? '⏸️' : '▶️'}
                      </Button>
                      {user.id !== 1 && ( // Don't allow deleting main admin
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          🗑️
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal show={showAddModal} onHide={() => {
        setShowAddModal(false);
        setEditingUser(null);
        setNewUser({
          username: '',
          email: '',
          name: '',
          role: 'customer',
          password: '',
          phone: '',
          status: 'active'
        });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? '✏️ Edit User' : '➕ Add New User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="customer">Customer</option>
                    <option value="driver">Driver</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={newUser.status}
                    onChange={(e) => setNewUser(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password {!editingUser && '*'}</Form.Label>
                  <Form.Control
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={editingUser ? handleUpdateUser : handleAddUser}
          >
            {editingUser ? 'Update User' : 'Create User'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminUserManagement;
