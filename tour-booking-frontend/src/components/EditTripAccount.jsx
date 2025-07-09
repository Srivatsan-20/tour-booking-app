import React from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditTripAccount = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <h2 className="text-center mb-4 text-primary">✏️ Edit Trip Account</h2>
      
      <Button variant="secondary" className="mb-3" onClick={() => navigate("/admin/trip-accounts")}>
        ⬅️ Back to Trip Accounts
      </Button>

      <Alert variant="info">
        <h5>🚧 Coming Soon!</h5>
        <p>The Edit Trip Account feature is currently under development.</p>
        <p><strong>Trip Account ID:</strong> {id}</p>
        <p>This will allow you to:</p>
        <ul>
          <li>Modify fuel entries (add, edit, delete)</li>
          <li>Update other expenses</li>
          <li>Change driver batta amount</li>
          <li>Update number of days</li>
        </ul>
        <Button variant="primary" onClick={() => navigate(`/admin/trip-accounts/${id}`)}>
          👁️ View Trip Account Details
        </Button>
      </Alert>
    </Container>
  );
};

export default EditTripAccount;
