import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  fallbackComponent = null 
}) => {
  const { user, isAuthenticated, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to sign in
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If specific role is required, check if user has it
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>
            You don't have permission to access this page. 
            Required role: <strong>{Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}</strong>
          </p>
          <p>Your current role: <strong>{user?.role}</strong></p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button 
              variant="outline-danger" 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // If specific permission is required, check if user has it
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          <Alert.Heading>Insufficient Permissions</Alert.Heading>
          <p>
            You don't have the required permission to access this feature.
            Required permission: <strong>{requiredPermission}</strong>
          </p>
          <p>Your current role: <strong>{user?.role}</strong></p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button 
              variant="outline-warning" 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // If fallback component is provided and user doesn't have access, show it
  if (fallbackComponent && requiredRole && !hasRole(requiredRole)) {
    return fallbackComponent;
  }

  // User has access, render the protected component
  return children;
};

export default ProtectedRoute;
