import axios from "axios";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import React, { useEffect, useState } from "react";

const GraphicDesignerModal = ({ show, onClose, taskId }) => {
  const [taskData, setTaskData] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [contentWriterData, setContentWriterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  setupAxiosInterceptors();
  useEffect(() => {
    // Fetch the task data only if the modal is open and a taskId is provided
    if (show && taskId) {
      const fetchTaskData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`/v1/task/get/submit/${taskId}`);
          setTaskData(response.data.data);
          setPlatforms(response.data?.data?.platforms);
          setContentWriterData(response.data?.data?.content_writer_data);
        } catch (err) {
          setError("Failed to fetch task data");
        } finally {
          setLoading(false);
        }
      };

      fetchTaskData();
    }
  }, [show, taskId]);

  // Function to get platform-specific styling
  const getPlatformStyle = (platform) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return "bg-blue-600 text-white";
      case "instagram":
        return "bg-pink-500 text-white";
      case "linkedin":
        return "bg-blue-500 text-white";
      case "twitter":
        return "bg-cyan-400 text-white";
      case "pinterest":
        return "bg-red-600 text-white";
      case "whatsapp":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-100 text-blue-600"; // Default for "All" or any other platform
    }
  };

  console.log("Task Data>>", taskData);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10">
      <div className="w-2/5 bg-white rounded-lg  ">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-2 mb-4">
          <h2 className="text-sm font-semibold">
            Task: {taskData?.brand_name}
          </h2>
          <button onClick={onClose} className="text-xl">
            &times;
          </button>
        </div>

        {/* Details */}
        <div className="mb-4 px-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              <p className="text-xs uppercase text-gray-200 font-semibold">
                Date & Time
              </p>
              <p className="text-xs">24/08/2024, 15:35</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-200 font-semibold">
                Work
              </p>
              <p className="text-xs">{taskData?.title}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-200 font-semibold">
                Kind
              </p>
              <p className="text-xs">Photo</p>
            </div>
            {/* <div>
              <p className="text-xs uppercase text-gray-200 font-semibold">
                Type
              </p>
              <p className="text-xs">24/08/2024, 15:35</p>
            </div> */}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4 px-4">
          <h3 className="text-start text-gray-700 font-medium text-sm uppercase">
            Description
          </h3>
          <p className="text-start text-gray-500 text-xs">{taskData?.description}</p>
        </div>

        {/* Captions */}
        <div className="mb-4 px-4">
          <h3 className="text-start text-gray-700 font-medium text-sm uppercase">
            Captions
          </h3>
          <div className="text-gray-500 text-xs">
            {/* Check if contentWriterData exists and map it */}
            {contentWriterData?.length > 0 ? (
              contentWriterData.map((item, index) => (
                <p key={index} className="mb-2 text-start text-xs font-semibold text-gray-500">
                  {item.content_caption?.trim()
                    ? item.content_caption
                    : "No caption available"}
                </p>
              ))
            ) : (
              <p className="text-xs font-semibold text-gray-500">No captions available</p>
            )}
          </div>
        </div>
        {/* Captions */}
        <div className="mb-4 px-4">
          <h3 className="text-start text-gray-700 font-medium text-sm uppercase">
            Uploaded Images
          </h3>
          <div className="flex flex-wrap space-x-2">
            {/* Check if images exist and map over them */}
            {taskData?.images?.length > 0 ? (
              taskData.images.every((item) => item.image_url) ? (
                taskData.images.map((item, index) => (
                  <div key={index} className="mb-4">
                    <img
                      src={item.image_url}
                      alt={item.content_caption || "Image"}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                ))
              ) : (
                <p className="text-start text-xs font-semibold text-gray-500">
                  No images available
                </p>
              )
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>

        {/* Social Media Buttons */}
        <div className="mb-4 px-4">
          <h3 className="text-start text-gray-700 font-medium uppercase text-sm">
            Platform
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* Map over the platforms to create buttons dynamically */}
            {platforms.map((platform, index) => (
              <button
                key={index}
                className={`py-1 px-3 rounded text-xs ${getPlatformStyle(
                  platform?.platform_name
                )}`}
              >
                {platform?.platform_name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 px-4">
          <h3 className="text-start text-gray-700 font-medium uppercase text-sm">#Tags</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* Check if taskData and tags_data exist and if tags_data is not an empty array */}
            {taskData?.tags_data && taskData.tags_data.length > 0 ? (
              taskData.tags_data.map((item, index) =>
                // Check if the tags field has a value
                item.tags.length > 0 ? (
                  <p key={index}>{item.tags}</p>
                ) : (
                  <p
                    className="text-xs font-semibold text-gray-500"
                    key={index}
                  >
                    No tags available
                  </p>
                )
              )
            ) : (
              <p>No tags available</p>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-center items-center gap-x-4 p-4">
          <button className=" bg-blue-600 text-white py-2 px-4 rounded text-xs">
            Approve
          </button>
          <button className=" bg-white text-blue-600 border border-blue-600  py-2 px-4 rounded text-xs">
            Disapprove
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphicDesignerModal;
