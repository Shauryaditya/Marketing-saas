import React from "react";

const ActivityTable = () => {
  const data = [
    { brand: "21GenX", socialMedia: "Done", designer: "Working", writer: "Delay" },
    { brand: "21GenX", socialMedia: "Done", designer: "Working", writer: "Delay" },
    { brand: "21GenX", socialMedia: "Done", designer: "Working", writer: "Delay" },
    { brand: "21GenX", socialMedia: "Done", designer: "Working", writer: "Delay" },
    { brand: "21GenX", socialMedia: "Done", designer: "Working", writer: "Delay" },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-600 px-2 py-1 rounded";
      case "Working":
        return "bg-yellow-100 text-yellow-600 px-2 py-1 rounded";
      case "Delay":
        return "bg-red-100 text-red-600 px-2 py-1 rounded";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Activity</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className=" ">
            <th className="p-3 border-b text-sm text-gray-300 font-normal text-left">BRAND</th>
            <th className="p-3 border-b text-sm text-gray-300 font-normal text-center">SOCIAL MEDIA</th>
            <th className="p-3 border-b text-sm text-gray-300 font-normal text-center">GRAPHIC DESIGNER</th>
            <th className="p-3 border-b text-sm text-gray-300 font-normal text-center">CONTENT WRITER</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="text-gray-700 text-sm">
              <td className="p-3 border-b text-xs">{row.brand}</td>
              <td className="p-3 border-b text-center text-xs">
                <span className={getStatusClass(row.socialMedia)}>{row.socialMedia}</span>
              </td>
              <td className="p-3 border-b text-center text-xs">
                <span className={getStatusClass(row.designer)}>{row.designer}</span>
              </td>
              <td className="p-3 border-b text-center text-xs">
                <span className={getStatusClass(row.writer)}>{row.writer}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
