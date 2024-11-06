import axios from "axios";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RoleAccessModal = ({ isOpen, onClose, emp_id, people }) => {
  setupAxiosInterceptors();
  const navigate = useNavigate();
  const [username, setUsername] = useState(emp_id);
  const [password, setPassword] = useState(people?.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mobile, email, _id: user_id, name, designation, department } = people;

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const data = { name, email, user_id, emp_id, mobile, password };

    try {
      const response = await axios.post(`/v1/auth/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Login Credentials Created");
        onClose();
        navigate(0);
      } else {
        toast.error(`Something went wrong!`);
      }
    } catch (error) {
      toast.error(
        `${error.response?.data?.msg ? error.response.data.msg : error.message}`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-3 text-xs">
        <div className="flex justify-between border-b p-2">
          <p className="text-sm font-semibold">Edit</p>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &#10005;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-2">
          {/* Grid Layout for fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                disabled
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
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
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Sub Department
              </label>
              <input
                type="text"
                value={department}
                disabled
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Designation
              </label>
              <input
                type="text"
                value={designation}
                disabled
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
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
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
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
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Role
              </label>
              <select className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs">
                <option>Select Role</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Task Module
              </label>
              <select className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs">
                <option>Select Task Module</option>
              </select>
            </div>
          </div>

          {/* Password fields with consistent width */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12h.01M19.5 12c0-2.5-2-4.5-4.5-4.5-1.1 0-2.2.4-3 1-1.8-1.3-3.5-3-5.5-3C5.5 5.5 3 7.9 3 10.5c0 1.3.5 2.5 1.5 3.5 1.1-1.2 2.5-2.1 4-2.5.5-.8 1.2-1.3 2-1.6C13.7 10.4 14.9 12 15 12z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.293 6.707a9.95 9.95 0 011.32 2.93c.03.3.046.604.046.91 0 2.25-1.39 4.17-3.41 5.16a7.054 7.054 0 01-1.946 1.048 8.965 8.965 0 01-.391.08c-.247.05-.493.1-.744.15a4.984 4.984 0 01-2.654-.485 6.004 6.004 0 01-2.257-2.349c-.1-.167-.19-.339-.273-.51l-.328-.436-5.462 3.733 3.213 4.459a4.993 4.993 0 01-2.551.561 7.06 7.06 0 01-3.42-1.907C3.9 13.836 2.5 11.964 2.5 10.5c0-.558.042-1.105.124-1.64A9.96 9.96 0 015.512 7a7.954 7.954 0 011.493-.9c.501-.139 1.02-.233 1.542-.233a7.986 7.986 0 016.063 2.615c.74-.32 1.543-.488 2.378-.48.77 0 1.507.124 2.226.345z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {showConfirmPassword && (
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs"
                  required
                />
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

          {/* Submit button with small width */}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="py-1 px-3 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
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
