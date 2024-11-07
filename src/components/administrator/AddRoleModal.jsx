import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import PermissionsComponent from "./PermissionComponent";
import toast from "react-hot-toast";

const AddRoleModal = ({ roleId, initialRoleName = "" }) => {
  const [roleName, setRoleName] = useState(initialRoleName);
  const [permissions, setPermissions] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Track dialog open state

  useEffect(() => {
    const fetchRoleDetails = async () => {
      if (roleId) {
        try {
          const response = await axios.get(`/v1/rbac/get-role?id=${roleId}`);
          console.log("response",response);
          setRoleName(response.data.role.name || "");
          setPermissions(response.data.role.permissions || []);
        } catch (error) {
          console.error("Error fetching role details:", error);
          toast.error("Failed to fetch role details.");
        }
      } else {
        console.log("Inside else::::");
        setRoleName("");
        setPermissions([]);
      }
    };

    if (isOpen) {
      fetchRoleDetails();
    }
  }, [roleId, isOpen]);

  const handlePermissionsChange = (updatedPermissions) => {
    setPermissions(updatedPermissions);
  };

  const handleSaveRole = async () => {
    const payload = {
      name: roleName,
      permissions,
    };
    try {
      const url = roleId
        ? `/v1/rbac/edit-role?id=${roleId}`
        : "/v1/rbac/add-role";
      const method = roleId ? "put" : "post";
      const response = await axios[method](url, payload);
      toast.success(response?.data?.message);
      setIsOpen(false); // Close dialog on successful save
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Failed to save role.");
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {" "}
        {/* Bind open state */}
        <DialogTrigger asChild>
          {roleId ? (
            <button className="cursor-pointer" onClick={() => setIsOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          ) : (
            <button
              className="px-3 py-1 text-blue-400 text-xs bg-white rounded-md"
              onClick={() => setIsOpen(true)}
            >
              <span className="text-xs p-1 rounded-full bg-gray-50">+</span>Add
              New Role
            </button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="border-b p-4">
              {roleId ? "Edit Role" : "Add Role"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 px-4">
            {" "}
            {/* Make this section scrollable */}
            <div className="flex justify-between">
              <div>
                <Label className="text-left">Role</Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <PermissionsComponent
                onPermissionsChange={handlePermissionsChange}
                permissions={permissions}
                roleId={roleId}
              />
            </div>
          </div>
          <DialogFooter className="p-4 sticky bottom-0 bg-white border-t">
            {" "}
            {/* Fixed footer */}
            <Button type="button" variant="secondary" onClick={handleSaveRole}>
              {roleId ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRoleModal;
