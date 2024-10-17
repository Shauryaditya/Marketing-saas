import React, { forwardRef } from "react";
import { FaDownload, FaEdit, FaFileArchive, FaTrash } from "react-icons/fa";

const DropdownMenu = forwardRef(
  ({ onDownload, onRename, onZip, onDelete, visible, type, fileId, folderId }, ref) => {
    console.log('type fileId folderId', type, fileId, folderId);
    return (
      <div
        ref={ref}
        className={`w-full bg-white  
          }`}
      >
        {type === "file" && (
          <button
            onClick={() => onDownload()}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
          >
            <FaDownload className="mr-2" /> Download
          </button>
        )}
        {type === "folder" && (
          <button
            onClick={() => onZip()}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
          >
            <FaFileArchive className="mr-2" /> Download
          </button>
        )}
        <button
          onClick={() => onRename()}
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
        >
          <FaEdit className="mr-2" /> Rename
        </button>
        <button
          onClick={(e) => onDelete(e, type, folderId, fileId)}
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
        >
          <FaTrash className="mr-2" /> Delete
        </button>
      </div>
    );
  }
);

export default DropdownMenu;
