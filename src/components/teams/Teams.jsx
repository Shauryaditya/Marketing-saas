import React, { useEffect, useState } from "react";
import AddTeamModal from "./AddTeamModal";
import TeamCard from "./TeamCard";
import { useNavigate } from "react-router-dom";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import axios from "axios";
import BackButton from "../BackButton";

const Teams = () => {
  setupAxiosInterceptors();
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleAddTeams = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`/v1/team/get`);
        setTeams(response.data.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  console.log("Teams>>???", teams);

  return (
    <div className="">
      <BackButton />
    <div className="w-full bg-gray-100 h-screen p-2">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-sm font-bold">Teams</h1>
          <p className="text-xs">Here is a list of Teams</p>
        </div>
        <div className="" onClick={() => handleAddTeams()}>
          <button className="px-3 py-1 text-white bg-blue-700 rounded-md text-xs">
            +Add Teams
          </button>
        </div>
        {showModal && <AddTeamModal onClose={handleClose} />}
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {teams.map((team) => (
          <div key={team._id} className="cursor-pointer">
            <TeamCard team={team} />
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Teams;
