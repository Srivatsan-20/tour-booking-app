// Create a test user with known credentials
async function createTestUser() {
  console.log('🧪 Creating test user...\n');

  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    name: 'Test User',
    role: 'admin',
    password: 'test123',
    phone: '+91-9999999999',
    status: 'active',
    notes: 'Test user for authentication testing'
  };

  try {
    console.log('🔄 Creating user:', testUser.username);
    const response = await fetch('http://localhost:5050/api/Users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    if (response.ok) {
      const createdUser = await response.json();
      console.log('✅ User created successfully!');
      console.log(`   ID: ${createdUser.id}`);
      console.log(`   Username: ${createdUser.username}`);
      console.log(`   Name: ${createdUser.name}`);
      console.log(`   Role: ${createdUser.role}`);
      
      // Now test authentication
      console.log('\n🔐 Testing authentication with new user...');
      const authResponse = await fetch('http://localhost:5050/api/Users/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: testUser.username,
          password: testUser.password
        })
      });

      if (authResponse.ok) {
        const userData = await authResponse.json();
        console.log('✅ Authentication successful!');
        console.log(`   Authenticated as: ${userData.name} (${userData.username})`);
        console.log(`   Role: ${userData.role}`);
        console.log('\n🎉 You can now login with:');
        console.log(`   Username: ${testUser.username}`);
        console.log(`   Password: ${testUser.password}`);
      } else {
        console.log('❌ Authentication failed');
        const errorText = await authResponse.text();
        console.log(`   Error: ${errorText}`);
      }

    } else {
      const errorText = await response.text();
      console.log('❌ Failed to create user:', errorText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

createTestUser();
