// Create sample bus allocations
const API_BASE = 'http://localhost:5050/api';

const sampleAllocations = [
  {
    busId: 1, // MH-01-AB-1234
    bookingId: 30, // Priya Sharma's booking
    tripStartDate: '2025-01-15',
    tripEndDate: '2025-01-20',
    allocatedPerDayRent: 4500,
    allocatedMountainRent: 0,
    assignedDriver: 'Rajesh Kumar',
    driverPhone: '+91-9876543210',
    notes: 'Mumbai to Goa trip - Premium AC Sleeper'
  },
  {
    busId: 3, // KA-03-EF-9012
    bookingId: 31, // Rajesh Patel's booking
    tripStartDate: '2025-01-25',
    tripEndDate: '2025-01-30',
    allocatedPerDayRent: 5200,
    allocatedMountainRent: 0,
    assignedDriver: 'Amit Singh',
    driverPhone: '+91-9234567890',
    notes: 'Gujarat tour - Volvo AC Seater'
  },
  {
    busId: 4, // GJ-04-GH-3456
    bookingId: 32, // Anita Singh's booking
    tripStartDate: '2025-02-10',
    tripEndDate: '2025-02-18',
    allocatedPerDayRent: 2800,
    allocatedMountainRent: 400,
    assignedDriver: 'Prakash Joshi',
    driverPhone: '+91-9345678901',
    notes: 'Delhi to Manali - Mountain terrain experience required'
  }
];

async function createAllocations() {
  console.log('🚌 Creating sample bus allocations...\n');

  for (const allocation of sampleAllocations) {
    try {
      const response = await fetch(`${API_BASE}/BusAllocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allocation),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Allocation created with ID: ${result.id} (Bus ID: ${allocation.busId}, Booking ID: ${allocation.bookingId})`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed to create allocation: ${error}`);
      }
    } catch (error) {
      console.log(`❌ Error creating allocation: ${error.message}`);
    }
  }

  console.log('\n🎉 Bus allocations created successfully!');
  console.log('\n📊 Summary:');
  console.log(`- ${sampleAllocations.length} allocations created`);
  console.log('- Buses are now assigned to specific bookings');
  console.log('\n🌐 Check the allocation dashboard at: http://localhost:5173/admin/bus-allocation');
}

// Run the script
createAllocations().catch(console.error);
