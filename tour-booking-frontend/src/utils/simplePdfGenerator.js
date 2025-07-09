import jsPDF from 'jspdf';

export const generateSimpleBookingPDF = (bookingData, bookingId) => {
  try {
    console.log('Starting simple PDF generation...', { bookingData, bookingId });
    
    // Validate input data
    if (!bookingData) {
      throw new Error('Booking data is required');
    }
    if (!bookingId) {
      throw new Error('Booking ID is required');
    }
    
    const doc = new jsPDF();
    let yPos = 20;
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('🚌 TOUR BOOKING CONFIRMATION', 20, yPos);
    
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Booking ID: #${bookingId}`, 20, yPos);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, yPos);
    
    // Customer Information
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER INFORMATION', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const customerInfo = [
      `Name: ${bookingData.customerName || 'N/A'}`,
      `Phone: ${bookingData.phone || 'N/A'}`,
      `Email: ${bookingData.email || 'N/A'}`,
      `Language: ${bookingData.language || 'English'}`
    ];
    
    customerInfo.forEach((info, index) => {
      doc.text(info, 20, yPos + (index * 8));
    });
    
    // Trip Information
    yPos += 40;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TRIP INFORMATION', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Safe date handling
    const startDate = bookingData.startDate ? new Date(bookingData.startDate) : new Date();
    const endDate = bookingData.endDate ? new Date(bookingData.endDate) : new Date();
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    const tripInfo = [
      `Start Date: ${startDate.toLocaleDateString()}`,
      `End Date: ${endDate.toLocaleDateString()}`,
      `Duration: ${duration} days`,
      `Pickup: ${bookingData.pickupLocation || 'N/A'}`,
      `Drop: ${bookingData.dropLocation || 'N/A'}`,
      `Places to Cover: ${bookingData.placesToCover || 'N/A'}`,
      `Route: ${bookingData.preferredRoute || 'N/A'}`,
      `Special Requirements: ${bookingData.specialRequirements || 'None'}`
    ];
    
    tripInfo.forEach((info, index) => {
      doc.text(info, 20, yPos + (index * 8));
    });
    
    // Bus Configuration
    yPos += 75;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BUS CONFIGURATION', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const busInfo = [
      `Number of Buses: ${bookingData.numberOfBuses || 1}`,
      `Number of Passengers: ${bookingData.numberOfPassengers || 1}`,
      `Bus Type: ${bookingData.busType || 'Standard'}`,
      `Payment Mode: ${bookingData.paymentMode || 'Online'}`
    ];
    
    busInfo.forEach((info, index) => {
      doc.text(info, 20, yPos + (index * 8));
    });
    
    // Pricing Information
    yPos += 40;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PRICING INFORMATION', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const totalRent = parseFloat(bookingData.totalRent) || 0;
    const advancePaid = parseFloat(bookingData.advancePaid) || 0;
    const balance = totalRent - advancePaid;
    
    const pricingInfo = [
      `Per Day Rent: ₹${bookingData.perDayRent || 0}`,
      `Mountain Rent: ₹${bookingData.mountainRent || 0}`,
      `Total Rent: ₹${totalRent.toLocaleString()}`,
      `Advance Paid: ₹${advancePaid.toLocaleString()}`,
      `Balance Due: ₹${balance.toLocaleString()}`
    ];
    
    pricingInfo.forEach((info, index) => {
      if (index >= 2) { // Make total amounts bold
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      doc.text(info, 20, yPos + (index * 8));
    });
    
    // Terms & Conditions
    yPos += 50;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMS & CONDITIONS', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const terms = [
      '• This booking is confirmed subject to payment of advance amount.',
      '• Balance amount must be paid before the trip starts.',
      '• Cancellation charges apply as per company policy.',
      '• Please carry a copy of this booking confirmation during travel.'
    ];
    
    terms.forEach((term, index) => {
      doc.text(term, 20, yPos + (index * 6));
    });
    
    // Contact Information
    yPos += 35;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTACT US', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text('Phone: +91-XXXXXXXXXX | Email: info@tourbooking.com', 20, yPos + 8);
    
    // Generate and download PDF
    const fileName = `Booking_Confirmation_${bookingId}_${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('Saving simple PDF with filename:', fileName);
    
    doc.save(fileName);
    console.log('Simple PDF generation completed successfully');

    return doc;
    
  } catch (error) {
    console.error('Simple PDF Generation Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      bookingData,
      bookingId
    });
    throw new Error(`Simple PDF generation failed: ${error.message}`);
  }
};
