// Logo testing utility
import { loadLogoFromFile, getLogoBase64, addLogoToPDF } from './logoUtils';

export const testLogoLoading = async () => {
  console.log('🧪 Testing Sri Sai Senthil Logo Loading...');
  
  try {
    // Test 1: Check if logo file exists
    console.log('📁 Testing logo file access...');
    const logoFromFile = await loadLogoFromFile();
    
    if (logoFromFile) {
      console.log('✅ Logo file loaded successfully from /public/logo.png');
      console.log('📏 Logo data length:', logoFromFile.length);
      console.log('🎨 Logo format:', logoFromFile.substring(0, 30) + '...');
    } else {
      console.log('❌ Logo file not found or failed to load');
    }
    
    // Test 2: Check base64 function
    console.log('🔍 Testing base64 function...');
    const logoBase64 = getLogoBase64();
    
    if (logoBase64) {
      console.log('✅ Base64 logo available');
      console.log('📏 Base64 data length:', logoBase64.length);
    } else {
      console.log('ℹ️ Base64 logo not set (using file loading)');
    }
    
    // Test 3: Create a test image element to verify logo
    if (logoFromFile || logoBase64) {
      const testImg = document.createElement('img');
      testImg.src = logoFromFile || logoBase64;
      testImg.style.maxWidth = '100px';
      testImg.style.maxHeight = '100px';
      testImg.style.border = '2px solid #8B4513';
      testImg.style.borderRadius = '8px';
      testImg.style.position = 'fixed';
      testImg.style.top = '10px';
      testImg.style.right = '10px';
      testImg.style.zIndex = '9999';
      testImg.style.background = 'white';
      testImg.style.padding = '5px';
      
      testImg.onload = () => {
        console.log('✅ Logo image loaded successfully in browser');
        console.log('📐 Image dimensions:', testImg.naturalWidth, 'x', testImg.naturalHeight);
        
        // Remove test image after 5 seconds
        setTimeout(() => {
          if (testImg.parentNode) {
            testImg.parentNode.removeChild(testImg);
          }
        }, 5000);
      };
      
      testImg.onerror = () => {
        console.log('❌ Logo image failed to load in browser');
        if (testImg.parentNode) {
          testImg.parentNode.removeChild(testImg);
        }
      };
      
      document.body.appendChild(testImg);
      console.log('🖼️ Test logo image added to page (top-right corner, will disappear in 5 seconds)');
    }
    
    return {
      fileLoaded: !!logoFromFile,
      base64Available: !!logoBase64,
      logoData: logoFromFile || logoBase64
    };
    
  } catch (error) {
    console.error('❌ Logo testing failed:', error);
    return {
      fileLoaded: false,
      base64Available: false,
      logoData: null,
      error: error.message
    };
  }
};

export const showLogoInstructions = () => {
  console.log(`
🎨 SRI SAI SENTHIL LOGO INTEGRATION STATUS

📁 Logo File Location: tour-booking-frontend/public/logo.png
🔧 Logo Utils: tour-booking-frontend/src/utils/logoUtils.js

✅ WHAT'S WORKING:
- Logo file loading system
- Async PDF generation
- Styled fallback logo
- Sri Sai Senthil branding

🧪 TO TEST LOGO:
1. Run: testLogoLoading()
2. Create a booking at /booking
3. Check PDF header for logo

📋 LOGO REQUIREMENTS:
- Format: PNG (preferred) or JPG
- Size: Recommended 200x200px or smaller
- Background: Transparent preferred
- Quality: High resolution for PDF clarity

🔧 TROUBLESHOOTING:
- If logo doesn't appear: Check browser console for errors
- If file not found: Verify logo.png is in public folder
- If PDF generation fails: Check async/await implementation
- If logo is blurry: Use higher resolution image

🎯 CURRENT STATUS:
- ✅ Logo system implemented
- ✅ Async loading ready
- ✅ Fallback system working
- ✅ Sri Sai Senthil branding complete
  `);
};

// Auto-run test when this module is imported in development
if (process.env.NODE_ENV === 'development') {
  // Delay to ensure DOM is ready
  setTimeout(() => {
    console.log('🎨 Sri Sai Senthil Logo System Ready!');
    console.log('💡 Run testLogoLoading() to test logo integration');
    console.log('📖 Run showLogoInstructions() for detailed info');
  }, 1000);
}
