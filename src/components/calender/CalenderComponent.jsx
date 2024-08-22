import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
  startOfToday,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalenderComponent.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import NewEventModal from "./NewEventModal";
import Sidebar from "./Sidebar";
import CustomToolbar from "./CustomToolbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import setupAxiosInterceptors from "../../AxiosInterceptor";
import EventModal from "./EventModal";

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
  const [events, setEvents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const [view, setView] = useState("month");
  const { id: brandId } = useParams();

  const fetchEvents = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const response = await axios.get(
        `/v1/task/currect/month?brand_id=${brandId}&year=${year}&month=${month}`
      );
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

  const handleSaveEvent = async () => {
    if (selectedEvent.id) {
      try {
        await axios.put(`/v1/task/add/${selectedEvent.id}`, selectedEvent);
        setEvents(
          events.map((event) =>
            event.id === selectedEvent.id ? selectedEvent : event
          )
        );
      } catch (error) {
        console.error("Error updating event:", error);
      }
    } else {
      try {
        const response = await axios.post(`/v1/task/add`, selectedEvent);
        setEvents([...events, { ...selectedEvent, id: response.data.id }]);
      } catch (error) {
        console.error("Error creating event:", error);
      }
    }
    handleModalClose();
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`/v1/events/${selectedEvent.id}`);
      setEvents(events.filter((event) => event.id !== selectedEvent.id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
    handleModalClose();
  };

  const handleEventClick = async (event) => {
    try {
      const response = await axios.get(`/v1/task/get/${event.id}`);
      const eventData = response.data;

      setSelectedEvent({
        id: eventData._id,
        title: eventData.title,
        start_date: eventData.start_date, // Use the raw date string
        end_date: eventData.end_date, // Use the raw date string
        color: eventData.color,
        description: eventData.description,
        event_type: eventData.event_type,
        status: eventData.status,
        recurrence: eventData.recurrence,
        platforms_data: eventData.platforms_data,
      });

      setShowEventModal(true);
    } catch (error) {
      console.error("Error fetching event details:", error.message);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({
      id: null,
      title: "",
      start,
      end,
      color: "#FFEBCC",
    });
    setShowNewEventModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setShowNewEventModal(false);
    setSelectedEvent(null);
  };

  const handleEventChange = (e) => {
    setSelectedEvent({ ...selectedEvent, [e.target.name]: e.target.value });
  };

  const moveEvent = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    setEvents(events.map((e) => (e.id === event.id ? updatedEvent : e)));
  };

  const handleDateClick = (date) => {
    setCurrentDate(date);
  };

  const handleTodayClick = () => {
    setCurrentDate(startOfToday());
  };

  const handleNavigationClick = (type, direction) => {
    let newDate;
    if (type === "day") {
      newDate =
        direction === "next"
          ? addDays(currentDate, 1)
          : subDays(currentDate, 1);
    } else if (type === "week") {
      newDate =
        direction === "next"
          ? addWeeks(currentDate, 1)
          : subWeeks(currentDate, 1);
    } else if (type === "month") {
      newDate =
        direction === "next"
          ? addMonths(currentDate, 1)
          : subMonths(currentDate, 1);
    }
    setCurrentDate(newDate);
  };

  const handleBackClick = () => {
    handleNavigationClick(view, "back");
  };

  const handleNextClick = () => {
    handleNavigationClick(view, "next");
  };

  useEffect(() => {
    console.log("showEditModal:", showEditModal);
    console.log("showNewEventModal:", showNewEventModal);
  }, [showEditModal, showNewEventModal]);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <Sidebar onDateClick={handleDateClick} />
        <div className="flex-1 p-4">
          <div className="flex justify-between">
            <button onClick={handleTodayClick} className="button">
              Today
            </button>
            <div className="flex">
              <button onClick={handleBackClick} className="button mr-2">
                Back
              </button>
              <button onClick={handleNextClick} className="button">
                Next
              </button>
            </div>
          </div>
          <div style={{ height: "calc(100vh - 4rem)" }}>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "98%" }}
              className="custom-calendar"
              components={{
                toolbar: (props) => (
                  <CustomToolbar
                    label={props.label}
                    onNavigate={(direction) => {
                      props.onNavigate(direction);
                      if (direction === "NEXT") handleNextClick();
                      if (direction === "PREV") handleBackClick();
                    }}
                    onView={(newView) => {
                      props.onView(newView);
                      handleViewChange(newView);
                    }}
                  />
                ),
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
              }}
              onEventDrop={({ event, start, end }) =>
                moveEvent({ event, start, end })
              }
              resizable
              selectable
              onSelectSlot={handleSelectSlot}
              date={currentDate}
              view={view}
              onView={setView}
            />
          </div>
        </div>
      </div>
      <NewEventModal
        show={showNewEventModal || showEditModal}
        onClose={handleModalClose}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        onChange={handleEventChange}
      />
      <EventModal
        show={showEventModal}
        onClose={() => setShowEventModal(false)}
        event={selectedEvent}
      />
    </DndProvider>
  );
};

export default CalendarComponent;
