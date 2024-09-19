import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash } from "react-icons/fa"; // Use a more modern trash icon
import AddFolderButton from "./AddFolderButton";
import AddCollateralButton from "./AddCollateralButton";

const apiUrl = import.meta.env.VITE_API_URL;

const OriginalCollateral = () => {
  const navigate = useNavigate();
  const { brandId } = useParams();
  const [items, setItems] = useState([]);

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

  const handleFolderAdded = (newFolder) => {
    setItems((prevItems) => [...prevItems, newFolder]);
  };

  // Add a permanent Recycle Bin folder
  const recycleBinFolder = {
    _id: "recycle-bin",
    name: "Recycle Bin",
    // Add other necessary fields
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
            Original Collateral
          </h1>
          <div className="flex items-center space-x-4">
            <AddCollateralButton />
            <AddFolderButton
              parentFolderId={null}
              brandId={brandId}
              onFolderAdded={handleFolderAdded}
            />
          </div>
        </header>
        <div className="bg-white p-1 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col items-center justify-center rounded-lg  bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
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
            {/* Recycle Bin Folder */}
            <div
              key={recycleBinFolder._id}
              className="flex flex-col items-center justify-center rounded-lg  bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
            >
              <Link
                to={`/item/${brandId}/${recycleBinFolder._id}`}
                className="flex flex-col items-center justify-center"
              >
                <FaTrash className="h-12 w-12 mb-4 text-gray-600" />{" "}
                {/* Updated icon */}
                <h3 className="font-semibold">{recycleBinFolder.name}</h3>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OriginalCollateral;
