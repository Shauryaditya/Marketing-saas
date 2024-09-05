import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles
import { useCalenderContext } from "../../contexts/CalenderContext";
import './CalenderComponent.css'
const Sidebar = () => {
  const { setCurrentDate, setView } = useCalenderContext()
  return (
    <div className="w-[15%]  flex items-end text-xs bg-custom-gradient border-r h-full">
      {/* <h2 className="text-base mb-4">Mini Calendar</h2> */}
      <Calendar
        onClickDay={(date) => {
          setCurrentDate(date)
          setView('day')
        }}
        className="my-calender-style" // Add your custom class
      />
    </div>
  );
};

export default Sidebar;
