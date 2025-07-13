// Update Srivatsan user's password to a known value
async function updateSrivatsanPassword() {
  console.log('🔄 Updating Srivatsan user password...\n');

  const userId = 1; // Srivatsan's user ID
  const newPassword = 'srivatsan123';

  const updateData = {
    username: 'Srivatsan',
    email: 'manivannansrivatsan@gmail.com',
    name: 'srivatsan',
    role: 'admin',
    password: newPassword,
    phone: '9445269013',
    status: 'active',
    notes: 'Updated password for testing'
  };

  try {
    console.log(`🔄 Updating user ${userId} password...`);
    const response = await fetch(`http://localhost:5050/api/Users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      console.log('✅ Password updated successfully!');
      
      // Test authentication with new password
      console.log('\n🔐 Testing authentication with updated password...');
      const authResponse = await fetch('http://localhost:5050/api/Users/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Srivatsan',
          password: newPassword
        })
      });

      if (authResponse.ok) {
        const userData = await authResponse.json();
        console.log('✅ Authentication successful!');
        console.log(`   Authenticated as: ${userData.name} (${userData.username})`);
        console.log(`   Role: ${userData.role}`);
        console.log('\n🎉 You can now login with:');
        console.log(`   Username: Srivatsan`);
        console.log(`   Password: ${newPassword}`);
      } else {
        console.log('❌ Authentication failed');
        const errorText = await authResponse.text();
        console.log(`   Error: ${errorText}`);
      }

    } else {
      const errorText = await response.text();
      console.log('❌ Failed to update password:', errorText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

updateSrivatsanPassword();
