import React, { useEffect, useState } from "react";
import AddPeopleModal from "./AddPeopleModal";
import EmployeeCard from "./EmployeeCard";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import axios from "axios";
import BackButton from "../BackButton";

const People = () => {
  setupAxiosInterceptors();
  const [showModal, setShowModal] = useState(false);
  const [people, setPeople] = useState([]);

  const handleAddPeople = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const fetchPeople = async () => {
    try {
      const response = await axios.get(`/v1/people/get`, {
        params: {
          page: 1,
          limit: 100,
          order: "desc",
          sort: "createdAt",
        },
      });

      // Handle the response data
      const people = response.data.data;
      setPeople(people);
      console.log("Fetched people:", people);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <div className="">
      <BackButton />
      <div className="w-full bg-gray-100 h-fit p-2">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h1 className="text-sm font-bold">People</h1>
            <p className="text-xs">Here is a list of people</p>
          </div>
          <div onClick={handleAddPeople}>
            <button className="px-3 py-1 text-white bg-blue-700 rounded-md text-xs">
              +Add people
            </button>
          </div>
          {showModal && <AddPeopleModal onClose={handleClose} />}
        </div>
        <div className="grid grid-cols-4 gap-4 mt-2">
          {people.length > 0 ? (
            people.map((person) => (
              <EmployeeCard
                key={person._id} // Assuming each person object has a unique 'id'
                person={person} // Pass the person data as a prop to EmployeeCard
              />
            ))
          ) : (
            <p className="text-sm text-gray-600">No people found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default People;
