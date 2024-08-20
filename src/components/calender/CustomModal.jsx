import React, { useState } from "react";
import ReactDOM from "react-dom";

const CustomModal = ({ show, onClose, onSave }) => {
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [repeatUnit, setRepeatUnit] = useState("week");
  const [selectedDays, setSelectedDays] = useState([]);
  const [ends, setEnds] = useState("never");
  const [endDate, setEndDate] = useState("");
  const [occurrences, setOccurrences] = useState(13);

  if (!show) return null;

  const handleSave = () => {
    const recurrence = {
      frequency: repeatUnit,
      daysOfWeek: selectedDays,
      interval: repeatEvery,
      endDate: ends === "on" ? endDate : undefined,
      occurrences: ends === "after" ? occurrences : undefined,
    };
    if (onSave) onSave(recurrence);
    onClose();
  };

  const toggleDaySelection = (day) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays]
    );
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 text-xs bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Custom Recurrence</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-2 text-xs font-medium text-gray-700">
              Repeat every:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={repeatEvery}
                onChange={(e) => setRepeatEvery(Number(e.target.value))}
                className="w-16 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
              />
              <select
                value={repeatUnit}
                onChange={(e) => setRepeatUnit(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
              >
                <option value="day">day</option>
                <option value="week">week</option>
                <option value="month">month</option>
                <option value="year">year</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Repeat on:
            </label>
            <div className="flex text-xs space-x-2">
              {["S1", "M", "T1", "W", "T2", "F", "S2"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDaySelection(day)}
                  className={`w-5 h-5 text-xs rounded-full ${
                    selectedDays.includes(day)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {day[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-xs font-medium text-gray-700">
              Ends:
            </label>
            <div className="space-y-2">
              <div>
                <input
                  type="radio"
                  id="never"
                  name="ends"
                  value="never"
                  checked={ends === "never"}
                  onChange={() => setEnds("never")}
                  className="mr-2"
                />
                <label htmlFor="never">Never</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="onDate"
                  name="ends"
                  value="on"
                  checked={ends === "on"}
                  onChange={() => setEnds("on")}
                  className="mr-2"
                />
                <label htmlFor="onDate">On</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={ends !== "on"}
                  className="ml-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="after"
                  name="ends"
                  value="after"
                  checked={ends === "after"}
                  onChange={() => setEnds("after")}
                  className="mr-2"
                />
                <label htmlFor="after">After</label>
                <input
                  type="number"
                  value={occurrences}
                  onChange={(e) => setOccurrences(Number(e.target.value))}
                  disabled={ends !== "after"}
                  className="ml-2 w-16 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                />
                <span className="ml-2">occurrences</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CustomModal;
