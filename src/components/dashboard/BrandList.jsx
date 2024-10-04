import axios from "axios";
import React, { useEffect, useState } from "react";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import { useNavigate } from "react-router-dom";

const BrandTable = ({brands}) => {
  const navigate = useNavigate();

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
