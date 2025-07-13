// Using built-in fetch (Node.js 18+)

const API_BASE = 'http://localhost:5050/api';

// Sample buses data
const sampleBuses = [
  {
    registrationNumber: 'MH-01-AB-1234',
    busType: 'AC Sleeper',
    make: 'Tata',
    model: 'Starbus',
    year: 2022,
    seatingCapacity: 0,
    sleeperCapacity: 40,
    features: 'AC, GPS, WiFi, Entertainment System, Reclining Seats, Reading Lights',
    status: 1,
    currentOdometer: 45000.5,
    defaultPerDayRent: 4500,
    defaultMountainRent: 800,
    assignedDriver: 'Rajesh Kumar',
    driverPhone: '+91-9876543210',
    notes: 'Premium luxury bus with excellent condition'
  },
  {
    registrationNumber: 'MH-02-CD-5678',
    busType: 'Non-AC Sleeper',
    make: 'Ashok Leyland',
    model: 'Viking',
    year: 2021,
    seatingCapacity: 0,
    sleeperCapacity: 36,
    features: 'GPS, Music System, Comfortable Berths, Curtains',
    status: 1,
    currentOdometer: 62000.0,
    defaultPerDayRent: 3200,
    defaultMountainRent: 500,
    assignedDriver: 'Suresh Patil',
    driverPhone: '+91-9123456789',
    notes: 'Reliable bus for long distance travel'
  },
  {
    registrationNumber: 'KA-03-EF-9012',
    busType: 'AC Seater',
    make: 'Volvo',
    model: 'B11R',
    year: 2023,
    seatingCapacity: 49,
    sleeperCapacity: 0,
    features: 'AC, GPS, WiFi, USB Charging, Comfortable Seats, Panoramic Windows',
    status: 1,
    currentOdometer: 28000.0,
    defaultPerDayRent: 5200,
    defaultMountainRent: 1000,
    assignedDriver: 'Amit Singh',
    driverPhone: '+91-9234567890',
    notes: 'Latest Volvo bus with premium features'
  },
  {
    registrationNumber: 'GJ-04-GH-3456',
    busType: 'Mini Bus',
    make: 'Force',
    model: 'Traveller',
    year: 2020,
    seatingCapacity: 26,
    sleeperCapacity: 0,
    features: 'AC, GPS, Music System',
    status: 1,
    currentOdometer: 78000.0,
    defaultPerDayRent: 2800,
    defaultMountainRent: 400,
    assignedDriver: 'Prakash Joshi',
    driverPhone: '+91-9345678901',
    notes: 'Perfect for small group tours'
  },
  {
    registrationNumber: 'RJ-05-IJ-7890',
    busType: 'Luxury Coach',
    make: 'Mercedes',
    model: 'Tourismo',
    year: 2023,
    seatingCapacity: 45,
    sleeperCapacity: 0,
    features: 'Premium AC, GPS, WiFi, Entertainment, Leather Seats, Panoramic Roof',
    status: 1,
    currentOdometer: 15000.0,
    defaultPerDayRent: 6500,
    defaultMountainRent: 1200,
    assignedDriver: 'Vikram Sharma',
    driverPhone: '+91-9456789012',
    notes: 'Ultra-luxury coach for VIP tours'
  },
  {
    registrationNumber: 'UP-06-KL-2468',
    busType: 'AC Sleeper',
    make: 'Tata',
    model: 'Starbus',
    year: 2021,
    seatingCapacity: 0,
    sleeperCapacity: 38,
    features: 'AC, GPS, Entertainment System, Individual Reading Lights',
    status: 2, // On Trip
    currentOdometer: 55000.0,
    defaultPerDayRent: 4200,
    defaultMountainRent: 700,
    assignedDriver: 'Ramesh Yadav',
    driverPhone: '+91-9567890123',
    notes: 'Currently on trip to Goa'
  },
  {
    registrationNumber: 'DL-07-MN-1357',
    busType: 'Non-AC Seater',
    make: 'Ashok Leyland',
    model: 'Lynx',
    year: 2019,
    seatingCapacity: 52,
    sleeperCapacity: 0,
    features: 'GPS, Music System, Comfortable Seats',
    status: 3, // Under Maintenance
    currentOdometer: 95000.0,
    defaultPerDayRent: 2500,
    defaultMountainRent: 300,
    assignedDriver: '',
    driverPhone: '',
    notes: 'Under maintenance - brake system service'
  },
  {
    registrationNumber: 'TN-08-OP-9753',
    busType: 'AC Sleeper',
    make: 'Volvo',
    model: 'B9R',
    year: 2022,
    seatingCapacity: 0,
    sleeperCapacity: 42,
    features: 'Premium AC, GPS, WiFi, Entertainment, Individual Controls',
    status: 1,
    currentOdometer: 38000.0,
    defaultPerDayRent: 5800,
    defaultMountainRent: 1100,
    assignedDriver: 'Arjun Reddy',
    driverPhone: '+91-9678901234',
    notes: 'High-end Volvo sleeper for premium tours'
  }
];

