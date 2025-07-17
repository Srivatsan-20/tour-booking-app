import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';

const CustomerDashboard: React.FC = () => {
  return (
    <div className="dashboard-page" style={{ paddingTop: '120px' }}>
      <Container>
        <Row>
          <Col>
            <h2 className="mb-4">My Dashboard</h2>
          </Col>
        </Row>
        
        <Row>
          <Col lg={4} className="mb-4">
            <Card>
              <Card.Body className="text-center">
                <h5>Total Bookings</h5>
                <h2 className="text-primary">5</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-4">
            <Card>
              <Card.Body className="text-center">
                <h5>Completed Trips</h5>
                <h2 className="text-success">3</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-4">
            <Card>
              <Card.Body className="text-center">
                <h5>Upcoming Trips</h5>
                <h2 className="text-warning">2</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Bookings</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Booking #</th>
                      <th>Route</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>BK123456</td>
                      <td>Chennai → Kanyakumari</td>
                      <td>2024-01-15</td>
                      <td><span className="badge bg-success">Completed</span></td>
                      <td><Button size="sm" variant="outline-primary">View</Button></td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CustomerDashboard;
