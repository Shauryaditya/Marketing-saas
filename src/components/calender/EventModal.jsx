import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FaTimes,
  FaCalendarAlt,
  FaTag,
  FaInfoCircle,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import axios from "axios";
import NewEventModal from "./NewEventModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
const apiUrl = import.meta.env.VITE_API_URL;

const EventModal = ({ show, onClose, event, onEdit, onDelete }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  if (!show || !event) return null;

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedEvent) => {
    try {
      const response = await axios.put(
        `${apiUrl}/v1/task/single/edit/${event.id}`,
        updatedEvent
      );
      if (response.data.success) {
        onEdit(updatedEvent);
        setEditModalOpen(false);
      } else {
        console.error("Failed to edit the event:", response.data.message);
      }
    } catch (error) {
      console.error("Error editing the event:", error);
    }
  };

  return (
    <>
      <div className="fixed text-xs inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-gray-800 opacity-75"
          onClick={onClose}
        />
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 relative z-10 overflow-auto no-scrollbar max-h-[90vh]">
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleEditClick}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaEdit className="w-5 h-5" />
            </button>
            <button
              onClick={() => setDeleteConfirmationOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTrashAlt className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            Event Details
          </h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-gray-600 font-medium flex items-center">
                <FaTag className="mr-2 text-blue-500" />
                Title
              </h3>
              <p className="text-gray-800 text-lg">{event.title}</p>
            </div>
            <div className="flex justify-between">
              <div className="w-1/2 pr-2">
                <h3 className="text-gray-600 font-medium flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  Start Date
                </h3>
                <p className="text-gray-800">{event.start_date}</p>
              </div>
              <div className="w-1/2 pl-2">
                <h3 className="text-gray-600 font-medium flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  End Date
                </h3>
                <p className="text-gray-800">{event.end_date}</p>
              </div>
            </div>
            <div>
              <h3 className="text-gray-600 font-medium flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                Description
              </h3>
              <p className="text-gray-800">
                {event.description || "No description available."}
              </p>
            </div>
            <div>
              <h3 className="text-gray-600 font-medium flex items-center">
                <FaTag className="mr-2 text-blue-500" />
                Event Type
              </h3>
              <p className="text-gray-800">
                {event.event_type || "Not specified"}
              </p>
            </div>
            {event.platforms_data && event.platforms_data.length > 0 && (
              <div>
                <h3 className="text-gray-600 font-medium flex items-center">
                  <FaInfoCircle className="mr-2 text-blue-500" />
                  Platforms
                </h3>
                <div className="flex flex-wrap gap-3">
                  {event.platforms_data.map((platform, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {platform.platform_logo && (
                        <img
                          src={platform.platform_logo}
                          alt={platform.platform_name}
                          className="w-4 h-4 object-cover rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">
                          {platform.platform_name}
                        </p>
                        {platform.content_types &&
                          platform.content_types.length > 0 && (
                            <ul className="list-disc list-inside text-gray-700 mt-1">
                              {platform.content_types.map((content, idx) => (
                                <li key={idx}>
                                  {content.content_type} - {content.size}
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <NewEventModal
        show={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        event={event}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmationModal
        show={isDeleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        eventId={event.id} // Pass the event ID here
        apiUrl={apiUrl} // Pass the API URL here
      />
    </>
  );
};

EventModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EventModal;
