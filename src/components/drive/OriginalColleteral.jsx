import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import AddFolderButton from "./AddFolderButton";
import AddCollateralButton from "./AddCollateralButton";

const apiUrl = import.meta.env.VITE_API_URL;

const OriginalCollateral = () => {
  const navigate = useNavigate();
  const { brandId } = useParams();
  const [items, setItems] = useState([]); // Main items (folders)
  const [recycleBinItems, setRecycleBinItems] = useState([]); // Recycle Bin folders
  const [recycleBinFiles, setRecycleBinFiles] = useState([]); // Recycle Bin files
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

      // Fetch recycle bin folders
      const foldersResponse = await axios.get(
        `${apiUrl}/v1/collateral/bin/folders/${brandId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRecycleBinItems(foldersResponse.data);

      // Fetch recycle bin files
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
            {/* Regular Folders */}
            {!isRecycleBinOpen &&
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
                >
                  <Link
                    to={`/item/${brandId}/${item._id}`} // This will allow navigation to the folder
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

            {/* Recycle Bin Folder */}
            {!isRecycleBinOpen && (
              <div
                onClick={handleOpenRecycleBin}
                className="flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <FaTrash className="h-12 w-12 mb-4 text-gray-600" />
                <h3 className="font-semibold">Recycle Bin</h3>
              </div>
            )}

            {/* Render Recycle Bin items if opened */}
            {isRecycleBinOpen && (
              <>
                {/* Render Recycle Bin Folders */}
                {recycleBinItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  >
                    <Link
                      to={`/item/${brandId}/${item._id}`} // You can navigate to recycle bin items as well
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

                {/* Render Recycle Bin Files */}
                {recycleBinFiles.map((file) => (
                  <div
                    key={file._id}
                    className="flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  >
                    <Link
                      to={`/file/${brandId}/${file._id}`} // You can navigate to the file
                      className="flex flex-col items-center justify-center"
                    >
                      <img
                        src="https://i.redd.it/cglk1r8sbyf71.png" // Replace with appropriate file icon or preview
                        alt={file.name}
                        className="h-16 w-16 mb-4"
                      />
                      <h3 className="font-semibold">{file.name}</h3>
                    </Link>
                  </div>
                ))}

                {/* Back Button to close Recycle Bin */}
                <div
                  onClick={handleCloseRecycleBin}
                  className="flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
                >
                  <h3 className="font-semibold">← Back to Folders</h3>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default OriginalCollateral;
