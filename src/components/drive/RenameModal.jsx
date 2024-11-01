import React, { useState } from "react";

const RenameModal = ({ isOpen, onClose, onRename, currentName }) => {
  const [newName, setNewName] = useState(currentName);

  const handleRenameClick = () => {
    onRename(newName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-1/3">
        <h2 className="text-lg font-semibold mb-4">Rename Item</h2>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border rounded-md p-2 w-full mb-4"
          placeholder="Enter new name"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 px-4 py-2 mr-2">
            Cancel
          </button>
          <button
            onClick={handleRenameClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameModal;
