import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import CustomModal from "./CustomModal";
const apiUrl = import.meta.env.VITE_API_URL;
import { format } from "date-fns";
setupAxiosInterceptors();

const colorOptions = ["#FF8D6F", "#66FF8E", "#66A3FF", "#F4D76D", "#B88CC7"];

const NewEventModal = ({ show, onClose, onSave, event, editScope, type }) => {
  if (type == "add") console.log("type event data", type, event);
  if (type == "edit") console.log("type event data", type, event);

  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    repeat: "Does not repeat",
    color: colorOptions[0], // Default color
  });
  const { id: brandId } = useParams();

  const [platformData, setPlatformData] = useState([]);
  const [selectedPlatformIds, setSelectedPlatformIds] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [recurrenceData, setRecurrenceData] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [isApiCalledSuccessfully, setIsApiCalledSuccessfully] = useState(false);
  useEffect(() => {
    if (!type && show) return;
    setIsApiCalledSuccessfully(false);
  }, [type, show]);
  useEffect(() => {
    if (eventData && brandId && !isApiCalledSuccessfully) {
      // Check if the call has not been made successfully
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/v1/task/current/platfrom/${brandId}/${eventData.date}`
          );
          if (response.data.success) {
            setPlatformData(response.data.data);
            setIsApiCalledSuccessfully(true); // Mark as successful to prevent future calls
          } else {
            setPlatformData([]);
          }
        } catch (error) {
          setPlatformData([]);
          console.error("Error fetching platform data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [brandId, eventData, isApiCalledSuccessfully]);

  useEffect(() => {
    if (!event) return; // Simply return if there is no event

    if (type === "edit" && event) {
      console.log("edit event", event);
      const selectedPlatformids = event.platforms_data.map((d) => d._id);
      const selectedType = event.platforms_data.reduce((acc, d) => {
        if (d?.content_types) {
          d.content_types.forEach((p) => {
            if (p) {
              acc[d._id] = p.type; // Add key-value pair to the object
            }
          });
        }
        return acc;
      }, {});
      setSelectedTypes(selectedType);
      setSelectedPlatformIds(selectedPlatformids);

      const dateObject = new Date(event?.start);
      const formattedTime = format(dateObject, "HH:mm");
      const formattedDate = format(dateObject, "yyyy-MM-dd");
      var eventType = "";
      if (event.event_type == "all_day") {
        eventType = "Does not repeat";
      }
      if (event.event_type == "daily") {
        eventType = "daily";
      }
      if (event.event_type == "recurring") {
        eventType = "Custom";
      }
      setEventData({
        title: event.title || "",
        date: formattedDate,
        time: formattedTime,
        description: event.description || "",
        repeat: eventType,
        color: event.color || colorOptions[0],
      });
    }
    if (type == "add") {
      const dateObject = new Date(event.start);
      setEventData({
        title: "",
        date: format(dateObject, "yyyy-MM-dd"),
        time: "12:00",
        description: "",
        repeat: "Does not repeat",
        color: colorOptions[0], // Default color
      });
      setSelectedTypes({});
      setSelectedPlatformIds([]);
    }
  }, [event, type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "repeat" && value === "Custom") {
      setShowCustomModal(true);
    }
  };

  // const handleColorSelect = (color) => {
  //   setEventData((prevData) => ({
  //     ...prevData,
  //     color: color,
  //   }));
  // };

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
    // Validation for mandatory fields
    if (!eventData.title.trim()) {
      return toast.error("Title is required.");
    }
    if (!eventData.date) {
      return toast.error("Date is required.");
    }
    if (!eventData.time) {
      return toast.error("Time is required.");
    }
    if (!selectedPlatformIds.length) {
      return toast.error("At least one platform must be selected.");
    }

    // Ensure a type is selected for each selected platform
    const missingTypes = selectedPlatformIds.some(
      (platformId) => !selectedTypes[platformId]
    );
    if (missingTypes) {
      return toast.error("Please select a type for each selected platform.");
    }

    if (eventData.repeat === "Custom" && !recurrenceData) {
      return toast.error(
        "Recurrence details are required for custom recurring events."
      );
    }

    // Continue with event creation logic if all validations pass
    const startDatetime = new Date(`${eventData.date}T${eventData.time}`);
    const endDatetime = recurrenceData?.endDate
      ? new Date(recurrenceData.endDate)
      : null;

    var eventType = "";
    if (eventData.repeat === "Does not repeat") {
      eventType = "all_day";
    } else if (eventData.repeat === "Custom") {
      eventType = "recurring";
    } else if (eventData.repeat === "daily") {
      eventType = "daily";
    }

    const requestBody = {
      brand_id: brandId,
      start_date: startDatetime.toISOString(),
      end_date: endDatetime ? endDatetime.toISOString() : null,
      title: eventData.title,
      description: eventData.description,
      color: eventData.color,
      event_type: eventType,
      platforms: selectedPlatformIds.map((platformId) => ({
        platform_id: platformId,
        type_id: selectedTypes[platformId],
      })),
      ...(eventData.repeat === "Custom" && { recurrence: recurrenceData }),
    };

    try {
      let response;
      if (type === "add") {
        response = await axios.post(`${apiUrl}/v1/task/add`, requestBody);
      } else if (type === "edit") {
        response = await axios.put(
          `${apiUrl}/v1/task/${editScope === "all" ? "edit" : "single/edit"}/${
            event.id
          }`,
          requestBody
        );
      }
      if (response.data.message) {
        console.log("msg", response.data.message);
        onClose(); // Close the modal after successful save
      } else {
        toast.error("Failed to save the event:", response.message);
      }
    } catch (error) {
      console.error("Error saving the event:", error);

      // Check if the error is a 400 with the specific message
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "Cannot create events for past dates"
      ) {
        toast.error("Cannot create events for past dates");
      } else {
        toast.error("An error occurred while saving the event.");
      }
    }
  };

  return (
    <div>
      {show && (
        <div className="fixed text-xs inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-gray-900 opacity-50"
            onClick={onClose}
          ></div>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md z-10">
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                {type == "edit" ? "Edit Task" : "Add New Task"}
              </h3>
            </div>
            <div className="space-y-4">
              {/* Color selection section (commented out) */}
              {/* <label className="block text-gray-700">
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
              </label> */}
              <div className="p-3 space-y-4">
                <label className="block text-gray-700">
                  Title
                  <input
                    required
                    type="text"
                    name="title"
                    value={eventData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="mt-1 block w-full rounded-md shadow-sm bg-gray-100 focus:ring-indigo-500 text-xs py-1 px-3 border-none"
                  />
                </label>

                {/* Conditionally render platform section */}
                {loading ? (
                  <p className="text-gray-500 text-xs">Loading platforms...</p>
                ) : platformData.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {platformData?.map((platform) =>
                      platform?.social_post.map((post) => (
                        <div key={post.social_id} className="space-y-2">
                          <div className="flex items-center">
                            <input
                              required
                              type="checkbox"
                              id={`platform-${post.social_id}`}
                              name="platform"
                              value={post.social_id}
                              checked={selectedPlatformIds?.includes(
                                post.social_id
                              )}
                              onChange={() =>
                                handlePlatformSelect(post.social_id)
                              }
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label
                              htmlFor={`platform-${post.social_id}`}
                              className="flex flex-col  justify-center items-left ml-3 text-xs text-gray-700"
                            >
                              <img
                                src={post.platform_logo}
                                alt={post.platform_name}
                                className="h-4 w-4 inline-block"
                              />
                              <span className="">{post.platform_name}</span>
                            </label>
                          </div>
                          {selectedPlatformIds.includes(post.social_id) && (
                            <div className="flex flex-col space-y-2">
                              {post.types.map((type) => (
                                <div
                                  key={type._id}
                                  className="flex  items-center"
                                >
                                  <input
                                    required
                                    type="radio"
                                    id={`type-${type._id}`}
                                    name={`type-${post.social_id}`}
                                    value={type.type}
                                    checked={
                                      selectedTypes[post.social_id] ===
                                      type.type
                                    }
                                    onChange={() =>
                                      handleTypeSelect(
                                        post.social_id,
                                        type.type
                                      )
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
                ) : (
                  <p className="text-gray-500 text-xs">No Strategy found</p>
                )}

                <div className="flex items-center space-x-4">
                  <label className="block text-gray-700 flex-1">
                    Date
                    <input
                      required
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
                      required
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
                      className="mt-1 block w-full rounded-md shadow-sm bg-gray-100 focus:ring-indigo-500 text-xs py-1 px-3 border-none"
                    >
                      <option value="Does not repeat">Does not repeat</option>
                      <option value="daily">Daily</option>
                      <option value="Custom">Custom</option>
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
                    className="mt-1 block w-full rounded-md shadow-sm bg-gray-100 focus:ring-indigo-500 text-xs py-1 px-3 border-none"
                  />
                </label>
              </div>
              <div className="px-4 py-3 text-xs bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-2 py-1 bg-black text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSave}
                >
                  {type == "edit" ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCustomModal && (
        <CustomModal
          type="edit"
          recurrence={event?.recurrence}
          recurrenceData={recurrenceData}
          show={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          onSave={(customRecurrenceData) => {
            setRecurrenceData(customRecurrenceData);
            setEventData((prevData) => ({
              ...prevData,
              repeat: "Custom",
            }));
            setShowCustomModal(false);
          }}
        />
      )}
    </div>
  );
};

export default NewEventModal;