// Sample bookings data
const sampleBookings = [
  {
    customerName: 'Priya Sharma',
    phone: '+91-9876543210',
    email: 'priya.sharma@email.com',
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    pickupLocation: 'Mumbai Central',
    dropLocation: 'Goa Panaji',
    numberOfPassengers: 35,
    busType: 'AC Sleeper',
    numberOfBuses: 1,
    placesToCover: 'Mumbai, Pune, Goa beaches, Old Goa churches',
    preferredRoute: 'Mumbai-Pune-Kolhapur-Goa',
    specialRequirements: 'Vegetarian meals, early morning pickup',
    paymentMode: 'Online',
    language: 'English',
    perDayRent: 4500,
    mountainRent: 0,
    advancePaid: 15000,
    totalRent: 22500,
    useIndividualBusRates: false,
    busRents: []
  },
  {
    customerName: 'Rajesh Patel',
    phone: '+91-9123456789',
    email: 'rajesh.patel@email.com',
    startDate: '2025-01-25',
    endDate: '2025-01-30',
    pickupLocation: 'Ahmedabad Railway Station',
    dropLocation: 'Rajkot',
    numberOfPassengers: 45,
    busType: 'AC Seater',
    numberOfBuses: 1,
    placesToCover: 'Ahmedabad, Rajkot, Dwarka, Somnath',
    preferredRoute: 'Ahmedabad-Rajkot-Dwarka-Somnath',
    specialRequirements: 'AC bus required, Gujarati speaking driver',
    paymentMode: 'Cash',
    language: 'Gujarati',
    perDayRent: 5200,
    mountainRent: 0,
    advancePaid: 20000,
    totalRent: 26000,
    useIndividualBusRates: false,
    busRents: []
  },
  {
    customerName: 'Anita Singh',
    phone: '+91-9234567890',
    email: 'anita.singh@email.com',
    startDate: '2025-02-10',
    endDate: '2025-02-18',
    pickupLocation: 'Delhi ISBT',
    dropLocation: 'Manali',
    numberOfPassengers: 25,
    busType: 'Mini Bus',
    numberOfBuses: 1,
    placesToCover: 'Delhi, Chandigarh, Shimla, Manali, Rohtang Pass',
    preferredRoute: 'Delhi-Chandigarh-Shimla-Manali',
    specialRequirements: 'Mountain driving experience required',
    paymentMode: 'Online',
    language: 'Hindi',
    perDayRent: 2800,
    mountainRent: 400,
    advancePaid: 12000,
    totalRent: 25600,
    useIndividualBusRates: false,
    busRents: []
  },
  {
    customerName: 'Karthik Reddy',
    phone: '+91-9345678901',
    email: 'karthik.reddy@email.com',
    startDate: '2025-02-20',
    endDate: '2025-02-25',
    pickupLocation: 'Bangalore Majestic',
    dropLocation: 'Mysore',
    numberOfPassengers: 40,
    busType: 'Luxury Coach',
    numberOfBuses: 1,
    placesToCover: 'Bangalore, Mysore Palace, Ooty, Coorg',
    preferredRoute: 'Bangalore-Mysore-Ooty-Coorg',
    specialRequirements: 'Luxury coach with entertainment system',
    paymentMode: 'Online',
    language: 'English',
    perDayRent: 6500,
    mountainRent: 1200,
    advancePaid: 25000,
    totalRent: 40700,
    useIndividualBusRates: false,
    busRents: []
  }
];

async function createSampleData() {
  console.log('🚀 Creating sample data for Bus Management System...\n');

  // Create buses
  console.log('📋 Creating sample buses...');
  for (const bus of sampleBuses) {
    try {
      const response = await fetch(`${API_BASE}/Bus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bus),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Bus ${bus.registrationNumber} created with ID: ${result.id}`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed to create bus ${bus.registrationNumber}: ${error}`);
      }
    } catch (error) {
      console.log(`❌ Error creating bus ${bus.registrationNumber}: ${error.message}`);
    }
  }

  console.log('\n📋 Creating sample bookings...');
  // Create bookings
  for (const booking of sampleBookings) {
    try {
      const response = await fetch(`${API_BASE}/Bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Booking for ${booking.customerName} created with ID: ${result.id}`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed to create booking for ${booking.customerName}: ${error}`);
      }
    } catch (error) {
      console.log(`❌ Error creating booking for ${booking.customerName}: ${error.message}`);
    }
  }

  console.log('\n🎉 Sample data creation completed!');
  console.log('\n📊 Summary:');
  console.log(`- ${sampleBuses.length} buses created`);
  console.log(`- ${sampleBookings.length} bookings created`);
  console.log('\n🌐 You can now test the system at: http://localhost:5173');
}

// Run the script
createSampleData().catch(console.error);
