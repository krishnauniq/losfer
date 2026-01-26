import React, { useState, useEffect, useRef } from 'react';

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DatePicker({ label, value, onChange, max, required, className, align = 'left' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date()); // For navigation
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
    const containerRef = useRef(null);

    // Sync internal state with external value prop
    useEffect(() => {
        if (value) {
            const date = new Date(value);
            setSelectedDate(date);
            setCurrentDate(date);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePrevMonth = (e) => {
        e.preventDefault();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = (e) => {
        e.preventDefault();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Correct for timezone offset to ensure YYYY-MM-DD matches local selection
        const offset = newDate.getTimezoneOffset();
        const localDate = new Date(newDate.getTime() - (offset * 60 * 1000));

        const dateString = localDate.toISOString().split('T')[0];

        if (max && dateString > max) return; // Prevent future dates if max is set

        setSelectedDate(newDate);
        onChange({ target: { value: dateString } }); // Mock event object for parent handler
        setIsOpen(false);
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const isSelected = (day) => {
        return selectedDate &&
            day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear();
    };

    const isDisabled = (day) => {
        if (!max) return false;
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Correct for timezone offset for comparison
        const offset = checkDate.getTimezoneOffset();
        const localCheckDate = new Date(checkDate.getTime() - (offset * 60 * 1000));
        const dateString = localCheckDate.toISOString().split('T')[0];
        return dateString > max;
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const disabled = isDisabled(day);
            const selected = isSelected(day);
            const today = isToday(day);

            days.push(
                <button
                    key={day}
                    onClick={(e) => { e.preventDefault(); !disabled && handleDateClick(day); }}
                    disabled={disabled}
                    className={`
                        h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                        ${selected
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 font-bold scale-110'
                            : disabled
                                ? 'text-surface-300 dark:text-surface-600 cursor-not-allowed'
                                : 'text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-primary-600'
                        }
                        ${today && !selected ? 'border-2 border-primary-500 text-primary-600 font-bold' : ''}
                    `}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2 uppercase tracking-wider">
                    {label} {required && <span className="text-error-500">*</span>}
                </label>
            )}

            {/* Input Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full px-4 py-3 bg-surface-50 dark:bg-surface-800 border-2 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-300
                    ${isOpen ? 'border-primary-500 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'}
                `}
            >
                <span className={`font-medium ${value ? 'text-surface-900 dark:text-white' : 'text-surface-400'}`}>
                    {value ? new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select Date'}
                </span>
                <span className="text-xl text-surface-400">📅</span>
            </div>

            {/* Calendar Popover */}
            {isOpen && (
                <div className={`absolute top-full mt-2 w-80 bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-surface-200 dark:border-surface-700 p-5 z-50 animate-in fade-in zoom-in-95 duration-200 ${align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'}`}>
                    {/* Decorative Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full text-surface-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h4 className="font-bold text-lg text-surface-900 dark:text-white">
                            {months[currentDate.getMonth()]} <span className="text-primary-500">{currentDate.getFullYear()}</span>
                        </h4>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full text-surface-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {daysOfWeek.map(day => (
                            <div key={day} className="text-center text-xs font-bold text-surface-400 uppercase">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                    </div>

                    <div className="mt-4 pt-3 border-t border-surface-100 dark:border-surface-800 flex justify-between items-center">
                        <button
                            onClick={(e) => { e.preventDefault(); onChange({ target: { value: '' } }); setIsOpen(false); }}
                            className="text-xs font-bold text-surface-400 hover:text-error-500 transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                const today = new Date().toISOString().split('T')[0];
                                onChange({ target: { value: today } });
                                setCurrentDate(new Date()); // Also jump view to today
                                setIsOpen(false);
                            }}
                            className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
