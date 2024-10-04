import React, { useState } from "react";

const TaskModal = ({ showModal,onClose }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10">
      <div className=" bg-white rounded-lg p-4 ">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-sm font-semibold">Task: NOVIUM-202407290730</h2>
          <button onClick={onClose} className="text-xl">
            &times;
          </button>
        </div>

        {/* Details */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              <p className="text-xs uppercase text-gray-200 font-semibold">Date & Time</p>
              <p className="text-xs">24/08/2024, 15:35</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-200 font-semibold">Work</p>
              <p className="text-xs">Novium Pen</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-200 font-semibold">Kind</p>
              <p className="text-xs">Photo</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-200 font-semibold">Type</p>
              <p className="text-xs">24/08/2024, 15:35</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="text-gray-700 font-medium text-sm uppercase">Description</h3>
          <p className="text-gray-500 text-xs">
            With the built-in dialog component template in Uizard, you can create rich, realistic designs that you can quickly show to your team to get feedback and iterate.
          </p>
        </div>

        {/* Social Media Buttons */}
        <div className="mb-4">
          <h3 className="text-gray-700 font-medium uppercase text-sm">Write Captions</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <button className="bg-gray-100 text-blue-600 py-1 px-3 rounded text-xs">All</button>
            <button className="bg-blue-600 text-white py-1 px-3 rounded text-xs">Facebook</button>
            <button className="bg-pink-500 text-white py-1 px-3 rounded text-xs">Instagram</button>
            <button className="bg-blue-500 text-white py-1 px-3 rounded text-xs">LinkedIn</button>
            <button className="bg-cyan-400 text-white py-1 px-3 rounded text-xs">Twitter</button>
            <button className="bg-red-600 text-white py-1 px-3 rounded text-xs">Pinterest</button>
            <button className="bg-green-500 text-white py-1 px-3 rounded text-xs">WhatsApp</button>
          </div>
        </div>

        {/* Caption Textarea */}
        <textarea
          className="w-full p-3 border rounded mb-4 placeholder:text-xs"
          rows="3"
          placeholder="Type here..."
        ></textarea>

        {/* Upload Button */}
        <div className="flex justify-center items-center">
        <button className=" bg-blue-600 text-white py-2 px-4 rounded text-xs">
          Upload
        </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal