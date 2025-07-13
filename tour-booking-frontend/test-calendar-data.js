// Test script to verify calendar data and create test allocations
const API_BASE = 'http://localhost:5050/api';

async function testCalendarData() {
  console.log('🧪 Testing Bus Calendar Data...\n');

  try {
    // Test 1: Fetch buses
    console.log('📋 Fetching buses...');
    const busResponse = await fetch(`${API_BASE}/Bus`);
    if (busResponse.ok) {
      const buses = await busResponse.json();
      console.log(`✅ Found ${buses.length} buses:`, buses.map(b => b.registrationNumber));
    } else {
      console.log('❌ Failed to fetch buses');
      return;
    }

    // Test 2: Fetch allocations
    console.log('\n📅 Fetching allocations...');
    const allocationResponse = await fetch(`${API_BASE}/BusAllocation`);
    if (allocationResponse.ok) {
      const allocations = await allocationResponse.json();
      console.log(`✅ Found ${allocations.length} allocations:`);
      
      allocations.forEach(allocation => {
        console.log(`  - ID: ${allocation.id}, Bus: ${allocation.busId}, Booking: ${allocation.bookingId}`);
        console.log(`    Dates: ${allocation.tripStartDate} to ${allocation.tripEndDate}`);
        console.log(`    Status: ${allocation.status}, Customer: ${allocation.booking?.customerName || 'N/A'}`);
      });

      // Check if any allocations are in current month
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const currentMonthAllocations = allocations.filter(allocation => {
        const startDate = new Date(allocation.tripStartDate);
        const endDate = new Date(allocation.tripEndDate);
        return (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear) ||
               (endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear);
      });

      console.log(`\n📊 Allocations in current month (${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}): ${currentMonthAllocations.length}`);
      
      if (currentMonthAllocations.length === 0) {
        console.log('⚠️  No allocations in current month - calendar will appear empty');
        console.log('💡 Creating test allocations for current month...');
        await createTestAllocations();
      }

    } else {
      console.log('❌ Failed to fetch allocations');
    }

  } catch (error) {
    console.error('❌ Error testing calendar data:', error.message);
  }
}

async function createTestAllocations() {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Create test bookings first
    const testBookings = [
      {
        customerName: "Calendar Test Customer 1",
        phone: "+91-9999999991",
        email: "test1@calendar.com",
        startDate: new Date(currentYear, currentMonth, 5).toISOString(),
        endDate: new Date(currentYear, currentMonth, 7).toISOString(),
        pickupLocation: "Test City A",
        dropLocation: "Test City B",
        numberOfBuses: 1,
        busType: "AC Sleeper",
        totalRent: 25000,
        advancePaid: 10000,
        notes: "Test booking for calendar"
      },
      {
        customerName: "Calendar Test Customer 2",
        phone: "+91-9999999992",
        email: "test2@calendar.com",
        startDate: new Date(currentYear, currentMonth, 12).toISOString(),
        endDate: new Date(currentYear, currentMonth, 16).toISOString(),
        pickupLocation: "Test City C",
        dropLocation: "Test City D",
        numberOfBuses: 1,
        busType: "AC Seater",
        totalRent: 30000,
        advancePaid: 15000,
        notes: "Test booking for calendar"
      }
    ];

    const createdBookings = [];
    for (const booking of testBookings) {
      const response = await fetch(`${API_BASE}/Bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });

      if (response.ok) {
        const createdBooking = await response.json();
        createdBookings.push(createdBooking);
        console.log(`✅ Created test booking: ${createdBooking.id}`);
      }
    }

    // Create test allocations
    const testAllocations = [
      {
        busId: 1,
        bookingId: createdBookings[0]?.id,
        tripStartDate: new Date(currentYear, currentMonth, 5).toISOString(),
        tripEndDate: new Date(currentYear, currentMonth, 7).toISOString(),
        plannedDays: 3,
        assignedDriver: "Test Driver 1",
        driverPhone: "+91-9999999991",
        status: 1, // Allocated
        plannedRevenue: 25000,
        notes: "Test allocation for calendar"
      },
      {
        busId: 2,
        bookingId: createdBookings[1]?.id,
        tripStartDate: new Date(currentYear, currentMonth, 12).toISOString(),
        tripEndDate: new Date(currentYear, currentMonth, 16).toISOString(),
        plannedDays: 5,
        assignedDriver: "Test Driver 2",
        driverPhone: "+91-9999999992",
        status: 2, // In Progress
        plannedRevenue: 30000,
        notes: "Test allocation for calendar"
      }
    ];

    for (const allocation of testAllocations) {
      if (allocation.bookingId) {
        const response = await fetch(`${API_BASE}/BusAllocation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(allocation)
        });

        if (response.ok) {
          const createdAllocation = await response.json();
          console.log(`✅ Created test allocation: ${createdAllocation.id}`);
        }
      }
    }

    console.log('\n🎉 Test allocations created! Refresh the calendar to see them.');

  } catch (error) {
    console.error('❌ Error creating test allocations:', error.message);
  }
}

// Run the test
testCalendarData();
