import React, { useEffect, useState } from 'react';
import AddRoleModal from './AddRoleModal';
import RoleCard from './RoleCard';
import axios from 'axios';

const Administrator = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const fetchRole = async () => {
    try {
      const response = await axios.get(`/v1/rbac/get-all-roles`);
      setRoles(response.data.roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  const onDeleteSuccess = (deletedRoleId) => {
    // Option 1: Refetch roles from API
    fetchRole();

    // Option 2: Update state locally
    // setRoles(prevRoles => prevRoles.filter(role => role._id !== deletedRoleId));
  };

  const handleRoleClick = (roleId) => {
    setSelectedRoleId(roleId); // Set selected role ID for editing
  };

  return (
    <div className="bg-gray-50 p-2">
      <div className="flex justify-between">
        <h1>Administrator</h1>
        <AddRoleModal /> {/* For adding a new role */}
      </div>
      <div className="bg-white p-4 rounded-lg max-w-5xl mx-auto mt-4">
      <h2 className="text-sm font-semibold text-gray-800 mb-1">
          Administrator roles available
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          A role provides access to predefined menus and features so that depending on the assigned role (Super Admin, Manager, Accountant) an administrator can have access to what he needs.
        </p>
        <div className="flex space-x-4 overflow-x-auto no-scrollbar">
          {roles.length > 0 ? (
            roles.map((role) => (
              <RoleCard
                key={role._id}
                roleName={role.name}
                accounts={role.userCount}
                roleId={role._id}
                onClick={handleRoleClick}
                onDeleteSuccess={onDeleteSuccess}
              />
            ))
          ) : (
            <p>No roles available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Administrator;
