import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const AddHashTags = () => {
  const { brandid } = useParams();
  console.log("Brand Id >>???",brandid)
  const [contentTypes, setContentTypes] = useState([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  const fetchContentTypes = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${apiUrl}/v1/strategy/brand/${brandid}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setContentTypes(response.data.data);
     
    } catch (error) {
      console.error("Error fetching content types:", error);
    }
  };

  useEffect(() => {
    fetchContentTypes();
  }, [accessToken]);

  const handleEditClick = () => {
    navigate(`/keyword-tags/${brandid}`);
  };

  return (
    <div className="w-72 h-20 bg-white text-xs rounded-xl overflow-hidden border border-gray-300 relative cursor-pointer"
    onClick={handleEditClick}
    >
      <div className="relative h-full">
        <div className="absolute top-0 w-full h-15 bg-white rounded-t-xl border-b border-gray-300"></div>
        <div className="absolute top-4 left-4 font-semibold text-sm text-gray-800">
          Keyword and Tags
        </div> 
      </div>
    </div>
  );
};

export default AddHashTags;
