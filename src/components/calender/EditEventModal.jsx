import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const colorOptions = ["#FF5733", "#33FF57", "#3357FF", "#F4D76D", "#B88CC7"];

const EditEventModal = ({ show, onClose, event, onSave }) => {
  const { brandId } = useParams(); // Get brandId from URL params
  console.log("brandddd", brandId);

  const [editedEvent, setEditedEvent] = useState({
    title: "",
    start_date: "",
    end_date: "",
    description: "",
    color: colorOptions[0], // Default color
    event_type: "all_day",
    recurrence: null,
    platforms: [],
  });

  useEffect(() => {
    if (event) {
      setEditedEvent({
        title: event.title || "",
        start_date: event.start_date || "",
        end_date: event.end_date || "",
        description: event.description || "",
        color: event.color || colorOptions[0],
        event_type: event.event_type || "all_day",
        recurrence: event.recurrence || null,
        platforms: event.platforms || [],
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color) => {
    setEditedEvent((prev) => ({ ...prev, color }));
  };

  const handleSave = async () => {
    try {
      const Url = `${apiUrl}/v1/task/single/edit/${event.id}`;

      const requestBody = {
        brand_id: brandId, // Ensure brandId is included
        start_date: editedEvent.start_date,
        end_date: editedEvent.end_date,
        title: editedEvent.title,
        description: editedEvent.description,
        color: editedEvent.color,
        event_type: editedEvent.event_type,
        recurrence: editedEvent.recurrence,
        platforms: editedEvent.platforms,
      };

      console.log("Request URL:", Url);
      console.log("Request Body:", requestBody); // Debug: Check if brand_id is included

      const response = await axios.put(Url, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updatedEvent = response.data;
      onSave(updatedEvent);
      onClose();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-xs">
          <div
            className="fixed inset-0 bg-gray-900 opacity-50"
            onClick={onClose}
          />
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md z-10">
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Edit Task</h3>
            </div>
            <div className="px-4 py-5 space-y-4">
              <label className="block text-gray-700">
                <div className="flex space-x-2 mt-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`w-6 h-6 rounded-full ${
                        editedEvent.color === color
                          ? "border-indigo-300"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </label>
              <label className="block text-gray-700">
                Title
                <input
                  type="text"
                  name="title"
                  value={editedEvent.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="mt-1 block w-full rounded-md shadow-sm bg-gray-100 text-xs py-1 px-3 border-none focus:ring-indigo-500"
                />
              </label>
              <div className="flex space-x-2">
                <label className="block text-gray-700 flex-1">
                  Start Date
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={editedEvent.start_date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md shadow-sm bg-gray-100 text-xs py-1 px-3 border-none focus:ring-indigo-500"
                  />
                </label>
                <label className="block text-gray-700 flex-1">
                  End Date
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={editedEvent.end_date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md shadow-sm bg-gray-100 text-xs py-1 px-3 border-none focus:ring-indigo-500"
                  />
                </label>
              </div>
              <label className="block text-gray-700">
                Description
                <textarea
                  name="description"
                  value={editedEvent.description}
                  onChange={handleChange}
                  placeholder="Description"
                  rows={3}
                  className="mt-1 block w-full text-xs rounded-md shadow-sm bg-gray-100 py-1 px-3 border-none focus:ring-indigo-500"
                ></textarea>
              </label>
              <label className="block text-gray-700">
                Event Type
                <select
                  name="event_type"
                  value={editedEvent.event_type}
                  onChange={handleChange}
                  className="mt-1 block w-full text-xs rounded-md shadow-sm bg-gray-100 focus:ring-indigo-500 py-1 px-3 border-none"
                >
                  <option value="all_day">All Day</option>
                  <option value="daily">Daily</option>
                  <option value="recurring">Recurring</option>
                </select>
              </label>
            </div>
            <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

EditEventModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditEventModal;
