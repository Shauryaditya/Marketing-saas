import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";

const FileUploadModal = ({ isOpen, onClose, onCollateralAdded }) => {
  const [file, setFile] = useState(null);
  const { brandId, parentId } = useParams();
  console.log("folderid", parentId);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("brand_id", brandId);
      formData.append("folderId", parentId || undefined);

      const accessToken = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://192.168.1.38:8000/v1/collateral/file/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Collateral added:", response.data);
      onCollateralAdded(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding collateral:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Add New File</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg flex flex-col items-center justify-center h-48"
          >
            <input {...getInputProps()} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>

            {file ? (
              <p>{file.name}</p>
            ) : (
              <p className="text-gray-500">
                Drag 'n' drop a file here, or click to select a file
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;
