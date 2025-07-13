import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // User roles and permissions
  const roles = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    DRIVER: 'driver',
    CUSTOMER: 'customer'
  };

  const permissions = {
    [roles.ADMIN]: [
      // Dashboard & Core Access
      'view_dashboard',

      // Bus Management - Full Access
      'manage_buses',
      'view_buses',

      // Booking Management - Full Access
      'manage_bookings',
      'create_booking',
      'view_bookings',

      // Bus Allocation - Full Access
      'manage_allocations',
      'view_allocations',

      // Trip Accounts - Full Access
      'manage_trip_accounts',
      'view_trip_accounts',

      // User Management - Admin Only
      'manage_users',
      'view_users',

      // Reports & Analytics
      'view_reports',
      'generate_reports',

      // System Administration
      'system_settings',
      'system_admin',

      // Driver Features (Admin can access all)
      'view_assigned_trips',
      'update_trip_status',
      'view_trip_details',
      'update_expenses',

      // Customer Features (Admin can access all)
      'view_own_bookings',
      'view_trip_status',
      'download_receipts',

      // Additional Admin Permissions
      'access_all_features',
      'override_permissions'
    ],
    [roles.MANAGER]: [
      'view_dashboard',
      'view_buses',
      'manage_bookings',
      'manage_allocations',
      'manage_trip_accounts',
      'view_reports',
      'create_booking'
    ],
    [roles.DRIVER]: [
      'view_assigned_trips',
      'update_trip_status',
      'view_trip_details',
      'update_expenses'
    ],
    [roles.CUSTOMER]: [
      'view_own_bookings',
      'create_booking',
      'view_trip_status',
      'download_receipts'
    ]
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user || !user.role) return false;

    // Admin has access to everything
    if (user.role === roles.ADMIN) return true;

    return permissions[user.role]?.includes(permission) || false;
  };

  // Check if user has any of the specified roles
  const hasRole = (roleOrRoles) => {
    if (!user || !user.role) return false;

    // Admin can access all role-based features
    if (user.role === roles.ADMIN) return true;

    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.includes(user.role);
    }
    return user.role === roleOrRoles;
  };

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('tour_booking_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('tour_booking_user');
      }
    }
    setLoading(false);
  }, []);

  // Sign in function
  const signIn = async (credentials) => {
    try {
      setLoading(true);

      // Use real API authentication with fallback to mock
      const response = await authenticateUser(credentials);

      if (response.success) {
        const userData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          role: response.user.role,
          name: response.user.name,
          token: response.token
        };

        setUser(userData);
        localStorage.setItem('tour_booking_user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('tour_booking_user');
  };

  // Real authentication function with API integration
  const authenticateUser = async (credentials) => {
    try {
      console.log('🔄 Authenticating user:', credentials.username);

      // Try real API first
      const response = await fetch('http://localhost:5050/api/Users/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ API Authentication successful:', userData);

        return {
          success: true,
          user: {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            name: userData.name,
            role: userData.role
          },
          token: `api_token_${userData.id}_${Date.now()}`
        };
      } else if (response.status === 401) {
        console.log('❌ API Authentication failed: Invalid credentials');
        // Fall back to mock users for existing demo accounts
        return await mockAuthenticate(credentials);
      } else {
        console.error('❌ API Error:', response.status);
        // Fall back to mock users if API has issues
        return await mockAuthenticate(credentials);
      }
    } catch (error) {
      console.error('❌ Authentication error:', error);
      // Fall back to mock users if API is unavailable
      return await mockAuthenticate(credentials);
    }
  };

  // Mock authentication function (fallback for demo accounts)
  const mockAuthenticate = async (credentials) => {
    console.log('🔄 Using mock authentication for demo accounts');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock users database
    const mockUsers = [
      {
        id: 1,
        username: 'admin',
        password: 'admin123',
        email: 'admin@tourbooking.com',
        name: 'System Administrator',
        role: roles.ADMIN
      },
      {
        id: 2,
        username: 'manager',
        password: 'manager123',
        email: 'manager@tourbooking.com',
        name: 'Operations Manager',
        role: roles.MANAGER
      },
      {
        id: 3,
        username: 'driver1',
        password: 'driver123',
        email: 'driver1@tourbooking.com',
        name: 'Rajesh Kumar',
        role: roles.DRIVER
      },
      {
        id: 4,
        username: 'customer1',
        password: 'customer123',
        email: 'customer1@email.com',
        name: 'Priya Sharma',
        role: roles.CUSTOMER
      }
    ];

    const user = mockUsers.find(u =>
      u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      console.log('✅ Mock authentication successful:', user.username);
      return {
        success: true,
        user: user,
        token: `mock_token_${user.id}_${Date.now()}`
      };
    } else {
      console.log('❌ Mock authentication failed');
      return {
        success: false,
        error: 'Invalid username or password'
      };
    }
  };

  const value = {
    user,
    loading,
    roles,
    signIn,
    signOut,
    hasPermission,
    hasRole,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
