import React, { useEffect, useState } from "react";
import TaskModal from "./ContentWriterModal";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import axios from "axios";

const TaskView = () => {
  setupAxiosInterceptors();
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

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

  // Fetch tasks when a brand is selected
  useEffect(() => {
    fetchTasks(); // Fetch tasks without filter if no brand is selected
  }, []);

  // Filter tasks based on their status
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const doneTasks = tasks.filter((task) => task.status === "done");
  const reworkTasks = tasks.filter((task) => task.status === "declined");

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className=" bg-gray-50  ">
      <div className="p-2 max-w-full mx-auto">
        <div className="grid grid-cols-3 items-center mb-2">
          <h2 className="text-lg font-bold">Task</h2>
        </div>

        {/* Flex container for horizontal alignment */}
        <div className="flex space-x-4 ">
          {/* Pending Tasks Table */}
          <div className="w-1/2 border rounded-md bg-white h-screen overflow-y-scroll no-scrollbar">
            <div className="flex justify-center items-center bg-red-200 p-2">
              <h3 className="text-xs text-[#868789] uppercase">Pending</h3>
            </div>

            {pendingTasks.length > 0 ? (
              <div className="bg-white">
                {/* Add table headers for Task, Brand, and Action */}
                <div className="flex justify-between items-center bg-gray-100 p-2 border-b">
                  <div className="w-1/3">
                    <h3 className="text-xs font-semibold uppercase">Task</h3>
                  </div>
                  <div className="w-1/3">
                    <h3 className="text-xs text-center font-semibold uppercase">
                      Brand
                    </h3>
                  </div>
                  <div className="w-1/3 text-center">
                    <h3 className="text-xs font-semibold uppercase">Action</h3>
                  </div>
                </div>

                {pendingTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    {/* Task details */}
                    <div className="w-1/3">
                      <h3 className="text-sm font-semibold">{task.title}</h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(task.submitd_date)}
                      </p>
                    </div>

                    {/* Brand details (add brand property to tasks if available) */}
                    <div className="w-1/3">
                      <p className="text-sm text-center text-gray-700">
                        {task.brand_name || "N/A"}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="w-1/3 text-center">
                      <button
                        className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md text-xs hover:bg-blue-50"
                        onClick={() => setShowModal(true)}
                      >
                        Preview
                      </button>
                      {showModal && (
                        <TaskModal
                          showModal={showModal}
                          onClose={() => setShowModal(false)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 p-2">No pending tasks.</p>
            )}
          </div>

          {/* Rework Tasks Table */}
          <div className="w-1/2 border rounded-md bg-white h-screen overflow-y-scroll no-scrollbar">
            <div className="flex justify-center items-center bg-yellow-100 p-2">
              <h3 className="text-xs text-[#868789] uppercase">Rework</h3>
            </div>
            {reworkTasks.length > 0 ? (
              <div className="bg-white ">
                <div className="flex justify-between items-center bg-gray-100 p-2 border-b">
                  <div className="w-1/3">
                    <h3 className="text-xs font-semibold uppercase">Task</h3>
                  </div>
                  <div className="w-1/3">
                    <h3 className="text-xs text-center font-semibold uppercase">
                      Brand
                    </h3>
                  </div>
                  <div className="w-1/3 text-center">
                    <h3 className="text-xs font-semibold uppercase">Action</h3>
                  </div>
                </div>
                {reworkTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    {/* Task details */}
                    <div className="w-1/3">
                      <h3 className="text-sm font-semibold">{task.title}</h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(task.submitd_date)}
                      </p>
                    </div>

                    {/* Brand details (add brand property to tasks if available) */}
                    <div className="w-1/3">
                      <p className="text-sm text-center text-gray-700">
                        {task.brand_name || "N/A"}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="w-1/3 text-center">
                      <button
                        className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md text-xs hover:bg-blue-50"
                        onClick={() => setShowModal(true)}
                      >
                        Preview
                      </button>
                      {showModal && (
                        <TaskModal
                          showModal={showModal}
                          onClose={() => setShowModal(false)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-center text-gray-500">
                No tasks to rework.
              </p>
            )}
          </div>
          {/* Done Tasks Table */}
          <div className="w-1/2 border rounded-md bg-white h-screen overflow-y-scroll no-scrollbar">
            <div className="flex justify-center items-center bg-green-200 p-2">
              <h3 className="text-xs text-[#A5A6AB] uppercase">Approved</h3>
            </div>
            {doneTasks.length > 0 ? (
              <div className="bg-white ">
                <div className="flex justify-between items-center bg-gray-100 p-2 border-b">
                  <div className="w-1/3">
                    <h3 className="text-xs font-semibold uppercase">Task</h3>
                  </div>
                  <div className="w-1/3">
                    <h3 className="text-xs text-center font-semibold uppercase">
                      Brand
                    </h3>
                  </div>
                  <div className="w-1/3 text-center">
                    <h3 className="text-xs font-semibold uppercase">Action</h3>
                  </div>
                </div>
                {doneTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    {/* Task details */}
                    <div className="w-1/3">
                      <h3 className="text-sm font-semibold">{task.title}</h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(task.submitd_date)}
                      </p>
                    </div>

                    {/* Brand details (add brand property to tasks if available) */}
                    <div className="w-1/3">
                      <p className="text-sm text-center text-gray-700">
                        {task.brand_name || "N/A"}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="w-1/3 text-center">
                      <button
                        className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md text-xs hover:bg-blue-50"
                        onClick={() => setShowModal(true)}
                      >
                        Preview
                      </button>
                      {showModal && (
                        <TaskModal
                          showModal={showModal}
                          onClose={() => setShowModal(false)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No approved tasks.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskView;
