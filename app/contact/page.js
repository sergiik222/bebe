'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendAnother = () => {
        setSuccess(false);
    };

    if (success) {
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
                        <h1 className="text-2xl font-medium mb-4">{t.contact.successTitle}</h1>
                        <p className="text-gray-400 mb-8">
                            {t.contact.successMessage}
                        </p>
                        <button
                            onClick={handleSendAnother}
                            className="px-6 py-3 bg-[var(--accent-color)] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                            {t.contact.sendAnother}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen">
            <div className="flex-1 p-4 pt-20 md:p-8 md:pt-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl md:text-3xl font-medium">{t.contact.title}</h1>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                        {t.common.name} *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                                        placeholder={t.book.namePlaceholder}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                        {t.common.email} *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                                        placeholder={t.book.emailPlaceholder}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                                        {t.common.phone}
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                                        placeholder={t.book.phonePlaceholder}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                                        {t.contact.subject} *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                                        placeholder={t.contact.subjectPlaceholder}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                                    {t.common.message} *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:border-[var(--accent-color)] transition-colors resize-none"
                                    placeholder={t.contact.messagePlaceholder}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-[var(--accent-color)] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span>
                                        {t.contact.sending}
                                    </span>
                                ) : (
                                    t.contact.sendMessage
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
