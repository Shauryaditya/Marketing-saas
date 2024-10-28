import setupAxiosInterceptors from "../AxiosInterceptor";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BrandTable from "./teams/BrandTable";

const ProfileSection = () => {
  setupAxiosInterceptors();

  const [formData, setFormData] = useState({
    name: "",
    emp_id: "",
    mobile: "",
    email: "",
    designation_name: "",
    department_name: "",
    sub_department_name: "",
  });

  // Fetch user details from API
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/v1/auth/me`);
        const userData = response.data.data;

        setFormData({
          name: userData.name,
          emp_id: userData.emp_id,
          mobile: userData.mobile,
          email: userData.email,
          designation_name: userData.designation_name,
          department_name: userData.department_name,
          sub_department_name: userData.sub_department_name,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the request body with only the name and mobile fields
    const requestBody = {
      name: formData.name,
    };

    // Conditionally include the mobile field if it's filled out
    if (formData.mobile) {
      requestBody.mobile = formData.mobile;
    }

    try {
      // Send the updated name and mobile fields to the API
      const response = await axios.post(`/v1/auth/me/edit`, requestBody);
      console.log("Update successful:", response.data);
      // Handle success (e.g., show a success message or refresh the data)
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-xs bg-gray-50">
      {/* Profile and Info Section */}
      <div className="bg-white shadow-md p-3 rounded-lg flex flex-col items-start space-x-6">
        <div className="flex gap-x-2">
          <div className="relative ">
            <img
              className="w-20 h-20 rounded-full object-cover"
              src="https://via.placeholder.com/150"
              alt="Profile"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
              📷
            </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{formData.name}</h2>
            <p className="text-sm text-gray-500">{formData.email}</p>
            <p className="text-sm text-gray-500">
              Employee ID: {formData.emp_id}
            </p>
          </div>
        </div>
        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="w-11/12 grid grid-cols-4 gap-4 mx-auto p-2 mt-2"
        >
          {/* Name */}
          <div className="col-span-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Employee ID (Read-only) */}
          <div className="col-span-1">
            <label
              htmlFor="employeeId"
              className="block text-sm font-medium text-gray-700"
            >
              Employee ID
            </label>
            <input
              id="employeeId"
              name="employeeId"
              type="text"
              value={formData.emp_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
              readOnly
            />
          </div>

          {/* Mobile Number */}
          <div className="col-span-1">
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              name="mobile"
              type="text"
              value={formData.mobile}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Designation (Read-only) */}
          <div className="col-span-1">
            <label
              htmlFor="designation"
              className="block text-sm font-medium text-gray-700"
            >
              Designation
            </label>
            <input
              id="designation"
              name="designation"
              type="text"
              value={formData.designation_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
              readOnly
            />
          </div>

          {/* Department (Read-only) */}
          <div className="col-span-1">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              value={formData.department_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              readOnly
            />
          </div>

          {/* Sub-Department (Read-only) */}
          <div className="col-span-1">
            <label
              htmlFor="subDepartment"
              className="block text-sm font-medium text-gray-700"
            >
              Sub-Department
            </label>
            <input
              id="subDepartment"
              name="subDepartment"
              type="text"
              value={formData.sub_department_name}
              onChange={handleChange}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Email (Pre-filled, non-editable) */}
          <div className="col-span-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100  rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Save Button */}
          <div className="col-span-4 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <BrandTable />
    </div>
  );
};

export default ProfileSection;
