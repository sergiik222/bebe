'use client';

import React, { useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const BookingForm = ({ selectedSlot, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    date: selectedSlot.date,
                    startTime: formatTime(selectedSlot.start),
                    endTime: formatTime(selectedSlot.end),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit booking');
            }

            onSuccess(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!selectedSlot) {
        return null;
    }

    return (
        <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-700 rounded-xl">
            <h3 className="text-xl font-medium mb-6 text-gray-200">Your Details</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                        placeholder="Your full name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                        placeholder="your@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                        Phone *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                        placeholder="+49 123 456 7890"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                        Message (optional)
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:border-[var(--accent-color)] transition-colors resize-none"
                        placeholder="Tell us about your project or any special requests..."
                    />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full sm:flex-1 px-6 py-3 border border-zinc-700 rounded-lg text-gray-300 hover:bg-zinc-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:flex-1 px-6 py-3 bg-[var(--accent-color)] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span>
                                Booking...
                            </span>
                        ) : (
                            'Book Appointment'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
