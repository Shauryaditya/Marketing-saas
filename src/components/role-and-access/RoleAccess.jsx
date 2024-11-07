import React from "react";
import RoleAccessTable from "./RoleAccessTable";
import BackButton from "../BackButton";
import Administrator from "../administrator/Administrator";

const RoleAccess = () => {
  return (
    <div className="">
      <BackButton />
      <div className="bg-gray-50 h-fit">
        <div className="">
          <Administrator />
        </div>
        <RoleAccessTable />
      </div>
    </div>
  );
};

export default RoleAccess;
