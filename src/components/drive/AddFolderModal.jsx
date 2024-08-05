import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AddFolderModal = ({ isOpen, onClose, parentFolderId, onFolderAdded }) => {
  // const { brandId } = useParams(); // Get brandId from URL params
  const [folderName, setFolderName] = useState("");
  const { id: brandId } = useParams();

  const handleAddFolder = async () => {
    if (!folderName.trim() || !brandId) {
      console.error("Both folder name and brand ID are required.");
      return;
    }

    // Prepare the request body
    const body = {
      name: folderName,
      brand_id: brandId, // Ensure brand_id is included
      parentFolderId: parentFolderId || null, // Use parentFolderId to nest
    };

    console.log("Adding folder with data:", body); // Log payload for debugging

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.error("Access token is missing.");
        return;
      }

      const response = await axios.post(
        "http://192.168.1.38:8000/v1/collateral/folder/add",
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Folder added:", response.data); // Log API response for debugging
      onFolderAdded(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding folder:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl mb-4">Add Folder</h2>
        <input
          type="text"
          placeholder="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAddFolder}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;
