import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import ActivityTable from "./ActivityTable";
import TeamsList from "./TeamsList";
import TaskList from "./TaskList";
import BrandTable from "./BrandList";

const Dashboard = () => {
  return (
    <div className="w-full bg-gray-100 h-fit p-2">
      <div className="flex justify-between">
        <h1 className="text-sm font-semibold">Dashboard</h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="border text-xs px-4 bg-white text-sky-800 rounded outline-0">
            New Brand
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Brands</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Brand 1</DropdownMenuItem>
            <DropdownMenuItem>Brand 2</DropdownMenuItem>
            <DropdownMenuItem>Brand 3</DropdownMenuItem>
            <DropdownMenuItem>Brand 4</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-x-4">
        <div className="w-2/3 mt-2 ">
          <ActivityTable />
          <div className="w-full flex mt-2 justify-between">
            <TeamsList />
            <BrandTable />
          </div>
        </div>
        <div className="w-1/3 mt-2">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
