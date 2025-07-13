// Create comprehensive test trip accounts for testing edit functionality
const API_BASE = 'http://localhost:5050/api';

const testTripAccounts = [
  {
    bookingId: 30, // Priya Sharma's booking (Mumbai to Goa)
    busExpenses: [
      {
        busNumber: "Bus 1 (MH-01-AB-1234)",
        driverBatta: 2500,
        numberOfDays: 6,
        startingOdometer: 45000,
        endingOdometer: 45850,
        fuelEntries: [
          { location: "Mumbai Petrol Pump", liters: 60, cost: 5400 },
          { location: "Pune Highway", liters: 45, cost: 4050 },
          { location: "Goa Entry", liters: 40, cost: 3600 }
        ],
        otherExpenses: [
          { description: "Toll Charges", amount: 1200 },
          { description: "Parking Fees", amount: 300 },
          { description: "Driver Meals", amount: 800 }
        ]
      }
    ]
  },
  {
    bookingId: 31, // Rajesh Patel's booking (Gujarat tour)
    busExpenses: [
      {
        busNumber: "Bus 1 (KA-03-EF-9012)",
        driverBatta: 3000,
        numberOfDays: 6,
        startingOdometer: 28000,
        endingOdometer: 28750,
        fuelEntries: [
          { location: "Ahmedabad Central", liters: 55, cost: 4950 },
          { location: "Rajkot Highway", liters: 50, cost: 4500 },
          { location: "Dwarka", liters: 35, cost: 3150 }
        ],
        otherExpenses: [
          { description: "Highway Toll", amount: 800 },
          { description: "Temple Parking", amount: 200 },
          { description: "Driver Accommodation", amount: 1500 }
        ]
      }
    ]
  },
  {
    bookingId: 32, // Anita Singh's booking (Delhi to Manali - Multi-bus)
    busExpenses: [
      {
        busNumber: "Bus 1 (GJ-04-GH-3456)",
        driverBatta: 3500,
        numberOfDays: 9,
        startingOdometer: 78000,
        endingOdometer: 78950,
        fuelEntries: [
          { location: "Delhi ISBT", liters: 40, cost: 3600 },
          { location: "Chandigarh", liters: 35, cost: 3150 },
          { location: "Shimla", liters: 30, cost: 2700 },
          { location: "Manali", liters: 25, cost: 2250 }
        ],
        otherExpenses: [
          { description: "Mountain Road Toll", amount: 600 },
          { description: "Chain Charges", amount: 400 },
          { description: "Driver Mountain Allowance", amount: 1000 },
          { description: "Emergency Repairs", amount: 2500 }
        ]
      },
      {
        busNumber: "Bus 2 (RJ-05-IJ-7890)",
        driverBatta: 4000,
        numberOfDays: 9,
        startingOdometer: 15000,
        endingOdometer: 15950,
        fuelEntries: [
          { location: "Delhi ISBT", liters: 45, cost: 4050 },
          { location: "Chandigarh", liters: 40, cost: 3600 },
          { location: "Shimla", liters: 35, cost: 3150 },
          { location: "Manali", liters: 30, cost: 2700 }
        ],
        otherExpenses: [
          { description: "Luxury Bus Toll", amount: 800 },
          { description: "Premium Parking", amount: 500 },
          { description: "Driver Premium Allowance", amount: 1200 },
          { description: "AC Maintenance", amount: 1500 }
        ]
      }
    ]
  }
];

async function createTestTripAccounts() {
  console.log('🧪 Creating comprehensive test trip accounts for edit testing...\n');

  for (let i = 0; i < testTripAccounts.length; i++) {
    const tripAccount = testTripAccounts[i];
    
    try {
      console.log(`Creating trip account ${i + 1} for booking ID ${tripAccount.bookingId}...`);
      
      const response = await fetch(`${API_BASE}/TripExpenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripAccount),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Trip account created with ID: ${result.id}`);
        
        // Calculate and display totals for verification
        let totalExpenses = 0;
        tripAccount.busExpenses.forEach((bus, busIndex) => {
          const fuelTotal = bus.fuelEntries.reduce((sum, fuel) => sum + fuel.cost, 0);
          const otherTotal = bus.otherExpenses.reduce((sum, expense) => sum + expense.amount, 0);
          const busTotal = bus.driverBatta + fuelTotal + otherTotal;
          const distance = bus.endingOdometer - bus.startingOdometer;
          
          console.log(`  🚌 ${bus.busNumber}:`);
          console.log(`    - Distance: ${distance} KM`);
          console.log(`    - Driver Batta: ₹${bus.driverBatta}`);
          console.log(`    - Fuel Cost: ₹${fuelTotal} (${bus.fuelEntries.length} entries)`);
          console.log(`    - Other Expenses: ₹${otherTotal} (${bus.otherExpenses.length} entries)`);
          console.log(`    - Bus Total: ₹${busTotal}`);
          
          totalExpenses += busTotal;
        });
        
        console.log(`  💰 Total Trip Expenses: ₹${totalExpenses}`);
        console.log('');
        
      } else {
        const error = await response.text();
        console.log(`❌ Failed to create trip account: ${error}`);
      }
    } catch (error) {
      console.log(`❌ Error creating trip account: ${error.message}`);
    }
  }

  console.log('🎉 Test trip accounts creation completed!');
  console.log('\n📊 Test Data Summary:');
  console.log('- Single Bus Trip: Mumbai to Goa (6 days, 850 KM)');
  console.log('- Single Bus Trip: Gujarat Tour (6 days, 750 KM)');
  console.log('- Multi Bus Trip: Delhi to Manali (9 days, 950 KM each bus)');
  console.log('\n🧪 Ready for comprehensive edit testing!');
  console.log('Test URLs:');
  console.log('- Trip Accounts List: http://localhost:5173/admin/trip-accounts');
  console.log('- Edit Trip Account 1: http://localhost:5173/admin/trip-accounts/1/edit');
  console.log('- Edit Trip Account 2: http://localhost:5173/admin/trip-accounts/2/edit');
  console.log('- Edit Trip Account 3: http://localhost:5173/admin/trip-accounts/3/edit');
}

// Run the script
createTestTripAccounts().catch(console.error);
