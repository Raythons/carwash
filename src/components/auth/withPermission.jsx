import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Higher-order component that prevents component rendering entirely
 * if user doesn't have required permissions. This is more aggressive
 * than ProtectedRoute and prevents any component mounting.
 */
const withPermission = (WrappedComponent, requiredPermission) => {
  const WithPermissionComponent = (props) => {
    const { hasPermission, isAuthenticated, loading } = useAuth();

    // Don't render anything while loading or if not authenticated
    if (loading || !isAuthenticated) {
      return null;
    }

    // Don't render if permission check fails
    if (requiredPermission && !hasPermission(requiredPermission)) {
      return null;
    }

    // Only render the component if all checks pass
    return <WrappedComponent {...props} />;
  };

  WithPermissionComponent.displayName = `withPermission(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithPermissionComponent;
};

export default withPermission;
