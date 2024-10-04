import React, { useState } from "react";
import TaskModal from "./ContentWriterModal";
import TaskViewModal from "./TaskView";

const TaskList = ({tasks}) => {
  // State to manage which tab is active (Pending or Approved)
  const [activeTab, setActiveTab] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [viewMore, setViewMore] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setViewMore(false)
  }

  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter((task) => task.status === activeTab);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", // Use "short" for abbreviated month
      day: "numeric",
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 w-1/2 rounded ${
            activeTab === "pending"
              ? "bg-[#3F64C2] text-white text-sm"
              : "bg-gray-200 text-gray-600 text-sm"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 w-1/2 rounded ${
            activeTab === "done"
              ? "bg-[#3F64C2] text-white"
              : "bg-gray-200 text-gray-600 text-sm"
          }`}
          onClick={() => setActiveTab("done")}
        >
          Approved
        </button>
      </div>
      <div className="bg-white">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center p-4 border-b"
          >
            <div>
              <h3 className="text-sm font-semibold">{task.title}</h3>
              <p className="text-xs text-gray-500">{formatDate(task.submitd_date)}</p>
            </div>
            <button
              className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md text-xs hover:bg-blue-50"
              onClick={() => setShowModal(true)}
            >
              Preview
            </button>
            {showModal && 
            <TaskModal 
              showModal={showModal}
              onClose = {handleClose}
            />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
