import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import api from '../api/index';
import { initializeCurrency } from '../constants/currency';

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
  const [token, setToken] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Initialize currency from stored user if available
          const userData = JSON.parse(storedUser);
          if (userData.currency) {
            initializeCurrency(userData.currency);
          }
          
          // CRITICAL: Always fetch fresh permissions from backend BEFORE setting authenticated
          // This prevents the race condition where isAuthenticated=true but permissions=[]
          await fetchUserPermissions(storedToken);
          
          // Only set authenticated AFTER permissions are loaded
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      const data = response.data; // Extract the actual data from the nested response
      
      console.log('Login response:', response); // Debug log
      console.log('Access token:', data.accessToken); // Debug log
      
      // Check if we have an access token
      if (!data.accessToken) {
        throw new Error('No access token received from server');
      }
      
      // Simple user data
      const userData = {
        id: data.userId,
        email: data.email,
        name: data.name || 'Admin User',
        userType: data.userType || 'Owner', // Use actual userType from API
        organizationId: data.organizationId ?? null,
        currency: data.currency || null,
      };

      // Initialize currency constant
      if (data.currency) {
        initializeCurrency(data.currency);
      }

      // Store auth data
      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      if (userData.organizationId) {
        localStorage.setItem('organizationId', userData.organizationId.toString());
      } else {
        localStorage.removeItem('organizationId');
      }

      setToken(data.accessToken);
      setUser(userData);
      
      // Fetch permissions from backend
      await fetchUserPermissions();
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Fetch user permissions
  const fetchUserPermissions = async (authToken = token) => {
    try {
      const response = await api.get('/user-management/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        const userData = response.data;
        const userPermissions = userData.permissions || userData.Permissions || [];
        
        localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
        localStorage.setItem('authUser', JSON.stringify({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          userType: userData.userType,
          clinicId: userData.clinicId,
          clinicName: userData.clinicName,
          organizationId: userData.organizationId,
          currency: userData.currency,
        }));

        // Initialize currency constant
        if (userData.currency) {
          initializeCurrency(userData.currency);
        }

        if (userData.organizationId) {
          localStorage.setItem('organizationId', userData.organizationId.toString());
        }

        setPermissions(userPermissions);
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          userType: userData.userType,
          clinicId: userData.clinicId,
          clinicName: userData.clinicName,
          organizationId: userData.organizationId,
        });
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('organizationId');
    setToken(null);
    setUser(null);
    setPermissions([]);
    setIsAuthenticated(false);
  };

  // Helper function to determine user type based on permissions
  const determineUserType = (permissions) => {
    if (!permissions || permissions.length === 0) return 'User';
    
    // Check if user has all admin permissions
    const adminPermissions = ['Users.Manage', 'Roles.Manage', 'AllClinics.Access'];
    const hasAllAdminPerms = adminPermissions.every(perm => permissions.includes(perm));
    
    if (hasAllAdminPerms) return 'Owner';
    if (permissions.includes('Statistics.View')) return 'Doctor';
    return 'User';
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => permissions.includes(permission));
  };

  // Check if user can access specific clinic
  const canAccessClinic = (clinicId) => {
    // Owner can access all clinics
    if (hasPermission('AllClinics.Access')) {
      return true;
    }
    
    // Check clinic-specific access
    return hasPermission(`Clinic.Access.${clinicId}`);
  };

  // Get user role display name
  const getUserRoleDisplay = () => {
    if (!user?.userType) return 'User';
    
    const roleDisplayNames = {
      'Doctor': 'Doctor',
      'Reception': 'Reception',
      'Owner': 'Owner'
    };
    
    return roleDisplayNames[user.userType] || user.userType;
  };

  const value = {
    // State
    user,
    token,
    permissions,
    loading,
    isAuthenticated,
    
    // Actions
    login,
    logout,
    fetchUserPermissions,
    
    // Utilities
    hasPermission,
    hasAnyPermission,
    canAccessClinic,
    getUserRoleDisplay,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
