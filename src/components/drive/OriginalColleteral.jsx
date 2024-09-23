import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaFileAlt, FaFilePdf } from "react-icons/fa"; // Ensure these are imported
import AddFolderButton from "./AddFolderButton";
import AddCollateralButton from "./AddCollateralButton";

const apiUrl = import.meta.env.VITE_API_URL;

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

const OriginalCollateral = () => {
  const navigate = useNavigate();
  const { brandId } = useParams();
  const [items, setItems] = useState([]);
  const [recycleBinItems, setRecycleBinItems] = useState([]);
  const [recycleBinFiles, setRecycleBinFiles] = useState([]);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(
          `${apiUrl}/v1/collateral/folder/get?brand_id=${brandId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [brandId]);

  const fetchRecycleBinItems = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const foldersResponse = await axios.get(
        `${apiUrl}/v1/collateral/bin/folders/${brandId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRecycleBinItems(foldersResponse.data);

      const filesResponse = await axios.get(
        `${apiUrl}/v1/collateral/bin/file/${brandId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRecycleBinFiles(filesResponse.data);
    } catch (error) {
      console.error("Error fetching recycle bin items or files:", error);
    }
  };

  const handleFolderAdded = (newFolder) => {
    setItems((prevItems) => [...prevItems, newFolder]);
  };

  const handleOpenRecycleBin = () => {
    setIsRecycleBinOpen(true);
    fetchRecycleBinItems();
  };

  const handleCloseRecycleBin = () => {
    setIsRecycleBinOpen(false);
  };

  return (
    <main className="max-w-full flex">
      <div className="min-h-screen text-xs w-full p-2">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 text-xs mb-4"
        >
          ← Back
        </button>
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-xl text-left text-blue-400 font-semibold mb-6">
            {isRecycleBinOpen ? "Recycle Bin" : "Original Collateral"}
          </h1>
          <div className="flex items-center space-x-4">
            {!isRecycleBinOpen && (
              <>
                <AddCollateralButton />
                <AddFolderButton
                  parentFolderId={null}
                  brandId={brandId}
                  onFolderAdded={handleFolderAdded}
                />
              </>
            )}
          </div>
        </header>
        <div className="bg-white p-1 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8 gap-4">
            {!isRecycleBinOpen &&
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
                >
                  <Link
                    to={`/item/${brandId}/${item._id}`}
                    className="flex flex-col items-center justify-center"
                  >
                    <img
                      src="https://i.redd.it/cglk1r8sbyf71.png"
                      alt={item.name}
                      className="h-16 w-16 mb-4"
                    />
                    <h3 className="font-semibold">{item.name}</h3>
                  </Link>
                </div>
              ))}

            {!isRecycleBinOpen && (
              <div
                onClick={handleOpenRecycleBin}
                className="flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <FaTrash className="h-12 w-12 mb-4 text-gray-600" />
                <h3 className="font-semibold">Recycle Bin</h3>
              </div>
            )}

            {isRecycleBinOpen && (
              <>
                {recycleBinItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  >
                    <Link
                      to={`/item/${brandId}/${item._id}`}
                      className="flex flex-col items-center justify-center"
                    >
                      <img
                        src="https://i.redd.it/cglk1r8sbyf71.png"
                        alt={item.name}
                        className="h-16 w-16 mb-4"
                      />
                      <h3 className="font-semibold">{item.name}</h3>
                    </Link>
                  </div>
                ))}

                {recycleBinFiles.map((file) => (
                  <div
                    key={file._id}
                    className="flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer relative group"
                  >
                    <a
                      href={file.path} // Ensure this is the correct path to the file
                      target="_blank" // This ensures the file opens in a new tab
                      rel="noopener noreferrer" // This is for security reasons to prevent the new tab from accessing the window object
                      className="flex flex-col items-center justify-center"
                    >
                      {renderFilePreview(file)}
                    </a>
                    <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-1 rounded">
                      {file.name}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default OriginalCollateral;
