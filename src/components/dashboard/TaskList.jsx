import React, { useEffect, useState } from "react";
import { useCalenderContext } from "../../contexts/CalenderContext";
import DetailedUploadModal from "../calender/DetailedUploadModal";
import axios from "axios";

const TaskList = ({ tasks }) => {
  const {
    currentDate,
    view,
    setView,
    setShowNewEventModal,
    showNewEventModal,
  } = useCalenderContext();
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [viewMore, setViewMore] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null); // Track selected brandId

  const handleClose = () => {
    setShowModal(false);
    setViewMore(false);
  };

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

  // Fetch events for a specific brand
  const fetchEvents = async (brandId) => {
    try {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const response = await axios.get(
        `/v1/task/currect/month?brand_id=${brandId}&year=${year}&month=${month}`
      );
      const apiEvents = response.data.data.map((event) => ({
        id: event._id,
        title: event.title,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        color: event.color,
        description: event.description,
        eventType: event.event_type,
      }));
      setEvents(apiEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handlePreviewClick = (brandId) => {
    setSelectedBrandId(brandId); // Save the brandId
    fetchEvents(brandId); // Fetch events for the clicked brand
    setShowModal(true); // Show the modal
  };

  useEffect(() => {
    if (selectedBrandId) {
      fetchEvents(selectedBrandId);
    }
  }, [currentDate, view, selectedBrandId]);

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
              <p className="text-xs text-gray-500">
                {formatDate(task.submitd_date)}
              </p>
            </div>
            <button
              className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md text-xs hover:bg-blue-50"
              onClick={() => handlePreviewClick(task.brand_id)} // Pass the brandId here
            >
              Preview
            </button>
            {showModal && (
              <DetailedUploadModal
                event={events}
                show={showModal}
                onClose={handleClose}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
