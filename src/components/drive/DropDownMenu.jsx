import React, { forwardRef } from "react";
import { FaDownload, FaEdit, FaFileArchive, FaTrash } from "react-icons/fa";

const DropdownMenu = forwardRef(
  ({ onDownload, onRename, onZip, onDelete, visible, type }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg ${
          visible ? "block" : "hidden"
        } z-10`}
      >
        {type === "file" && (
          <button
            onClick={onDownload}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
          >
            <FaDownload className="mr-2" /> Download
          </button>
        )}
        {type === "folder" && (
          <button
            onClick={onZip}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
          >
            <FaFileArchive className="mr-2" /> Download
          </button>
        )}
        <button
          onClick={onRename}
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
        >
          <FaEdit className="mr-2" /> Rename
        </button>
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
        >
          <FaTrash className="mr-2" /> Delete
        </button>
      </div>
    );
  }
);

export default DropdownMenu;
