import React, { useEffect, useState } from "react";
import axios from "axios";
import { FolderIcon } from "@heroicons/react/24/outline"; // Ensure to install @heroicons/react

const Bin = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="p-4">
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="flex flex-col items-center bg-white rounded-lg p-4 hover:bg-gray-50 transition duration-150"
            >
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
      )}
    </div>
  );
};

export default Bin;
