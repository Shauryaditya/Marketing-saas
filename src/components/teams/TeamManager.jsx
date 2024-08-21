import React, { useEffect, useState } from "react";
import TeamMembersTable from "./TeamMembersTable";
import BrandTable from "./BrandTable";
import AddMemberModal from "./AddMemberModal";
import { useParams } from "react-router-dom";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import axios from "axios";

const TeamManager = () => {
  const {id} = useParams()
  setupAxiosInterceptors()
  const [teamMembers, setTeamMembers] = useState([])
  const [teams, setTeams] = useState([])
  const [manager,setManager] = useState([])
  const [members,setMembers] = useState([])
  const [showModal, setShowModal] = useState(false);

  const handleAddMembers = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`/v1/team/members/get/${id}`);
        // Handle the response data as needed
        const teamMembers = response.data;
        console.log("Fetched team members:", teamMembers);
        setTeamMembers(teamMembers);
        setManager(teamMembers.manager)
        setMembers(teamMembers.members)
  
        // Update state or perform other actions with the fetched data
        // setTeamMembers(teamMembers); // Example: setting team members in state
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };
  
    fetchTeamMembers();
  }, [id]); // Include 'id' in the dependency array if 'id' is a dynamic value

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`/v1/team/get/${id}`);
        setTeams(response.data.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  console.log("Team Members>>???",teamMembers)
  
  return (
    <div className="bg-gray-50 h-full pb-4">
        <div className="flex justify-between px-4">
            <div className="flex items-center gap-x-3">
            <h1 className="text-sm font-semibold">Team Name</h1>
            <p className="text-sm font-normal">{teamMembers.team_name}</p>
            </div>
            <div className="">
                <button className="text-xs text-white bg-blue-800 px-4 py-1 rounded-sm" onClick={handleAddMembers}>+Add Member</button>
            </div>
          {
            showModal && (
              <AddMemberModal
              team={teams}
              onClose={handleClose}
              />
            )
          }
        </div>
        <div className="flex mx-4 gap-x-4 my-4">
            <div className="flex items-center">
                <h1 className="text-sm font-semibold">Team Manager</h1> 
            </div>
            <div className="max-w-xs rounded-lg shadow-lg p-4 bg-white flex flex-1 flex-col justify-start">
            <div className="text-start ">
              <h2 className="text-xs font-semibold text-gray-800">
                {manager.name}
              </h2>
              <p className="text-xs text-gray-500">{manager.email}</p>
              <div className="flex">
                <span className="text-xs font-medium">Mobile No :</span>
                <span className="text-xs">{manager.phone}</span>
              </div>
            </div>
            </div>
        </div>
      <div className="mx-auto mt-2">
        <TeamMembersTable members={members}/>
      </div>
      <div className="mx-auto mt-2 mb-4">
        <BrandTable />
      </div>
    </div>
  );
};

export default TeamManager;
