import axios from "axios";
import React, { useEffect, useState } from "react";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import { useNavigate } from "react-router-dom";

const BrandTable = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);

  setupAxiosInterceptors();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`/v1/brand/profile/get?limit=100`);
        setBrands(response.data.data); // Assuming response.data is an array of brands
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div>
      <div className="relative  ">
        <h1 className="text-sm mb-2">Brands</h1>
        <div className="grid grid-cols-4 p-2 gap-3 bg-white rounded">
          {brands.map((brand, index) => (
            <div className="flex flex-col justify-center items-center border rounded p-2">
              <img className="w-4 h-4" src={brand.brand_logo} alt="" />
              <p className="text-xs">{brand.brand_name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandTable;
