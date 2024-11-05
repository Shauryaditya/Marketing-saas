import { format } from "date-fns";
import { useCalenderContext } from "../../contexts/CalenderContext";
function CustomToolbar() {
  const {
    handleTodayClick,
    handleNavigationClick,
    currentDate,
    view,
    setView,
    setShowNewEventModal,
    brandName,
  } = useCalenderContext();
  return (
    <div className="flex justify-between items-center mb-3 ">
      <div className="text-2xl flex items-center">
        <span className="font-bold">
          {currentDate.toLocaleString("default", { month: "long" })}
        </span>
        <span className="ml-2">{currentDate.getFullYear()}</span>

        <span
          onClick={() => setShowNewEventModal(true)}
          className="ml-5 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </span>
      </div>
      <div className="flex justify-center ">
        <button
          className={`${
            view === "month" ? "bg-gray-100" : "bg-white"
          } py-1 px-4  border rounded text-xs`}
          onClick={() => setView("month")}
        >
          Month
        </button>
        <button
          className={`${
            view === "week" ? "bg-gray-100" : "bg-white"
          } py-1 px-4 border rounded text-xs`}
          onClick={() => setView("week")}
        >
          Week
        </button>
        <button
          className={`${
            view === "day" ? "bg-gray-100" : "bg-white"
          } py-1 px-4  border rounded text-xs `}
          onClick={() => setView("day")}
        >
          Day
        </button>
      </div>
      <div className="text-[#265985] text-xl font-semibold capitalize">
        {brandName}
      </div>
      <div className="flex justify-center items-end space-x-1">
        <button
          className="bg-white rounded-sm shadow-md py-0.5 px-1"
          onClick={() => handleTodayClick()}
        >
          Today
        </button>
        <button
          onClick={() => handleNavigationClick(view, "back")}
          className="bg-white rounded-sm shadow-md py-0.5 px-1"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </span>
        </button>

        <button
          className="bg-white rounded-sm shadow-md py-0.5 px-1"
          onClick={() => handleNavigationClick(view, "next")}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

export default CustomToolbar;
