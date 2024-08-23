import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const AddCollateralModal = ({ isOpen, onClose, onCollateralAdded }) => {
  const [files, setFiles] = useState([]);
  const { brandId, parentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setFiles([]);
    }
  }, [isOpen]);

  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("brand_id", brandId);
      formData.append("folderId", parentId || undefined);

      const accessToken = localStorage.getItem("access_token");
      const response = await axios.post(
        `${apiUrl}/v1/collateral/file/upload`,
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
        <h2 className="text-xl font-semibold mb-4">Add New Collateral</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg flex flex-col items-center justify-center h-48"
          >
            <input {...getInputProps()} multiple />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>

            {files.length > 0 ? (
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                Drag 'n' drop files here, or click to select files
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
              Add Collateral
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCollateralModal;
