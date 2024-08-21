import setupAxiosInterceptors from "../../AxiosInterceptor";
import React, { useEffect, useState } from "react";
import axios from "axios";
import RoleAccessModal from "./RoleAccessModal";

const RoleAccessTable = () => {
  setupAxiosInterceptors();
  const [people, setPeople] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null); // Store the selected person

  const handleRoleAccessModal = (person) => {
    setSelectedPerson(person); // Set the selected person
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPerson(null); // Reset the selected person when closing the modal
  };

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
    <div>
      <div className="relative px-4 pt-2">
        <h1 className="text-base font-semibold py-4">Role & Access</h1>
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-200 text-xs font-normal rounded-xl">
            <tr>
              <th
                scope="col"
                className="px-2 py-3 whitespace-nowrap rounded-tl-xl"
              >
                Sl No
              </th>
              <th scope="col" className="px-2 py-3 whitespace-nowrap">
                Employee's Name
              </th>
              <th scope="col" className="px-2 py-3 whitespace-nowrap">
                Department
              </th>
              <th scope="col" className="px-2 py-3 whitespace-nowrap">
                Sub Department
              </th>
              <th scope="col" className="px-2 py-3 whitespace-nowrap">
                Designation
              </th>
              <th scope="col" className="px-2 py-3 whitespace-nowrap">
                Email
              </th>
              <th
                scope="col"
                className="px-2 py-3 whitespace-nowrap "
              >
                Mobile Number
              </th>
              <th
                scope="col"
                className="px-2 py-3 whitespace-nowrap "
              >
                Login Access
              </th>
              <th
                scope="col"
                className="px-2 py-3 whitespace-nowrap rounded-tr-xl"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {people.length > 0 ? (
              people.map((person, index) => (
                <tr key={person.id} className="border-b">
                  <td className="px-2 py-3 whitespace-nowrap bg-white">
                    {index + 1}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap bg-white">
                    {person.name}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap bg-white">
                    {person.department_name}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap bg-white">
                    {person.sub_department_name}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap bg-white">
                    {person.designation_name}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap bg-white">
                    {person.email}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap bg-white">
                    {person.mobile}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap bg-white">
                    <div className="flex items-center gap-x-2 ml-2">
                      <button onClick={() => handleRoleAccessModal(person)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-4 h-4 text-blue-400"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                          />
                        </svg>
                      </button>
                      {showModal && selectedPerson && (
                        <RoleAccessModal
                          isOpen={showModal}
                          onClose={handleClose}
                          people={selectedPerson}
                          emp_id={selectedPerson.emp_id}
                        />
                      )}
                      <button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-4 h-4 text-blue-400"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap bg-white">
                    <p className="px-2 text-green-600 bg-green-50 text-center rounded-sm">
                      Active
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleAccessTable;
