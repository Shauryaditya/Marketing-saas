import React from "react";
import PropTypes from "prop-types";
import {
  FaTimes,
  FaCalendarAlt,
  FaTag,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const EventModal = ({ show, onClose, event }) => {
  if (!show || !event) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    });
  };

  const statusIcon = () => {
    switch (event.status) {
      case "completed":
        return <FaCheckCircle className="text-green-600" />;
      case "pending":
        return <FaExclamationCircle className="text-yellow-600" />;
      default:
        return <FaInfoCircle className="text-gray-600" />;
    }
  };

  return (
    <div className="fixed text-xs  inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-800 opacity-75"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 relative z-10 overflow-auto no-scrollbar max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaCalendarAlt className="mr-2 text-blue-600" />
          Event Details
        </h2>
        <div className="space-y-3">
          <div>
            <h3 className="text-gray-600 font-medium flex items-center">
              <FaTag className="mr-2 text-blue-500" />
              Title
            </h3>
            <p className="text-gray-800 text-lg">{event.title}</p>
          </div>
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <h3 className="text-gray-600 font-medium flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Start Date
              </h3>
              <p className="text-gray-800">{formatDate(event.start_date)}</p>
            </div>
            <div className="w-1/2 pl-2">
              <h3 className="text-gray-600 font-medium flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                End Date
              </h3>
              <p className="text-gray-800">{formatDate(event.end_date)}</p>
            </div>
          </div>
          <div>
            <h3 className="text-gray-600 font-medium flex items-center">
              <FaInfoCircle className="mr-2 text-blue-500" />
              Description
            </h3>
            <p className="text-gray-800">
              {event.description || "No description available."}
            </p>
          </div>
          <div>
            <h3 className="text-gray-600 font-medium flex items-center">
              <FaTag className="mr-2 text-blue-500" />
              Event Type
            </h3>
            <p className="text-gray-800">
              {event.event_type || "Not specified"}
            </p>
          </div>
          <div>
            <h3 className="text-gray-600 font-medium flex items-center">
              {statusIcon()}
              Status
            </h3>
            <p
              className={`text-lg ${
                event.status === "pending"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {event.status}
            </p>
          </div>
          {event.recurrence && (
            <div>
              <h3 className="text-gray-600 font-medium flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Recurrence
              </h3>
              <p className="text-gray-800">
                Frequency: {event.recurrence.frequency}{" "}
                {event.recurrence.interval === 1 ? "week" : "weeks"}
              </p>
              <p className="text-gray-800">
                Days of Week: {event.recurrence.daysOfWeek.join(", ")}
              </p>
              <p className="text-gray-800">
                End Date: {formatDate(event.recurrence.endDate)}
              </p>
            </div>
          )}
          {event.platforms_data && event.platforms_data.length > 0 && (
            <div>
              <h3 className="text-gray-600 font-medium flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                Platforms
              </h3>
              <div className="flex flex-wrap gap-3">
                {event.platforms_data.map((platform, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {platform.platform_logo && (
                      <img
                        src={platform.platform_logo}
                        alt={platform.platform_name}
                        className="w-4 h-4 object-cover rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">
                        {platform.platform_name}
                      </p>
                      {platform.content_types &&
                        platform.content_types.length > 0 && (
                          <ul className="list-disc list-inside text-gray-700 mt-1">
                            {platform.content_types.map((content, idx) => (
                              <li key={idx}>
                                {content.content_type} - {content.size}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

EventModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    description: PropTypes.string,
    event_type: PropTypes.string,
    status: PropTypes.string,
    recurrence: PropTypes.shape({
      frequency: PropTypes.string,
      interval: PropTypes.number,
      daysOfWeek: PropTypes.arrayOf(PropTypes.number),
      endDate: PropTypes.string,
    }),
    platforms_data: PropTypes.arrayOf(
      PropTypes.shape({
        platform_name: PropTypes.string,
        platform_logo: PropTypes.string,
        content_types: PropTypes.arrayOf(
          PropTypes.shape({
            type: PropTypes.string,
            content_type: PropTypes.string,
            size: PropTypes.string,
          })
        ),
      })
    ),
  }),
};

export default EventModal;
