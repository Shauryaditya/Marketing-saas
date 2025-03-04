import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <div className="h-screen border-right top-0 sticky overflow-y-auto no-scrollbar pr-8">
        <Sidebar />
      </div>
      <div className="w-full pt-16 border-l">
        {" "}
        {/* Add pt-16 to offset the fixed navbar */}
        <Navbar />
        <div className="flex-1 p-2">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
