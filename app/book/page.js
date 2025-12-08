'use client';

import React, { useState } from 'react';
import BookingCalendar from '@/components/booking/BookingCalendar';
import BookingForm from '@/components/booking/BookingForm';

const Book = () => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleBookingSuccess = (data) => {
        setBookingSuccess(true);
        setSelectedSlot(null);
    };

    const handleCancel = () => {
        setSelectedSlot(null);
    };

    const handleBookAnother = () => {
        setBookingSuccess(false);
        setSelectedSlot(null);
    };

    if (bookingSuccess) {
        return (
            <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen">
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto bg-[var(--accent-color)]/20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl font-medium mb-4">Booking Request Sent!</h1>
                        <p className="text-gray-400 mb-8">
                            Thank you for your booking request. You will receive a confirmation email shortly once your appointment is confirmed.
                        </p>
                        <button
                            onClick={handleBookAnother}
                            className="px-6 py-3 bg-[var(--accent-color)] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Book Another Appointment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen">
            <div className="flex-1 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-medium mb-2">Book a Session</h1>
                        <p className="text-gray-400">Select a date and time that works for you</p>
                    </div>

                    {/* Calendar */}
                    <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
                        <BookingCalendar
                            onSlotSelect={handleSlotSelect}
                            selectedSlot={selectedSlot}
                        />

                        {/* Booking Form */}
                        {selectedSlot && (
                            <BookingForm
                                selectedSlot={selectedSlot}
                                onSuccess={handleBookingSuccess}
                                onCancel={handleCancel}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Book;
