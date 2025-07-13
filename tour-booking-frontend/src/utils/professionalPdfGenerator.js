import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { addLogoToPDF, getCompanyInfo } from './logoUtils';

export const generateProfessionalBookingPDF = async (bookingData, bookingId) => {
  try {
    console.log('🎨 Generating Professional PDF...', { bookingData, bookingId });

    if (!bookingData || !bookingId) {
      throw new Error('Booking data and ID are required');
    }

    const doc = new jsPDF();

    // Professional Color Palette - Sri Sai Senthil Theme
    const colors = {
      primary: [139, 69, 19],       // Maroon (matching logo)
      secondary: [101, 67, 33],     // Dark Brown
      accent: [255, 215, 0],        // Gold (matching logo)
      success: [34, 139, 34],       // Forest Green
      light: [245, 245, 220],       // Cream (matching logo background)
      dark: [33, 37, 41],           // Dark Gray
      white: [255, 255, 255],       // White
      border: [222, 226, 230],      // Border Gray
      text: [33, 37, 41],           // Text Dark
      textMuted: [108, 117, 125]    // Muted Text
    };

    // Get company information
    const companyInfo = getCompanyInfo();

    // Professional Helper Functions
    const addGradientHeader = async () => {
      // Main header background with gradient effect
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, 210, 50, 'F');

      // Accent stripe
      doc.setFillColor(...colors.accent);
      doc.rect(0, 45, 210, 5, 'F');

      // Company logo
      await addLogoToPDF(doc, 15, 8, 30, 30);

      // Company branding
      doc.setTextColor(...colors.white);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(companyInfo.name, 50, 20);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(companyInfo.tagline, 50, 28);

      doc.setFontSize(9);
      doc.text(companyInfo.address, 50, 34);
      doc.text(`📞 ${companyInfo.phone} | 📧 ${companyInfo.email}`, 50, 40);
      doc.text(`🌐 ${companyInfo.website}`, 50, 46);

      // Booking status badge
      doc.setFillColor(...colors.success);
      doc.roundedRect(140, 8, 60, 22, 3, 3, 'F');

      doc.setTextColor(...colors.white);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ CONFIRMED', 145, 20);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Booking ID: #${bookingId}`, 145, 26);
    };

    const addSection = (title, yPos, icon = '', bgColor = colors.light) => {
      // Section background with rounded corners effect
      doc.setFillColor(...bgColor);
      doc.rect(10, yPos - 8, 190, 16, 'F');

      // Section border
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(0.5);
      doc.rect(10, yPos - 8, 190, 16);

      // Section title with icon
      doc.setTextColor(...colors.primary);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${icon} ${title}`, 15, yPos);

      // Add decorative line
      doc.setDrawColor(...colors.accent);
      doc.setLineWidth(2);
      doc.line(15, yPos + 3, 195, yPos + 3);

      return yPos + 20;
    };

    const addInfoCard = (items, yPos, cardTitle = '') => {
      // Card background
      doc.setFillColor(...colors.white);
      doc.rect(15, yPos, 180, items.length * 8 + 10, 'F');

      // Card border
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(0.5);
      doc.rect(15, yPos, 180, items.length * 8 + 10);

      let currentY = yPos + 8;

      items.forEach(([label, value], index) => {
        // Alternate row background
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(16, currentY - 3, 178, 6, 'F');
        }

        // Label
        doc.setTextColor(...colors.text);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, 20, currentY);

        // Value
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.textMuted);
        const displayValue = value || 'N/A';
        doc.text(displayValue, 70, currentY);

        currentY += 8;
      });

      return yPos + items.length * 8 + 15;
    };

    const addPricingTable = (yPos) => {
      const tableData = [
        ['Description', 'Quantity', 'Rate', 'Amount'],
        ['Bus Rental', bookingData.numberOfBuses || '1', `₹${(bookingData.totalRent / (bookingData.numberOfBuses || 1)).toLocaleString()}`, `₹${bookingData.totalRent?.toLocaleString() || '0'}`],
        ['Service Tax', '1', 'Included', 'Included'],
        ['Total Amount', '', '', `₹${bookingData.totalRent?.toLocaleString() || '0'}`],
        ['Advance Paid', '', '', `₹${bookingData.advancePaid?.toLocaleString() || '0'}`],
        ['Balance Due', '', '', `₹${((bookingData.totalRent || 0) - (bookingData.advancePaid || 0)).toLocaleString()}`]
      ];

      doc.autoTable({
        startY: yPos,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'grid',
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontSize: 11,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 10,
          textColor: colors.text
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        margin: { left: 15, right: 15 },
        tableWidth: 180
      });

      return doc.lastAutoTable.finalY + 10;
    };

    const addFooter = (yPos) => {
      // Footer background
      doc.setFillColor(...colors.light);
      doc.rect(0, yPos, 210, 40, 'F');

      // Terms and conditions
      doc.setTextColor(...colors.textMuted);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');

      const terms = [
        'Terms & Conditions:',
        '• Full payment required 48 hours before departure',
        '• Cancellation charges apply as per company policy',
        '• Driver accommodation and meals to be arranged by customer',
        '• Toll charges, parking fees, and state taxes extra',
        '• Vehicle breakdown replacement subject to availability'
      ];

      terms.forEach((term, index) => {
        doc.text(term, 15, yPos + 8 + (index * 4));
      });

      // Contact information
      doc.setTextColor(...colors.primary);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`24/7 Customer Support: ${companyInfo.phone}`, 15, yPos + 35);

      // QR Code placeholder
      doc.setDrawColor(...colors.border);
      doc.rect(160, yPos + 5, 25, 25);
      doc.setTextColor(...colors.textMuted);
      doc.setFontSize(8);
      doc.text('QR Code', 167, yPos + 20);
      doc.text('for tracking', 164, yPos + 24);
    };

    // Generate PDF Content
    await addGradientHeader();

    let yPos = 60;

    // Customer Information
    yPos = addSection('CUSTOMER INFORMATION', yPos, '👤');
    const customerInfo = [
      ['Full Name', bookingData.customerName],
      ['Phone Number', bookingData.phone],
      ['Email Address', bookingData.email],
      ['Language Preference', bookingData.language || 'English']
    ];
    yPos = addInfoCard(customerInfo, yPos);

    // Trip Information
    yPos = addSection('TRIP DETAILS', yPos, '🗺️');
    const startDate = bookingData.startDate ? new Date(bookingData.startDate) : new Date();
    const endDate = bookingData.endDate ? new Date(bookingData.endDate) : new Date();
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const tripInfo = [
      ['Journey Date', startDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
      ['Return Date', endDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
      ['Duration', `${duration} days`],
      ['Pickup Location', bookingData.pickupLocation],
      ['Drop Location', bookingData.dropLocation],
      ['Number of Buses', bookingData.numberOfBuses],
      ['Bus Type', bookingData.busType],
      ['Special Notes', bookingData.notes || 'None']
    ];
    yPos = addInfoCard(tripInfo, yPos);

    // Pricing Information
    yPos = addSection('PRICING BREAKDOWN', yPos, '💰');
    yPos = addPricingTable(yPos);

    // Footer
    addFooter(yPos + 10);

    // Add page numbers and timestamp
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setTextColor(...colors.textMuted);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 15, 290);
    }

    // Save the PDF
    const fileName = `Booking_${bookingId}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    console.log('✅ Professional PDF generated successfully:', fileName);
    return { success: true, fileName };

  } catch (error) {
    console.error('❌ Error generating professional PDF:', error);
    return { success: false, error: error.message };
  }
};
