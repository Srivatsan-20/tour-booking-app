// Utility to convert logo image to base64 for PDF embedding

export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const resizeImage = (file, maxWidth = 300, maxHeight = 300) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and resize
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64
      const base64 = canvas.toDataURL('image/png');
      resolve(base64);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Function to help developers add their logo
export const generateLogoBase64Code = async (imageFile) => {
  try {
    const resizedBase64 = await resizeImage(imageFile, 200, 200);
    
    const code = `
// Add this to logoUtils.js in the getLogoBase64 function:
export const getLogoBase64 = () => {
  return '${resizedBase64}';
};
    `;
    
    console.log('📋 Copy this code to logoUtils.js:', code);
    return code;
  } catch (error) {
    console.error('Error generating logo code:', error);
    return null;
  }
};

// Instructions for adding logo
export const getLogoInstructions = () => {
  return `
🎨 HOW TO ADD YOUR LOGO TO PDFs:

1. SAVE YOUR LOGO:
   - Save the Sri Sai Senthil logo as 'logo.png' in the 'public' folder
   - Recommended size: 200x200 pixels or smaller
   - Format: PNG with transparent background preferred

2. CONVERT TO BASE64:
   - Use the convertImageToBase64() function in this file
   - Or use an online base64 converter
   - Copy the resulting base64 string

3. UPDATE logoUtils.js:
   - Open src/utils/logoUtils.js
   - Replace the getLogoBase64() function return value
   - Change 'return null;' to 'return "data:image/png;base64,YOUR_BASE64_STRING";'

4. TEST THE PDF:
   - Create a new booking
   - Check that the logo appears in the PDF header
   - Verify it looks professional and properly sized

EXAMPLE:
export const getLogoBase64 = () => {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'; // Your base64 here
};

ALTERNATIVE METHOD:
- Use the generateLogoBase64Code() function in this file
- It will automatically generate the code for you
- Just copy and paste the result into logoUtils.js
  `;
};

// Demo function to show how to use
export const demoLogoConversion = () => {
  console.log(getLogoInstructions());
  
  // Example usage:
  // const fileInput = document.createElement('input');
  // fileInput.type = 'file';
  // fileInput.accept = 'image/*';
  // fileInput.onchange = async (e) => {
  //   const file = e.target.files[0];
  //   const code = await generateLogoBase64Code(file);
  //   console.log('Generated code:', code);
  // };
  // fileInput.click();
};
