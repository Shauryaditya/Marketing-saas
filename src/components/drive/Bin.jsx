import React, { useEffect, useState } from "react";
import axios from "axios";
import { FolderIcon } from "@heroicons/react/24/outline"; // Ensure to install @heroicons/react

const Bin = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch folders on mount
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get(
          "https://api.21genx.com:5000/v1/collateral/bin/folders"
        );
        setFolders(response.data);
      } catch (error) {
        setError("Failed to fetch folders");
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  // Handle folder selection
  const handleFolderSelection = (folderId) => {
    setSelectedFolders((prevSelected) =>
      prevSelected.includes(folderId)
        ? prevSelected.filter((id) => id !== folderId)
        : [...prevSelected, folderId]
    );
  };

  // Delete selected folders
  const handleDelete = async () => {
    try {
      await axios.post("https://api.21genx.com:5000/v1/collateral/bin/delete", {
        folderIds: selectedFolders,
      });
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => !selectedFolders.includes(folder.id))
      );
      setSelectedFolders([]); // Clear selected after deletion
    } catch (error) {
      setError("Failed to delete folders");
    }
  };

  // Restore selected folders
  const handleRestore = async () => {
    try {
      await axios.post(
        "https://api.21genx.com:5000/v1/collateral/bin/restore",
        {
          folderIds: selectedFolders,
        }
      );
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => !selectedFolders.includes(folder.id))
      );
      setSelectedFolders([]); // Clear selected after restoration
    } catch (error) {
      setError("Failed to restore folders");
    }
  };

  return (
    <div className="p-4">
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {/* Action buttons */}
          <div className="mb-4 flex justify-end space-x-2">
            <button
              onClick={handleDelete}
              className="bg-red-100 text-red-500 hover:bg-red-200 px-2 py-1 text-xs rounded-md border border-red-200"
              disabled={selectedFolders.length === 0}
            >
              Delete
            </button>
            <button
              onClick={handleRestore}
              className="bg-green-100 text-green-500 hover:bg-green-200 px-2 py-1 text-xs rounded-md border border-green-200"
              disabled={selectedFolders.length === 0}
            >
              Restore
            </button>
          </div>

          {/* Folders Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="flex flex-col items-center bg-white rounded-lg p-4 hover:bg-gray-50 transition duration-150 relative"
              >
                <input
                  type="checkbox"
                  checked={selectedFolders.includes(folder.id)}
                  onChange={() => handleFolderSelection(folder.id)}
                  className="absolute top-2 right-2"
                />
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FolderIcon className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="mt-2 text-center">
                  <h2 className="text-xs font-medium text-gray-800 truncate">
                    {folder.name}
                  </h2>
                  <p className="text-gray-500 text-xs mt-1 truncate">
                    {folder.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Bin;
