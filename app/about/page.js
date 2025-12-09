'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';

const About = () => {
    const { t } = useLanguage();

    const stats = [
        { number: '5+', label: t.about.yearsExp },
        { number: '200+', label: t.about.projects },
        { number: '150+', label: t.about.clients },
    ];

    return (
        <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen">
            <div className="flex-1 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl md:text-5xl font-medium mb-4">{t.about.title}</h1>
                        <p className="text-gray-400 text-lg">{t.about.subtitle}</p>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Image Placeholder */}
                        <div className="relative">
                            <div className="aspect-[4/5] bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-[var(--accent-color)]/20 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 text-sm">{t.about.photoPlaceholder}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="flex flex-col justify-center">
                            <h2 className="text-2xl md:text-3xl font-medium mb-6 text-[var(--accent-color)]">
                                {t.about.greeting}
                            </h2>
                            <div className="space-y-4 text-gray-300 leading-relaxed">
                                <p>{t.about.bio1}</p>
                                <p>{t.about.bio2}</p>
                                <p>{t.about.bio3}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-12">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-[var(--accent-color)] mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 md:p-8 mb-12">
                        <h3 className="text-xl font-medium mb-6 text-center">{t.about.whatIDo}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {t.about.skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-center text-sm text-gray-300 hover:border-[var(--accent-color)] transition-colors"
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <p className="text-gray-400 mb-6">
                            {t.about.cta}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/book"
                                className="px-8 py-3 bg-[var(--accent-color)] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                            >
                                {t.about.bookSession}
                            </a>
                            <a
                                href="/contact"
                                className="px-8 py-3 border border-zinc-700 text-gray-300 rounded-lg hover:border-[var(--accent-color)] transition-colors"
                            >
                                {t.about.getInTouch}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
