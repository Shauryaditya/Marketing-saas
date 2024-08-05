import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AddFolderButton from "./AddFolderButton";
import Folder from "./Folder";
import AddCollateralButton from "./AddCollateralButton";

const FolderView = () => {
  const { brandId, parentId } = useParams(); // Retrieve parentId from URL parameters
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  const fetchFolders = async (parentId) => {
    try {
      const response = await axios.get(
        `http://192.168.1.38:8000/v1/collateral/folder/get/${parentId}`,
        {
          params: { brand_id: brandId },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching folders:", error);
      return [];
    }
  };

  const fetchFiles = async (parentId) => {
    try {
      const response = await axios.get(
        `http://192.168.1.38:8000/v1/collateral/file/get?folder_id=${parentId}`,
        {
          params: { brand_id: brandId },
        }
      );
      return response.data.files;
    } catch (error) {
      console.error("Error fetching files:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadFoldersAndFiles = async () => {
      const fetchedFolders = await fetchFolders(parentId);
      const fetchedFiles = await fetchFiles(parentId);
      setFolders(fetchedFolders);
      setFiles(fetchedFiles);
    };
    loadFoldersAndFiles();
  }, [parentId, brandId]);

  useEffect(() => {
    if (folders.length > 0) {
      const folder = folders.find((folder) => folder._id === parentId);
      setCurrentFolder(
        folder || {
          name: "Default Folder",
          path: "",
          subfolders: [],
          files: [],
        }
      );
    }
  }, [folders, parentId]);

  const handleFolderAdded = (newFolder) => {
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
  };

  const handleCollateralAdded = (newCollateral) => {
    const updatedFiles = [...files, newCollateral];
    setFiles(updatedFiles);
  };

  const renderPath = (path) => {
    const pathParts = path.split("/");
    // Removing the first part if it's an ID
    if (/^[a-f0-9]{24}$/.test(pathParts[0])) {
      pathParts.shift();
    }
    return pathParts.join("/");
  };

  return (
    <main className="max-w-full flex">
      <div className="min-h-screen text-xs w-full p-2">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-xs text-left text-blue-400 font-semibold mb-6">
            {currentFolder
              ? ` ${renderPath(currentFolder.path)}`
              : "Loading Folder..."}
          </h1>
          <div className="flex items-center space-x-4">
            <AddCollateralButton onCollateralAdded={handleCollateralAdded} />
            <AddFolderButton
              parentFolderId={parentId}
              brandId={brandId}
              onFolderAdded={handleFolderAdded}
            />
          </div>
        </header>
        <div className="bg-white p-1 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8 gap-4">
            {folders.map((folder) => (
              <div
                key={folder._id}
                className="flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <Link
                  to={`/item/${brandId}/${folder._id}`}
                  className="flex flex-col items-center justify-center"
                >
                  <img
                    src="https://i.redd.it/cglk1r8sbyf71.png" // Placeholder image
                    alt={folder.name}
                    className="h-16 w-16 mb-4"
                  />
                  <h3 className="font-semibold">{folder.name}</h3>
                </Link>
              </div>
            ))}
            {files.map((file) => (
              <div
                key={file._id}
                className="flex flex-col items-center justify-center rounded-lg bg-white cursor-pointer"
              >
                <a href={file.path} target="_blank" rel="noopener noreferrer">
                  <img
                    src={file.path} // Assuming the file path is a URL to the image
                    alt={file.name}
                    className="h-16 w-16 mb-4"
                  />
                  {/* <h3 className="font-semibold">{file.name}</h3> */}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default FolderView;
