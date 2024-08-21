import React, { useState, useEffect } from "react";
import axios from "axios";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import toast from "react-hot-toast";

const AddMemberModal = ({ onClose, team }) => {
  setupAxiosInterceptors();
  const { _id } = team; // Assuming team object contains the team ID
  const [people, setPeople] = useState([]);
  const [persons, setPersons] = useState([{ member_id: "", reporting_id: "" }]);
  const [manager, setManager] = useState("");

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(`/v1/people/get`, {
          params: {
            page: 1,
            limit: 10,
            order: "desc",
            sort: "createdAt",
          },
        });

        setPeople(response.data.data);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    const fetchExistingMembers = async () => {
      try {
        const response = await axios.get(`/v1/team/members/get/${_id}`);
        const existingTeam = response.data;
        console.log("Existing Team>>??",existingTeam.members)
        if (existingTeam.manager) {
          setManager(existingTeam.manager._id); // Assuming manager has an _id field
        }

        const existingMembers = existingTeam.members.map((member) => ({
          
          member_id: member.member._id, // Assuming each member has an _id
          reporting_id: member.reporting._id, // Assuming each member has a reporting_id
        }));

        setPersons(existingMembers);
      } catch (error) {
        console.error("Error fetching existing team members:", error);
      }
    };

    fetchPeople();
    fetchExistingMembers();
  }, [_id]);

  const handleAddPerson = () => {
    setPersons([...persons, { member_id: "", reporting_id: "" }]);
  };

  const handlePersonChange = (index, field, value) => {
    const updatedPersons = [...persons];
    updatedPersons[index][field] = value;
    setPersons(updatedPersons);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teamMembers = persons.map((person) => {
      return {
        member_id: person.member_id,
        reporting_id: person.reporting_id,
      };
    });

    const requestBody = {
      team_id: _id,
      manager_id: manager,
      team_members: teamMembers,
    };

    try {
      const response = await axios.post(`/v1/team/members/add`, requestBody);
      console.log("Response:", response.data);
      toast.success(response.data.message);
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to add members");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex text-xs items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-2xl font-semibold">Add Member</h2>
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
          <div className="flex flex-col text-left gap-4 mb-6 p-4">
            <div className="flex items-center gap-x-2">
              <label className="block w-1/5 text-xs font-medium text-gray-700">
                Team Manager
              </label>
              <select
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="mt-1 p-2 grow block bg-gray-50 border-none rounded-md shadow-sm focus:ring-0"
              >
                <option value="">Select Manager</option>
                {people.map((personOption) => (
                  <option key={personOption._id} value={personOption._id}>
                    {personOption.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-x-36">
              <label className="block text-xs font-medium text-gray-700">
                Add People
              </label>
              <label className="block text-xs font-medium text-gray-700">
                Reporting
              </label>
            </div>
            {persons.map((person, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-2"
              >
                <div className="flex flex-col w-1/2">
                  <select
                    value={person.member_id}
                    onChange={(e) =>
                      handlePersonChange(index, "member_id", e.target.value)
                    }
                    className="mt-1 p-2 bg-gray-50 block w-full border-none rounded-md shadow-sm focus:ring-0"
                  >
                    <option value="">Select Person</option>
                    {people.map((personOption) => (
                      <option key={personOption._id} value={personOption._id}>
                        {personOption.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col w-1/2">
                  <select
                    value={person.reporting_id}
                    onChange={(e) =>
                      handlePersonChange(index, "reporting_id", e.target.value)
                    }
                    className="mt-1 p-2 bg-gray-50 block w-full border-none rounded-md shadow-sm focus:ring-0"
                  >
                    <option value="">Select Reporting Person</option>
                    {people.map((reportingOption) => (
                      <option
                        key={reportingOption._id}
                        value={reportingOption._id}
                      >
                        {reportingOption.name}
                      </option>
                    ))}
                  </select>
                </div>
                {index === persons.length - 1 && (
                  <button
                    type="button"
                    onClick={handleAddPerson}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-x-3 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white rounded-lg shadow-md hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
