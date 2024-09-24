import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaUpload } from "react-icons/fa";

// Additional Modal for detailed Social Media Upload (from image)
const DetailedUploadModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-gray-800 opacity-75"
        onClick={onClose}
      />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-4 relative z-10 overflow-auto max-h-[90vh]">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Novium Pen - Social Media Upload
        </h2>

        <div className="mb-4">
          <p className="text-gray-600">
            With the built-in dialog component template in Uizard, you can
            create rich, realistic designs that you can quickly show to your
            team to get feedback and iterate.
          </p>
        </div>

        {/* Platform Selection */}
        <div className="flex space-x-3 mb-4">
          {["Facebook", "Instagram", "Twitter", "Pinterest", "WhatsApp"].map(
            (platform) => (
              <button
                key={platform}
                className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md shadow"
              >
                {platform}
              </button>
            )
          )}
        </div>

        {/* Image Upload Slots */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            "Instagram/Facebook",
            "LinkedIn",
            "Pinterest/Twitter",
            "Instagram Story",
            "WhatsApp Story",
            "YouTube",
          ].map((label) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center border border-gray-300 rounded-md h-36"
            >
              <div className="text-gray-400">1600x900</div>
              <div className="text-gray-600 mt-2">{label}</div>
              <button className="mt-3 text-blue-500 hover:underline">
                Upload
              </button>
            </div>
          ))}
        </div>

        {/* Hashtag Input */}
        <div className="mb-4">
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-md"
            placeholder="Write #tags"
          />
        </div>

        {/* Preview and Upload Buttons */}
        <div className="flex justify-end space-x-3">
          <button className="bg-gray-500 text-white py-2 px-4 rounded-md shadow hover:bg-gray-600">
            Preview
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 flex items-center">
            <FaUpload className="mr-2" />
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

DetailedUploadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DetailedUploadModal;
