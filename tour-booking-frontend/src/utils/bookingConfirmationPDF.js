import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addLogoToPDF, getCompanyInfo } from './logoUtils';

export const generateBookingConfirmationPDF = async (bookingData) => {
  try {
    console.log('🎫 Generating Booking Confirmation PDF...', bookingData);

    if (!bookingData) {
      throw new Error('Booking data is required');
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

    // Add logo and header
    let yPos = 20;
    try {
      yPos = await addLogoToPDF(doc, yPos);
    } catch (logoError) {
      console.warn('Logo could not be added:', logoError);
      yPos = 30;
    }

    // Success Header
    yPos += 10;
    doc.setFillColor(...colors.success);
    doc.rect(15, yPos, 180, 25, 'F');

    doc.setTextColor(...colors.white);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ BOOKING CONFIRMED!', 105, yPos + 12, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Your tour bus booking has been successfully confirmed', 105, yPos + 20, { align: 'center' });

    // Booking ID
    yPos += 35;
    doc.setFillColor(...colors.accent);
    doc.rect(15, yPos, 180, 12, 'F');

    doc.setTextColor(...colors.dark);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Booking ID: ${bookingData.bookingId}`, 105, yPos + 8, { align: 'center' });

    // Helper function to add sections
    const addSection = (title, startY) => {
      doc.setFillColor(...colors.light);
      doc.rect(15, startY, 180, 8, 'F');

      doc.setTextColor(...colors.primary);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, startY + 6);

      return startY + 15;
    };

    // Helper function to add info rows
    const addInfoRow = (label, value, yPosition, isRightColumn = false) => {
      const xPos = isRightColumn ? 110 : 20;

      doc.setTextColor(...colors.dark);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, xPos, yPosition);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.text);
      const valueText = doc.splitTextToSize(String(value), isRightColumn ? 80 : 80);
      doc.text(valueText, xPos, yPosition + 6);

      return yPosition + (valueText.length > 1 ? 12 + (valueText.length - 1) * 4 : 12);
    };

    // Tour Package Details
    yPos += 20;
    yPos = addSection('TOUR PACKAGE DETAILS', yPos);

    let leftY = yPos;
    let rightY = yPos;

    leftY = addInfoRow('Tour Package', bookingData.tourPackage.name, leftY);
    rightY = addInfoRow('Bus Type', bookingData.tourPackage.busType, rightY, true);

    leftY = addInfoRow('Places to Cover', bookingData.searchData.places, leftY);
    rightY = addInfoRow('Buses Required', `${bookingData.searchData.buses} bus${bookingData.searchData.buses > 1 ? 'es' : ''}`, rightY, true);

    const startDate = new Date(bookingData.searchData.startDate).toLocaleDateString('en-IN');
    const endDate = new Date(bookingData.searchData.endDate).toLocaleDateString('en-IN');
    leftY = addInfoRow('Tour Duration', `${startDate} to ${endDate}`, leftY);
    rightY = addInfoRow('Total Days', `${bookingData.totalDays} days`, rightY, true);

    yPos = Math.max(leftY, rightY) + 10;

    // Tour Organizer Information
    yPos = addSection('TOUR ORGANIZER INFORMATION', yPos);

    leftY = yPos;
    rightY = yPos;

    leftY = addInfoRow('Organizer Name', bookingData.organizerDetails.organizerName, leftY);
    rightY = addInfoRow('Group Size', `${bookingData.organizerDetails.groupSize} people`, rightY, true);

    leftY = addInfoRow('Email', bookingData.organizerDetails.email, leftY);
    if (bookingData.organizerDetails.organizationName) {
      rightY = addInfoRow('Organization', bookingData.organizerDetails.organizationName, rightY, true);
    }

    leftY = addInfoRow('Phone', bookingData.organizerDetails.phone, leftY);
    if (bookingData.organizerDetails.groupType) {
      rightY = addInfoRow('Group Type', bookingData.organizerDetails.groupType, rightY, true);
    }

    yPos = Math.max(leftY, rightY) + 10;

    // Pricing Information
    yPos = addSection('PRICING BREAKDOWN', yPos);

    // Calculate pricing details
    const pricePerDay = bookingData.tourPackage?.pricePerDay || 8000;
    const subtotal = pricePerDay * bookingData.searchData.buses * bookingData.totalDays;
    const gst = Math.round(subtotal * 0.05);

    // Create pricing table manually (fallback for autoTable issues)
    try {
      const tableData = [
        ['Description', 'Rate', 'Quantity', 'Amount'],
        ['Bus rental per day', `₹${pricePerDay}`, `${bookingData.searchData.buses} bus × ${bookingData.totalDays} days`, `₹${subtotal}`],
        ['GST (5%)', '', '', `₹${gst}`],
        ['', '', 'TOTAL AMOUNT', `₹${bookingData.totalAmount}`]
      ];

      autoTable(doc, {
        startY: yPos,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'grid',
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: colors.text
        },
        alternateRowStyles: {
          fillColor: colors.light
        },
        margin: { left: 15, right: 15 },
        tableWidth: 180,
        styles: {
          cellPadding: 4,
          lineColor: colors.border,
          lineWidth: 0.5
        }
      });

      yPos = doc.previousAutoTable.finalY + 20;
    } catch (tableError) {
      console.warn('AutoTable failed, using manual table:', tableError);

      // Manual table as fallback
      doc.setTextColor(...colors.text);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');

      doc.text('Bus rental per day:', 20, yPos);
      doc.text(`₹${pricePerDay}`, 80, yPos);
      doc.text(`${bookingData.searchData.buses} bus × ${bookingData.totalDays} days`, 120, yPos);
      doc.text(`₹${subtotal}`, 170, yPos);

      yPos += 8;
      doc.text('GST (5%):', 20, yPos);
      doc.text(`₹${gst}`, 170, yPos);

      yPos += 12;
      doc.setFontSize(12);
      doc.text('TOTAL AMOUNT:', 20, yPos);
      doc.text(`₹${bookingData.totalAmount}`, 170, yPos);

      yPos += 20;
    }

    // Important Information
    yPos = addSection('IMPORTANT INFORMATION', yPos);

    const importantInfo = [
      '• Please coordinate with our team 24 hours before tour start date',
      '• Provide final passenger list and pickup points',
      '• Keep your booking confirmation handy',
      '• For any changes or cancellations, contact us at least 24 hours before tour start',
      '• Customer support: +91 98765 43210'
    ];

    doc.setTextColor(...colors.text);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    importantInfo.forEach((info, index) => {
      doc.text(info, 20, yPos + (index * 6));
    });

    yPos += importantInfo.length * 6 + 15;

    // Contact Information Footer
    doc.setFillColor(...colors.primary);
    doc.rect(15, yPos, 180, 25, 'F');

    doc.setTextColor(...colors.white);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTACT US', 20, yPos + 8);

    doc.setFont('helvetica', 'normal');
    doc.text(`Phone: ${companyInfo.phone} | Email: ${companyInfo.email}`, 20, yPos + 15);
    doc.text(`Website: ${companyInfo.website}`, 20, yPos + 22);

    // Footer with generation info
    doc.setTextColor(...colors.textMuted);
    doc.setFontSize(8);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 15, 285);
    doc.text('Page 1 of 1', 180, 285);

    // Save the PDF
    const fileName = `Booking_Confirmation_${bookingData.bookingId}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    console.log('✅ Booking Confirmation PDF generated successfully:', fileName);
    return { success: true, fileName };

  } catch (error) {
    console.error('❌ Error generating Booking Confirmation PDF:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to generate Booking Confirmation PDF'
    };
  }
};
