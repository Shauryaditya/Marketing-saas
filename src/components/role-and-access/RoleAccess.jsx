import React from "react";
import RoleAccessTable from "./RoleAccessTable";
import BackButton from "../BackButton";

const RoleAccess = () => {
  return (
    <div className="">
      <BackButton />
      <div className="bg-gray-50 h-fit">
        <RoleAccessTable />
      </div>
    </div>
  );
};

export default RoleAccess;
