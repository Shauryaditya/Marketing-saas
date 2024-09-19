import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa";
import DropdownMenu from "./DropDownMenu";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FaFileAlt, FaFilePdf } from "react-icons/fa";
import AddFolderButton from "./AddFolderButton";
import AddCollateralButton from "./AddCollateralButton";

const apiUrl = import.meta.env.VITE_API_URL;

const FolderView = () => {
  const [showMenu, setShowMenu] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const menuRef = useRef(null); // Create a ref for the DropdownMenu
  const navigate = useNavigate();
  const { brandId, parentId } = useParams();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedItems, setSelectedItems] = useState({
    files: [],
    folders: [],
  });

  const handleMenuClick = (item) => {
    setSelectedItem(item);
    setShowMenu(item._id); // Show menu for the clicked item
  };

  const fetchFolders = async (parentId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/v1/collateral/folder/get/${parentId}?page=1&limit=50`,
        { params: { brand_id: brandId } }
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
        `${apiUrl}/v1/collateral/file/get?folder_id=${parentId}`,
        { params: { brand_id: brandId } }
      );
      return response.data.files;
    } catch (error) {
      console.error("Error fetching files:", error);
      return [];
    }
  };

  const fetchFolderContents = async (folderId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/v1/collateral/folder/get/${folderId}?page=1&limit=50`,
        { params: { brand_id: brandId } }
      );
      const folderFolders = response.data.folders || [];
      const folderFiles = await fetchFiles(folderId);

      let allFiles = folderFiles;
      for (const subFolder of folderFolders) {
        const { files: subFolderFiles } = await fetchFolderContents(
          subFolder._id
        );
        allFiles = [...allFiles, ...subFolderFiles];
      }

      return { folders: folderFolders, files: allFiles };
    } catch (error) {
      console.error("Error fetching folder contents:", error);
      return { folders: [], files: [] };
    }
  };

  const toggleSelectItem = (item, type) => {
    if (type === "folder") {
      setSelectedItems((prev) => ({
        ...prev,
        folders: prev.folders.includes(item._id)
          ? prev.folders.filter((id) => id !== item._id)
          : [...prev.folders, item._id], // Allow multiple selections
      }));
    } else if (type === "file") {
      setSelectedItems((prev) => ({
        ...prev,
        files: prev.files.includes(item._id)
          ? prev.files.filter((id) => id !== item._id)
          : [...prev.files, item._id], // Allow multiple selections
      }));
    }
  };

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

  const handleDelete = async () => {
    try {
      const folderIdsToDelete = selectedItems.folders;
      const fileIdsToDelete = selectedItems.files;

      if (folderIdsToDelete.length > 0) {
        await axios.post(
          `${apiUrl}/v1/collateral/update/status`,
          {
            folderIds: folderIdsToDelete,
            status: false,
          },
          {
            params: { brand_id: brandId },
          }
        );
      }

      if (fileIdsToDelete.length > 0) {
        await Promise.all(
          fileIdsToDelete.map((fileId) =>
            axios.post(
              `${apiUrl}/v1/collateral/bin/file/${fileId}`,
              {
                status: false,
                file_delete: true,
              },
              {
                params: { brand_id: brandId },
              }
            )
          )
        );
      }

      // Update the UI by removing the deleted items
      setFolders((prev) =>
        prev.filter((folder) => !folderIdsToDelete.includes(folder._id))
      );
      setFiles((prev) =>
        prev.filter((file) => !fileIdsToDelete.includes(file._id))
      );

      // Clear the selected items
      // setSelectedItems({ files: [], folders: [] });
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  const handleDownload = async () => {
    for (const fileId of selectedItems.files) {
      const file = files.find((f) => f._id === fileId);
      if (file) {
        try {
          console.log(`Fetching file: ${file.path}`);
          const response = await fetch(file.path, {});
          // Check if the response is successful
          if (response.ok) {
            const blob = await response.blob();
            // Create a link element
            const link = document.createElement("a");
            // Create an object URL for the blob and set it as the href attribute
            const url = URL.createObjectURL(blob);
            link.href = url;
            // Set the download attribute to trigger download
            link.download = file.path.split("/").pop(); // Use the filename from the path
            // Append the link to the body (not visible to the user)
            document.body.appendChild(link);
            // Programmatically click the link to trigger the download
            link.click();
            // Clean up by removing the link and revoking the object URL
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log("File downloaded successfully");
          }
        } catch (error) {
          console.error("Error downloading file:", error);
        }
      }
    }
  };

  const handleZip = async () => {
    const zip = new JSZip();

    for (const folderId of selectedItems.folders) {
      const { files, folders } = await fetchFolderContents(folderId);
      for (const file of files) {
        try {
          const response = await fetch(file.path, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
          if (response.ok) {
            const blob = await response.blob();
            zip.file(file.name, blob);
          } else {
            console.error("Failed to fetch file:", response.statusText);
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
    const loadFoldersAndFiles = async () => {
      const fetchedFolders = await fetchFolders(parentId);
      const fetchedFiles = await fetchFiles(parentId);
      setFolders(fetchedFolders);
      setFiles(fetchedFiles);
    };
    loadFoldersAndFiles();
  }, [parentId, brandId]);

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

  // Function to handle adding a new folder
  const handleFolderAdded = (newFolder) => {
    setFolders((prevFolders) => [...prevFolders, newFolder]);
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
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 text-xs mb-4"
          >
            ← Back
          </button>

          <div className="flex items-center space-x-4">
            <AddCollateralButton onCollateralAdded={() => {}} />
            <AddFolderButton
              parentFolderId={parentId}
              brandId={brandId}
              onFolderAdded={handleFolderAdded} // Pass the callback
            />
          </div>
        </header>

        <div className="bg-white p-1 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8 gap-4">
            {folders.map((folder) => (
              <div
                key={folder._id}
                className="relative flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300"
              >
                <Link
                  to={`/item/${brandId}/${folder._id}`}
                  className="flex flex-col items-center justify-center relative rounded-lg bg-white hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src="https://i.redd.it/cglk1r8sbyf71.png"
                    alt={folder.name}
                    className="h-16 w-16 mb-4"
                  />
                  <h3 className="font-semibold">{folder.name}</h3>
                </Link>
                <FaEllipsisV
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from bubbling up
                    toggleSelectItem(folder, "folder");
                    handleMenuClick(folder); // Show the menu for the folder
                  }}
                  className="absolute top-2 right-2 text-gray-500 cursor-pointer"
                />
                <DropdownMenu
                  ref={menuRef}
                  // onDownload={handleDownload}
                  onRename={handleRename}
                  onZip={handleZip}
                  onDelete={handleDelete}
                  visible={showMenu === folder._id}
                  type="folder" // Pass folder type
                />
              </div>
            ))}

            {files.map((file) => (
              <div
                key={file._id}
                className="relative flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow duration-300"
              >
                <FaEllipsisV
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from bubbling up
                    toggleSelectItem(file, "file");
                    handleMenuClick(file); // Show the menu for the file
                  }}
                  className="absolute top-2 right-2 text-gray-500 cursor-pointer"
                />
                <DropdownMenu
                  ref={menuRef}
                  onDownload={handleDownload}
                  onRename={handleRename}
                  // onZip={handleZip}
                  onDelete={handleDelete}
                  visible={showMenu === file._id}
                  type="file" // Pass file type
                />
                {renderFilePreview(file)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default FolderView;
