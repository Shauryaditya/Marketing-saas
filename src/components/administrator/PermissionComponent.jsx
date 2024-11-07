import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch } from '../ui/switch';

const PermissionsComponent = ({ onPermissionsChange, permissions = [] }) => {
  const [selectedSection, setSelectedSection] = useState(0); // Initially select the first section
  const [sections, setSections] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});

  // Fetch permissions from the API only once on mount
  const fetchPermissions = async () => {
    try {
      const response = await axios.get('/v1/rbac/get-all-permission');
      setSections(response.data.data || []);

      // Initialize selectedPermissions, merging with the permissions prop
      const initialPermissions = response.data.data.reduce((acc, section) => {
        acc[section.section] = section.permissions
          .filter(permission => permissions.includes(permission.permissionKey))
          .map(permission => permission.permissionKey);
        return acc;
      }, {});
      setSelectedPermissions(initialPermissions);
      onPermissionsChange(Object.values(initialPermissions).flat());
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  // Remove permissions from the dependency array to prevent infinite calls
  useEffect(() => {
    fetchPermissions();
  }, []); // Empty dependency array to ensure it only runs on mount

  const togglePermission = (section, permissionKey) => {
    setSelectedPermissions(prev => {
      const updatedPermissions = { ...prev };
      if (updatedPermissions[section].includes(permissionKey)) {
        updatedPermissions[section] = updatedPermissions[section].filter(
          key => key !== permissionKey
        );
      } else {
        updatedPermissions[section].push(permissionKey);
      }
      onPermissionsChange(
        Object.values(updatedPermissions).flat() // Flatten the selected permissions array for easier API consumption
      );
      return updatedPermissions;
    });
  };

  return (
    <div className="flex rounded-lg shadow-md max-w-xl mx-auto mt-4 h-80">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 overflow-y-auto no-scrollbar">
        {sections.map((section, index) => (
          <div
            key={index}
            onClick={() => setSelectedSection(index)}
            className={`p-2 cursor-pointer text-xs ${
              selectedSection === index ? 'text-blue-500 bg-white font-bold' : 'text-gray-600'
            }`}
          >
            {section.section}
          </div>
        ))}
      </div>

      {/* Permissions Content */}
      <div className="w-2/3 pl-4">
        {sections[selectedSection] ? (
          <>
            <h2 className="font-semibold text-gray-700 mb-2">{sections[selectedSection].section}</h2>
            <div className="grid grid-cols-2 gap-y-2">
              {sections[selectedSection].permissions.map(permission => (
                <label key={permission.permissionKey} className="flex items-center space-x-2">
                  <Switch
                    id={permission.permissionKey}
                    checked={selectedPermissions[sections[selectedSection].section]?.includes(
                      permission.permissionKey
                    )}
                    onCheckedChange={() =>
                      togglePermission(sections[selectedSection].section, permission.permissionKey)
                    }
                  />
                  <span className="text-gray-700 text-xs">{permission.displayName}</span>
                </label>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">No permissions available for this section.</p>
        )}
      </div>
    </div>
  );
};

export default PermissionsComponent;
