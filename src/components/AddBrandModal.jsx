// import React, { useState } from "react";

// const BrandModal = ({ isOpen, onClose }) => {
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [platforms, setPlatforms] = useState([
//     {
//       id: Date.now(),
//       platform: "",
//       account_id: "",
//       password: "",
//       phone_no: "",
//       backup_email: "",
//     },
//   ]);
//   const [formData, setFormData] = useState({
//     brandName: "",
//     brandCompanyName: "",
//     websiteLink: "",
//     brand_logo_dataURI: null,
//     brand_guidelines_dataURI: null,
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const { name } = e.target;
//     const file = e.target.files[0];

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: reader.result, // Convert file to base64 URI
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handlePlatformChange = (id, e) => {
//     const { name, value } = e.target;
//     setPlatforms((prevPlatforms) =>
//       prevPlatforms.map((platform) =>
//         platform.id === id ? { ...platform, [name]: value } : platform
//       )
//     );
//   };

//   const addPlatform = () => {
//     setPlatforms([
//       ...platforms,
//       {
//         id: Date.now(), // Unique ID for each platform
//         platform: "",
//         account_id: "",
//         password: "",
//         phone_no: "",
//         backup_email: "",
//       },
//     ]);
//   };

//   const removePlatform = (id) => {
//     setPlatforms(platforms.filter((platform) => platform.id !== id));
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.brandName) newErrors.brandName = "Brand Name is required";
//     if (!formData.brandCompanyName)
//       newErrors.brandCompanyName = "Brand Company Name is required";

//     if (!formData.brand_logo_dataURI)
//       newErrors.brand_logo_dataURI = "Logo is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const data = {
//       brand_name: formData.brandName,
//       brand_company_name: formData.brandCompanyName,
//       website_link: formData.websiteLink,
//       brand_logo_dataURI: formData.brand_logo_dataURI,
//       brand_guidelines_dataURI: formData.brand_guidelines_dataURI,
//       social_media: platforms,
//     };

//     const accessToken = localStorage.getItem("access_token");
//     fetch(`${apiUrl}/v1/brand/profile/add`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("Success:", result);
//         onClose(); // Close the modal after successful submission
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex text-xs items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-semibold">Add Brand Profile</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 text-left sm:grid-cols-3 gap-6 mb-6">
//             <div>
//               <label className="block text-xs font-medium text-gray-700">
//                 Brand Name
//               </label>
//               <input
//                 type="text"
//                 name="brandName"
//                 value={formData.brandName}
//                 onChange={handleChange}
//                 className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
//                 placeholder="Brand Name"
//               />
//               {errors.brandName && (
//                 <p className="text-red-500 text-xs mt-1">{errors.brandName}</p>
//               )}
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-700">
//                 Brand Company Name
//               </label>
//               <input
//                 type="text"
//                 name="brandCompanyName"
//                 value={formData.brandCompanyName}
//                 onChange={handleChange}
//                 className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
//                 placeholder="Brand Company Name"
//               />
//               {errors.brandCompanyName && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.brandCompanyName}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-700">
//                 Website Link
//               </label>
//               <input
//                 type="text"
//                 name="websiteLink"
//                 value={formData.websiteLink}
//                 onChange={handleChange}
//                 className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
//                 placeholder="Website Link"
//               />
//               {errors.websiteLink && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.websiteLink}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-700">
//                 Logo
//               </label>
//               <input
//                 type="file"
//                 name="brand_logo_dataURI"
//                 onChange={handleFileChange}
//                 className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
//               />
//               {formData.brand_logo_dataURI && (
//                 <p className="text-blue-500 text-sm">File Selected</p>
//               )}
//               {errors.brand_logo_dataURI && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.brand_logo_dataURI}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-700">
//                 Brand Guidelines (PDF)
//               </label>
//               <input
//                 type="file"
//                 name="brand_guidelines_dataURI"
//                 accept="application/pdf"
//                 onChange={handleFileChange}
//                 className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
//               />
//               {formData.brand_guidelines_dataURI && (
//                 <p className="text-blue-500 text-sm">PDF Selected</p>
//               )}
//               {errors.brand_guidelines_dataURI && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.brand_guidelines_dataURI}
//                 </p>
//               )}
//             </div>
//           </div>
//           <h3 className="text-lg font-medium mb-4">Credential</h3>
//           {platforms.map((platform, index) => (
//             <div
//               key={platform.id}
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 text-left gap-6 mb-6"
//             >
//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Social Media Platform
//                 </label>
//                 <input
//                   type="text"
//                   name="platform"
//                   value={platform.platform}
//                   onChange={(e) => handlePlatformChange(platform.id, e)}
//                   className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
//                   placeholder="Platform"
//                 />
//                 {errors[`platform_${index}`] && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors[`platform_${index}`]}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Account ID
//                 </label>
//                 <input
//                   type="text"
//                   name="account_id"
//                   value={platform.account_id}
//                   onChange={(e) => handlePlatformChange(platform.id, e)}
//                   className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
//                   placeholder="Account ID"
//                 />
//                 {errors[`account_id_${index}`] && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors[`account_id_${index}`]}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Password
//                 </label>
//                 <input
//                   type="text"
//                   name="password"
//                   value={platform.password}
//                   onChange={(e) => handlePlatformChange(platform.id, e)}
//                   className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
//                   placeholder="Password"
//                 />
//                 {errors[`password_${index}`] && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors[`password_${index}`]}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Phone No.
//                 </label>
//                 <input
//                   type="text"
//                   name="phone_no"
//                   value={platform.phone_no}
//                   onChange={(e) => handlePlatformChange(platform.id, e)}
//                   className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
//                   placeholder="Phone No."
//                 />
//                 {errors[`phone_no_${index}`] && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors[`phone_no_${index}`]}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Backup Email
//                 </label>
//                 <input
//                   type="text"
//                   name="backup_email"
//                   value={platform.backup_email}
//                   onChange={(e) => handlePlatformChange(platform.id, e)}
//                   className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
//                   placeholder="Backup Email"
//                 />
//                 {errors[`backup_email_${index}`] && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors[`backup_email_${index}`]}
//                   </p>
//                 )}
//               </div>
//               <div className="flex items-center justify-end">
//                 <button
//                   type="button"
//                   onClick={() => removePlatform(platform.id)}
//                   className="text-red-600 hover:text-red-900"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke-width="1.5"
//                     stroke="currentColor"
//                     class="size-6"
//                   >
//                     <path
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           ))}
//           <div className="flex justify-start">
//             <button
//               type="button"
//               onClick={addPlatform}
//               className="text-white px-2 py-1 bg-blue-400 hover:text-blue-900 mb-4"
//             >
//               Add Platform
//             </button>
//           </div>
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
//             >
//               Save Brand Profile
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BrandModal;

