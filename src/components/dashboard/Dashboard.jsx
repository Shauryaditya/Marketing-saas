import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import TeamsList from "./TeamsList";
import TaskList from "./TaskList";
import BrandTable from "./BrandList";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  setupAxiosInterceptors();
  const router = useNavigate()
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null); // State for the selected brand

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      const response = await axios.get(`/v1/brand/profile/get?limit=100`);
      setBrands(response.data.data); // Assuming response.data.data is an array of brands
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Fetch tasks, filtered by selected brand if provided
  const fetchTasks = async (brandId) => {
    try {
      const response = await axios.get(`/v1/task/dashboard/task`, {
        params: {
          limit: 10, // Set the page limit here
          brand_id: brandId || "", // Pass the selected brandId as a query parameter
        },
      });
      if (response.data && response.data.tasks) {
        setTasks([...response.data.tasks]); // Ensure non-mutated state update
      } else {
        setError("No tasks found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks.");
      console.error(err);
    }
  };

  // Fetch brands when component mounts
  useEffect(() => {
    fetchBrands();
  }, []);

  // Fetch tasks when a brand is selected
  useEffect(() => {
    if (selectedBrandId) {
      fetchTasks(selectedBrandId); // Fetch tasks for selected brand
    } else {
      fetchTasks(); // Fetch tasks without filter if no brand is selected
    }
  }, [selectedBrandId]);

  // Handle brand selection
  const handleBrandSelect = (brandId) => {
    setSelectedBrandId(brandId); // Set the selected brandId when clicked
  };

  // Determine class for task statuses
  const getStatusClass = (status) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-600 px-2 py-1 rounded";
      case "pending":
        return "bg-yellow-100 text-yellow-600 px-2 py-1 rounded";
      case "delay":
        return "bg-red-100 text-red-600 px-2 py-1 rounded";
      default:
        return "";
    }
  };

  return (
    <div className="w-full bg-gray-100 h-fit p-2">
      <div className="flex justify-between">
        <h1 className="text-sm font-semibold">Dashboard</h1>

        {/* Dropdown for Brand Selection */}
        <div className="flex gap-x-40">
          
          <p className="text-sm font-semibold ">Tasks <span className="text-xs font-normal text-blue-800 cursor-pointer hover:text-blue-950 hover:underline" onClick={() => router(`/tasks`)}>View All</span></p>
        <DropdownMenu>
          <DropdownMenuTrigger className="border text-xs px-4 bg-white text-sky-800 rounded outline-0">
            {selectedBrandId
              ? `Brand: ${
                  brands.find((b) => b._id === selectedBrandId)?.brand_name
                }`
              : "Select Brand"}{" "}
            {/* Display selected brand */}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Brands</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {brands.length > 0 ? (
              brands.map((brand) => (
                <DropdownMenuItem
                  key={brand._id}
                  onClick={() => handleBrandSelect(brand._id)}
                >
                  {brand.brand_name}{" "}
                  {/* Assuming the brand object has an id and name */}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>No Brands Available</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="flex gap-x-4">
        <div className="w-2/3 mt-2">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Activity</h2>

            {/* Activity Table */}
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="p-3 border-b text-sm text-gray-300 font-normal text-left">
                      BRAND
                    </th>
                    <th className="p-3 border-b text-sm text-gray-300 font-normal text-center">
                      SOCIAL MEDIA
                    </th>
                    <th className="p-3 border-b text-sm text-gray-300 font-normal text-center">
                      GRAPHIC DESIGNER
                    </th>
                    <th className="p-3 border-b text-sm text-gray-300 font-normal text-center">
                      CONTENT WRITER
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className="text-gray-700 text-sm"
                    >
                      <td className="p-3 border-b text-xs">
                        {item.brand_name}
                      </td>
                      <td className="p-3 border-b text-center text-xs">
                        <span className={getStatusClass(item.sm_status)}>
                          {item.sm_status}
                        </span>
                      </td>
                      <td className="p-3 border-b text-center text-xs">
                        <span className={getStatusClass(item.gd_status)}>
                          {item.gd_status}
                        </span>
                      </td>
                      <td className="p-3 border-b text-center text-xs">
                        <span className={getStatusClass(item.cw_status)}>
                          {item.cw_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Additional sections */}
          <div className="w-full flex mt-2 justify-between">
            <TeamsList />
            <BrandTable brands={brands} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-1/3 mt-2">
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
