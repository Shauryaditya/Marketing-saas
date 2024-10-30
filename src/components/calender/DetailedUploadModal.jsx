import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaUpload } from "react-icons/fa";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import TagModal from "./TagModal";
import { add } from "date-fns";

const DetailedUploadModal = ({ show, onClose, event }) => {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUploadPlatform, setSelectedUploadPlatform] = useState();
  const [platformCaptions, setPlatformCaptions] = useState({});
  const [platformTags, setPlatformTags] = useState({});
  const [platformCopywriting, setPlatformCopywriting] = useState({});
  const [allCaption, setAllCaption] = useState("");
  const [allTags, setAllTags] = useState();
  const [allCopywriting, setAllCopywriting] = useState("");
  const [files, setFiles] = useState({}); // Object to store files per platform
  const [showTagModal, setShowTagModal] = useState(false);
  // Check if event is null and handle appropriately
  useEffect(() => {
    if (show && event) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/v1/task/get/submit/${event.id}`);

          const data = response.data.data;
          setSelectedUploadPlatform(data?.platforms[0]?.platform_id);
          // Parse submit_date to extract year and month
          const submitDate = new Date(data.submit_date);
          const year = submitDate.getFullYear();
          const month = submitDate.getMonth() + 1;
          setTaskData({ ...data, year, month });
          const { caption, copyWriting } =
            data?.content_writer_data?.reduce(
              (acc, key) => {
                acc.caption[key.platform_id] = key.content_caption;
                acc.copyWriting[key.platform_id] = key.copy_writing;
                return acc;
              },
              { caption: {}, copyWriting: {} }
            ) || {};
          setPlatformCopywriting(copyWriting);
          setPlatformCaptions(caption);

          const tagData = data?.tags_data?.reduce((acc, key) => {
            // If the platform_id already exists, concatenate the unique tags
            acc[key.platform_id] = key.tags;
            return acc;
          }, {});
          setPlatformTags(tagData);
          const images = data?.tags_data?.reduce((acc, key) => {
            // If the platform_id already exists, concatenate the unique tags
            acc[key.platform_id] = key.image_url;

            return acc;
          }, {});
          setFiles(images);
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
    console.log("drop file", platformId, acceptedFiles);
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
  console.log("task data", taskData);
  console.log("tags", platformTags);
  const handleUpload = () => {
    if (!event || !event.id) {
      console.error("Event or event.id is not defined");
      return;
    }

    // Constructing the payload
    const uploadData = {
      task_id: event.id,
      submitted_tasks: [],
      applyToAllPlatforms: {
        content_caption_and_copy_writing: selectedUploadPlatform === "all",
        tags: selectedUploadPlatform === "all",
      },
    };

    if (selectedUploadPlatform === "all") {
      uploadData.submitted_tasks = taskData.platforms.map((platform) => ({
        platform_id: platform.platform_id,
        content_caption: allCaption,
        copy_writing: allCopywriting,
        files: "", // Placeholder for the files, will be updated below
        tags: allTags.split(",").map((tag) => tag.trim()),
      }));
    } else {
      const platform = taskData.platforms.find(
        (p) => p.platform_id === selectedUploadPlatform
      );

      const tags = platformTags[selectedUploadPlatform]
        ? platformTags[selectedUploadPlatform]
        : platformTags[selectedUploadPlatform].split(" "); // Adjust the delimiter as necessary

      uploadData.submitted_tasks.push({
        platform_id: platform.platform_id,
        content_caption: platformCaptions[selectedUploadPlatform],
        copy_writing: platformCopywriting[selectedUploadPlatform],
        files: "", // Placeholder for the files, will be updated below
        tags: tags,
      });
    }

    const formData = new FormData();
    formData.append("task_id", uploadData.task_id);

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
      if (files[task.platform_id]) {
        files[task.platform_id].forEach((file) => {
          console.log(
            `Appending file: ${file.name} to platform: ${task.platform_id}`,
            file
          ); // Debugging file appending
          formData.append(`submitted_tasks[${index}][files]`, file);
        });
      }
    });
    axios
      .post(`/v1/task/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Upload successful", response.data);
        onClose();
      })
      .catch((error) => {
        console.error(
          "Error uploading files:",
          error.response ? error.response.data : error.message
        ); // Improved error logging
      });
  };

  const handleSelectTags = (tags) => {
    // Update tags in the relevant input fields
    if (selectedUploadPlatform === "all") {
      setAllTags(tags);
    } else if (selectedUploadPlatform) {
      setPlatformTags((prev) => ({
        ...prev,
        [selectedUploadPlatform]: tags,
      }));
    }
  };

  if (!show) return null;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 text-xs flex items-center  justify-center z-50">
      <div
        className="absolute inset-0 bg-gray-800 opacity-75"
        onClick={onClose}
      />
      <div className="bg-white p-6 rounded-lg no-scrollbar shadow-lg w-full max-w-6xl mx-4 relative z-10 overflow-auto max-h-[90vh]">
        <div className="border-b pb-3 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Task: {taskData.taskId}
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
              <span className="flex justify-end text-gray-500 mt-4">
                Time Left: {taskData.content_writer_time_left}
              </span>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-md h-20"
                placeholder="Write caption for all platforms..."
                value={allCaption}
                onChange={(e) => setAllCaption(e.target.value)}
              />

              <textarea
                className="w-full border border-gray-300 p-3 rounded-md h-20 mt-2"
                placeholder="Write copywriting for all platforms..."
                value={allCopywriting}
                onChange={(e) => setAllCopywriting(e.target.value)}
              />
              <span className="flex justify-end text-gray-500 mt-4">
                Time Left: {taskData.tags_time_left}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 p-3 rounded-md"
                  placeholder="Write #tags for all platforms"
                  value={allTags}
                  onChange={(e) => setAllTags(e.target.value)}
                />
                <button
                  onClick={() => setShowTagModal(true)}
                  className="text-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.75 3.375c0-1.036.84-1.875 1.875-1.875H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375Zm10.5 1.875a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Zm-3.75 5.56c0-1.336-1.616-2.005-2.56-1.06l-.22.22a.75.75 0 0 0 1.06 1.06l.22-.22v1.94h-.75a.75.75 0 0 0 0 1.5H9v3c0 .671.307 1.453 1.068 1.815a4.5 4.5 0 0 0 5.993-2.123c.233-.487.14-1-.136-1.37A1.459 1.459 0 0 0 14.757 15h-.507a.75.75 0 0 0 0 1.5h.349a2.999 2.999 0 0 1-3.887 1.21c-.091-.043-.212-.186-.212-.46v-3h5.25a.75.75 0 1 0 0-1.5H10.5v-1.94Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <TagModal
                  show={showTagModal}
                  onClose={() => setShowTagModal(false)}
                  month={taskData.month}
                  year={taskData.year}
                  brandId={taskData.brand_id}
                  onSelectTags={handleSelectTags}
                />
              </div>
            </>
          ) : (
            taskData.platforms.map((platform) => {
              if (platform.platform_id === selectedUploadPlatform) {
                return (
                  <div key={platform.platform_id} className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700">
                      Caption, Tags & Copywriting for {platform.platform_name}:
                    </h5>
                    <span className="flex justify-end text-gray-500 mt-4">
                      Time Left: {taskData.content_writer_time_left}
                    </span>
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
                    <span className="flex justify-end text-gray-500 mt-4">
                      Time Left: {taskData.tags_time_left}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        className="w-full border border-gray-300 p-3 rounded-md"
                        placeholder={`Write #tags for ${
                          taskData.platforms.find(
                            (p) => p.platform_id === selectedUploadPlatform
                          )?.platform_name
                        }`}
                        value={platformTags[selectedUploadPlatform] || ""}
                        onChange={(e) =>
                          setPlatformTags((prev) => ({
                            ...prev,
                            [selectedUploadPlatform]: e.target.value,
                          }))
                        }
                      />

                      <button
                        onClick={() => setShowTagModal(true)}
                        className="text-blue-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.75 3.375c0-1.036.84-1.875 1.875-1.875H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375Zm10.5 1.875a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Zm-3.75 5.56c0-1.336-1.616-2.005-2.56-1.06l-.22.22a.75.75 0 0 0 1.06 1.06l.22-.22v1.94h-.75a.75.75 0 0 0 0 1.5H9v3c0 .671.307 1.453 1.068 1.815a4.5 4.5 0 0 0 5.993-2.123c.233-.487.14-1-.136-1.37A1.459 1.459 0 0 0 14.757 15h-.507a.75.75 0 0 0 0 1.5h.349a2.999 2.999 0 0 1-3.887 1.21c-.091-.043-.212-.186-.212-.46v-3h5.25a.75.75 0 1 0 0-1.5H10.5v-1.94Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <TagModal
                      show={showTagModal}
                      onClose={() => setShowTagModal(false)}
                      month={taskData.month}
                      year={taskData.year}
                      brandId={taskData.brand_id}
                      onSelectTags={handleSelectTags}
                    />
                  </div>
                );
              }
              return null;
            })
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <h4 className="text-lg font-medium mb-2">Files to Upload:</h4>
            <span className="block text-gray-500 mt-4">
              Time Left: {taskData.image_time_left}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {taskData.images.map((image) => {
              const currentFiles = files[image.platform_id] || [];

              return (
                <CustomDropzone
                  key={image.platform_id}
                  platformId={image.platform_id}
                  onDrop={onDrop}
                  imageUrl={image.image_url}
                  isfile={currentFiles.length}
                  // Pass image_url here
                >
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
                </CustomDropzone>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleUpload}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </div>
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

const CustomDropzone = ({ platformId, onDrop, imageUrl, children, isfile }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, platformId), // Pass platformId to onDrop
    multiple: true,
    accept: "image/*,video/*,audio/*", // Accept images, videos, and GIFs
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col bg-blue-100 items-center justify-center border border-gray-300 rounded-md h-28 cursor-pointer relative"
    >
      <input {...getInputProps()} />
      {imageUrl && !isfile ? (
        <img
          src={imageUrl}
          alt="Uploaded preview"
          className="absolute inset-0 object-cover w-full h-full rounded-md"
        />
      ) : (
        children
      )}
    </div>
  );
};
