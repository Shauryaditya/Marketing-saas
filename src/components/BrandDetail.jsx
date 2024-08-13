import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BrandDetail() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const fetchBrandDetail = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(
          `${apiUrl}/v1/brand/profile/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setBrand(response.data.data);
      } catch (error) {
        console.error("Error fetching brand detail:", error);
      }
    };

    fetchBrandDetail();
  }, [id]);

  if (!brand) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen min-w-screen text-sm pl-8 pt-4">
      {/* <button onClick={() => navigate("/")} className="text-blue-500 mb-4">
        ← Back
      </button> */}
      <h1 className="text-2xl font-semibold mb-6">{brand.brand_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 border rounded-lg">
          <button
            onClick={() => navigate(`/brand/edit/${id}`)}
            className="text-black hover:text-blue-500 mb-2"
          >
            Profile
          </button>
        </div>
        <div
          className="bg-white p-4 border rounded-lg cursor-pointer"
          onClick={() => navigate(`/add-strategy/${id}`)}
        >
          <h2 className="text-xs font-medium mb-2">Strategy</h2>
          {/* Display Strategy Data */}
        </div>
        <div
          className="bg-white p-4 border rounded-lg cursor-pointer"
          onClick={() => navigate(`/originalcollateral/${id}`)}
        >
          <h2 className="text-xs font-medium mb-2">Marketing Collateral</h2>
          {/* Display Marketing Collateral Data */}
        </div>
        <div
          className="bg-white p-4 border rounded-lg"
          onClick={() => navigate(`/calendar/${id}`)}
        >
          {" "}
          <h2 className="text-xs font-medium mb-2">Calendar</h2>{" "}
          {/* Display Calendar Data */}
        </div>
      </div>
    </div>
  );
}

export default BrandDetail;
