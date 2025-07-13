// Test script to check bus allocation API data
async function testBusAllocationAPI() {
  try {
    console.log('🧪 Testing Bus Allocation API...\n');

    const response = await fetch('http://localhost:5050/api/BusAllocation');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allocations = await response.json();
    console.log(`✅ Found ${allocations.length} bus allocations\n`);

    if (allocations.length === 0) {
      console.log('❌ No allocations found in database');
      return;
    }

    // Analyze the data
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    allocations.forEach((allocation, index) => {
      const startDate = new Date(allocation.tripStartDate);
      const endDate = new Date(allocation.tripEndDate);
      const isUpcoming = startDate >= today;
      const isCurrent = startDate <= today && endDate >= today;
      const isPast = endDate < today;

      console.log(`📋 Allocation ${index + 1}:`);
      console.log(`  - ID: ${allocation.id}`);
      console.log(`  - Bus ID: ${allocation.busId}`);
      console.log(`  - Booking ID: ${allocation.bookingId}`);
      console.log(`  - Start Date: ${startDate.toLocaleDateString()}`);
      console.log(`  - End Date: ${endDate.toLocaleDateString()}`);
      console.log(`  - Status: ${allocation.status}`);
      console.log(`  - Category: ${isUpcoming ? 'UPCOMING' : isCurrent ? 'CURRENT' : 'PAST'}`);
      console.log(`  - Bus: ${allocation.bus?.registrationNumber || 'N/A'}`);
      console.log(`  - Customer: ${allocation.booking?.customerName || 'N/A'}`);
      console.log('');
    });

    // Summary
    const upcoming = allocations.filter(a => new Date(a.tripStartDate) >= today);
    const current = allocations.filter(a => {
      const start = new Date(a.tripStartDate);
      const end = new Date(a.tripEndDate);
      return start <= today && end >= today;
    });
    const past = allocations.filter(a => new Date(a.tripEndDate) < today);

    console.log('📊 Summary:');
    console.log(`  - Total Allocations: ${allocations.length}`);
    console.log(`  - Upcoming: ${upcoming.length}`);
    console.log(`  - Current: ${current.length}`);
    console.log(`  - Past: ${past.length}`);
    console.log('');

    if (upcoming.length === 0) {
      console.log('⚠️  No upcoming allocations found!');
      console.log('   This explains why the Bus Allocation Dashboard appears empty.');
      console.log('   The default filter is set to "upcoming" trips only.');
      console.log('');
      console.log('💡 Solutions:');
      console.log('   1. Change default filter to "all" trips');
      console.log('   2. Create test allocations with future dates');
      console.log('   3. Manually change filter in the UI to "All Trips"');
    }

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

// Run the test
testBusAllocationAPI();
