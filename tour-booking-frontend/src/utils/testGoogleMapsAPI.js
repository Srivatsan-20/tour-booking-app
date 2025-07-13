// Test utility to verify Google Maps API integration
export const testGoogleMapsAPI = async () => {
  try {
    console.log('🧪 Testing Google Maps API integration...');

    // Test feasibility check endpoint
    const testRequest = {
      startingPoint: 'Dharmapuri',
      places: [
        { placeName: 'Chennai', priority: 1 },
        { placeName: 'Kanyakumari', priority: 1 }
      ],
      numberOfDays: 2,
      maxDrivingHoursPerDay: 10
    };

    const response = await fetch('http://localhost:5050/api/TourPlanner/feasibility-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRequest)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Google Maps API test successful:', result);
      return { success: true, data: result };
    } else {
      console.error('❌ Google Maps API test failed:', response.status);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('❌ Google Maps API test error:', error);
    return { success: false, error: error.message };
  }
};

// Test places endpoint
export const testPlacesAPI = async () => {
  try {
    console.log('🧪 Testing Places API...');

    const response = await fetch('http://localhost:5050/api/TourPlanner/places');

    if (response.ok) {
      const places = await response.json();
      console.log('✅ Places API test successful:', places.length, 'places loaded');
      return { success: true, data: places };
    } else {
      console.error('❌ Places API test failed:', response.status);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('❌ Places API test error:', error);
    return { success: false, error: error.message };
  }
};

// Test full tour planning
export const testFullTourPlanning = async () => {
  try {
    console.log('🧪 Testing Full Tour Planning with Google Maps...');

    const testRequest = {
      startingPoint: 'Dharmapuri',
      places: [
        { placeName: 'Chennai', customVisitDurationMinutes: 480, priority: 1 },
        { placeName: 'Kanyakumari', customVisitDurationMinutes: 360, priority: 1 },
        { placeName: 'Madurai', customVisitDurationMinutes: 300, priority: 2 }
      ],
      numberOfDays: 3,
      maxDrivingHoursPerDay: 10,
      tripName: 'Google Maps API Test Tour'
    };

    const response = await fetch('http://localhost:5050/api/TourPlanner/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRequest)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Full tour planning test successful:', result);

      // Check if we got real Google Maps data
      const hasRealDistances = result.dayItineraries?.some(day =>
        day.stops?.some(stop => stop.distanceKm && stop.distanceKm > 0)
      );

      if (hasRealDistances) {
        console.log('🗺️ Google Maps API is providing real distance data!');
      } else {
        console.log('⚠️ Using fallback data - Google Maps API may not be working');
      }

      return { success: true, data: result, hasRealData: hasRealDistances };
    } else {
      console.error('❌ Full tour planning test failed:', response.status);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('❌ Full tour planning test error:', error);
    return { success: false, error: error.message };
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('🚀 Running Smart Tour Planner API Tests...');

  const results = {
    places: await testPlacesAPI(),
    feasibility: await testGoogleMapsAPI(),
    fullPlanning: await testFullTourPlanning()
  };

  console.log('📊 Test Results Summary:', results);

  const allPassed = Object.values(results).every(r => r.success);
  const hasGoogleMaps = results.fullPlanning.hasRealData;

  if (allPassed) {
    if (hasGoogleMaps) {
      console.log('🎉 All tests passed! Google Maps API is working perfectly!');
    } else {
      console.log('✅ All tests passed! Using fallback mode (Google Maps API key may need verification)');
    }
  } else {
    console.log('❌ Some tests failed. Check the logs above for details.');
  }

  return { allPassed, hasGoogleMaps, results };
};
