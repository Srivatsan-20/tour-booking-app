// Logo utility for PDF generation
export const getLogoBase64 = () => {
  // TODO: Replace this with actual base64 of the Sri Sai Senthil logo
  // The logo should be converted to base64 format and placed here
  // For now, returning null to use the styled fallback
  return null;
};

// Function to load logo from file (for future implementation)
export const loadLogoFromFile = async () => {
  try {
    // This would load the logo from public/logo.png
    const response = await fetch('/logo.png');
    if (response.ok) {
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }
  } catch (error) {
    console.error('Error loading logo:', error);
  }
  return null;
};

export const addLogoToPDF = async (doc, x, y, width, height) => {
  try {
    // Try to load the actual logo first
    let logoBase64 = getLogoBase64();

    if (!logoBase64) {
      // Try to load from file
      logoBase64 = await loadLogoFromFile();
    }

    if (logoBase64) {
      // Add the actual logo image
      doc.addImage(logoBase64, 'PNG', x, y, width, height);
      return true;
    } else {
      // Fallback: Create a styled logo representation
      addStyledLogoFallback(doc, x, y, width, height);
      return false;
    }
  } catch (error) {
    console.error('Error adding logo to PDF:', error);
    addStyledLogoFallback(doc, x, y, width, height);
    return false;
  }
};

const addStyledLogoFallback = (doc, x, y, width, height) => {
  // Create a styled representation of the Sri Sai Senthil logo
  const colors = {
    maroon: [139, 69, 19],
    gold: [255, 215, 0],
    cream: [245, 245, 220],
    darkMaroon: [101, 67, 33]
  };

  // Logo background with ornate border (matching the original design)
  doc.setFillColor(...colors.cream);
  doc.roundedRect(x, y, width, height, 4, 4, 'F');

  // Ornate border (double border like the original)
  doc.setDrawColor(...colors.maroon);
  doc.setLineWidth(1.5);
  doc.roundedRect(x, y, width, height, 4, 4);
  doc.setLineWidth(0.5);
  doc.roundedRect(x + 1, y + 1, width - 2, height - 2, 3, 3);

  const centerX = x + width / 2;
  const centerY = y + height * 0.3;

  // Temple gopuram (simplified but more detailed)
  doc.setFillColor(...colors.maroon);

  // Main temple structure
  const templeWidth = width * 0.4;
  const templeHeight = height * 0.25;
  doc.rect(centerX - templeWidth / 2, centerY, templeWidth, templeHeight, 'F');

  // Temple tiers (simplified gopuram style)
  for (let i = 0; i < 3; i++) {
    const tierWidth = templeWidth - (i * 3);
    const tierHeight = 2;
    doc.rect(centerX - tierWidth / 2, centerY - (i * 2), tierWidth, tierHeight, 'F');
  }

  // Temple top
  doc.setFillColor(...colors.gold);
  doc.circle(centerX, centerY - 6, 1.5, 'F');

  // Religious symbols (simplified)
  doc.setTextColor(...colors.maroon);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text('ॐ', centerX + templeWidth / 2 + 2, centerY + 3); // Om symbol
  doc.text('🔱', centerX - templeWidth / 2 - 4, centerY + 3); // Trishul

  // Bus symbol (more detailed)
  const busY = centerY + templeHeight + 3;
  doc.setFillColor(...colors.gold);
  doc.roundedRect(centerX - width * 0.35, busY, width * 0.7, height * 0.15, 2, 2, 'F');

  // Bus details
  doc.setFillColor(...colors.maroon);
  doc.rect(centerX - width * 0.3, busY + 1, width * 0.6, height * 0.08, 'F');

  // Bus wheels
  doc.setFillColor(...colors.darkMaroon);
  doc.circle(centerX - width * 0.25, busY + height * 0.15, 1.5, 'F');
  doc.circle(centerX + width * 0.25, busY + height * 0.15, 1.5, 'F');

  // Company name (Tamil style)
  doc.setTextColor(...colors.maroon);
  doc.setFontSize(width > 25 ? 7 : 5);
  doc.setFont('helvetica', 'bold');
  doc.text('ஸ்ரீ சாயி', centerX - width * 0.25, y + height - 8);
  doc.text('செந்தில்', centerX - width * 0.25, y + height - 3);
};

// Company branding information
export const getCompanyInfo = () => {
  return {
    name: 'SRI SAI SENTHIL',
    tagline: 'TOURS AND TRAVELS',
    tamilName: 'ஸ்ரீ சாயி செந்தில்',
    phone: '+91-1800-SAI-TOURS',
    email: 'bookings@srisaisenthil.com',
    website: 'www.srisaisenthiltours.com',
    address: 'Professional Travel & Tourism Services'
  };
};
