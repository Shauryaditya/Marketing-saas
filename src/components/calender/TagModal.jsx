import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const TagModal = ({ show, onClose, month, year, brandId, onSelectTags }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (show) {
      const fetchTags = async () => {
        try {
          const response = await axios.get(`/v1/task/tags/get`, {
            params: { month, year, brand_id: brandId },
          });

          const tagsString = response.data.data || "";
          const tagsArray = tagsString.split("#").filter((tag) => tag);

          setTags(tagsArray);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching tags:", error);
          setLoading(false);
        }
      };

      fetchTags();
    }
  }, [show, month, year, brandId]);

  const handleUseTags = () => {
    onSelectTags(tags.map((tag) => `#${tag}`).join(" "));
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 text-xs flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-gray-800 opacity-75"
        onClick={onClose}
      />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 relative z-10">
        <h3 className="text-xl font-semibold mb-4">Select Tags</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-lg">#TAG</h4>
              <button
                onClick={handleUseTags}
                className="px-4 py-1 bg-gray-700 text-white rounded-full"
              >
                Use
              </button>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {tags.map((tag) => `#${tag} `)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

TagModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  brandId: PropTypes.string.isRequired,
  onSelectTags: PropTypes.func.isRequired,
};

export default TagModal;
