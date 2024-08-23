// BrandPage.jsx
import React, { useState, useEffect } from "react";
import BrandModal from "./AddBrandModal";
import Card from "./BrandCard";

function BrandPage() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchBrands = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.get(`${apiUrl}/v1/brand/profile/get`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setBrands(response.data.data);
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const refreshBrands = () => {
    fetchBrands(); // Refresh the brands after adding a new one
  };

  const filteredBrands = brands.filter((brand) =>
    brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-200 min-w-screen text-xs">
      <div className="bg-white min-h-screen pl-2 pt-2">
        <header className="flex justify-between items-center pb-8">
          <h1 className="text-xl text-blue-500 font-semibold pb-6">Account</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300"
          >
            Add Brand Profile
          </button>
        </header>
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {filteredBrands.map((brand) => (
              <Card
                key={brand._id}
                brand={{
                  name: brand.brand_name,
                  logo: brand.brand_logo,
                  id: brand._id,
                }}
              />
            ))}
          </div>
        </main>
      </div>
      <BrandModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refreshBrands();
        }}
      />
    </div>
  );
}

export default BrandPage;
