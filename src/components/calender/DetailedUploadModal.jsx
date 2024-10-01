import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaUpload } from "react-icons/fa";
import axios from "axios"; // Import Axios

const DetailedUploadModal = ({ show, onClose }) => {
  const [taskData, setTaskData] = useState(null); // For storing task data
  const [tags, setTags] = useState(""); // For storing hashtags input
  const [loading, setLoading] = useState(true); // Loading state while fetching data
  const [selectedPlatforms, setSelectedPlatforms] = useState([]); // State to store selected platforms
  const [selectAll, setSelectAll] = useState(false); // State to track if 'All' is selected
  const fileInputRef = useRef(null); // Ref for the file input

  // Fetch task data when the modal is shown
  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://api.21genx.com:5000/v1/task/get/submit/66f4107fb6aab0705152b616"
          );
          setTaskData(response.data.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching task data:", error);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [show]);

  // Close the modal if not shown
  if (!show) return null;

  // Loading state while fetching data
  if (loading) return <div>Loading...</div>;

  // Handler for hashtags input
  const handleTagChange = (e) => {
    setTags(e.target.value);
  };

  // Handle platform selection toggle
  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms((prevSelected) =>
      prevSelected.includes(platformId)
        ? prevSelected.filter((id) => id !== platformId)
        : [...prevSelected, platformId]
    );
    setSelectAll(false); // If selecting/deselecting individual platforms, uncheck "All"
  };

  // Handle "Select All/Deselect All" platforms
  const handleSelectAllToggle = () => {
    if (selectAll) {
      // Deselect all platforms
      setSelectedPlatforms([]);
    } else {
      // Select all platforms
      const allPlatformIds = taskData.platforms.map(
        (platform) => platform.platform_id
      );
      setSelectedPlatforms(allPlatformIds);
    }
    setSelectAll(!selectAll); // Toggle select all state
  };

  // Handle file upload
  const handleUpload = (platformName) => {
    console.log(`Uploading content for ${platformName}`);

    // Simulate triggering the file input
    fileInputRef.current.click();
  };

  // Handle file change event
  const handleFileChange = (e) => {
    const files = e.target.files; // Get the selected files

    if (files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]); // Append each file to form data
      }
      // You can send the formData to your backend API
      axios
        .post("YOUR_UPLOAD_URL_HERE", formData)
        .then((response) => {
          console.log("File uploaded successfully", response.data);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-gray-800 opacity-75"
        onClick={onClose}
      />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl mx-4 relative z-10 overflow-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="border-b pb-3 mb-4">
          {/* Task Information */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Task: {taskData.title || "NOVIUM-202407290730"}
              </h3>
              <p className="text-sm text-gray-500">
                Date & Time: 24/08/2024, 15:35{" "}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Additional Task Info */}
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div>
              <span className="block font-medium text-gray-700">Work</span>
              <span className="block text-gray-500">
                {taskData.brand_name || "Novium Pen"}
              </span>
            </div>

            <div>
              <span className="block font-medium text-gray-700">CW Status</span>
              <span className="block text-gray-500">
                {taskData.cw_status || "N/A"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <span className="block font-medium text-gray-700">Description</span>
            <p className="text-gray-500">
              {taskData.description ||
                "With the built-in dialog component template in Uizard, you can create rich, realistic designs that you can quickly show to your team to get feedback and iterate."}
            </p>
          </div>
        </div>

        {/* Platform Selection (First Instance) */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            {/* All Button */}
            <button
              onClick={handleSelectAllToggle}
              className={`px-3 py-2 rounded-md shadow flex items-center space-x-2 ${
                selectAll
                  ? "bg-gray-300 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <span>All</span>
            </button>
            {/* Platform Buttons */}
            {taskData.platforms.map((platform) => (
              <button
                key={platform.platform_id}
                onClick={() => handlePlatformToggle(platform.platform_id)}
                className={`px-3 py-2 rounded-md shadow flex items-center space-x-2 ${
                  selectedPlatforms.includes(platform.platform_id)
                    ? "bg-gray-300 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <img
                  src={platform.platform_logo}
                  alt={platform.platform_name}
                  className="w-4 h-4"
                />
                <span>{platform.platform_name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Write Caption */}
        <div className="mb-4">
          <textarea
            className="w-full border border-gray-300 p-3 rounded-md h-20"
            placeholder="Write Captions..."
          ></textarea>
        </div>

        {/* Image Upload Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {taskData.images.map((image) => (
            <div
              key={image.platform_id}
              className="flex flex-col items-center justify-center border border-gray-300 rounded-md h-36"
            >
              <div className="text-gray-400">{image.content_type.type}</div>
              <div className="text-gray-600 mt-2">{image.platform_name}</div>
              <div className="text-sm text-gray-500">
                Size: {image.content_type.size} {/* Display the size */}
              </div>
              <button
                className="mt-3 text-blue-500 hover:underline"
                onClick={() => handleUpload(image.platform_name)}
              >
                Upload
              </button>
            </div>
          ))}
        </div>

        {/* Platform Selection (Second Instance) */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            {/* All Button */}
            <button
              onClick={handleSelectAllToggle}
              className={`px-3 py-2 rounded-md shadow flex items-center space-x-2 ${
                selectAll
                  ? "bg-gray-300 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <span>All</span>
            </button>
            {/* Platform Buttons */}
            {taskData.platforms.map((platform) => (
              <button
                key={platform.platform_id}
                onClick={() => handlePlatformToggle(platform.platform_id)}
                className={`px-3 py-2 rounded-md shadow flex items-center space-x-2 ${
                  selectedPlatforms.includes(platform.platform_id)
                    ? "bg-gray-300 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <img
                  src={platform.platform_logo}
                  alt={platform.platform_name}
                  className="w-4 h-4"
                />
                <span>{platform.platform_name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Write Hashtags */}
        <div className="mb-4">
          <input
            type="text"
            value={tags}
            onChange={handleTagChange}
            className="w-full border border-gray-300 p-3 rounded-md"
            placeholder="Write #tags"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button className="bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600">
            Preview
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 flex items-center">
            <FaUpload className="mr-2" />
            Upload
          </button>
        </div>

        {/* Hidden File Input for Uploading */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }} // Hide the file input
          multiple // Allow multiple file uploads
        />
      </div>
    </div>
  );
};

DetailedUploadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DetailedUploadModal;
