import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`https://localhost:7040/api/Bookings/${id}`);
        if (!res.ok) throw new Error("Failed to fetch tour");
        const data = await res.json();
        setTour(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const exportToPDF = () => {
    if (!tour) return;

    const doc = new jsPDF();
    const logoImage = new Image();
    logoImage.src = logo;
    logoImage.onload = () => {
      doc.addImage(logoImage, "PNG", 10, 10, 30, 30);
      doc.setFontSize(16);
      doc.text("Sri Sai Senthil Tours & Travels", 45, 20);
      doc.setFontSize(12);
      doc.text("Tour Booking Details", 45, 28);

      let y = 50;
      doc.setFontSize(11);
      doc.text(`Customer Name: ${tour.customerName}`, 10, y); y += 6;
      doc.text(`Phone: ${tour.phone}`, 10, y); y += 6;
      doc.text(`Email: ${tour.email}`, 10, y); y += 6;
      doc.text(`Start Date: ${new Date(tour.startDate).toLocaleDateString()}`, 10, y); y += 6;
      doc.text(`End Date: ${new Date(tour.endDate).toLocaleDateString()}`, 10, y); y += 6;
      doc.text(`Pickup: ${tour.pickupLocation}`, 10, y); y += 6;
      doc.text(`Drop: ${tour.dropLocation}`, 10, y); y += 6;
      doc.text(`Bus Type: ${tour.busType}`, 10, y); y += 6;
      doc.text(`Number of Buses: ${tour.numberOfBuses}`, 10, y); y += 6;
      doc.text(`Places to Cover: ${tour.placesToCover}`, 10, y); y += 6;
      doc.text(`Preferred Route: ${tour.preferredRoute}`, 10, y); y += 6;
      doc.text(`Special Requirements: ${tour.specialRequirements}`, 10, y); y += 6;
      doc.text(`Payment Mode: ${tour.paymentMode}`, 10, y); y += 6;
      doc.text(`Language: ${tour.language}`, 10, y); y += 10;

      const rentPerBus = tour.rentPerBus || 0;
      const totalRent = rentPerBus * (tour.numberOfBuses || 0);
      const advance = tour.advance || 0;
      const balance = totalRent - advance;

      doc.text(`Rent Per Bus: ₹${rentPerBus}`, 10, y); y += 6;
      doc.text(`Total Rent: ₹${totalRent}`, 10, y); y += 6;
      doc.text(`Advance Paid: ₹${advance}`, 10, y); y += 6;
      doc.text(`Balance Due: ₹${balance}`, 10, y);

      doc.save(`Tour_${tour.id}_Details.pdf`);
    };
  };

  return (
    <Container className="mt-5 p-4 border rounded shadow bg-light">
      <h2 className="text-center mb-4 text-primary">📋 Tour Details</h2>
      <Button variant="secondary" className="mb-4" onClick={() => navigate("/admin/upcoming-tours")}>
        ⬅️ Back to Tour List
      </Button>
      <Button variant="danger" className="mb-4 ms-2" onClick={exportToPDF}>
        📄 Export PDF
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : tour ? (
        <Row>
          <Col md={6}><strong>Customer Name:</strong> {tour.customerName}</Col>
          <Col md={6}><strong>Phone:</strong> {tour.phone}</Col>
          <Col md={6}><strong>Email:</strong> {tour.email}</Col>
          <Col md={6}><strong>Start Date:</strong> {new Date(tour.startDate).toLocaleDateString()}</Col>
          <Col md={6}><strong>End Date:</strong> {new Date(tour.endDate).toLocaleDateString()}</Col>
          <Col md={6}><strong>Pickup Location:</strong> {tour.pickupLocation}</Col>
          <Col md={6}><strong>Drop Location:</strong> {tour.dropLocation}</Col>
          <Col md={6}><strong>Bus Type:</strong> {tour.busType}</Col>
          <Col md={6}><strong>Number of Buses:</strong> {tour.numberOfBuses}</Col>
          <Col md={12}><strong>Places to Cover:</strong> {tour.placesToCover}</Col>
          <Col md={12}><strong>Preferred Route:</strong> {tour.preferredRoute}</Col>
          <Col md={12}><strong>Special Requirements:</strong> {tour.specialRequirements}</Col>
          <Col md={6}><strong>Payment Mode:</strong> {tour.paymentMode}</Col>
          <Col md={6}><strong>Language:</strong> {tour.language}</Col>
        </Row>
      ) : (
        <Alert variant="warning">No tour data found.</Alert>
      )}
    </Container>
  );
};

export default TourDetail;
