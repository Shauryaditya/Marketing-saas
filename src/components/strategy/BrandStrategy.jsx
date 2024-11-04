import axios from "axios";
import { Facebook, MinusCircle, PlusCircle } from "lucide-react";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import BackButton from "../BackButton";
import setupAxiosInterceptors from "../../AxiosInterceptor";
const url = import.meta.env.VITE_API_URL;

const BrandStrategy = () => {
  setupAxiosInterceptors();
  const { id, strategyId } = useParams(); // Fetch brand_id from URL
  const [platforms, setPlatforms] = useState([]);
  const [focus, setFocus] = useState([]);
  const token = localStorage.getItem("access_token");
  const [focusGroups, setFocusGroups] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    brand_id: id,
    month: "",
    focus: [{ percent: "", focus_id: "" }],
    productToFocus: "",
    social_post: [],
    blog_post: [{ time_interval: "Monthly", number: "0" }],
    email_marketing: [{ time_interval: "Weekly", number: "0" }],
    sms_marketing: [{ time_interval: "Daily", number: "0" }],
    new_sletter: [{ time_interval: "Monthly", number: "0" }],
    tags: "",
    important_date: [{ date: "", name: "", description: "" }],
    budget: "",
    campaigns: "",
    remark: "",
    documents: [],
  });
  const [tags, setTags] = useState("");
  const [fileUri, setFileUri] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const formattedMonth =
        selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
      const formattedDate = `${selectedYear}-${formattedMonth}-01`;

      try {
        const apiurl = `${url}/v1/Strategy/get/${id}/${formattedDate}`;
        const response = await axios.get(apiurl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          const data = response.data.data[0];
          setFormData((prevState) => ({
            ...prevState,
            ...data,
            month: formattedDate, // Update the month value here
          }));
        } else {
          // If no data is returned, reset the form but preserve the month field
          setFormData((prevState) => ({
            ...initialFormData, // Use initial structure to reset values
            brand_id: id,
            month: formattedDate, // Preserve month
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setFormData((prevState) => ({
          ...initialFormData,
          brand_id: id,
          month: formattedDate, // Preserve month even if there's an error
        }));
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, strategyId]);

  // Define initialFormData outside the component
  const initialFormData = {
    brand_id: id,
    month: "",
    focus: [{ percent: "", focus_id: "" }],
    productToFocus: "",
    social_post: [],
    blog_post: [{ time_interval: "Monthly", number: "0" }],
    email_marketing: [{ time_interval: "Weekly", number: "0" }],
    sms_marketing: [{ time_interval: "Daily", number: "0" }],
    new_sletter: [{ time_interval: "Monthly", number: "0" }],
    tags: "",
    important_date: [{ date: "", name: "", description: "" }],
    budget: "",
    campaigns: "",
    remark: "",
    documents: [],
  };

  const updateMonthInFormData = (month, year) => {
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDate = `${year}-${formattedMonth}-01`;
    setFormData((prevData) => ({
      ...prevData,
      month: formattedDate,
    }));
  };

  const handleMonthChange = (e) => {
    const month = Number(e.target.value);
    setSelectedMonth(month);
    updateMonthInFormData(month, selectedYear);
  };

  const handleYearChange = (e) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    updateMonthInFormData(selectedMonth, year);
  };

  const [importantDates, setImportantDates] = useState([
    { date: "", name: "", description: "" },
  ]);
  const [file, setFile] = useState(null);

  const timeIntervals = ["Daily", "Weekly", "Monthly"];

  useEffect(() => {
    const fetchStrategy = async () => {
      try {
        const response = await axios.get(
          `/v1/strategy/sigle/get/${strategyId}`
        );

        if (response.data.data.length > 0) {
          const data = response.data.data[0];

          // Extract the month and year from the API response
          if (data.month) {
            const date = new Date(data.month); // Parse the date from the API (ISO format)
            const apiYear = date.getFullYear(); // Get the year
            const apiMonth = date.getMonth() + 1; // Get the month (0-indexed, so add 1)

            // Update the selectedMonth and selectedYear states
            setSelectedMonth(apiMonth);
            setSelectedYear(apiYear);
          }

          // Update formData with the API data, including social_post
          setFormData((prevState) => ({
            ...prevState,
            ...data,
            social_post: data.social_post || [], // Ensure social_post is set, or an empty array if missing
          }));
        }
      } catch (error) {
        setError("Failed to fetch strategy data");
        console.error("Error fetching strategy data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (strategyId) {
      fetchStrategy();
    }
  }, [strategyId]);

  // Added strategyId to dependency array

  const handleAddGroup = () => {
    setFormData((prevFormData) => {
      if (prevFormData.focus.length >= focus.length) {
        setErrorMessage("Cannot add more focus groups than available options.");
        return prevFormData;
      }

      setErrorMessage(""); // Clear any previous error
      return {
        ...prevFormData,
        focus: [...prevFormData.focus, { percent: "", focus_id: "" }],
      };
    });
  };

  const handleRemoveGroup = (index) => {
    setFormData((prevFormData) => {
      const updatedFocus = prevFormData.focus.filter((_, i) => i !== index);

      const totalPercentage = updatedFocus.reduce((sum, group) => {
        return sum + (parseFloat(group.percent) || 0);
      }, 0);

      if (totalPercentage <= 100) {
        setErrorMessage(""); // Clear error if within limits
      }

      return {
        ...prevFormData,
        focus: updatedFocus,
      };
    });
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "tags") {
      // Split the value by commas and trim whitespace from each tag
      const tagsArray = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      setFormData((prevData) => ({
        ...prevData,
        tags: tagsArray.join(", "), // Store as comma-separated string
      }));
    } else {
      // Handle other fields as needed
      setFormData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  const handleFocus = (index, name, value) => {
    if (name === "percent" && value < 0) {
      setErrorMessage("Percentage cannot be negative");
      return;
    }

    setFormData((prevFormData) => {
      const updatedFocus = prevFormData.focus.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      );

      const totalPercentage = updatedFocus.reduce((sum, group) => {
        return sum + (parseFloat(group.percent) || 0);
      }, 0);

      if (totalPercentage > 100) {
        setErrorMessage("Total percentage cannot exceed 100%");
        return prevFormData; // Prevent updating if percentage exceeds 100%
      }

      setErrorMessage(""); // Clear error if within limits
      return {
        ...prevFormData,
        focus: updatedFocus,
      };
    });
  };

  const handleTimeIntervalChange = (socialId, newInterval) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      social_post: prevFormData.social_post.map((post) =>
        post.social_id === socialId
          ? { ...post, time_interval: newInterval }
          : post
      ),
    }));
  };

  const handlePlatformChange = (
    platformId,
    platformlogo,
    platformname,
    isChecked
  ) => {
    // Create the post object
    const post = {
      platform_name: platformname,
      platform_logo: platformlogo,
      social_id: platformId,
      time_interval: "", // Default or set as needed
      number: "", // Default or set as needed
    };
    // Update the formData state
    setFormData((prevFormData) => {
      let updatedSocialPosts;

      if (isChecked) {
        // Add the post if checkbox is selected
        updatedSocialPosts = [...prevFormData.social_post, post];
      } else {
        // Remove the post if checkbox is deselected
        updatedSocialPosts = prevFormData.social_post.filter(
          (item) => item.social_id !== platformId
        );
      }
      return {
        ...prevFormData,
        social_post: updatedSocialPosts,
      };
    });
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result;
      setFormData((prevFormData) => ({
        ...prevFormData,
        documents: [...prevFormData.documents, dataUri],
      }));
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      documents: prevFormData.documents.filter((_, i) => i !== index),
    }));
  };

  const getFileExtension = (url) => {
    return url.split(".").pop();
  };

  const isImage = (url) => {
    const ext = getFileExtension(url).toLowerCase();
    return (
      ["jpeg", "jpg", "png", "gif"].includes(ext) ||
      url.startsWith("data:image/")
    );
  };
  const renderFileIcon = (extension) => {
    switch (extension) {
      case "pdf":
        return <FaFilePdf className="text-red-500 text-3xl" />;
      case "doc":
      case "docx":
        return <FaFileWord className="text-blue-500 text-3xl" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel className="text-green-500 text-3xl" />;
      default:
        return <FaFileAlt className="text-gray-500 text-3xl" />;
    }
  };
  // Function to handle changing date fields
  const handleDateChange = (index, field, value) => {
    const updatedDates = formData.important_date.map((date, i) =>
      i === index ? { ...date, [field]: value } : date
    );
    setFormData((prevData) => ({
      ...prevData,
      important_date: updatedDates,
    }));
  };

  // Function to remove a date
  const handleRemoveDate = (index) => {
    const updatedDates = formData.important_date.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      important_date: updatedDates,
    }));
  };

  // Function to add a new date
  const handleAddDate = () => {
    const newDate = { date: "", name: "", description: "" };
    setFormData((prevData) => ({
      ...prevData,
      important_date: [...prevData.important_date, newDate],
    }));
  };

  const handleMarketingChange = (index, field, value, type) => {
    const updateMarketing = (prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item));

    setFormData((prev) => {
      switch (type) {
        case "email":
          return {
            ...prev,
            email_marketing: updateMarketing(prev.email_marketing),
          };
        case "sms":
          return {
            ...prev,
            sms_marketing: updateMarketing(prev.sms_marketing),
          };
        case "newsletter":
          return {
            ...prev,
            new_sletter: updateMarketing(prev.new_sletter),
          };
        case "blog":
          return {
            ...prev,
            blog_post: updateMarketing(prev.blog_post),
          };
        default:
          return prev;
      }
    });
  };

  useEffect(() => {
    // Fetch platforms from the API
    const fetchPlatforms = async () => {
      try {
        const response = await fetch(`${url}/v1/platform/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPlatforms(data.data); // Assuming the response data is an array of platforms
      } catch (error) {
        console.error("Error fetching platforms:", error);
      }
    };

    fetchPlatforms();
  }, [token]);

  useEffect(() => {
    const fetchFocus = async () => {
      try {
        const response = await fetch(
          `${url}/v1/platform/focus/get?page=1&limit=100`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setFocus(data.data); // Assuming the response data is an array of focus items
      } catch (error) {
        console.error("Error fetching focus:", error);
      }
    };

    fetchFocus();
  }, [token]);

  const handleNumberChange = (socialId, newNumber) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      social_post: prevFormData.social_post.map((post) =>
        post.social_id === socialId ? { ...post, number: newNumber } : post
      ),
    }));
  };

  // Helper function to check if a value is empty
  const isEmpty = (value) => {
    return value === "" || value === null || value === undefined;
  };
  // Main validation function
  const validateFormData = () => {
    const errors = [];

    // Check each field and add specific error messages as needed

    if (isEmpty(formData.productToFocus))
      errors.push("Product focus is required.");
    if (isEmpty(formData.budget)) errors.push("Budget field is required.");
    if (isEmpty(formData.campaigns))
      errors.push("Campaign details are required.");

    formData.focus.forEach((item, index) => {
      if (isEmpty(item.percent)) {
        errors.push(`Focus group ${index + 1}: Percentage is required.`);
      }
      if (isEmpty(item.focus_id)) {
        errors.push(`Focus group ${index + 1}: Please select a focus.`);
      }
    });

    formData.social_post.forEach((post, index) => {
      if (isEmpty(post.time_interval)) {
        errors.push(`Social post ${index + 1}: Time interval is required.`);
      }
      if (isEmpty(post.number)) {
        errors.push(`Social post ${index + 1}: Number of posts is required.`);
      }
    });

    formData.important_date.forEach((date, index) => {
      if (isEmpty(date.date))
        errors.push(`Important date ${index + 1}: Date is required.`);
      if (isEmpty(date.name))
        errors.push(`Important date ${index + 1}: Name is required.`);
    });

    return errors;
  };
  // Update handleSubmit to include toast notifications for errors
  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateFormData();

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        toast.error(error); // Display each error message in a toast
      });
      return; // Stop submission if there are validation errors
    }

    try {
      const response = await axios.post(`${url}/v1/Strategy/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="text-xs">
      <BackButton />
      <form onSubmit={handleSubmit}>
        <div className="p-4 bg-gray-50">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-center font-semibold">Strategy</h1>
              <div className="mb-6 flex space-x-2">
                <select
                  className="border p-1 rounded bg-gray-50 text-xs"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(0, month - 1).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
                <select
                  className="border p-1 rounded bg-gray-50 text-xs"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-white p-2">
              <h2 className="text-xs font-bold mb-4 uppercase">Platform</h2>
              <div className="flex space-x-4 overflow-x-auto no-scrollbar">
                {platforms.map((platform) => {
                  // Check if the platform is already selected
                  const isChecked = formData.social_post.some(
                    (item) => item.social_id === platform._id
                  );

                  return (
                    <label
                      key={platform._id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked} // Controlled checkbox state
                        onChange={(e) =>
                          handlePlatformChange(
                            platform._id,
                            platform.platform_logo,
                            platform.platform_name,
                            e.target.checked
                          )
                        }
                      />
                      <img
                        className="w-6 h-6"
                        src={platform.platform_logo}
                        alt=""
                      />
                      <span>{platform.platform_name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-white p-2">
              <h2 className="text-sm font-bold mb-4 uppercase">Focus</h2>
              <div className="flex flex-wrap space-x-8">
                {formData.focus.map((group, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="number"
                      min="0"
                      className="border w-12 p-1 rounded bg-gray-50"
                      placeholder="Percentage"
                      value={group.percent}
                      onChange={(e) =>
                        handleFocus(index, "percent", e.target.value)
                      }
                    />
                    <span>%</span>
                    <select
                      className="border p-1 rounded bg-gray-50 w-40"
                      value={group.focus_id}
                      onChange={(e) =>
                        handleFocus(index, "focus_id", e.target.value)
                      }
                    >
                      <option value="">Select a focus</option>
                      {focus.map((f) => {
                        // Disable the option if it's already selected in another group
                        const isDisabled = formData.focus.some(
                          (selectedGroup, selectedIndex) =>
                            selectedGroup.focus_id === f._id &&
                            selectedIndex !== index
                        );

                        return (
                          <option
                            key={f._id}
                            value={f._id}
                            disabled={isDisabled}
                          >
                            {f.focus_name}
                          </option>
                        );
                      })}
                    </select>
                    {formData.focus.length > 1 && (
                      <MinusCircle
                        onClick={() => handleRemoveGroup(index)}
                        height="18"
                        width="18"
                        className="cursor-pointer text-red-500"
                      />
                    )}
                  </div>
                ))}

                <div className="mt-2">
                  {formData.focus.length < focus.length && (
                    <PlusCircle
                      onClick={handleAddGroup}
                      height="18"
                      width="18"
                      className="cursor-pointer text-green-500"
                    />
                  )}
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-white p-2">
              <h2 className="text-xl font-bold mb-4">Post</h2>
              <div className="flex flex-col space-y-4">
                {formData.social_post.map((post) => (
                  <div
                    key={post.social_id}
                    className="flex items-center space-x-4"
                  >
                    <img src={post.platform_logo} className="w-6 h-6" alt="" />
                    <span className="text-xs">{post.platform_name}</span>
                    <div className="flex justify-center items-center gap-x-2">
                      <label className="text-xs" htmlFor="">
                        Time interval
                      </label>
                      <select
                        className="border bg-gray-50 rounded text-xs p-1"
                        value={post.time_interval}
                        onChange={(e) =>
                          handleTimeIntervalChange(
                            post.social_id,
                            e.target.value
                          )
                        }
                      >
                        <option value="">--Select--</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="flex justify-center items-center gap-x-4">
                      <label className="text-center text-xs" htmlFor="">
                        Number of Posts
                      </label>
                      <input
                        type="number"
                        className="border p-2 w-16 text-xs bg-gray-50"
                        placeholder="12"
                        value={post.number}
                        onChange={(e) =>
                          handleNumberChange(post.social_id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="bg-white p-2 ">
              <div className="flex justify-center items-center bg-white p-2 mt-2 ">
                <label className="text-xs w-1/6 uppercase font-semibold">
                  Products to Focus
                </label>
                <input
                  type="text"
                  className="border w-5/6 p-1 rounded bg-gray-50"
                  placeholder="Enter Product to focus"
                  value={formData.productToFocus}
                  onChange={(e) => handleInputChange(e, "productToFocus")}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-white  mt-2">
                <h2 className="text-xs font-bold mb-2 uppercase border-b p-2">
                  Blog Post
                </h2>
                <div className="flex flex-wrap p-2">
                  {formData.blog_post.map((blog, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-8 mb-2"
                    >
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs">Time Interval</span>
                        <select
                          className="border p-1 rounded bg-gray-50"
                          value={blog.time_interval}
                          onChange={(e) =>
                            handleMarketingChange(
                              index,
                              "time_interval",
                              e.target.value,
                              "blog"
                            )
                          }
                        >
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs ">Number of Blogs</span>
                        <input
                          type="number"
                          className="border w-1/6 p-1 rounded bg-gray-50 "
                          placeholder="Number"
                          value={blog.number}
                          onChange={(e) =>
                            handleMarketingChange(
                              index,
                              "number",
                              e.target.value,
                              "blog"
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white mt-2">
              <h2 className="text-xs font-bold border-b p-2 uppercase">
                Email Marketing
              </h2>
              <div className="flex flex-wrap p-2">
                {formData.email_marketing.map((email, index) => (
                  <div key={index} className="flex items-center space-x-8 mb-2">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs">Time Interval</span>
                      <select
                        className="border p-1 rounded bg-gray-50"
                        value={email.time_interval}
                        onChange={(e) =>
                          handleMarketingChange(
                            index,
                            "time_interval",
                            e.target.value,
                            "email"
                          )
                        }
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs">Number of email</span>
                      <input
                        type="number"
                        className="border w-1/6 p-1 rounded bg-gray-50"
                        placeholder="Number"
                        value={email.number}
                        onChange={(e) =>
                          handleMarketingChange(
                            index,
                            "number",
                            e.target.value,
                            "email"
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white mt-2">
              <h2 className="text-xs font-bold border-b p-2 uppercase">
                SMS Marketing
              </h2>
              <div className="flex flex-wrap p-2">
                {formData.sms_marketing.map((sms, index) => (
                  <div key={index} className="flex items-center space-x-8 mb-2">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs">Time Interval</span>
                      <select
                        className="border p-1 rounded bg-gray-50"
                        value={sms.time_interval}
                        onChange={(e) =>
                          handleMarketingChange(
                            index,
                            "time_interval",
                            e.target.value,
                            "sms"
                          )
                        }
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs">Number of sms</span>
                      <input
                        type="number"
                        className="border w-1/6 p-1 rounded bg-gray-50"
                        placeholder="Number"
                        value={sms.number}
                        onChange={(e) =>
                          handleMarketingChange(
                            index,
                            "number",
                            e.target.value,
                            "sms"
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white mt-2">
              <h2 className="text-xs font-bold p-2  border-b uppercase">
                Newsletters
              </h2>
              <div className="flex flex-wrap p-2">
                {formData.new_sletter.map((newsletter, index) => (
                  <div key={index} className="flex items-center space-x-8 mb-2">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs">Time Interval</span>
                      <select
                        className="border p-1 rounded bg-gray-50"
                        value={newsletter.time_interval}
                        onChange={(e) =>
                          handleMarketingChange(
                            index,
                            "time_interval",
                            e.target.value,
                            "newsletter"
                          )
                        }
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs">Number of Newsletter</span>
                      <input
                        type="number"
                        className="border w-1/6 p-1 rounded bg-gray-50"
                        placeholder="Number"
                        value={newsletter.number}
                        onChange={(e) =>
                          handleMarketingChange(
                            index,
                            "number",
                            e.target.value,
                            "newsletter"
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center bg-white p-2 mt-2">
              <label className="text-xs w-1/6 uppercase font-semibold">
                This month #Tags
              </label>
              <input
                type="text"
                className="border w-full p-1 rounded bg-gray-50"
                placeholder="Enter tags"
                value={formData.tags}
                onChange={(e) => handleInputChange(e, "tags")}
              />
            </div>
            <div className="bg-white p-2 mt-2">
              <h2 className="text-xs font-bold mb-2 uppercase">
                Important Dates
              </h2>
              <div className="flex flex-wrap space-x-3">
                {formData.important_date.map((date, index) => (
                  <div className="flex justify-end items-end" key={index}>
                    <div className="flex flex-col items-center space-y-2 mb-2">
                      <div className="flex gap-x-4">
                        <input
                          type="date"
                          className="border p-1 rounded bg-gray-50"
                          value={
                            date.date
                              ? new Date(date.date).toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleDateChange(index, "date", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          className="border p-1 rounded bg-gray-50"
                          placeholder="Name"
                          value={date.name}
                          onChange={(e) =>
                            handleDateChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <textarea
                        className="border w-full p-1 rounded bg-gray-50 h-24 resize-none"
                        placeholder="Description"
                        value={date.description}
                        onChange={(e) =>
                          handleDateChange(index, "description", e.target.value)
                        }
                      />
                    </div>
                    {formData.important_date.length > 1 && (
                      <button
                        type="button"
                        className="text-red-500 ml-2"
                        onClick={() => handleRemoveDate(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center justify-end mt-2 text-blue-500"
                  onClick={handleAddDate}
                >
                  <PlusCircle />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col">
            <div className="flex justify-between">
              <label className="block text-xs uppercase font-medium text-gray-700">
                Documents
              </label>
            </div>
            <div className="flex gap-x-4">
              <div
                {...getRootProps()}
                className="w-1/3 border-2 border-dashed border-gray-300 p-8 text-center rounded-lg flex flex-col items-center justify-center h-48"
              >
                <input {...getInputProps()} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                  />
                </svg>
                {file ? (
                  <p>{file.name}</p>
                ) : (
                  <p className="text-gray-500">
                    Drag 'n' drop a file here, or click to select a file
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4">
                <h1 className="text-sm font-semibold">Preview:</h1>
                {formData.documents.length > 0
                  ? formData.documents.map((fileUrl, index) => {
                      const isBase64 = fileUrl.startsWith("data:image/");
                      const fileExtension =
                        getFileExtension(fileUrl).toLowerCase();
                      const isPdfBase64 = fileUrl.startsWith(
                        "data:application/pdf"
                      );

                      return (
                        <div
                          key={index}
                          className="mt-2 flex flex-col items-center"
                        >
                          {/* Image Preview */}
                          {isImage(fileUrl) || isBase64 ? (
                            <img
                              src={fileUrl}
                              alt={`file-${index}`}
                              className="mt-1 max-h-32"
                            />
                          ) : isPdfBase64 ? (
                            /* PDF Preview for Base64 */
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaFilePdf className="text-4xl text-red-600" />
                              <p className="text-xs">Open PDF</p>
                            </a>
                          ) : fileExtension === "pdf" ? (
                            /* PDF Preview for Direct URLs */
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaFilePdf className="text-4xl text-red-600" />
                              <p className="text-xs">Open PDF</p>
                            </a>
                          ) : fileExtension === "xlsx" ||
                            fileExtension === "xls" ? (
                            /* Excel File Preview */
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaFileExcel className="text-4xl text-green-600" />
                              <p className="text-xs">Download Excel</p>
                            </a>
                          ) : (
                            <div className="text-center">
                              {renderFileIcon(fileExtension)}{" "}
                              {/* Display the icon */}
                            </div>
                          )}
                          {/* Remove button */}
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="mt-1 text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>

            {/* Budget, Campaigns, and Remarks Sections */}
            <div className="mb-6">
              <div className="flex items-center gap-x-2 bg-white p-2 mt-2">
                <label className="text-sm uppercase font-semibold">
                  Budget
                </label>
                <input
                  type="text"
                  className="border w-1/6 p-1 rounded bg-gray-50"
                  placeholder="Enter Budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange(e, "budget")}
                />
                <span className="text-sm font-semibold">INR/Month</span>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex flex-col bg-white p-2 mt-2">
                <label className="text-sm uppercase font-semibold">
                  Campaigns
                </label>
                <textarea
                  type="text"
                  className="border w-full p-1 rounded bg-gray-50 h-32 resize-none"
                  placeholder="Enter Campaigns"
                  value={formData.campaigns}
                  onChange={(e) => handleInputChange(e, "campaigns")}
                />
              </div>
              <div className="flex flex-col bg-white p-2">
                <label className="text-sm uppercase font-semibold">
                  Remarks
                </label>
                <textarea
                  type="text"
                  className="border w-full p-1 rounded h-32 resize-none bg-gray-50"
                  placeholder="Enter Remarks"
                  value={formData.remark}
                  onChange={(e) => handleInputChange(e, "remark")}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2  rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandStrategy;