// BrandModal.jsx
import React, { useState } from "react";

const BrandModal = ({ isOpen, onClose }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [platforms, setPlatforms] = useState([
    {
      id: Date.now(),
      platform: "",
      account_id: "",
      password: "",
      phone_no: "",
      backup_email: "",
    },
  ]);
  const [formData, setFormData] = useState({
    brandName: "",
    brandCompanyName: "",
    websiteLink: "",
    brand_logo_dataURI: null,
    brand_guidelines_dataURI: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [name]: reader.result, // Convert file to base64 URI
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePlatformChange = (id, e) => {
    const { name, value } = e.target;
    setPlatforms((prevPlatforms) =>
      prevPlatforms.map((platform) =>
        platform.id === id ? { ...platform, [name]: value } : platform
      )
    );
  };

  const addPlatform = () => {
    setPlatforms([
      ...platforms,
      {
        id: Date.now(), // Unique ID for each platform
        platform: "",
        account_id: "",
        password: "",
        phone_no: "",
        backup_email: "",
      },
    ]);
  };

  const removePlatform = (id) => {
    setPlatforms(platforms.filter((platform) => platform.id !== id));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.brandName) newErrors.brandName = "Brand Name is required";
    if (!formData.brandCompanyName)
      newErrors.brandCompanyName = "Brand Company Name is required";

    if (!formData.brand_logo_dataURI)
      newErrors.brand_logo_dataURI = "Logo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      brand_name: formData.brandName,
      brand_company_name: formData.brandCompanyName,
      website_link: formData.websiteLink,
      brand_logo_dataURI: formData.brand_logo_dataURI,
      brand_guidelines_dataURI: formData.brand_guidelines_dataURI,
      social_media: platforms,
    };

    const accessToken = localStorage.getItem("access_token");
    fetch(`${apiUrl}/v1/brand/profile/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
        onClose(); // Close the modal and refresh brands
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex text-xs items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Add Brand Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 text-left sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Brand Name
              </label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
                placeholder="Brand Name"
              />
              {errors.brandName && (
                <p className="text-red-500 text-xs mt-1">{errors.brandName}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Brand Company Name
              </label>
              <input
                type="text"
                name="brandCompanyName"
                value={formData.brandCompanyName}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
                placeholder="Brand Company Name"
              />
              {errors.brandCompanyName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.brandCompanyName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Website Link
              </label>
              <input
                type="text"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
                placeholder="Website Link"
              />
              {errors.websiteLink && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.websiteLink}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Logo
              </label>
              <input
                type="file"
                name="brand_logo_dataURI"
                onChange={handleFileChange}
                className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
              />
              {formData.brand_logo_dataURI && (
                <p className="text-blue-500 text-sm">File Selected</p>
              )}
              {errors.brand_logo_dataURI && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.brand_logo_dataURI}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Brand Guidelines (PDF)
              </label>
              <input
                type="file"
                name="brand_guidelines_dataURI"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
              />
              {formData.brand_guidelines_dataURI && (
                <p className="text-blue-500 text-sm">PDF Selected</p>
              )}
              {errors.brand_guidelines_dataURI && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.brand_guidelines_dataURI}
                </p>
              )}
            </div>
          </div>
          <h3 className="text-lg font-medium mb-4">Credential</h3>
          {platforms.map((platform, index) => (
            <div
              key={platform.id}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 text-left gap-6 mb-6"
            >
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Social Media Platform
                </label>
                <input
                  type="text"
                  name="platform"
                  value={platform.platform}
                  onChange={(e) => handlePlatformChange(platform.id, e)}
                  className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
                  placeholder="Platform"
                />
                {errors[`platform_${index}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`platform_${index}`]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Account ID
                </label>
                <input
                  type="text"
                  name="account_id"
                  value={platform.account_id}
                  onChange={(e) => handlePlatformChange(platform.id, e)}
                  className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
                  placeholder="Account ID"
                />
                {errors[`account_id_${index}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`account_id_${index}`]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="text"
                  name="password"
                  value={platform.password}
                  onChange={(e) => handlePlatformChange(platform.id, e)}
                  className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
                  placeholder="Password"
                />
                {errors[`password_${index}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`password_${index}`]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Phone No.
                </label>
                <input
                  type="text"
                  name="phone_no"
                  value={platform.phone_no}
                  onChange={(e) => handlePlatformChange(platform.id, e)}
                  className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
                  placeholder="Phone No."
                />
                {errors[`phone_no_${index}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`phone_no_${index}`]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Backup Email
                </label>
                <input
                  type="text"
                  name="backup_email"
                  value={platform.backup_email}
                  onChange={(e) => handlePlatformChange(platform.id, e)}
                  className="mt-1 p-2 block w-full border-none rounded-md shadow-sm focus:ring-0"
                  placeholder="Backup Email"
                />
                {errors[`backup_email_${index}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`backup_email_${index}`]}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => removePlatform(platform.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={addPlatform}
              className="text-white px-2 py-1 bg-blue-400 hover:text-blue-900 mb-4"
            >
              Add Platform
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
            >
              Save Brand Profile
            </button>
          </div>
        </form>
        {/* <div className="flex justify-start">
          <button
            type="button"
            onClick={addPlatform}
            className="text-white px-2 py-1 bg-blue-400 hover:text-blue-900 mb-4"
          >
            Add Platform
          </button>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
          >
            Save Brand Profile
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default BrandModal;
