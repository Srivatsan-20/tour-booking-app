import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateBookingPDF = (bookingData, bookingId) => {
  try {
    console.log('Starting PDF generation...', { bookingData, bookingId });

    // Validate input data
    if (!bookingData) {
      throw new Error('Booking data is required');
    }
    if (!bookingId) {
      throw new Error('Booking ID is required');
    }

    const doc = new jsPDF();

    // Colors
    const primaryColor = [41, 128, 185]; // Blue
    const secondaryColor = [52, 73, 94]; // Dark gray
    const accentColor = [231, 76, 60]; // Red
    const lightGray = [236, 240, 241];

    // Helper function to add colored rectangle
    const addColoredRect = (x, y, width, height, color) => {
      doc.setFillColor(...color);
      doc.rect(x, y, width, height, 'F');
    };

    // Header Section
    addColoredRect(0, 0, 210, 40, primaryColor);

    // Company Logo/Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('🚌 TOUR BOOKING', 20, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Tour & Travel Services', 20, 28);

    // Booking Confirmation Badge
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BOOKING CONFIRMED', 140, 20);

    doc.setFontSize(10);
    doc.text(`Booking ID: #${bookingId}`, 140, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 34);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Customer Information Section
    let yPos = 55;

    // Section Header
    addColoredRect(15, yPos - 5, 180, 8, lightGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text('👤 CUSTOMER INFORMATION', 20, yPos);

    yPos += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // Customer details in two columns
    const customerInfo = [
      ['Customer Name:', bookingData.customerName || 'N/A'],
      ['Phone Number:', bookingData.phone || 'N/A'],
      ['Email Address:', bookingData.email || 'N/A'],
      ['Language Preference:', bookingData.language || 'English']
    ];

    customerInfo.forEach(([label, value], index) => {
      const xPos = index % 2 === 0 ? 20 : 110;
      const currentY = yPos + Math.floor(index / 2) * 8;

      doc.setFont('helvetica', 'bold');
      doc.text(label, xPos, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(value || 'N/A', xPos + 35, currentY);
    });

    // Trip Information Section
    yPos += 40;

    addColoredRect(15, yPos - 5, 180, 8, lightGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text('🗓️ TRIP INFORMATION', 20, yPos);

    yPos += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // Safe date handling
    const startDate = bookingData.startDate ? new Date(bookingData.startDate) : new Date();
    const endDate = bookingData.endDate ? new Date(bookingData.endDate) : new Date();
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const tripInfo = [
      ['Start Date:', startDate.toLocaleDateString()],
      ['End Date:', endDate.toLocaleDateString()],
      ['Duration:', `${duration} days`],
      ['Pickup Location:', bookingData.pickupLocation || 'N/A'],
      ['Drop Location:', bookingData.dropLocation || 'N/A'],
      ['Places to Cover:', bookingData.placesToCover || 'N/A'],
      ['Preferred Route:', bookingData.preferredRoute || 'N/A'],
      ['Special Requirements:', bookingData.specialRequirements || 'None']
    ];

    tripInfo.forEach(([label, value], index) => {
      const xPos = index % 2 === 0 ? 20 : 110;
      const currentY = yPos + Math.floor(index / 2) * 8;

      doc.setFont('helvetica', 'bold');
      doc.text(label, xPos, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(value || 'N/A', xPos + 35, currentY);
    });

    // Bus Configuration Section
    yPos += 50;

    addColoredRect(15, yPos - 5, 180, 8, lightGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text('🚌 BUS CONFIGURATION', 20, yPos);

    yPos += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const busInfo = [
      ['Number of Buses:', (bookingData.numberOfBuses || 1).toString()],
      ['Number of Passengers:', (bookingData.numberOfPassengers || 1).toString()],
      ['Bus Type:', bookingData.busType || 'Standard'],
      ['Payment Mode:', bookingData.paymentMode || 'Online']
    ];

    busInfo.forEach(([label, value], index) => {
      const xPos = index % 2 === 0 ? 20 : 110;
      const currentY = yPos + Math.floor(index / 2) * 8;

      doc.setFont('helvetica', 'bold');
      doc.text(label, xPos, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(value || 'N/A', xPos + 35, currentY);
    });

    // Pricing Section
    yPos += 30;

    addColoredRect(15, yPos - 5, 180, 8, lightGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text('💰 PRICING BREAKDOWN', 20, yPos);

    yPos += 15;

    // Create pricing table
    const pricingData = [];

    if (bookingData.useIndividualBusRates && bookingData.busRents) {
      // Individual bus rates
      bookingData.busRents.forEach((bus, index) => {
        const days = Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24)) + 1;
        const perDayTotal = bus.perDayRent * days;
        const mountainTotal = bus.mountainRent || 0;
        const busTotal = perDayTotal + mountainTotal;

        pricingData.push([
          bus.busNumber,
          bus.busType,
          `₹${bus.perDayRent}`,
          `${days} days`,
          `₹${perDayTotal}`,
          bus.mountainRent ? `₹${bus.mountainRent}` : '-',
          `₹${busTotal}`
        ]);
      });
    } else {
      // Uniform rates
      const days = Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24)) + 1;
      const perDayTotal = bookingData.perDayRent * bookingData.numberOfBuses * days;
      const mountainTotal = (bookingData.mountainRent || 0) * bookingData.numberOfBuses;

      pricingData.push([
        `All Buses (${bookingData.numberOfBuses})`,
        bookingData.busType,
        `₹${bookingData.perDayRent}`,
        `${days} days`,
        `₹${perDayTotal}`,
        bookingData.mountainRent ? `₹${mountainTotal}` : '-',
        `₹${perDayTotal + mountainTotal}`
      ]);
    }

    // Add pricing table
    doc.autoTable({
      startY: yPos,
      head: [['Bus', 'Type', 'Per Day', 'Duration', 'Subtotal', 'Mountain', 'Total']],
      body: pricingData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      margin: { left: 20, right: 20 }
    });

    // Payment Summary
    yPos = doc.lastAutoTable.finalY + 20;

    addColoredRect(15, yPos - 5, 180, 8, lightGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text('💳 PAYMENT SUMMARY', 20, yPos);

    yPos += 15;

    // Payment summary box
    addColoredRect(20, yPos, 170, 35, [248, 249, 250]);
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.5);
    doc.rect(20, yPos, 170, 35);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);

    const totalRent = parseFloat(bookingData.totalRent) || 0;
    const advancePaid = parseFloat(bookingData.advancePaid) || 0;
    const balance = totalRent - advancePaid;

    doc.text(`Total Rent Amount:`, 25, yPos + 10);
    doc.text(`₹${totalRent.toLocaleString()}`, 150, yPos + 10);

    doc.text(`Advance Paid:`, 25, yPos + 20);
    doc.setTextColor(...primaryColor);
    doc.text(`₹${advancePaid.toLocaleString()}`, 150, yPos + 20);

    doc.setTextColor(...accentColor);
    doc.setFontSize(14);
    doc.text(`Balance Due:`, 25, yPos + 30);
    doc.text(`₹${balance.toLocaleString()}`, 150, yPos + 30);

    // Footer
    yPos += 50;
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text('Terms & Conditions:', 20, yPos);
    doc.setFontSize(8);
    doc.text('• This booking is confirmed subject to payment of advance amount.', 20, yPos + 8);
    doc.text('• Balance amount must be paid before the trip starts.', 20, yPos + 14);
    doc.text('• Cancellation charges apply as per company policy.', 20, yPos + 20);
    doc.text('• Please carry a copy of this booking confirmation during travel.', 20, yPos + 26);

    // Contact Information
    yPos += 35;
    addColoredRect(15, yPos - 5, 180, 20, primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('📞 CONTACT US', 20, yPos + 5);
    doc.setFont('helvetica', 'normal');
    doc.text('Phone: +91-XXXXXXXXXX | Email: info@tourbooking.com | Website: www.tourbooking.com', 20, yPos + 12);

    // Generate and download PDF
    const fileName = `Booking_Confirmation_${bookingId}_${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('Saving PDF with filename:', fileName);

    doc.save(fileName);
    console.log('PDF generation completed successfully');

    return doc;

  } catch (error) {
    console.error('PDF Generation Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      bookingData,
      bookingId
    });
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};
