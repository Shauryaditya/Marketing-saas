import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const AddStrategy = () => {
  const { brandid } = useParams();

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

  const handleEditClick = (type) => {
    navigate(`/strategy/edit/${brandid}/${type._id}`);
  };

  return (
    <div className="w-72 h-72 bg-white text-xs rounded-xl overflow-hidden border border-gray-300 relative overflow-y-scroll no-scrollbar">
      <div className="relative h-full">
        <div className="absolute top-0 w-full h-15 bg-white rounded-t-xl border-b border-gray-300"></div>
        <div className="absolute top-4 left-4 font-semibold text-sm text-gray-800">
          Strategy
        </div>
        <button
          className="absolute top-3 right-4 px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs"
          onClick={() => navigate(`/strategy/${brandid}`)}
        >

          + Add Strategy
        </button>
        <div className="flex flex-col gap-1 absolute top-16 left-0 w-full px-4 ">
          {contentTypes.length > 0 ? (
            contentTypes.map((type) => (
              <div
                key={type._id}
                className="flex items-center justify-between gap-2 px-3 py-1 border-b border-gray-300"
              >
                <div className="text-dark-gray text-sm">
                  {`${new Date(type?.month).toLocaleString("default", {
                    month: "long",
                  })} ${new Date(type?.month).getFullYear()}`}
                </div>
                <div className="flex justify-center gap-x-2">
                  <svg
                    onClick={() => handleEditClick(type)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  <svg
                    onClick={() => handleEditClick(type)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4 cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No Strategy available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStrategy;
