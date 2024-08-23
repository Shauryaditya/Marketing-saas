import axios from "axios";
import React, { useEffect, useState } from "react";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import { useNavigate } from "react-router-dom";

const BrandTable = () => {
    const navigate = useNavigate()
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
      <div className="relative px-4 mt-4">
        <table className="w-96 text-left text-xs">
          <thead className="bg-gray-200 text-xs font-normal ">
            <tr>
              <th scope="col" className="px-2 py-3 whitespace-nowrap text-center rounded-tl-xl">
                Sl No
              </th>
              <th scope="col" className="px-2 py-3 text-center whitespace-nowrap">
                Brand Name
              </th>
              <th scope="col" className="px-2 py-3 text-center whitespace-nowrap rounded-tr-xl">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, index) => (
              <tr key={brand._id} className="border-b">
                <td className="px-2 py-3 whitespace-nowrap bg-white text-center">{index + 1}</td>
                <td className="px-2 py-3 whitespace-nowrap bg-white text-center">
                  <div className="flex gap-x-3 justify-center">
                    <img className="w-4 h-4" src={brand.brand_logo} alt="" />
                    <p className="text-xs">{brand.brand_name}</p>
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap bg-white text-center">
                  <button 
                  className="text-blue-500 hover:underline"
                  onClick={() => navigate(`/brand/${brand._id}`)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
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
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandTable;
