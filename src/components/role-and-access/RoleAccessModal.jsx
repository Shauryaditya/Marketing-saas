import axios from "axios";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import React, { useEffect, useState, useRef } from "react";
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
    role_id,
    task_module
  } = people;
  console.log("People>>???",people)
  if (!isOpen) return null;

  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [taskModules, setTaskModules] = useState([]);
  const hasFetchedRoles = useRef(false); // Track if roles have been fetched

  const fetchRole = async () => {
    try {
      const response = await axios.get(`/v1/rbac/get-all-roles`);
      setRoles(response.data.roles || []);
      hasFetchedRoles.current = true; // Set as fetched
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    if (isOpen && !hasFetchedRoles.current) {
      fetchRole();
    }
  }, [isOpen]);

    // Update selectedRoleId and taskModules when people changes
    useEffect(() => {
      if (people) {
        setSelectedRoleId(people.role_id || "");
        setTaskModules(people.task_module || []);
      }
    }, [people]);

  const taskModuleOptions = [
    { value: "SM", label: "Social Media" }, 
    { value: "CW", label: "Content Writer" },
    { value: "GD", label: "Graphics Designer" },
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
      role_id: selectedRoleId,
      task_module: taskModules,
    };
    console.log("Response Body>>???", data);
    try {
      const response = await axios.post(`/v1/auth/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.msg);
        onClose()
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error(error)
      toast.error(
        `${error.response?.data?.message}`
      );
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: "0.75rem", // Adjust control font size if needed
      padding: "1px 1px"
    }),
    option: (provided) => ({
      ...provided,
      fontSize: "0.75rem", // Smaller font size for options
      padding: "2px 8px", // Adjust padding if needed
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      fontSize: "0.6rem", // Adjust font size for selected multi-values
      padding: "1px 1px"
    }),
  };

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
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-2 gap-4 mt-4">
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
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="">
              <label className="block text-xs font-medium text-gray-700">
                Task Module
              </label>
              <Select
                closeMenuOnSelect={false}
                isMulti
                options={[{ value: "ALL", label: "All" }, ...taskModuleOptions]}
                onChange={(selectedOptions) => {
                  if (
                    selectedOptions.some((option) => option.value === "ALL")
                  ) {
                    setTaskModules(
                      taskModuleOptions.map((option) => option.value)
                    );
                  } else {
                    setTaskModules(
                      selectedOptions.map((option) => option.value)
                    );
                  }
                }}
                value={taskModuleOptions.filter((option) =>
                  taskModules.includes(option.value)
                )}
                styles={customSelectStyles} // Apply custom styles here
                className="mt-1"
              />
            </div>
            {showConfirmPassword && (
              <div className="">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
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
