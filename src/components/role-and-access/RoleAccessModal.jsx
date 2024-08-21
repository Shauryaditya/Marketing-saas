import axios from 'axios';
import setupAxiosInterceptors from '../../AxiosInterceptor';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RoleAccessModal = ({ isOpen, onClose, emp_id, people }) => {
    setupAxiosInterceptors()
  const navigate = useNavigate()
  const [username, setUsername] = useState(emp_id);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { mobile, email, _id: user_id, name } = people;

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
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the response is within the successful range
      if (response.status >= 200 && response.status < 300) {
        toast.success("Login Credentials Created");
        onClose();
        navigate(0);
        console.log('Success:', response.data);
      } else {
        // Handle cases where the response is not in the successful range
        console.log("Response>>???",response.data)
        toast.error(`Something went wrong!`);
        console.error('Error:', response.data);
      }
    } catch (error) {
      // Handle network or other errors
      toast.error(`${error.response.data.msg ? error.response.data.msg : error.msg}`);
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 bg-blend-saturation">
      <div className="max-w-xs w-full  bg-white shadow-lg rounded-lg">
        <div className="flex justify-between border-b p-4">
            <p className='text-sm font-semibold'>Login Access</p>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &#10005;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-gray-700"
            >
              Username/Employee ID
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-1 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleAccessModal;
