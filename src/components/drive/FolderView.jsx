import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileAlt, FaFilePdf, FaImage } from "react-icons/fa"; // Import icons from react-icons
import AddFolderButton from "./AddFolderButton";
import AddCollateralButton from "./AddCollateralButton";
import { BreadcrumbDemo } from "../BreadCrumbDemo";
const apiUrl = import.meta.env.VITE_API_URL;

const FolderView = () => {
  const navigate = useNavigate()
  const { brandId, parentId } = useParams();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState([]);

  const fetchFolders = async (parentId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/v1/collateral/folder/get/${parentId}`,
        {
          params: { brand_id: brandId },
        }
      );
      setPath(response.data); // Set the path from the response
      return response.data;
    } catch (error) {
      console.error("Error fetching folders:", error);
      return [];
    }
  };

  const fetchFiles = async (parentId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/v1/collateral/file/get?folder_id=${parentId}`,
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
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  };

  const handleCollateralAdded = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const renderPath = (path) => {
    const pathParts = path.split("/");
    if (/^[a-f0-9]{24}$/.test(pathParts[0])) {
      pathParts.shift();
    }
    return pathParts.join("/");
  };

  const renderFilePreview = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return (
        <img
          src={file.path}
          alt={file.name}
          className="h-16 w-16 mb-4 object-cover"
        />
      );
    } else if (extension === "pdf") {
      return <FaFilePdf className="h-16 w-16 mb-4 text-red-600" />;
    } else {
      return <FaFileAlt className="h-16 w-16 mb-4 text-gray-500" />;
    }
  };

  return (
    <main className="max-w-full flex">
      <div className="min-h-screen text-xs w-full p-2">
        <header className="flex justify-between items-center mb-8">

          {/* <h1 className="text-xs text-left text-blue-400 font-semibold mb-6">
            {currentFolder
              ? ` ${renderPath(currentFolder.path)}`
              : "Loading Folder..."}
          </h1> */}
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 text-xs mb-4"
          >
            ← Back
          </button>


          <BreadcrumbDemo currentFolder={path} />
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
                    src="https://i.redd.it/cglk1r8sbyf71.png"
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
                  {renderFilePreview(file)}
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
