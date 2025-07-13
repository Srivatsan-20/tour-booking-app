import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { addLogoToPDF, getCompanyInfo } from './logoUtils';

export const generateProfessionalReceipt = async (bookingData, paymentData, receiptId) => {
  try {
    console.log('🧾 Generating Professional Receipt...', { bookingData, paymentData, receiptId });

    if (!bookingData || !receiptId) {
      throw new Error('Booking data and receipt ID are required');
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

    // Professional Header
    const addReceiptHeader = async () => {
      // Header background
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, 210, 45, 'F');

      // Accent stripe
      doc.setFillColor(...colors.accent);
      doc.rect(0, 40, 210, 5, 'F');

      // Company logo
      await addLogoToPDF(doc, 15, 8, 25, 25);

      // Company branding
      doc.setTextColor(...colors.white);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(companyInfo.name, 45, 18);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Payment Receipt & Tax Invoice', 45, 25);
      doc.text(`📞 ${companyInfo.phone} | 📧 ${companyInfo.email}`, 45, 31);
      doc.text(`🌐 ${companyInfo.website}`, 45, 37);

      // Receipt badge
      doc.setFillColor(...colors.success);
      doc.roundedRect(140, 8, 55, 20, 3, 3, 'F');

      doc.setTextColor(...colors.white);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ PAID', 150, 20);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Receipt #${receiptId}`, 145, 25);
    };

    const addSection = (title, yPos, icon = '') => {
      // Section background
      doc.setFillColor(...colors.light);
      doc.rect(10, yPos - 6, 190, 12, 'F');

      // Section border
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(0.5);
      doc.rect(10, yPos - 6, 190, 12);

      // Section title
      doc.setTextColor(...colors.primary);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${icon} ${title}`, 15, yPos);

      return yPos + 15;
    };

    const addInfoRow = (label, value, yPos, leftCol = 15) => {
      doc.setTextColor(...colors.text);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, leftCol, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.textMuted);
      doc.text(value || 'N/A', leftCol + 40, yPos);

      return yPos + 6;
    };

    const addPaymentTable = (yPos) => {
      const paymentAmount = paymentData?.amount || bookingData.advancePaid || 0;
      const paymentMethod = paymentData?.method || 'Cash';
      const paymentDate = paymentData?.date || new Date().toISOString();

      const tableData = [
        ['Description', 'Date', 'Method', 'Amount'],
        [
          `Payment for Booking #${bookingData.id || 'N/A'}`,
          new Date(paymentDate).toLocaleDateString(),
          paymentMethod.toUpperCase(),
          `₹${paymentAmount.toLocaleString()}`
        ]
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
          textColor: colors.text,
          cellPadding: 8
        },
        margin: { left: 15, right: 15 },
        tableWidth: 180
      });

      return doc.lastAutoTable.finalY + 10;
    };

    const addTaxBreakdown = (yPos) => {
      const amount = paymentData?.amount || bookingData.advancePaid || 0;
      const taxableAmount = Math.round(amount / 1.18); // Assuming 18% GST
      const gstAmount = amount - taxableAmount;

      const taxData = [
        ['Tax Breakdown', 'Rate', 'Amount'],
        ['Taxable Amount', '', `₹${taxableAmount.toLocaleString()}`],
        ['CGST (9%)', '9%', `₹${Math.round(gstAmount / 2).toLocaleString()}`],
        ['SGST (9%)', '9%', `₹${Math.round(gstAmount / 2).toLocaleString()}`],
        ['Total Amount', '', `₹${amount.toLocaleString()}`]
      ];

      doc.autoTable({
        startY: yPos,
        head: [taxData[0]],
        body: taxData.slice(1),
        theme: 'grid',
        headStyles: {
          fillColor: colors.secondary,
          textColor: colors.white,
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
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

    const addReceiptFooter = (yPos) => {
      // Footer background
      doc.setFillColor(...colors.light);
      doc.rect(0, yPos, 210, 35, 'F');

      // Thank you message
      doc.setTextColor(...colors.primary);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Thank you for choosing ${companyInfo.name}!`, 15, yPos + 12);

      // Additional info
      doc.setTextColor(...colors.textMuted);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('This is a computer-generated receipt and does not require a signature.', 15, yPos + 20);
      doc.text('For any queries, please contact our customer support team.', 15, yPos + 25);

      // Digital signature placeholder
      doc.setDrawColor(...colors.border);
      doc.rect(140, yPos + 5, 50, 20);
      doc.setTextColor(...colors.textMuted);
      doc.setFontSize(8);
      doc.text('Digitally Signed', 150, yPos + 16);
      doc.text(`${companyInfo.name}`, 145, yPos + 20);
    };

    // Generate Receipt Content
    await addReceiptHeader();

    let yPos = 55;

    // Receipt Information
    yPos = addSection('RECEIPT INFORMATION', yPos, '🧾');
    yPos = addInfoRow('Receipt Number', receiptId, yPos);
    yPos = addInfoRow('Receipt Date', new Date().toLocaleDateString(), yPos);
    yPos = addInfoRow('Booking Reference', `#${bookingData.id || 'N/A'}`, yPos);
    yPos += 5;

    // Customer Information
    yPos = addSection('CUSTOMER DETAILS', yPos, '👤');
    yPos = addInfoRow('Customer Name', bookingData.customerName, yPos);
    yPos = addInfoRow('Phone Number', bookingData.phone, yPos);
    yPos = addInfoRow('Email Address', bookingData.email, yPos);
    yPos += 5;

    // Trip Information
    yPos = addSection('TRIP DETAILS', yPos, '🗺️');
    yPos = addInfoRow('Route', `${bookingData.pickupLocation} → ${bookingData.dropLocation}`, yPos);
    yPos = addInfoRow('Travel Date', bookingData.startDate ? new Date(bookingData.startDate).toLocaleDateString() : 'N/A', yPos);
    yPos = addInfoRow('Bus Type', bookingData.busType, yPos);
    yPos += 5;

    // Payment Details
    yPos = addSection('PAYMENT DETAILS', yPos, '💳');
    yPos = addPaymentTable(yPos);

    // Tax Breakdown
    yPos = addSection('TAX BREAKDOWN', yPos, '📊');
    yPos = addTaxBreakdown(yPos);

    // Footer
    addReceiptFooter(yPos + 10);

    // Add page numbers and timestamp
    doc.setTextColor(...colors.textMuted);
    doc.setFontSize(8);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 15, 290);
    doc.text('Page 1 of 1', 180, 290);

    // Save the PDF
    const fileName = `Receipt_${receiptId}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    console.log('✅ Professional Receipt generated successfully:', fileName);
    return { success: true, fileName };

  } catch (error) {
    console.error('❌ Error generating professional receipt:', error);
    return { success: false, error: error.message };
  }
};
