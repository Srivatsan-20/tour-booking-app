import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { addLogoToPDF, getCompanyInfo } from './logoUtils';

export const generateContractAgreementPDF = async (bookingData, bookingId) => {
  try {
    console.log('📄 Generating Contract Agreement PDF...', { bookingData, bookingId });

    if (!bookingData || !bookingId) {
      throw new Error('Booking data and ID are required');
    }

    const doc = new jsPDF();
    const companyInfo = getCompanyInfo();

    // Colors matching the image
    const colors = {
      yellow: [255, 255, 0],        // Bright yellow header
      black: [0, 0, 0],             // Black text
      gray: [128, 128, 128],        // Gray background
      white: [255, 255, 255]        // White background
    };

    // Yellow header section
    doc.setFillColor(...colors.yellow);
    doc.rect(0, 0, 210, 45, 'F');

    // Company name in header
    doc.setTextColor(...colors.black);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('SRI SAI SENTHIL TOURS & TRAVELS', 105, 20, { align: 'center' });

    // Registration details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Regd. CST No. 2013/33605/02020/GS', 105, 28, { align: 'center' });
    doc.text('No. 597/1, TMS Campus, Dharmapuri - 636701', 105, 34, { align: 'center' });
    doc.text('Email: gomaniv@gmail.com | Phone: 94436 49013, 94436 56816', 105, 40, { align: 'center' });

    // Contract Agreement title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTRACT AGREEMENT', 105, 55, { align: 'center' });

    // Form fields section with organized sections
    let yPos = 70;
    const leftMargin = 20;
    const rightMargin = 190;
    const lineHeight = 6; // Reduced line height to fit more content
    const sectionSpacing = 8; // Reduced section spacing
    const pageHeight = 280; // Maximum Y position before page break

    // Helper function to add form field with bold label and normal value
    const addFormField = (label, value, x, y, width = 80, maxWidth = 170) => {
      // Add bold label
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(label, x, y);

      // Calculate available width for the field
      const labelWidth = doc.getTextWidth(label);
      const fieldStartX = x + labelWidth + 2;
      const availableWidth = Math.min(width, maxWidth - labelWidth - 2);

      // Add value if provided with normal font
      if (value) {
        const valueStr = String(value);
        doc.setFont('helvetica', 'normal');

        // Check if text fits in one line
        if (doc.getTextWidth(valueStr) <= availableWidth - 4) {
          doc.text(valueStr, fieldStartX, y);
        } else {
          // Split text into multiple lines
          const words = valueStr.split(' ');
          let currentLine = '';
          let currentY = y;

          for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
            const testWidth = doc.getTextWidth(testLine);

            if (testWidth <= availableWidth - 4 && currentLine !== '') {
              currentLine = testLine;
            } else {
              if (currentLine) {
                doc.text(currentLine, fieldStartX, currentY);
                currentY += 6; // Move to next line
              }
              currentLine = words[i];
            }
          }

          // Add the last line
          if (currentLine) {
            doc.text(currentLine, fieldStartX, currentY);
          }

          // Return the additional height used
          return currentY - y;
        }
      }
      return 0; // No additional height used
    };

    // Helper function for multi-line fields with bold label and normal value
    const addMultiLineField = (label, value, x, y, maxWidth = 150) => {
      // Check if we need a new page for the label
      if (y > pageHeight - 10) {
        doc.addPage();
        y = 20;
      }

      // Add bold label
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(label, x, y);

      const labelWidth = doc.getTextWidth(label);
      const fieldStartX = x + labelWidth + 2;
      const availableWidth = maxWidth - labelWidth - 2;

      if (value) {
        const valueStr = String(value);
        doc.setFont('helvetica', 'normal');

        // Use jsPDF's splitTextToSize for proper text wrapping
        const splitText = doc.splitTextToSize(valueStr, availableWidth);

        if (splitText.length === 1) {
          doc.text(splitText[0], fieldStartX, y);
          return { newY: y, additionalHeight: 0 };
        } else {
          // Multiple lines needed with page break support
          let currentY = y;
          splitText.forEach((line, index) => {
            // Check if we need a new page for this line
            if (currentY > pageHeight - 5) {
              doc.addPage();
              currentY = 20;
            }
            doc.text(line, fieldStartX, currentY);
            if (index < splitText.length - 1) {
              currentY += 6;
            }
          });
          return { newY: currentY, additionalHeight: (splitText.length - 1) * 6 };
        }
      }
      return { newY: y, additionalHeight: 0 };
    };

    // Helper function to add section header with page break check
    const addSectionHeader = (title, y) => {
      // Check if we need a new page for the section header
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      doc.setFillColor(240, 240, 240); // Light gray background
      doc.rect(leftMargin - 5, y - 4, 175, 8, 'F');
      doc.setTextColor(...colors.black);
      doc.setFontSize(11); // Slightly smaller font
      doc.setFont('helvetica', 'bold');
      doc.text(title, leftMargin, y);
      return y + sectionSpacing;
    };

    // Helper function to check page break before adding content
    const checkPageBreak = (currentY, requiredSpace = 15) => {
      if (currentY > pageHeight - requiredSpace) {
        doc.addPage();
        return 20;
      }
      return currentY;
    };

    // SECTION 1: BOOKING & CONTACT DETAILS
    yPos = checkPageBreak(yPos);
    yPos = addSectionHeader('BOOKING & CONTACT DETAILS', yPos);

    // Booking No. and Date
    yPos = checkPageBreak(yPos);
    addFormField('Booking No.: ', bookingId, leftMargin, yPos, 60, 90);
    addFormField('Date: ', new Date().toLocaleDateString(), 120, yPos, 60, 90);
    yPos += lineHeight + 2;

    // Customer Name (with wrapping)
    yPos = checkPageBreak(yPos);
    const nameResult = addMultiLineField('Customer Name: ', bookingData.customerName, leftMargin, yPos, 150);
    yPos = nameResult.newY + lineHeight + 2;

    // Email (with wrapping)
    yPos = checkPageBreak(yPos);
    const emailResult = addMultiLineField('Email: ', bookingData.email || '', leftMargin, yPos, 150);
    yPos = emailResult.newY + lineHeight + 2;

    // Phone and Mobile
    yPos = checkPageBreak(yPos);
    addFormField('Phone No: ', bookingData.phone, leftMargin, yPos, 60, 90);
    addFormField('Mobile: ', bookingData.phone, 120, yPos, 60, 90);
    yPos += lineHeight + 2;

    // Address (multi-line)
    yPos = checkPageBreak(yPos);
    const addressResult = addMultiLineField('Address: ', '', leftMargin, yPos, 150);
    yPos = addressResult.newY + lineHeight + sectionSpacing;

    // SECTION 2: TRAVEL DETAILS
    yPos = checkPageBreak(yPos);
    yPos = addSectionHeader('TRAVEL DETAILS', yPos);

    // Pickup and Drop Location (with wrapping)
    yPos = checkPageBreak(yPos);
    const pickupResult = addMultiLineField('Pickup Location: ', bookingData.pickupLocation, leftMargin, yPos, 150);
    yPos = pickupResult.newY + lineHeight + 2;

    yPos = checkPageBreak(yPos);
    const dropResult = addMultiLineField('Drop Location: ', bookingData.dropLocation, leftMargin, yPos, 150);
    yPos = dropResult.newY + lineHeight + 2;

    // Travel Dates
    yPos = checkPageBreak(yPos);
    addFormField('Start Date: ', new Date(bookingData.startDate).toLocaleDateString(), leftMargin, yPos, 60, 90);
    addFormField('End Date: ', new Date(bookingData.endDate).toLocaleDateString(), 120, yPos, 60, 90);
    yPos += lineHeight + 2;

    // Bus Type and Passengers
    yPos = checkPageBreak(yPos);
    addFormField('Bus Type: ', bookingData.busType, leftMargin, yPos, 60, 90);
    addFormField('No. of Passengers: ', bookingData.numberOfPassengers, 120, yPos, 60, 90);
    yPos += lineHeight + 2;

    // Number of Buses and Days
    yPos = checkPageBreak(yPos);
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    addFormField('No. of Buses: ', bookingData.numberOfBuses, leftMargin, yPos, 60, 90);
    addFormField('No. of Days: ', daysDiff, 120, yPos, 60, 90);
    yPos += lineHeight + 2;

    // Places to Cover (multi-line)
    yPos = checkPageBreak(yPos);
    const placesResult = addMultiLineField('Places to Cover: ', bookingData.placesToCover || '', leftMargin, yPos, 150);
    yPos = placesResult.newY + lineHeight + 2;

    // Special Requirements (multi-line)
    yPos = checkPageBreak(yPos);
    const requirementsResult = addMultiLineField('Special Requirements: ', bookingData.specialRequirements || '', leftMargin, yPos, 150);
    yPos = requirementsResult.newY + lineHeight + sectionSpacing;

    // SECTION 3: FINANCIAL DETAILS
    yPos = checkPageBreak(yPos);
    yPos = addSectionHeader('FINANCIAL DETAILS', yPos);

    // Amount per day and Total Days
    yPos = checkPageBreak(yPos);
    addFormField('Amount per day: Rs. ', bookingData.perDayRent || '', leftMargin, yPos, 60, 90);
    addFormField('Total Days: ', daysDiff, 120, yPos, 50, 90);
    yPos += lineHeight + 2;

    // Total Amount
    yPos = checkPageBreak(yPos);
    addFormField('Total Amount: Rs. ', bookingData.totalRent || '', leftMargin, yPos, 80, 90);
    addFormField('Payment Mode: ', bookingData.paymentMode || '', 120, yPos, 60, 90);
    yPos += lineHeight + 2;

    // Advance and Balance
    yPos = checkPageBreak(yPos);
    addFormField('Advance Paid: Rs. ', bookingData.advancePaid || '', leftMargin, yPos, 60, 90);
    const balance = (bookingData.totalRent || 0) - (bookingData.advancePaid || 0);
    addFormField('Balance: Rs. ', balance > 0 ? balance : '', 120, yPos, 60, 90);
    yPos += lineHeight + 2;

    // Due Date
    yPos = checkPageBreak(yPos);
    addFormField('Due Date: ', '', leftMargin, yPos, 80, 150);
    yPos += lineHeight + sectionSpacing;

    // SECTION 4: TERMS AND CONDITIONS
    yPos = checkPageBreak(yPos, 30); // Need more space for terms section
    yPos = addSectionHeader('TERMS AND CONDITIONS', yPos);

    const terms = [
      '1. Booking is confirmed only after advance payment.',
      '2. Departure time: 4.00 AM to 12.00 Midnight.',
      '3. DVD Player and other facilities are based on availability.',
      '4. The management is not responsible for any delay or breakdown.',
      '5. Additional expenses like washing, service, etc., must be borne by the customer.',
      '6. Cancellation charges apply as per company policy.',
      '7. Driver accommodation and food to be arranged by the customer.',
      '8. Toll charges, parking fees, and state taxes are extra.',
      '9. Any damage to the vehicle will be charged to the customer.',
      '10. Company reserves the right to change terms without prior notice.'
    ];

    doc.setFontSize(9); // Smaller font for terms
    doc.setFont('helvetica', 'normal');

    terms.forEach(term => {
      // Check if we need a new page for the term
      yPos = checkPageBreak(yPos, 15);

      // Use text wrapping for long terms
      const maxWidth = 170;
      const splitText = doc.splitTextToSize(term, maxWidth);

      // Handle each line of the term
      splitText.forEach((line, index) => {
        // Check if we need a new page for this line
        if (yPos > pageHeight - 10) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, leftMargin, yPos);
        yPos += lineHeight;
      });
    });

    yPos += sectionSpacing;

    // SECTION 5: SIGNATURES
    yPos = checkPageBreak(yPos, 50); // Need space for entire signature section
    yPos = addSectionHeader('AGREEMENT ACCEPTANCE', yPos);

    // Agreement text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Check if we need a new page for the agreement text
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }

    const agreementText = 'I/We hereby agree to the above terms and conditions and confirm this booking.';
    const agreementLines = doc.splitTextToSize(agreementText, 170);

    agreementLines.forEach((line, index) => {
      if (yPos > pageHeight - 35) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, leftMargin, yPos);
      yPos += lineHeight;
    });
    yPos += 8;

    // Signature section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');

    // Ensure we have space for the entire signature section
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
    }

    doc.text('Accepted By:', leftMargin, yPos);
    doc.text('For SRI SAI SENTHIL TOURS & TRAVELS', 120, yPos);
    yPos += lineHeight + 15;

    // Signature labels
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Customer Signature', leftMargin, yPos);
    doc.text('Owner / Manager', 120, yPos);
    yPos += 5;

    // Add signature lines
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos, leftMargin + 70, yPos);
    doc.line(120, yPos, 190, yPos);
    yPos += 12;

    // Date fields
    doc.text('Date: _______________', leftMargin, yPos);
    doc.text('Date: _______________', 120, yPos);
    yPos += 8;

    // Stamp area
    doc.setFontSize(9);
    doc.text('(Customer Signature)', leftMargin + 10, yPos);
    doc.text('(Company Seal & Signature)', 120 + 15, yPos);

    // Save the PDF
    const fileName = `Sri_Sai_Senthil_Contract_Agreement_${bookingId}.pdf`;
    doc.save(fileName);

    console.log('✅ Contract Agreement PDF generated successfully');
    return {
      success: true,
      fileName: fileName,
      message: 'Contract Agreement PDF generated successfully'
    };

  } catch (error) {
    console.error('❌ Error generating Contract Agreement PDF:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to generate Contract Agreement PDF'
    };
  }
};
