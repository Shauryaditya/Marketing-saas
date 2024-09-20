import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const Dashboard = () => {
  return (
    <div className="w-full bg-gray-100 h-fit p-2">
      <div className="flex justify-between">
        <h1 className="text-sm font-semibold">Dashboard</h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="border text-xs px-4 bg-white text-sky-800 rounded outline-0">New Brand</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Dashboard;
