import React, { useState } from "react";

const TaskList = () => {
  // State to manage which tab is active (Pending or Approved)
  const [activeTab, setActiveTab] = useState("Pending");

  // Dummy data for tasks
  const tasks = [
    { id: 1, name: "Task Name", date: "24/07/2024, 12:00", status: "Pending" },
    { id: 2, name: "Task Name", date: "24/07/2024, 12:00", status: "Pending" },
    { id: 3, name: "Task Name", date: "24/07/2024, 12:00", status: "Pending" },
    { id: 4, name: "Task Name", date: "24/07/2024, 12:00", status: "Pending" },
    { id: 5, name: "Task Name", date: "24/07/2024, 12:00", status: "Pending" },
    { id: 6, name: "Task Name", date: "24/07/2024, 12:00", status: "Approved" },
    { id: 7, name: "Task Name", date: "24/07/2024, 12:00", status: "Approved" },
    { id: 8, name: "Task Name", date: "24/07/2024, 12:00", status: "Approved" },
  ];

  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter(task => task.status === activeTab);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 w-1/2 rounded ${
            activeTab === "Pending" ? "bg-[#3F64C2] text-white text-sm" : "bg-gray-200 text-gray-600 text-sm"
          }`}
          onClick={() => setActiveTab("Pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 w-1/2 rounded ${
            activeTab === "Approved" ? "bg-[#3F64C2] text-white" : "bg-gray-200 text-gray-600 text-sm"
          }`}
          onClick={() => setActiveTab("Approved")}
        >
          Approved
        </button>
      </div>
      <div className="bg-white">
        {filteredTasks.map((task) => (
          <div key={task.id} className="flex justify-between items-center p-4 border-b">
            <div>
              <h3 className="text-sm font-semibold">{task.name}</h3>
              <p className="text-xs text-gray-500">{task.date}</p>
            </div>
            <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded text-sm hover:bg-blue-50">
              Preview
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
