import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../public/logo.svg";
const apiUrl = import.meta.env.VITE_API_URL;

const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

const Sidebar = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(""); // State for active sub-tab

  const navigate = useNavigate();
  const location = useLocation();

  const toggleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  const toggleTeam = () => {
    setIsTeamOpen(!isTeamOpen);
  };

  useEffect(() => {
    const fetchBrands = async () => {
      const token = getAccessToken();

      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${apiUrl}/v1/brand/profile/get?fields=brand_name&limit=100`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBrands(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/sign-in");
  };

  useEffect(() => {
    // Set active tab based on current location on load
    setActiveTab(location.pathname);
  }, [location]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen h-fit w-48 text-xs bg-white shadow-md sticky top-0 flex flex-col justify-between ">
      <div>
        <a href="/dashboard">
          <div className="p-4 flex items-center justify-center gap-2">
            <img src={logo} alt="Logo" className="h-6 w-6" />
            <p className="font-semibold text-base">21Genx</p>
          </div>
        </a>

        <div className="p-4 ">
          <button
            className="flex items-center justify-between w-full text-left p-2 rounded hover:bg-gray-200"
            onClick={toggleAccount}
            aria-expanded={isAccountOpen}
            aria-controls="account-menu"
          >
            <span className="flex gap-1 items-center">
              {/* Icon */}
              <Link to="/admin">Account</Link>
            </span>
            {/* Toggle Icon */}
            <svg
              className={`h-5 w-5 transition-transform transform ${
                isTeamOpen ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isAccountOpen && (
            <div id="account-menu" className="pl-8 mt-1">
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className={`flex items-center p-1 hover:bg-gray-200 rounded ${
                    activeTab === `/brand/${brand._id}`
                      ? "bg-gray-200 text-blue-500" // Selected tab color
                      : ""
                  }`}
                >
                  <Link
                    to={`/brand/${brand._id}`}
                    onClick={() => setActiveTab(`/brand/${brand._id}`)}
                    target="_blank"
                    className="capitalize"
                  >
                    {brand.brand_name}
                  </Link>
                </div>
              ))}
            </div>
          )}

          <button
            className="flex items-center justify-between w-full text-left p-2 rounded hover:bg-gray-200 mt-2"
            onClick={toggleTeam}
            aria-expanded={isTeamOpen}
            aria-controls="team-menu"
          >
            <span className="flex gap-1 items-center">
              {/* Icon */}
              Manage Team
            </span>
            {/* Toggle Icon */}
            <svg
              className={`h-5 w-5 transition-transform transform ${
                isTeamOpen ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isTeamOpen && (
            <div id="team-menu" className="pl-8 mt-2">
              <Link
                to="/team/teams"
                onClick={() => setActiveTab("/team/teams")}
                className={`block p-2 hover:bg-gray-200 rounded ${
                  activeTab === "/team/teams" ? "bg-gray-200 text-blue-500" : ""
                }`}
              >
                Teams
              </Link>
              <Link
                to="/team/people"
                onClick={() => setActiveTab("/team/people")}
                className={`block p-2 hover:bg-gray-200 rounded ${
                  activeTab === "/team/people" ? "bg-gray-200 text-blue-500" : ""
                }`}
              >
                People
              </Link>
              <Link
                to="/team/role-access"
                onClick={() => setActiveTab("/team/role-access")}
                className={`block p-2 hover:bg-gray-200 rounded ${
                  activeTab === "/team/role-access" ? "bg-gray-200 text-blue-500" : ""
                }`}
              >
                Role and access
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full p-2 rounded bg-gray-400 text-white hover:bg-red-400"
        >
          {/* Logout Icon */}
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
