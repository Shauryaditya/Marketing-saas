import React, { useState } from "react";

const ProfileSection = () => {
  const [formData, setFormData] = useState({
    name: "Alexa Rawles",
    employeeId: "ID09864",
    mobileNumber: "0000000000",
    email: "alexarawles@gmail.com",
    designation: "Designation name",
    department: "Department name",
    subDepartment: "Sub-Department name",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <div className="max-w-4xl mx-auto p-8 text-xs bg-gray-50">
      {/* Profile and Info Section */}
      <div className="bg-white shadow-md p-6 rounded-lg flex items-center space-x-6">
        <div className="relative">
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
            Employee ID: {formData.employeeId}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-3 gap-4 mt-6 max-w-3xl mx-auto"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Employee ID */}
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
            value={formData.employeeId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
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
            name="mobileNumber"
            type="text"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Designation */}
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
            value={formData.designation}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Department */}
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
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Sub-Department */}
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
            value={formData.subDepartment}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Save Button */}
        <div className="col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </form>

      {/* Brand Table Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg w-1/3">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr>
              <th className="px-2 py-2 border-b">Sr.</th>
              <th className="px-2 py-2 border-b">Brand Name</th>
              <th className="px-2 py-2 border-b">Preview</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-2 border-b">1</td>
              <td className="px-2 py-2 border-b">Novium</td>
              <td className="px-2 py-2 border-b">
                <button className="text-blue-500">🔍</button>
              </td>
            </tr>
            <tr>
              <td className="px-2 py-2 border-b">2</td>
              <td className="px-2 py-2 border-b">Blacksmith</td>
              <td className="px-2 py-2 border-b">
                <button className="text-blue-500">🔍</button>
              </td>
            </tr>
            <tr>
              <td className="px-2 py-2 border-b">3</td>
              <td className="px-2 py-2 border-b">Sinex</td>
              <td className="px-2 py-2 border-b">
                <button className="text-blue-500">🔍</button>
              </td>
            </tr>
            <tr>
              <td className="px-2 py-2 border-b">4</td>
              <td className="px-2 py-2 border-b">Bombol</td>
              <td className="px-2 py-2 border-b">
                <button className="text-blue-500">🔍</button>
              </td>
            </tr>
            <tr>
              <td className="px-2 py-2 border-b">5</td>
              <td className="px-2 py-2 border-b">Lofree</td>
              <td className="px-2 py-2 border-b">
                <button className="text-blue-500">🔍</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileSection;
