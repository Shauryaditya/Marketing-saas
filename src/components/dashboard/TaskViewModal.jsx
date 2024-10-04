import React, { useState } from 'react';
import TaskModal from './ContentWriterModal';

const TaskViewModal = ({ tasks, onClose }) => {
  const [showModal, setShowModal] = useState(false);

  // Filter tasks based on their status
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const doneTasks = tasks.filter((task) => task.status === "done");

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
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* Flex container for horizontal alignment */}
        <div className="flex space-x-8">
          {/* Pending Tasks Table */}
          <div className="w-1/2 border rounded-md">
          <div className="flex justify-center items-center bg-red-200 p-4">
            <h3 className="text-xs text-[#A5A6AB] uppercase">Pending</h3>
            </div>
            {pendingTasks.length > 0 ? (
              <div className="bg-white ">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-center p-4 border-b">
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
                      onClose={() => setShowModal(false)}
                    />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No pending tasks.</p>
            )}
          </div>

          {/* Done Tasks Table */}
          <div className="w-1/2 border rounded-md ">
          <div className="flex justify-center items-center bg-green-200 p-4">
            <h3 className="text-xs text-[#A5A6AB] uppercase">Approved</h3>
            </div>
            {doneTasks.length > 0 ? (
              <div className="bg-white ">
                {doneTasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-center p-4 border-b">
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
                      onClose={() => setShowModal(false)}
                    />}
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

export default TaskViewModal;
