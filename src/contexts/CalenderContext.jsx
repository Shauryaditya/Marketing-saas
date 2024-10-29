import { createContext, useContext, useState, useEffect, useMemo } from "react";
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
    subDays
} from "date-fns";
export const CalenderContext = createContext();

export const CalenderProvider = ({ children }) => {
    const [brandName, setBrandName] = useState(null)
    const [currentDate, setCurrentDate] = useState(startOfToday());
    const [view, setView] = useState("month");
    const [showNewEventModal, setShowNewEventModal] = useState(false);
    const handleDateClick = (date) => {
        setCurrentDate(date);
    };

    const handleTodayClick = () => {
        console.log('today got clicked');
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
        console.log('next prev button clicked', newDate);
        setCurrentDate(newDate);
    };

    // Extract values from context outside of useMemo
    const contextValue = { currentDate, setCurrentDate, handleDateClick, handleTodayClick, handleNavigationClick, view, setView, setShowNewEventModal, showNewEventModal,setBrandName,brandName };

    // Memoize the context value to prevent unnecessary re-renders of consumers
    const memoizedValue = useMemo(() => contextValue, [contextValue]);
    return (
        <CalenderContext.Provider
            value={memoizedValue}
        >
            {children}
        </CalenderContext.Provider>
    );
};

export const useCalenderContext = () => {
    return useContext(CalenderContext);
};
