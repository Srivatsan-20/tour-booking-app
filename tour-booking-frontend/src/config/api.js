// Centralized API Configuration
const API_CONFIG = {
  // Base URL for all API calls
  BASE_URL: 'http://localhost:5051',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/Users/authenticate',
      USERS: '/api/Users'
    },
    
    // Booking Management
    BOOKING: {
      UPCOMING: '/api/Bookings/Upcoming',
      BY_ID: '/api/Bookings',
      PUBLIC_SEARCH: '/api/public/booking/search',
      PUBLIC_FEATURED: '/api/public/booking/featured'
    },
    
    // Bus Management
    BUS: {
      DASHBOARD: '/api/Bus/Dashboard',
      LIST: '/api/Bus',
      ALLOCATIONS: '/api/BusAllocations'
    },
    
    // Trip Accounts
    TRIP_ACCOUNTS: {
      LIST: '/api/TripExpenses',
      BY_ID: '/api/TripExpenses'
    },
    
    // Tour Planner
    TOUR_PLANNER: {
      PLACES: '/api/TourPlanner/places',
      GENERATE_SIMPLE: '/api/TourPlanner/generate-simple-plan'
    },
    
    // Customer Account
    CUSTOMER: {
      BOOKINGS: '/api/public/account'
    }
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for common API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Success: ${url}`);
    return { success: true, data };
    
  } catch (error) {
    console.error(`❌ API Error: ${url}`, error);
    return { success: false, error: error.message };
  }
};

// Export the configuration
export default API_CONFIG;
