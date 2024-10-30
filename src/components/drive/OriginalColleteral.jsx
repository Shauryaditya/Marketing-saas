import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaFileAlt, FaFilePdf } from "react-icons/fa";
import AddFolderButton from "./AddFolderButton";
import { FaEllipsisV } from "react-icons/fa";
import DropdownMenu from "./DropDownMenu";
import JSZip from "jszip";
import "react-medium-image-zoom/dist/styles.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
const apiUrl = "https://api.21genx.com:5000/v1/collateral"; // Replace this with your API base URL

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
  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [folders, setFolders] = useState([]);
  const [recycleBinItems, setRecycleBinItems] = useState([]);
  const [recycleBinFiles, setRecycleBinFiles] = useState([]);
  const [selectedItems, setSelectedItems] = useState({
    files: [],
    folders: [],
  });
  const [selectedItem, setSelectedItem] = useState([]);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRename = async () => {
    try {
      const newName = prompt("Enter the new name:");

      if (selectedItems.folders.length > 0) {
        const folderId = selectedItems.folders[0];
        await axios.patch(`${apiUrl}/v1/collateral/folder/${folderId}`, {
          name: newName,
        });
        setFolders((prev) =>
          prev.map((folder) =>
            folder._id === folderId ? { ...folder, name: newName } : folder
          )
        );
      } else if (selectedItems.files.length > 0) {
        const fileId = selectedItems.files[0];
        await axios.patch(`${apiUrl}/v1/collateral/file/${fileId}`, {
          name: newName,
        });
        setFiles((prev) =>
          prev.map((file) =>
            file._id === fileId ? { ...file, name: newName } : file
          )
        );
      }

      setSelectedItems({ files: [], folders: [] });
    } catch (error) {
      console.error("Error renaming items:", error);
    }
  };

  const handleZip = async () => {
    const zip = new JSZip();

    for (const folderId of selectedItems.folders) {
      const { files, folders } = await fetchFolderContents(folderId);
      for (const file of files) {
        try {
          const response = await fetch(file.path);
          if (response.ok) {
            const blob = await response.blob();
            zip.file(file.name, blob);
          }
        } catch (error) {
          console.error("Error fetching file:", error);
        }
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "selected_folders.zip");
    });

    setSelectedItems({ files: [], folders: [] });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(
          `${apiUrl}/folder/get?brand_id=${brandId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setItems(response.data);
        console.log("data", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [brandId]);

  // Single click to select, double-click to enter folder
  const handleFolderDoubleClick = (folderId) => {
    // Navigate on double-click
    navigate(`/item/${brandId}/${folderId}`);
  };

  // Updated toggleSelectItem function for selecting folders
  const toggleSelectItem = (item) => {
    setSelectedItems((prev) => ({
      ...prev,
      folders: prev.folders.includes(item._id)
        ? prev.folders.filter((id) => id !== item._id)
        : [...prev.folders, item._id],
    }));
  };

  const handleEllipsisClick = (e) => {
    e.stopPropagation(); // Prevent the event from bubbling up and triggering folder navigation
  };

  const fetchRecycleBinItems = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const foldersResponse = await axios.get(
        `${apiUrl}/bin/folders/${brandId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRecycleBinItems(foldersResponse.data);

      const filesResponse = await axios.get(`${apiUrl}/bin/file/${brandId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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

  // Select or deselect folder or file
  const handleSelection = (id) => {
    setSelectedItem((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null); // Close the menu when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRestore = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("access_token");

      // Prepare data for restoration
      const fileRestoreData = recycleBinFiles
        .filter((file) => selectedItem.includes(file._id))
        .map((file) => ({
          fileId: file._id,
          status: true, // Restore the file by setting status to true
          file_delete: false, // Indicate the file should not be deleted
        }));

      const folderIds = recycleBinItems
        .filter((item) => selectedItem.includes(item._id))
        .map((item) => item._id);

      // Restore files if any
      if (fileRestoreData.length > 0) {
        await axios.post(
          `${apiUrl}/bin/file`, // Endpoint for restoring files
          {
            files: fileRestoreData,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Remove restored files from the recycle bin list
        setRecycleBinFiles((prevFiles) =>
          prevFiles.filter((file) => !selectedItem.includes(file._id))
        );
      }

      // Restore folders if any
      if (folderIds.length > 0) {
        await axios.post(
          `${apiUrl}/update/status`, // Endpoint for restoring folders
          {
            folderIds: folderIds,
            status: true, // Restore the folder by setting status to true
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Remove restored folders from the recycle bin list
        setRecycleBinItems((prevItems) =>
          prevItems.filter((item) => !selectedItem.includes(item._id))
        );
      }

      // Clear selection after restore
      setSelectedItem([]);
    } catch (error) {
      setError("Failed to restore items.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDel = async (e, type, folderId, fileId) => {
    e.stopPropagation();
    try {
      const folderIdsToDelete = selectedItems.folders;
  
      const response = await axios.post(`${apiUrl}/update/status`, {
        folderIds: folderIdsToDelete,
        status: false,
      });
  
      // Show success message
      toast.success(response.data.message || "Folders moved to Recycle Bin.");
  
      // Update `items` by filtering out deleted folders
      setItems((prevItems) =>
        prevItems.filter((item) => !folderIdsToDelete.includes(item._id))
      );
  
      // Clear selected items
      setSelectedItem({ files: [], folders: [] });
  
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("Failed to delete items.");
    }
  };
  
  

  // Handle Delete API Call
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("access_token");

      // Prepare separate arrays for folders and files
      const folderIds = recycleBinItems
        .filter((item) => selectedItem.includes(item._id))
        .map((item) => item._id);

      const fileIds = recycleBinFiles
        .filter((file) => selectedItem.includes(file._id))
        .map((file) => file._id);

      // If there are folders to delete
      if (folderIds.length > 0) {
        const folderDeleteApiUrl =
          "https://api.21genx.com:5000/v1/collateral/delete/folder";
        await axios.post(
          folderDeleteApiUrl,
          {
            folderIds: folderIds,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Update UI after folder delete
        setRecycleBinItems((prevItems) =>
          prevItems.filter((item) => !selectedItem.includes(item._id))
        );
      }

      // If there are files to delete
      if (fileIds.length > 0) {
        const fileDeleteApiUrl =
          "https://api.21genx.com:5000/v1/collateral/files/delete";
        await axios.post(
          fileDeleteApiUrl,
          {
            fileIds: fileIds,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Update UI after file delete
        setRecycleBinFiles((prevFiles) =>
          prevFiles.filter((file) => !selectedItem.includes(file._id))
        );
      }

      setSelectedItem([]); // Clear selection after delete
    } catch (error) {
      setError("Failed to delete items.");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-xl text-left font-semibold mb-6">
            {isRecycleBinOpen ? "Recycle Bin" : ``}
          </h1>
          <div className="flex items-center space-x-4">
            {!isRecycleBinOpen && (
              <>
                <AddFolderButton
                  parentFolderId={null}
                  brandId={brandId}
                  onFolderAdded={handleFolderAdded}
                />
              </>
            )}
            {isRecycleBinOpen && (
              <>
                <button
                  onClick={handleRestore}
                  className="bg-green-100 text-green-500 hover:bg-green-200 px-2 py-1 text-xs rounded-md border border-green-200"
                  disabled={selectedItem.length === 0 || loading}
                >
                  Restore
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-100 text-red-500 hover:bg-red-200 px-2 py-1 text-xs rounded-md border border-red-200"
                  disabled={selectedItem.length === 0 || loading}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </header>

        {error && <p className="text-center text-red-500">{error}</p>}
        {loading && <p className="text-center text-gray-500">Processing...</p>}

        <div className="bg-white p-1 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8 gap-4">
            {!isRecycleBinOpen &&
              items.map((item) => (
                <div
                  key={item._id}
                  className={`relative flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 
                  ${
                    selectedItems.folders.includes(item._id)
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => toggleSelectItem(item)} // Select folder on single click
                  onDoubleClick={() => handleFolderDoubleClick(item._id)} // Navigate on double click
                >
                  <img
                    src="https://i.redd.it/cglk1r8sbyf71.png"
                    alt={item.name}
                    className="h-16 w-16 mb-4"
                  />
                  <h3 className="font-semibold">{item.name}</h3>

                  {/* Ellipsis and DropdownMenu */}
                  <Popover>
                    <PopoverTrigger onClick={handleEllipsisClick}>
                      <FaEllipsisV className="absolute top-2 right-2 text-gray-500 cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-36 text-xs" side="right">
                      <DropdownMenu
                        ref={menuRef}
                        onRename={handleRename}
                        onZip={handleZip}
                        onDelete={handleDel}
                        folderId={item._id}
                        type="folder" // Pass folder type
                      />
                    </PopoverContent>
                  </Popover>
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
                    className="relative flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItem.includes(item._id)}
                      onChange={() => handleSelection(item._id)}
                      className="absolute top-2 right-2"
                    />
                    <Link
                      // to={`/item/${brandId}/${item._id}`}
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
                    className="relative flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItem.includes(file._id)}
                      onChange={() => handleSelection(file._id)}
                      className="absolute top-2 right-2"
                    />
                    <a
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center"
                    >
                      {renderFilePreview(file)}
                    </a>
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
