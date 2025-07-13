// Test authentication with the created user
async function testAuthentication() {
  console.log('🧪 Testing Authentication...\n');

  const testCredentials = [
    { username: 'Srivatsan', password: 'password123' },
    { username: 'Srivatsan', password: 'wrongpassword' },
    { username: 'admin', password: 'admin123' } // Mock user fallback test
  ];

  for (const credentials of testCredentials) {
    console.log(`\n🔐 Testing: ${credentials.username} / ${credentials.password}`);
    
    try {
      const response = await fetch('http://localhost:5050/api/Users/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Authentication successful!');
        console.log(`   User: ${userData.name} (${userData.username})`);
        console.log(`   Role: ${userData.role}`);
        console.log(`   Email: ${userData.email}`);
      } else if (response.status === 401) {
        console.log('❌ Authentication failed: Invalid credentials');
      } else {
        console.log(`❌ API Error: ${response.status}`);
        const errorText = await response.text();
        console.log(`   Error: ${errorText}`);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }

  // Test user list
  console.log('\n📋 Current users in database:');
  try {
    const response = await fetch('http://localhost:5050/api/Users');
    if (response.ok) {
      const users = await response.json();
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.name}) - ${user.role} - ${user.status}`);
      });
    }
  } catch (error) {
    console.log('❌ Error fetching users:', error.message);
  }
}

testAuthentication();
