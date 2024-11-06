import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import PermissionsComponent from './PermissionComponent';
import toast from 'react-hot-toast';

const AddRoleModal = () => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);

  // Handle permission updates from PermissionsComponent
  const handlePermissionsChange = updatedPermissions => {
    setPermissions(updatedPermissions);
  };

  // Save Role with selected permissions
  const handleSaveRole = async () => {
    const payload = {
      name: roleName,
      permissions,
    };
    try {
      const response = await axios.post('/v1/rbac/add-role', payload);
      toast.success(response?.data?.message)
      console.log('Role added successfully:', response.data);
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="px-3 py-1 text-blue-400 text-xs bg-white rounded-md">
            <span className="text-xs p-1 rounded-full bg-gray-50">+</span>Add New Role
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="border-b p-4">Add Role</DialogTitle>
          </DialogHeader>
          <div className="flex justify-between px-4">
            <div>
              <Label className="text-left">Role</Label>
              <Input
                id="name"
                className="col-span-3"
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
              />
            </div>
          </div>
          <div className="px-4">
            <PermissionsComponent onPermissionsChange={handlePermissionsChange} />
          </div>
          <DialogFooter className="p-4">
            <Button type="button" onClick={handleSaveRole}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRoleModal;
