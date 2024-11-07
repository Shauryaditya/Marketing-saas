import React from "react";
import AddRoleModal from "./AddRoleModal";
import { DeleteDialogue } from "./DeleteAlertDialogue";

const RoleCard = ({ roleName, accounts, roleId, onClick,onDeleteSuccess }) => (
  <div
    className="flex flex-col items-start p-2 border rounded-lg shadow-sm w-40 bg-white shrink-0"
    onClick={() => onClick(roleId)}
  >
    <div className="flex items-center space-x-8">
      <span className="text-xs text-gray-500">{accounts} ACCOUNTS</span>
      <div className="flex items-center space-x-2">
        <AddRoleModal roleId={roleId} initialRoleName={roleName} />
        <DeleteDialogue roleId={roleId}  onDeleteSuccess={onDeleteSuccess}/>
      </div>
    </div>

    <p className="text-sm font-semibold text-gray-800 mb-1">{roleName}</p>
    <div className="">
      
    </div>
  </div>
);

export default RoleCard;
