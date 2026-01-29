import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * PermissionGate component - Shows/hides content based on user permissions
 * 
 * @param {string} permission - Single permission required
 * @param {string[]} permissions - Array of permissions (user needs at least one)
 * @param {string[]} allPermissions - Array of permissions (user needs all)
 * @param {React.ReactNode} children - Content to show if user has permission
 * @param {React.ReactNode} fallback - Content to show if user lacks permission
 * @param {boolean} invert - If true, shows content when user DOESN'T have permission
 */
const PermissionGate = ({ 
  permission, 
  permissions, 
  allPermissions,
  children, 
  fallback = null,
  invert = false 
}) => {
  const { hasPermission, hasAnyPermission } = useAuth();

  let hasAccess = false;

  // Check single permission
  if (permission) {
    hasAccess = hasPermission(permission);
  }
  // Check if user has any of the permissions
  else if (permissions) {
    hasAccess = hasAnyPermission(permissions);
  }
  // Check if user has all permissions
  else if (allPermissions) {
    hasAccess = allPermissions.every(perm => hasPermission(perm));
  }
  // If no permission specified, allow access
  else {
    hasAccess = true;
  }

  // Invert logic if requested
  if (invert) {
    hasAccess = !hasAccess;
  }

  return hasAccess ? children : fallback;
};

export default PermissionGate;
