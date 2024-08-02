import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";

const Platforms = () => {
  const [platforms, setPlatforms] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [platformName, setPlatformName] = useState("");
  const [platformLogo, setPlatformLogo] = useState(null);
  const [platformLink, setPlatformLink] = useState("");
  const [platformContentTypes, setPlatformContentTypes] = useState([
    { type: "", length: "", width: "" },
  ]);
  const [editMode, setEditMode] = useState(false);
  const [currentPlatformId, setCurrentPlatformId] = useState(null);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.38:5000/v1/platform/get",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPlatforms(response.data.data);
      } catch (error) {
        console.error("Error fetching platforms:", error);
      }
    };

    const fetchContentTypes = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.38:5000/v1/platform/type/get?page=1&limit=10",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setContentTypes(response.data.data);
      } catch (error) {
        console.error("Error fetching content types:", error);
      }
    };

    fetchPlatforms();
    fetchContentTypes();
  }, [accessToken]);

  const handleAddPlatform = async () => {
    const platformData = {
      platform_name: platformName,
      platform_logo: platformLogo,
      platform_link: platformLink,
      content_type: platformContentTypes.map((contentType) => ({
        type: contentType.type,
        size: `${contentType.length} x ${contentType.width}`,
      })),
    };

    try {
      if (editMode) {
        await axios.put(
          `http://192.168.1.38:5000/v1/platform/edit/${currentPlatformId}`,
          platformData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.post(
          "http://192.168.1.38:5000/v1/platform/add",
          platformData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      setShowModal(false);
      resetForm();
      const response = await axios.get(
        "http://192.168.1.38:5000/v1/platform/get",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPlatforms(response.data.data);
    } catch (error) {
      console.error("Error adding platform:", error);
    }
  };

  const handleEditPlatform = (platform) => {
    setEditMode(true);
    setCurrentPlatformId(platform._id);
    setPlatformName(platform.platform_name);
    setPlatformLogo(platform.platform_logo);
    setPlatformLink(platform.platform_link);
    setPlatformContentTypes(
      platform.content_type.map((contentType) => {
        const [length, width] = contentType.size.split(" x ");
        return { type: contentType.type, length, width };
      })
    );
    setShowModal(true);
  };

  const resetForm = () => {
    setPlatformName("");
    setPlatformLogo(null);
    setPlatformLink("");
    setPlatformContentTypes([{ type: "", length: "", width: "" }]);
    setEditMode(false);
    setCurrentPlatformId(null);
  };

  const handleContentTypeChange = (index, field, value) => {
    const newContentTypes = [...platformContentTypes];
    newContentTypes[index][field] = value;
    setPlatformContentTypes(newContentTypes);
  };

  const handleAddContentType = () => {
    setPlatformContentTypes([
      ...platformContentTypes,
      { type: "", length: "", width: "" },
    ]);
  };

  const handleFileUpload = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPlatformLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-96 h-72 text-xs bg-white rounded-xl overflow-hidden border border-gray-300 relative">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-sm text-gray-800">Platforms</div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-1 py-1 bg-gray-100 text-gray-800 rounded-md"
          >
            + Add Platform
          </button>
        </div>
        <div className="bg-gray-200 p-2 flex justify-between items-center text-xs text-gray-600 mb-2">
          <div className="w-1/4 text-left">LOGO</div>
          <div className="w-1/4 text-left">NAME</div>
          <div className="w-1/2 text-left">LINK</div>
          <div className="w-1/4 text-center">ACTIONS</div>
        </div>
        {platforms.map((platform) => (
          <div
            key={platform._id}
            className="flex items-center justify-between border-b border-gray-300 py-1 px-2"
          >
            <img
              className="w-8 h-8 object-cover"
              src={platform.platform_logo}
              alt={`${platform.platform_name} Logo`}
            />
            <div className="text-xs pl-8 text-gray-800 flex-1 text-left">
              {platform.platform_name}
            </div>
            <div className="w-1/2 text-left">
              <a
                href={platform.platform_link}
                className="text-xs text-blue-600 underline break-words"
              >
                {platform.platform_link}
              </a>
            </div>
            <button
              onClick={() => handleEditPlatform(platform)}
              className="px-2 py-1 rounded ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">
              {editMode ? "Edit Platform" : "Add New Platform"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full border border-gray-300 p-1 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Platform Link
              </label>
              <input
                type="text"
                value={platformLink}
                onChange={(e) => setPlatformLink(e.target.value)}
                className="w-full border border-gray-300 p-1 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Logo</label>
              <div className="border border-dashed border-gray-400 rounded-md p-2 text-center">
                {platformLogo ? (
                  <img
                    src={platformLogo}
                    alt="Platform Logo"
                    className="mb-4 mx-auto h-20 w-20 object-cover"
                  />
                ) : (
                  <div className="text-gray-600">Upload Logo</div>
                )}
                <Dropzone onDrop={handleFileUpload}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>
                          Drag 'n' drop some files here, or click to select
                          files
                        </p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </div>
            {platformContentTypes.map((contentType, index) => (
              <div key={index} className="flex items-center mb-4">
                <select
                  className="w-full border border-gray-300 p-1 rounded mr-2"
                  value={contentType.type}
                  onChange={(e) =>
                    handleContentTypeChange(index, "type", e.target.value)
                  }
                >
                  <option value="">Select type</option>
                  {contentTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.content_type}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={contentType.length}
                  onChange={(e) =>
                    handleContentTypeChange(index, "length", e.target.value)
                  }
                  className="w-full border border-gray-300 p-1 rounded"
                  placeholder="Length"
                />
                <span className="mx-1">x</span>
                <input
                  type="text"
                  value={contentType.width}
                  onChange={(e) =>
                    handleContentTypeChange(index, "width", e.target.value)
                  }
                  className="w-full border border-gray-300 p-1 rounded"
                  placeholder="Width"
                />
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={handleAddContentType}
                className="px-2 py-1 text-right bg-blue-800 text-white rounded mb-4"
              >
                +
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 bg-gray-300 text-gray-800 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlatform}
                className="px-4 py-1 bg-blue-500 text-white rounded"
              >
                {editMode ? "Update Platform" : "Add Platform"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Platforms;
