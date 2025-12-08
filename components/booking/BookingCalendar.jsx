'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const DURATION_OPTIONS = [
    { value: 1, label: '1 hour' },
    { value: 2, label: '2 hours' },
    { value: 3, label: '3 hours' },
    { value: 4, label: '4 hours' },
    { value: 5, label: '5 hours' },
    { value: 6, label: '6 hours' },
    { value: 7, label: '7 hours' },
    { value: 8, label: '8 hours' },
    { value: 24, label: 'Full day' },
];

const BookingCalendar = ({ onSlotSelect, selectedSlot }) => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [duration, setDuration] = useState(1);

    const fetchAvailabilityForMonth = useCallback(async (year, month) => {
        try {
            setLoading(true);
            setError(null);
            // month is 0-indexed in JS, but our API expects 1-indexed
            const response = await fetch(`${BACKEND_URL}/api/availability?year=${year}&month=${month + 1}`);
            if (!response.ok) {
                throw new Error('Failed to fetch availability');
            }
            const data = await response.json();
            setAvailability(data.days || []);
            setSelectedDate(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAvailabilityForMonth(currentYear, currentMonth);
    }, [currentYear, currentMonth, fetchAvailabilityForMonth]);

    const selectedDaySlots = availability.find(day => day.date === selectedDate)?.slots || [];

    // Filter slots that have enough consecutive hours available
    const availableStartSlots = useMemo(() => {
        if (duration === 1) {
            return selectedDaySlots;
        }

        const validStartSlots = [];
        for (let i = 0; i < selectedDaySlots.length; i++) {
            let hasEnoughSlots = true;
            for (let j = 0; j < duration; j++) {
                if (i + j >= selectedDaySlots.length) {
                    hasEnoughSlots = false;
                    break;
                }
                if (j > 0) {
                    const prevEnd = new Date(selectedDaySlots[i + j - 1].end).getTime();
                    const currStart = new Date(selectedDaySlots[i + j].start).getTime();
                    if (prevEnd !== currStart) {
                        hasEnoughSlots = false;
                        break;
                    }
                }
            }
            if (hasEnoughSlots) {
                validStartSlots.push({
                    start: selectedDaySlots[i].start,
                    end: selectedDaySlots[i + duration - 1].end
                });
            }
        }
        return validStartSlots;
    }, [selectedDaySlots, duration]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric'
        });
    };

    const formatMonthYear = (month, year) => {
        const date = new Date(year, month);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const isSlotSelected = (slot) => {
        return selectedSlot &&
               selectedSlot.start === slot.start &&
               selectedSlot.end === slot.end;
    };

    const handleSlotClick = (slot, date) => {
        onSlotSelect({
            ...slot,
            date: date,
            duration: duration
        });
    };

    const goToPrevMonth = () => {
        const now = new Date();
        // Don't go before current month
        if (currentYear === now.getFullYear() && currentMonth === now.getMonth()) {
            return;
        }
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const canGoPrev = () => {
        const now = new Date();
        return !(currentYear === now.getFullYear() && currentMonth === now.getMonth());
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-color)]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-400">
                <p>Error loading availability: {error}</p>
                <button
                    onClick={() => fetchAvailabilityForMonth(currentYear, currentMonth)}
                    className="mt-4 px-4 py-2 bg-[var(--accent-color)] text-black rounded-lg hover:opacity-80 transition-opacity"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Duration Selection */}
            <div>
                <h3 className="text-lg font-medium mb-3 text-gray-200">Session Duration</h3>
                <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setDuration(option.value);
                                onSlotSelect(null);
                            }}
                            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                                duration === option.value
                                    ? 'bg-[var(--accent-color)] text-black border-[var(--accent-color)]'
                                    : 'bg-zinc-900/50 text-gray-300 border-zinc-700 hover:border-[var(--accent-color)]'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={goToPrevMonth}
                    disabled={!canGoPrev()}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                        canGoPrev()
                            ? 'text-gray-300 hover:bg-zinc-800 hover:text-[var(--accent-color)]'
                            : 'text-zinc-700 cursor-not-allowed'
                    }`}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <h2 className="text-xl font-medium text-gray-200">
                    {formatMonthYear(currentMonth, currentYear)}
                </h2>

                <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-lg transition-all duration-200 text-gray-300 hover:bg-zinc-800 hover:text-[var(--accent-color)]"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Date Selection */}
            <div>
                <h3 className="text-lg font-medium mb-3 text-gray-200">Select a Date</h3>
                {availability.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No available dates in this month.</p>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const container = document.getElementById('dates-container');
                                if (container) {
                                    container.scrollBy({ left: -200, behavior: 'smooth' });
                                }
                            }}
                            className="flex-shrink-0 p-2 rounded-lg transition-all duration-200 text-gray-300 hover:bg-zinc-800 hover:text-[var(--accent-color)]"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div id="dates-container" className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scroll-smooth">
                            {availability.map((day) => (
                                <button
                                    key={day.date}
                                    onClick={() => setSelectedDate(day.date)}
                                    className={`flex-shrink-0 px-4 py-3 rounded-lg border transition-all duration-200 ${
                                        selectedDate === day.date
                                            ? 'bg-[var(--accent-color)] text-black border-[var(--accent-color)]'
                                            : 'bg-zinc-900/50 text-gray-300 border-zinc-700 hover:border-[var(--accent-color)]'
                                    }`}
                                >
                                    <div className="text-sm font-medium">{formatDate(day.date)}</div>
                                    <div className="text-xs opacity-70">{day.slots.length} slots</div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                const container = document.getElementById('dates-container');
                                if (container) {
                                    container.scrollBy({ left: 200, behavior: 'smooth' });
                                }
                            }}
                            className="flex-shrink-0 p-2 rounded-lg transition-all duration-200 text-gray-300 hover:bg-zinc-800 hover:text-[var(--accent-color)]"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Time Slots */}
            {selectedDate && (
                <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-200">Select a Time</h3>
                    {availableStartSlots.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">
                            No {duration}-hour slots available on this date. Try a shorter duration or different date.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {availableStartSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSlotClick(slot, selectedDate)}
                                    className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                                        isSlotSelected(slot)
                                            ? 'bg-[var(--accent-color)] text-black border-[var(--accent-color)]'
                                            : 'bg-zinc-900/50 text-gray-300 border-zinc-700 hover:border-[var(--accent-color)]'
                                    }`}
                                >
                                    {formatTime(slot.start)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Selected Slot Display */}
            {selectedSlot && (
                <div className="mt-4 p-4 bg-zinc-900/50 border border-[var(--accent-color)]/30 rounded-lg">
                    <p className="text-[var(--accent-color)]">
                        Selected: {new Date(selectedSlot.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })} at {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)} ({duration} hour{duration > 1 ? 's' : ''})
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookingCalendar;
