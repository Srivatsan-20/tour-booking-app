import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { generateBookingPDF } from '../utils/pdfGenerator';
import { generateSimpleBookingPDF } from '../utils/simplePdfGenerator';

const PDFPreview = () => {
  const sampleBookingData = {
    customerName: "John Doe",
    phone: "+91-9876543210",
    email: "john.doe@example.com",
    startDate: "2025-07-15",
    endDate: "2025-07-20",
    pickupLocation: "Mumbai Central Station",
    dropLocation: "Goa Beach Resort",
    numberOfPassengers: 25,
    numberOfBuses: 2,
    busType: "AC Sleeper",
    placesToCover: "Mumbai, Pune, Goa, Beaches, Temples",
    preferredRoute: "Mumbai-Pune-Goa Highway",
    specialRequirements: "Wheelchair accessible bus required",
    paymentMode: "Online",
    language: "English",
    useIndividualBusRates: true,
    perDayRent: 3000,
    mountainRent: 500,
    totalRent: 44500,
    advancePaid: 15000,
    busRents: [
      {
        busNumber: "Bus 1",
        busType: "AC Sleeper",
        perDayRent: 3500,
        mountainRent: 500
      },
      {
        busNumber: "Bus 2",
        busType: "Luxury",
        perDayRent: 4000,
        mountainRent: 800
      }
    ]
  };

  const handleGenerateSamplePDF = () => {
    try {
      generateBookingPDF(sampleBookingData, "SAMPLE123");
    } catch (error) {
      console.error('Advanced PDF failed, trying simple version:', error);
      generateSimpleBookingPDF(sampleBookingData, "SAMPLE123");
    }
  };

  const handleGenerateSimplePDF = () => {
    generateSimpleBookingPDF(sampleBookingData, "SIMPLE123");
  };

  return (
    <Container className="mt-5 p-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">📄 PDF Preview & Test</h4>
            </Card.Header>
            <Card.Body>
              <h5 className="text-primary mb-3">Beautiful PDF Features:</h5>

              <Row className="mb-4">
                <Col md={6}>
                  <div className="border rounded p-3 h-100">
                    <h6 className="text-success">🎨 Design Features</h6>
                    <ul className="list-unstyled">
                      <li>✅ Professional header with company branding</li>
                      <li>✅ Color-coded sections for easy reading</li>
                      <li>✅ Organized information layout</li>
                      <li>✅ Beautiful typography and spacing</li>
                      <li>✅ Contact information footer</li>
                    </ul>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border rounded p-3 h-100">
                    <h6 className="text-info">📊 Content Sections</h6>
                    <ul className="list-unstyled">
                      <li>👤 Customer Information</li>
                      <li>🗓️ Trip Details & Itinerary</li>
                      <li>🚌 Bus Configuration</li>
                      <li>💰 Detailed Pricing Breakdown</li>
                      <li>💳 Payment Summary</li>
                      <li>📋 Terms & Conditions</li>
                    </ul>
                  </div>
                </Col>
              </Row>

              <div className="border rounded p-3 mb-4 bg-light">
                <h6 className="text-warning">🚀 Smart Features</h6>
                <Row>
                  <Col md={6}>
                    <ul className="list-unstyled mb-0">
                      <li>📱 Supports both uniform & individual bus rates</li>
                      <li>🧮 Automatic calculations and totals</li>
                      <li>📅 Dynamic date formatting</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <ul className="list-unstyled mb-0">
                      <li>💼 Professional business layout</li>
                      <li>🎯 Clear payment status indicators</li>
                      <li>📄 Auto-download after booking</li>
                    </ul>
                  </Col>
                </Row>
              </div>

              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGenerateSamplePDF}
                  className="px-4 me-3"
                >
                  🎉 Generate Beautiful PDF
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={handleGenerateSimplePDF}
                  className="px-4"
                >
                  📄 Generate Simple PDF
                </Button>
                <p className="text-muted mt-2 small">
                  Click to download sample PDFs with demo data
                </p>
              </div>

              <div className="mt-4 p-3 bg-info text-white rounded">
                <h6 className="mb-2">📋 How it works:</h6>
                <ol className="mb-0">
                  <li>Customer fills out the booking form</li>
                  <li>Upon successful submission, PDF is automatically generated</li>
                  <li>PDF downloads immediately to customer's device</li>
                  <li>Admin can also generate PDFs from the dashboard</li>
                </ol>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PDFPreview;
