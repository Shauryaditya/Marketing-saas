import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaUpload } from "react-icons/fa";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const DetailedUploadModal = ({ show, onClose, event }) => {
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUploadPlatform, setSelectedUploadPlatform] = useState(null);
  const [platformCaptions, setPlatformCaptions] = useState({});
  const [platformTags, setPlatformTags] = useState({});
  const [platformCopywriting, setPlatformCopywriting] = useState({});
  const [allCaption, setAllCaption] = useState("");
  const [allTags, setAllTags] = useState();
  const [allCopywriting, setAllCopywriting] = useState("");
  const [files, setFiles] = useState({}); // Object to store files per platform

  // Check if event is null and handle appropriately
  useEffect(() => {
    if (show && event) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://api.21genx.com:5000/v1/task/get/submit/${event.id}`
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
  }, [show, event]);

  const onDrop = (acceptedFiles, platformId) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [platformId]: acceptedFiles, // Store files for each platform
    }));
  };

  const handleUploadPlatformToggle = (platformId) => {
    if (platformId === "all") {
      setSelectedUploadPlatform("all");
    } else {
      setSelectedUploadPlatform((prevPlatform) =>
        prevPlatform === platformId ? null : platformId
      );
    }
  };

  const handleUpload = () => {
    if (!event || !event.id) {
      console.error("Event or event.id is not defined");
      return;
    }

    // Constructing the payload
    const uploadData = {
      task_id: event.id, // Send event.id as task_id
      submitted_tasks: [],
      applyToAllPlatforms: {
        content_caption_and_copy_writing: selectedUploadPlatform === "all",
        tags: selectedUploadPlatform === "all",
      },
    };

    // Process each platform
    if (selectedUploadPlatform === "all") {
      uploadData.submitted_tasks = taskData.platforms.map((platform) => ({
        platform_id: platform.platform_id,
        content_caption: allCaption,
        copy_writing: allCopywriting,
        image_url: "", // Placeholder for the image_url
        tags: allTags.split(",").map((tag) => tag.trim()),
      }));
    } else {
      const platform = taskData.platforms.find(
        (p) => p.platform_id === selectedUploadPlatform
      );

      uploadData.submitted_tasks.push({
        platform_id: platform.platform_id,
        content_caption: platformCaptions[selectedUploadPlatform],
        copy_writing: platformCopywriting[selectedUploadPlatform],
        image_url: "", // Placeholder for the image_url
        tags: Array.isArray(platformTags[selectedUploadPlatform])
          ? platformTags[selectedUploadPlatform]
          : platformTags[selectedUploadPlatform]
              .split(",")
              .map((tag) => tag.trim()),
      });
    }

    // Create a FormData object for the file upload
    const formData = new FormData();
    formData.append("task_id", uploadData.task_id); // Append task_id to form data

    uploadData.submitted_tasks.forEach((task, index) => {
      formData.append(
        `submitted_tasks[${index}][platform_id]`,
        task.platform_id
      );
      formData.append(
        `submitted_tasks[${index}][content_caption]`,
        task.content_caption
      );
      formData.append(
        `submitted_tasks[${index}][copy_writing]`,
        task.copy_writing
      );
      formData.append(
        `submitted_tasks[${index}][tags]`,
        JSON.stringify(task.tags)
      );

      // Append files if they exist
      if (files[task.platform_id]) {
        for (let file of files[task.platform_id]) {
          formData.append(`submitted_tasks[${index}][image_url]`, file); // Use the same key for image_url
        }
      }
    });

    // Send the request
    axios
      .post(`/v1/task/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the content type is set for file upload
        },
      })
      .then((response) => {
        console.log("Upload successful", response.data);
        // Optionally, reset state or close modal
        onClose(); // Close the modal after successful upload
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, selectedUploadPlatform), // Dropzone handler
    multiple: true,
    accept: "image/*,video/*,audio/*", // Accept images, videos, and GIFs
  });

  if (!show) return null;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 text-xs flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-gray-800 opacity-75"
        onClick={onClose}
      />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl mx-4 relative z-10 overflow-auto max-h-[90vh]">
        <div className="border-b pb-3 mb-4">
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

          <div className="mt-4">
            <span className="block font-medium text-gray-700">Description</span>
            <p className="text-gray-500">
              {taskData.description ||
                "With the built-in dialog component template in Uizard, you can create rich, realistic designs that you can quickly show to your team to get feedback and iterate."}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">
            Select Platform to Upload:
          </h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleUploadPlatformToggle("all")}
              className={`px-3 py-2 rounded-md shadow flex items-center space-x-2 ${
                selectedUploadPlatform === "all"
                  ? "bg-gray-300 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <span>All</span>
            </button>
            {taskData.platforms.map((platform) => (
              <button
                key={platform.platform_id}
                onClick={() => handleUploadPlatformToggle(platform.platform_id)}
                className={`px-3 py-2 rounded-md shadow flex items-center space-x-2 ${
                  selectedUploadPlatform === platform.platform_id
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

        <div className="mb-4">
          {selectedUploadPlatform === "all" ? (
            <>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-md h-20"
                placeholder="Write caption for all platforms..."
                value={allCaption}
                onChange={(e) => setAllCaption(e.target.value)}
              />
              <input
                type="text"
                className="w-full border border-gray-300 p-3 rounded-md mt-2"
                placeholder="Write #tags for all platforms"
                value={allTags}
                onChange={(e) => setAllTags(e.target.value)}
              />
              <textarea
                className="w-full border border-gray-300 p-3 rounded-md h-20 mt-2"
                placeholder="Write copywriting for all platforms..."
                value={allCopywriting}
                onChange={(e) => setAllCopywriting(e.target.value)}
              />
            </>
          ) : (
            taskData.platforms.map((platform) => {
              if (platform.platform_id === selectedUploadPlatform) {
                return (
                  <div key={platform.platform_id} className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700">
                      Caption, Tags & Copywriting for {platform.platform_name}:
                    </h5>
                    <textarea
                      className="w-full border border-gray-300 p-3 rounded-md h-20 mt-2"
                      placeholder={`Write caption for ${platform.platform_name}...`}
                      value={platformCaptions[platform.platform_id] || ""}
                      onChange={(e) =>
                        setPlatformCaptions((prev) => ({
                          ...prev,
                          [platform.platform_id]: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-3 rounded-md mt-2"
                      placeholder={`Write #tags for ${platform.platform_name}`}
                      value={platformTags[platform.platform_id] || ""}
                      onChange={(e) =>
                        setPlatformTags((prev) => ({
                          ...prev,
                          [platform.platform_id]: e.target.value,
                        }))
                      }
                    />
                    <textarea
                      className="w-full border border-gray-300 p-3 rounded-md h-20 mt-2"
                      placeholder={`Write copywriting for ${platform.platform_name}...`}
                      value={platformCopywriting[platform.platform_id] || ""}
                      onChange={(e) =>
                        setPlatformCopywriting((prev) => ({
                          ...prev,
                          [platform.platform_id]: e.target.value,
                        }))
                      }
                    />
                  </div>
                );
              }
              return null;
            })
          )}
        </div>

        <div className="mt-4">
          <h4 className="text-lg font-medium mb-2">Files to Upload:</h4>
          <div className="grid grid-cols-5 gap-4">
            {taskData.images.map((image) => {
              const currentFiles = files[image.platform_id] || [];
              return (
                <div
                  key={image.platform_id}
                  {...getRootProps()} // Spread the dropzone props to the box
                  className="flex flex-col items-center justify-center border border-gray-300 rounded-md h-36 cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <div className="text-gray-400">{image.content_type.type}</div>
                  <div className="text-gray-600 mt-2">
                    {image.platform_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Size: {image.content_type.size}
                  </div>
                  {currentFiles.length > 0 && (
                    <div className="text-sm text-gray-500 mt-2">
                      {currentFiles.length > 1
                        ? `${currentFiles.length} files selected`
                        : `1 file: ${currentFiles[0].name}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleUpload}
          className="mt-2 flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <FaUpload className="mr-2" />
          Upload
        </button>
      </div>
    </div>
  );
};

DetailedUploadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
};

DetailedUploadModal.defaultProps = {
  event: { id: null }, // Set default value for event
};

export default DetailedUploadModal;
