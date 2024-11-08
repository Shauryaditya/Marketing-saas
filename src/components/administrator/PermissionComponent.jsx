import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch } from '../ui/switch';

const PermissionsComponent = ({ onPermissionsChange, permissions, roleId, setSections,sections,setSelectedPermissions,selectedPermissions }) => {
  const [selectedSection, setSelectedSection] = useState(0); // Initially select the first section

console.log("Permissions>>>L:::",permissions)
  // Fetch permissions from the API only once on mount


  const togglePermission = (section, permissionKey) => {

    console.log("section",section,permissionKey)
    setSelectedPermissions(prev => {
      const updatedPermissions = { ...prev };

      // Ensure section array exists in case it's undefined
      updatedPermissions[section] = updatedPermissions[section] || [];

      // Toggle the permission key in the section array
      if (updatedPermissions[section].includes(permissionKey)) {
        updatedPermissions[section] = updatedPermissions[section].filter(
          key => key !== permissionKey
        );
      } else {
        updatedPermissions[section].push(permissionKey);
      }

      // Pass flattened permissions to onPermissionsChange only when the permissions change
      const flattenedPermissions = Object.values(updatedPermissions).flat();

      onPermissionsChange(flattenedPermissions);

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
                    checked={
                      selectedPermissions[sections[selectedSection].section]?.includes(
                        permission.permissionKey
                      )
                    }
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
