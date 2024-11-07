import axios from "axios";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Select from "react-select";

const RoleAccessModal = ({ isOpen, onClose, emp_id, people }) => {
  setupAxiosInterceptors();
  const navigate = useNavigate();
  const [username, setUsername] = useState(emp_id);
  const [password, setPassword] = useState(people?.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    mobile,
    email,
    _id: user_id,
    name,
    designation_name,
    department_name,
    sub_department_name,
  } = people;

  if (!isOpen) return null;

  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [taskModules, setTaskModules] = useState([]);

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

  const taskModuleOptions = [
    { value: "SM", label: "Social Media" },
    { value: "GD", label: "Graphics Designer" },
    { value: "CW", label: "Content Writer" },
  ];

  const handleTaskModuleChange = (selectedOptions) => {
    setTaskModules(selectedOptions.map((option) => option.value));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showConfirmPassword && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const data = {
      name,
      email,
      user_id,
      emp_id,
      mobile,
      password,
      role_id: selectedRoleId ,
      task_modules: taskModules,
    };
    	console.log("Response Body>>???",data)
    try {
      const response = await axios.post(`/v1/auth/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Login Credentials Created");
        // onClose();
        // navigate(0);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error(
        `${error.response?.data?.msg ? error.response.data.msg : error.message}`
      );
    }
  };

  console.log("People>>>???", people);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="max-w-xl w-full max-h-4/5 bg-white rounded-lg p-3 text-xs">
        <div className="flex justify-between border-b p-2 mb-4">
          <p className="text-base font-semibold">Edit</p>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &#10005;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                disabled
                className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Employee ID
              </label>
              <input
                type="text"
                value={emp_id}
                disabled
                className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Sub Department
              </label>
              <input
                type="text"
                value={department_name}
                disabled
                className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Designation
              </label>
              <input
                type="text"
                value={designation_name}
                disabled
                className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Email ID
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Contact no
              </label>
              <input
                type="text"
                value={mobile}
                disabled
                className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Role
              </label>
              <select
                className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
                value={selectedRoleId || ""}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Task Module
              </label>
              <Select
                closeMenuOnSelect={false}
                isMulti
                options={taskModuleOptions}
                onChange={handleTaskModuleChange}
              />
            </div>
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                >
                  👁️
                </button>
              </div>
            </div>

            {showConfirmPassword && (
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md sm:text-xs" // Removed 'shadow-sm'
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                  >
                    👁️
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Change Password link */}
          {!showConfirmPassword && (
            <p
              className="text-xs text-indigo-600 cursor-pointer mt-2"
              onClick={() => setShowConfirmPassword(true)}
            >
              Change Password
            </p>
          )}

          {/* Submit button */}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="py-1 px-4 border border-transparent rounded-md  text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleAccessModal;
