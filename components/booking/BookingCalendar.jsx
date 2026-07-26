'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Loader from '@/components/ui/Loader';
import { BACKEND_URL, getLocale } from '@/lib/config';

const BookingCalendar = ({ onSlotSelect, selectedSlot, t, language }) => {
    const locale = getLocale(language);

    const durationOptions = useMemo(() => [
        { value: 1, label: `1 ${t.book.hour}` },
        { value: 2, label: `2 ${t.book.hours}` },
        { value: 3, label: `3 ${t.book.hours}` },
        { value: 4, label: `4 ${t.book.hours}` },
        { value: 5, label: `5 ${t.book.hours}` },
        { value: 6, label: `6 ${t.book.hours}` },
        { value: 7, label: `7 ${t.book.hours}` },
        { value: 8, label: `8 ${t.book.hours}` },
        { value: 24, label: t.book.fullDay },
    ], [t]);
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
        return date.toLocaleDateString(locale, {
            weekday: 'short',
            day: 'numeric'
        });
    };

    const formatMonthYear = (month, year) => {
        const date = new Date(year, month);
        return date.toLocaleDateString(locale, {
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString(locale, {
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
        // Auto-scroll to booking form on mobile
        setTimeout(() => {
            const formElement = document.getElementById('booking-form');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
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
                <Loader size="md" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-danger">
                <p>{t.common.error}: {error}</p>
                <button
                    onClick={() => fetchAvailabilityForMonth(currentYear, currentMonth)}
                    className="mt-4 px-4 py-2 bg-[var(--accent-color)] text-on-accent rounded-lg hover:opacity-80 transition-opacity"
                >
                    {t.common.tryAgain}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Duration Selection */}
            <div>
                <h3 className="text-lg font-medium mb-3 text-primary-text">{t.book.duration}</h3>
                {/* Mobile: Select dropdown */}
                <div className="sm:hidden">
                    <select
                        value={duration}
                        onChange={(e) => {
                            setDuration(Number(e.target.value));
                            onSlotSelect(null);
                        }}
                        className="w-full px-4 py-3 bg-surface/50 border border-line-strong rounded-lg text-primary-text focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                    >
                        {durationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Desktop: Button grid */}
                <div className="hidden sm:flex flex-wrap gap-2">
                    {durationOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setDuration(option.value);
                                onSlotSelect(null);
                            }}
                            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                                duration === option.value
                                    ? 'bg-[var(--accent-color)] text-on-accent border-[var(--accent-color)]'
                                    : 'bg-surface/50 text-secondary-text border-line-strong hover:border-[var(--accent-color)]'
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
                            ? 'text-secondary-text hover:bg-surface-raised hover:text-[var(--accent-color)]'
                            : 'text-muted-text cursor-not-allowed'
                    }`}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <h2 className="text-xl font-medium text-primary-text">
                    {formatMonthYear(currentMonth, currentYear)}
                </h2>

                <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-lg transition-all duration-200 text-secondary-text hover:bg-surface-raised hover:text-[var(--accent-color)]"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Date Selection */}
            <div>
                <h3 className="text-lg font-medium mb-3 text-primary-text">{t.book.selectDate}</h3>
                {availability.length === 0 ? (
                    <p className="text-secondary-text text-center py-4">{t.book.noDatesInMonth}</p>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const container = document.getElementById('dates-container');
                                if (container) {
                                    container.scrollBy({ left: -200, behavior: 'smooth' });
                                }
                            }}
                            className="hidden sm:block flex-shrink-0 p-2 rounded-lg transition-all duration-200 text-secondary-text hover:bg-surface-raised hover:text-[var(--accent-color)]"
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
                                            ? 'bg-[var(--accent-color)] text-on-accent border-[var(--accent-color)]'
                                            : 'bg-surface/50 text-secondary-text border-line-strong hover:border-[var(--accent-color)]'
                                    }`}
                                >
                                    <div className="text-sm font-medium">{formatDate(day.date)}</div>
                                    <div className="text-xs opacity-70">{day.slots.length} {t.book.slots}</div>
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
                            className="hidden sm:block flex-shrink-0 p-2 rounded-lg transition-all duration-200 text-secondary-text hover:bg-surface-raised hover:text-[var(--accent-color)]"
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
                    <h3 className="text-lg font-medium mb-3 text-primary-text">{t.book.selectTime}</h3>
                    {availableStartSlots.length === 0 ? (
                        <p className="text-secondary-text text-center py-4">
                            {t.book.noSlotsForDuration.replace('{duration}', duration)}
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {availableStartSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSlotClick(slot, selectedDate)}
                                    className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                                        isSlotSelected(slot)
                                            ? 'bg-[var(--accent-color)] text-on-accent border-[var(--accent-color)]'
                                            : 'bg-surface/50 text-secondary-text border-line-strong hover:border-[var(--accent-color)]'
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
                <div className="mt-4 p-4 bg-surface/50 border border-[var(--accent-color)]/30 rounded-lg">
                    <p className="text-[var(--accent-color)]">
                        {t.book.selected}: {new Date(selectedSlot.date).toLocaleDateString(locale, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })} - {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)} ({duration} {duration > 1 ? t.book.hours : t.book.hour})
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookingCalendar;
