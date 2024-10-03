import React, { useEffect } from "react";

const ActivityTable = ({ tasks, error, fetchTasks }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-600 px-2 py-1 rounded";
      case "pending":
        return "bg-yellow-100 text-yellow-600 px-2 py-1 rounded";
      case "delay":
        return "bg-red-100 text-red-600 px-2 py-1 rounded";
      default:
        return "";
    }
  };

  useEffect(() => {
    fetchTasks()
  },[])
  console.log("Tasks passed to activity table",tasks)
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Activity</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="p-3 border-b text-sm text-gray-300 font-normal text-left">BRAND</th>
              <th className="p-3 border-b text-sm text-gray-300 font-normal text-center">SOCIAL MEDIA</th>
              <th className="p-3 border-b text-sm text-gray-300 font-normal text-center">GRAPHIC DESIGNER</th>
              <th className="p-3 border-b text-sm text-gray-300 font-normal text-center">CONTENT WRITER</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((item, index) => (
              <tr key={item._id || index} className="text-gray-700 text-sm">
                <td className="p-3 border-b text-xs">{item.brand_name}</td>
                <td className="p-3 border-b text-center text-xs">
                  <span className={getStatusClass(item.sm_status)}>{item.sm_status}</span>
                </td>
                <td className="p-3 border-b text-center text-xs">
                  <span className={getStatusClass(item.gd_status)}>{item.gd_status}</span>
                </td>
                <td className="p-3 border-b text-center text-xs">
                  <span className={getStatusClass(item.cw_status)}>{item.cw_status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActivityTable;
