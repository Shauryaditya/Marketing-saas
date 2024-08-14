import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import setupAxiosInterceptors from "../../AxiosInterceptor";

setupAxiosInterceptors();

const colorOptions = ["#FF8D6F", "#66FF8E", "#66A3FF", "#F4D76D", "#B88CC7"];

const NewEventModal = ({ show, onClose, onSave, event }) => {
  const [eventData, setEventData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    description: "",
    repeat: "Does not repeat",
    color: colorOptions[0], // Default color
  });
  const { id: brandId } = useParams();

  const [platformData, setPlatformData] = useState([]);
  const [selectedPlatformIds, setSelectedPlatformIds] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState({});

  useEffect(() => {
    if (event) {
      setEventData({
        title: event.title || "",
        date: event.start
          ? new Date(event.start).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        time: event.start
          ? new Date(event.start).toTimeString().slice(0, 5)
          : "",
        description: event.description || "",
        repeat: event.repeat || "Does not repeat",
        color: event.color || colorOptions[0], // Set color from event if available
      });
    }
  }, [event]);

  useEffect(() => {
    if (eventData.date && brandId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `/v1/task/current/platfrom/${brandId}/${eventData.date}`
          );
          if (response.data.success) {
            setPlatformData(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching platform data:", error);
        }
      };
      fetchData();
    }
  }, [eventData.date, brandId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleColorSelect = (color) => {
    setEventData((prevData) => ({
      ...prevData,
      color: color,
    }));
  };

  const handlePlatformSelect = (platformId) => {
    setSelectedPlatformIds((prevIds) =>
      prevIds.includes(platformId)
        ? prevIds.filter((id) => id !== platformId)
        : [...prevIds, platformId]
    );
    setSelectedTypes((prevTypes) => {
      const newTypes = { ...prevTypes };
      delete newTypes[platformId];
      return newTypes;
    });
  };

  const handleTypeSelect = (platformId, type) => {
    setSelectedTypes((prevTypes) => ({
      ...prevTypes,
      [platformId]: type,
    }));
  };

  const handleSave = async () => {
    const startDatetime = new Date(`${eventData.date}T${eventData.time}`);

    // Determine the event_type based on the repeat value
    const eventType =
      eventData.repeat === "Does not repeat"
        ? "all_day"
        : eventData.repeat.toLowerCase();

    const requestBody = {
      brand_id: brandId,
      start_date: startDatetime.toISOString(),
      title: eventData.title,
      description: eventData.description,
      color: eventData.color, // Use the selected color here
      event_type: eventType,
      platforms: selectedPlatformIds.map((platformId) => ({
        platfrom_id: platformId,
        type_id: selectedTypes[platformId], // This now contains the 'type' value instead of '_id'
      })),
    };

    try {
      const response = await axios.post(`/v1/task/add`, requestBody);
      if (response.data.success) {
        onSave(response.data.event); // Pass the saved event back to the parent component.
        onClose(); // Close the modal.
      } else {
        console.error("Failed to save the event:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving the event:", error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed text-xs inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md z-10">
        <div className="px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">
            {event ? "Edit Task" : "Add New Task"}
          </h3>
        </div>
        <div className="px-4 py-5 space-y-4">
          <label className="block text-gray-700">
            <div className="flex space-x-2 mt-1">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-4 h-4 rounded-full border-1 ${
                    eventData.color === color
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
              value={eventData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="mt-1 block w-full rounded-md shadow-sm bg-gray-100 focus:ring-indigo-500 text-xs py-1 px-3 border-none"
            />
          </label>
          <div className="space-x-2 flex">
            {platformData.map((platform) =>
              platform.social_post.map((post) => (
                <div key={post.social_id} className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`platform-${post.social_id}`}
                      name="platform"
                      value={post.social_id}
                      checked={selectedPlatformIds.includes(post.social_id)}
                      onChange={() => handlePlatformSelect(post.social_id)}
                      className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    />
                    <label
                      htmlFor={`platform-${post.social_id}`}
                      className="ml-3 block text-xs text-gray-700"
                    >
                      <img
                        src={post.platform_logo}
                        alt={post.platform_name}
                        className="h-6 w-6 inline-block"
                      />
                      <span className="ml-2">{post.platform_name}</span>
                    </label>
                  </div>
                  {selectedPlatformIds.includes(post.social_id) && (
                    <div className="flex space-x-2">
                      {post.types.map((type) => (
                        <div key={type._id} className="flex items-center">
                          <input
                            type="radio"
                            id={`type-${type._id}`}
                            name={`type-${post.social_id}`}
                            value={type.type} // Use 'type.type' instead of 'type._id'
                            checked={
                              selectedTypes[post.social_id] === type.type
                            }
                            onChange={() =>
                              handleTypeSelect(post.social_id, type.type)
                            }
                            className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                          />
                          <label
                            htmlFor={`type-${type._id}`}
                            className="ml-1 block text-xs text-gray-700"
                          >
                            {type.content_type}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="flex items-center space-x-4">
            <label className="block text-gray-700 flex-1">
              Date
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md shadow-sm bg-gray-100 focus:ring-indigo-500 text-xs py-1 px-3 border-none"
              />
            </label>
            <label className="block text-gray-700">
              Time
              <input
                type="time"
                name="time"
                value={eventData.time}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md shadow-sm bg-gray-100 focus:ring-indigo-500 text-xs py-1 px-3 border-none"
              />
            </label>
            <label className="block text-gray-700">
              Repeat
              <select
                name="repeat"
                value={eventData.repeat}
                onChange={handleInputChange}
                className="mt-1 block w-full text-xs rounded-md shadow-sm bg-gray-100 focus:ring-indigo-500 py-1 px-3 border-none"
              >
                <option>Does not repeat</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
                <option>Custom</option>
              </select>
            </label>
          </div>
          <label className="block text-gray-700">
            Description
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="mt-1  min-h-16 block w-full rounded-md shadow-sm bg-gray-100 focus:ring-indigo-500 text-xs py-1 px-3 border-none"
            />
          </label>
        </div>
        <div className="px-4 py-3 sm:px-6 sm:flex  sm:flex-row-reverse border-t border-gray-200">
          <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
            <button
              onClick={handleSave}
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-1 bg-indigo-600 text-xs  text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 "
            >
              Save
            </button>
          </span>
          <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
            <button
              onClick={onClose}
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-1 bg-white text-xs  text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150"
            >
              Cancel
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewEventModal;
