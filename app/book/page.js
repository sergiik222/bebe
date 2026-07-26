'use client';

import React, { useState } from 'react';
import BookingCalendar from '@/components/booking/BookingCalendar';
import BookingForm from '@/components/booking/BookingForm';
import { useLanguage } from '@/lib/LanguageContext';

const Book = () => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const { t, language } = useLanguage();

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
            <div className="font-roboto flex flex-col w-full min-h-screen">
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto bg-[var(--accent-color)]/20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl font-medium mb-4">{t.book.successTitle}</h1>
                        <p className="text-secondary-text mb-8">
                            {t.book.successMessage}
                        </p>
                        <button
                            onClick={handleBookAnother}
                            className="px-6 py-3 bg-[var(--accent-color)] text-on-accent font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                            {t.book.bookAnother}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="font-roboto flex flex-col w-full min-h-screen">
            <div className="flex-1 p-4 pt-20 md:p-8 md:pt-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl md:text-3xl font-medium">{t.book.title}</h1>
                    </div>

                    {/* Calendar */}
                    <div className="bg-surface/30 backdrop-blur-sm border border-line rounded-2xl p-6">
                        <BookingCalendar
                            onSlotSelect={handleSlotSelect}
                            selectedSlot={selectedSlot}
                            t={t}
                            language={language}
                        />

                        {/* Booking Form */}
                        {selectedSlot && (
                            <BookingForm
                                selectedSlot={selectedSlot}
                                onSuccess={handleBookingSuccess}
                                onCancel={handleCancel}
                                t={t}
                                language={language}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Book;
