import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../BackButton";
import TeamCard from "../teams/TeamCard";
import setupAxiosInterceptors from "../../AxiosInterceptor";

const TeamsList = () => {
  setupAxiosInterceptors()
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
    <div className="w-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-sm ">Teams</h1>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-4">
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

export default TeamsList;
