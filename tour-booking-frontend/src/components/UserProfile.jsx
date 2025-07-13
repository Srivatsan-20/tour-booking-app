import React, { useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    emergencyContact: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate save operation
    setTimeout(() => {
      alert('Profile updated successfully!');
      setSaving(false);
    }, 1000);
  };

  const getDashboardRoute = () => {
    if (hasRole('admin') || hasRole('manager')) return '/admin';
    if (hasRole('driver')) return '/driver';
    if (hasRole('customer')) return '/customer';
    return '/';
  };

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-0">👤 User Profile</h2>
          <p className="text-muted">Manage your account information</p>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate(getDashboardRoute())}>
          ← Dashboard
        </Button>
      </div>

      <Alert variant="info">
        <h5>🚧 Profile Management</h5>
        <p>This is a demo profile interface. In production, this would allow users to update their personal information.</p>
      </Alert>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Personal Information</h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Emergency Contact</Form.Label>
                  <Form.Control
                    type="tel"
                    value={profileData.emergencyContact}
                    onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    placeholder="Enter emergency contact"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={profileData.address}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your address"
              />
            </Form.Group>

            <div className="text-center">
              <Button 
                variant="primary" 
                onClick={handleSave}
                disabled={saving}
                className="px-4"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;
