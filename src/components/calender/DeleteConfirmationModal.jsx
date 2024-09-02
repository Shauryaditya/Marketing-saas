import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

const DeleteConfirmationModal = ({
  show,
  onClose,
  eventId,
  apiUrl,
  onDeletionSuccess,
}) => {
  if (!show) return null;

  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete(
        `${apiUrl}/v1/task/delete/${eventId}`
      );
      if (response.data.message === "Task deleted successfully") {
        console.log("All events deleted successfully.");
        onDeletionSuccess(); // Notify parent on success
      } else {
        console.error("Failed to delete all events:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting all events:", error);
    }
  };

  const handleDeleteSingle = async () => {
    try {
      const response = await axios.delete(
        `${apiUrl}/v1/task/single/delete/${eventId}`
      );
      if (response.data.message === "Task deleted successfully") {
        console.log("Event deleted successfully.");
        onDeletionSuccess(); // Notify parent on success
      } else {
        console.error("Failed to delete the event:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting the event:", error);
    }
  };

  return (
    <div className="fixed text-xs inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-gray-800 opacity-75"
        onClick={onClose}
      />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-4 relative z-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Confirm Deletion
        </h2>
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this event? You can choose to delete
          either this individual event or all events.
        </p>
        <div className="flex justify-between">
          <button
            onClick={handleDeleteAll}
            className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700"
          >
            Delete All
          </button>
          <button
            onClick={handleDeleteSingle}
            className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700"
          >
            Delete Individual
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  eventId: PropTypes.number.isRequired, // Assuming eventId is a number
  apiUrl: PropTypes.string.isRequired,
  onDeletionSuccess: PropTypes.func.isRequired, // New prop for handling success
};

export default DeleteConfirmationModal;
