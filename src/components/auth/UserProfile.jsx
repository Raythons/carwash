import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Shield, Building, ChevronDown } from 'lucide-react';

const UserProfile = () => {
  const { user, logout, getUserRoleDisplay, permissions } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {/* User Profile Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        
        {/* User Info */}
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium text-gray-700">
            {user?.name || user?.email}
          </p>
          <p className="text-xs text-gray-500">
            {getUserRoleDisplay()}
          </p>
        </div>
        
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          ></div>
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {user?.name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="p-4 space-y-3">
              {/* Role */}
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm font-medium text-gray-700">
                    {getUserRoleDisplay()}
                  </p>
                </div>
              </div>

              {/* Clinic */}
              {user?.clinicName && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Clinic</p>
                    <p className="text-sm font-medium text-gray-700">
                      {user.clinicName}
                    </p>
                  </div>
                </div>
              )}

              {/* Permissions Count */}
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Permissions</p>
                  <p className="text-sm font-medium text-gray-700">
                    {permissions.length} active permissions
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
