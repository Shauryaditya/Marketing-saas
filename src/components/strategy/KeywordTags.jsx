import axios from "axios";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import { PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import BackButton from "../BackButton";

const KeywordTags = () => {
  setupAxiosInterceptors();
  const { brandid } = useParams();
  const [tags, setTags] = useState([{ id: 1, target_audience: "", tags: "" }]);
  const [googleKeywords, setGoogleKeywords] = useState("");
  const [thirdPartyKeywords, setThirdPartyKeywords] = useState("");
  const [marketplaceKeywords, setMarketplaceKeywords] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`/v1/brand/profile/get/tags/${brandid}`);
        const { google_keywords, third_party_keywords, marketplace_keywords, tags } = response.data;
  
        // Convert arrays to strings
        const googleKeywordsStr = google_keywords ? google_keywords.join(' ') : "";
        const thirdPartyKeywordsStr = third_party_keywords ? third_party_keywords.join(' ') : "";
        const marketplaceKeywordsStr = marketplace_keywords ? marketplace_keywords.join(' ') : "";
  
        // Convert tags array to a single string for each tag object
        const formattedTags = tags.map((tag, index) => ({
          id: index + 1,
          target_audience: tag.target_audience,
          tags: Array.isArray(tag.tags) ? tag.tags.join(' ') : tag.tags,
        }));
  
        setGoogleKeywords(googleKeywordsStr);
        setThirdPartyKeywords(thirdPartyKeywordsStr);
        setMarketplaceKeywords(marketplaceKeywordsStr);
        setTags(formattedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
  
    fetchTags();
  }, [brandid]);
  
  

  const addTag = () => {
    setTags([...tags, { id: tags.length + 1, target_audience: "", tags: "" }]);
  };

  const handleTagChange = (index, field, value) => {
    const updatedTags = tags.map((tag, i) =>
      i === index ? { ...tag, [field]: value } : tag
    );
    setTags(updatedTags);
  };

  const handleSubmit = async () => {
    const body = {
      brand_id: brandid,
      google_keywords: googleKeywords,
      third_party_keywords: thirdPartyKeywords,
      marketplace_keywords: marketplaceKeywords,
      tags: tags.map(({ target_audience, tags }) => ({
        target_audience,
        tags,
      })),
    };

    try {
      const response = await axios.post(`/v1/brand/profile/tags`, body);
      toast.success(response.data.message)
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting tags:", error);
    }
  };

  return (
    <div className="">
      <BackButton/>
    <div className="bg-gray-50 h-screen p-2">
      {/* Google Search Section */}
      <div className="">
        <div className="bg-white  m-2">
          <div className="flex justify-center items-center bg-white p-2 mt-2">
            <label className="text-xs w-1/6 uppercase font-semibold">
              Google Search
            </label>
            <input
              type="text"
              className="border w-5/6 p-1 rounded text-xs bg-gray-50 placeholder:text-xs"
              placeholder="Google Search"
              value={googleKeywords}
              onChange={(e) => setGoogleKeywords(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Third Party Keywords Section */}
      <div className="">
        <div className="bg-white p-2 mx-2">
          <div className="flex justify-center items-center bg-white p-2 mt-2">
            <label className="text-xs w-1/6 uppercase font-semibold">
              3rd Party
            </label>
            <input
              type="text"
              className="border w-5/6 p-1 text-xs rounded bg-gray-50 placeholder:text-xs"
              placeholder="3rd Party"
              value={thirdPartyKeywords}
              onChange={(e) => setThirdPartyKeywords(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Marketplace Keywords Section */}
      <div className="">
        <div className="bg-white p-2 mx-2">
          <div className="flex justify-center items-center bg-white p-2 mt-2">
            <label className="text-xs w-1/6 uppercase font-semibold">
              Marketplace Keywords
            </label>
            <input
              type="text"
              className="border w-5/6 p-1 text-xs rounded bg-gray-50 placeholder:text-xs"
              placeholder="Marketplace Keywords"
              value={marketplaceKeywords}
              onChange={(e) => setMarketplaceKeywords(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="p-2">
        <div className="bg-white mx-2 mt-2">
          <div className="flex justify-between border-b p-2">
            <h1 className="text-sm font-semibold">Tags</h1>
          </div>
          <div className="bg-white p-2 mx-2">
            <div className="flex flex-col gap-2">
              {tags.map((tag, index) => (
                <div
                  key={tag.id}
                  className="flex items-center bg-white p-2 gap-x-2"
                >
                  <label className="text-xs w-1/6 uppercase font-semibold flex items-center">
                    Tag#{index + 1}
                  </label>
                  <div className="w-2/5 flex flex-col">
                    <label htmlFor="" className="text-xs italic">
                      Target Audience
                    </label>
                    <textarea
                      className="border p-1 text-xs rounded bg-gray-50"
                      type="text"
                      value={tag.target_audience}
                      onChange={(e) =>
                        handleTagChange(index, "target_audience", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-5/6 flex flex-col">
                    <label
                      className="text-xs w-1/6 uppercase flex items-center italic"
                      htmlFor=""
                    >
                      #Tags
                    </label>
                    <textarea
                      type="text"
                      className="border w-full p-1 text-xs rounded bg-gray-50  h-12"
                      placeholder=""
                      value={tag.tags}
                      onChange={(e) =>
                        handleTagChange(index, "tags", e.target.value)
                      }
                    />
                  </div>
                  {index === tags.length - 1 && (
                    <PlusCircle
                      onClick={addTag}
                      className="cursor-pointer ml-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
    </div>
  );
};

export default KeywordTags;
