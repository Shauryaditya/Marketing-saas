import React, { useEffect, useState } from 'react';
import AddRoleModal from './AddRoleModal';
import RoleCard from './RoleCard';
import setupAxiosInterceptors from '../../AxiosInterceptor';
import axios from 'axios';

const Administrator = () => {
  setupAxiosInterceptors();
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null); // State to track selected role ID

  const fetchRole = async () => {
    try {
      const response = await axios.get(`/v1/rbac/get-all-roles`);
      const fetchedRoles = response.data.roles; // Accessing roles directly
      setRoles(Array.isArray(fetchedRoles) ? fetchedRoles : []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]); // Set to an empty array in case of error to avoid further issues
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  // Function to handle role card clicks and set selected role ID
  const handleRoleClick = (roleId) => {
    setSelectedRoleId(roleId);
    console.log("Selected Role ID:", roleId); // Log the selected role ID
  };

  console.log("Roles:", roles);
  console.log("Selected Role ID:", selectedRoleId);

  return (
    <div className="bg-gray-50 p-2">
      <div className="flex justify-between">
        <h1>Administrator</h1>
        <AddRoleModal />
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

                onClick={handleRoleClick} // Pass the handler to RoleCard
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
