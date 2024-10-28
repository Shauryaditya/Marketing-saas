import React, { useState, useEffect, useMemo } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, add } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalenderComponent.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import NewEventModal from "./NewEventModal"; // Import NewEventModal
import Sidebar from "./Sidebar";
import CustomToolbar from "./CustomToolbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import { useCalenderContext } from "../../contexts/CalenderContext";
import DetailedUploadModal from "./DetailedUploadModal";

setupAxiosInterceptors();

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent = () => {
  const {
    currentDate,
    view,
    setView,
    setShowNewEventModal,
    showNewEventModal,
    setBrandName,
    brandName
  } = useCalenderContext();
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { id: brandId } = useParams();

  const fetchEvents = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const response = await axios.get(
        `/v1/task/currect/month?brand_id=${brandId}&year=${year}&month=${month}`
      );

      // Extract brand_name from the response data
      const { brand_name } = response.data;

      // Set brand name state
      setBrandName(brand_name);
      const apiEvents = response.data.data.map((event) => ({
        id: event._id,
        title: event.title,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        color: event.color,
        description: event.description,
        eventType: event.event_type,
      }));
      setEvents(apiEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate, view]);

  const handleEventClick = async (event) => {
    try {
      const response = await axios.get(`/v1/task/get/${event.id}`);
      const eventData = response.data;

      // Set selected event with necessary properties including the _id
      setSelectedEvent({
        id: eventData._id,
        title: eventData.title,
        eventId: eventData.eventId,
        start: eventData.start_date,
        end: eventData.end_date,
        color: eventData.color,
        description: eventData.description,
        event_type: eventData.event_type,
        status: eventData.status,
        recurrence: eventData.recurrence,
        platforms_data: eventData.platforms_data,
      });

      setShowEventModal(true); // Open DetailedUploadModal
    } catch (error) {
      console.error("Error fetching event details:", error.message);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    // Open NewEventModal on slot select
    setSelectedEvent({
      id: null,
      title: "",
      start,
      end,
      color: "#FFEBCC", // Default color for new events
    });
    setShowNewEventModal(true);
  };

  const handleModalClose = () => {
    setShowEventModal(false);
    setShowNewEventModal(false); // Close NewEventModal
    setSelectedEvent(null);
    fetchEvents(); // Fetch events to refresh the calendar
  };

  const moveEvent = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    setEvents(events.map((e) => (e.id === event.id ? updatedEvent : e)));
  };

  const { components, defaultDate } = useMemo(
    () => ({
      components: {
        toolbar: CustomToolbar,
        event: (props) => (
          <div
            style={{
              padding: "2px",
              borderRadius: "2px",
              color: "#fff",
              border: "none",
              outline: "none",
            }}
            onClick={() => handleEventClick(props.event)}
          >
            {props.event.title}
          </div>
        ),
      },
      defaultDate: new Date(),
    }),
    []
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-4">
          <div style={{ height: "calc(100vh - 2rem)" }}>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "98%" }}
              className="custom-calendar"
              defaultDate={defaultDate}
              components={components}
              onEventDrop={({ event, start, end }) =>
                moveEvent({ event, start, end })
              }
              resizable
              selectable
              onSelectSlot={handleSelectSlot} // Handle slot selection
              date={currentDate}
              view={view}
              onView={setView}
            />
          </div>
        </div>
      </div>

      {/* New Event Modal */}
      <NewEventModal
        show={showNewEventModal} // Control visibility
        onClose={handleModalClose} // Close modal function
        event={selectedEvent} // Pass the selected event to the modal
        type="add"
      />

      {/* Detailed Event Modal */}
      <DetailedUploadModal
        show={showEventModal}
        onClose={handleModalClose}
        event={selectedEvent} // Pass selected event to modal
      />
    </DndProvider>
  );
};

export default CalendarComponent;
