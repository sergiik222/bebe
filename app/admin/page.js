'use client';

import React, { useState, useEffect } from 'react';
import Loader from '@/components/ui/Loader';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// Menu items configuration - easy to add new items in the future
const menuItems = [
    { id: 'galleries', label: 'Галереи' },
    // Future menu items can be added here:
    // { id: 'bookings', label: 'Бронирования' },
    // { id: 'settings', label: 'Настройки' },
];

const AdminPanel = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeMenu, setActiveMenu] = useState('galleries');

    // Login form state
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);

    // Create gallery form state
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createData, setCreateData] = useState({
        client_email: '',
        folder_name: '',
        title: '',
        message: '',
        expires_in: 30,
        language: 'en'
    });
    const [createLoading, setCreateLoading] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('adminToken');
        if (savedToken) {
            setToken(savedToken);
            setIsLoggedIn(true);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn && token) {
            fetchGalleries();
        }
    }, [isLoggedIn, token]);

    const fetchGalleries = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/admin/galleries`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                handleLogout();
                return;
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setGalleries(data.galleries || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            localStorage.setItem('adminToken', data.token);
            setToken(data.token);
            setIsLoggedIn(true);
            // Dispatch event to notify Navigation component
            window.dispatchEvent(new Event('adminAuthChanged'));
        } catch (err) {
            setLoginError(err.message);
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken('');
        setIsLoggedIn(false);
        setGalleries([]);
        // Dispatch event to notify Navigation component
        window.dispatchEvent(new Event('adminAuthChanged'));
    };

    const handleCreateGallery = async (e) => {
        e.preventDefault();
        setCreateLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/galleries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(createData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setShowCreateForm(false);
            setCreateData({
                client_email: '',
                folder_name: '',
                title: '',
                message: '',
                expires_in: 30,
                language: 'en'
            });
            fetchGalleries();
        } catch (err) {
            alert('Ошибка: ' + err.message);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDeleteGallery = async (id) => {
        if (!confirm('Вы уверены, что хотите удалить эту галерею?')) return;

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/galleries/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            fetchGalleries();
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    };

    const handleResendEmail = async (id) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/galleries/${id}/resend`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            alert('Email успешно отправлен!');
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('de-AT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Login Screen
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-light tracking-wider text-[var(--accent-color)]">BEBE MEDIA</h1>
                        <p className="text-gray-400 mt-2">Admin</p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        {loginError && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                {loginError}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Имя пользователя</label>
                                <input
                                    type="text"
                                    required
                                    value={loginData.username}
                                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-[var(--accent-color)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Пароль</label>
                                <input
                                    type="password"
                                    required
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-[var(--accent-color)]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loginLoading}
                                className="w-full py-3 bg-[var(--accent-color)] text-black font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
                            >
                                {loginLoading ? 'Вход...' : 'Войти'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <div className="min-h-screen pt-16 md:pt-0">
            {/* Header */}
            <header className="bg-zinc-900/50 border-b border-zinc-800 px-4 md:px-6 py-6 sticky top-16 md:top-0 z-30 backdrop-blur-lg">
                <div className="w-full text-center md:mx-48">
                    <h1 className="text-xl md:text-2xl font-light tracking-wider text-[var(--accent-color)] text-center md:text-left">
                        Admin
                    </h1>
                </div>
            </header>

            {/* Sub-navigation menu */}
            <nav className="bg-zinc-900/30 border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <ul className="flex gap-1">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveMenu(item.id)}
                                    className={`
                                        px-4 py-3 text-sm font-medium transition-colors relative
                                        ${activeMenu === item.id
                                            ? 'text-[var(--accent-color)]'
                                            : 'text-gray-400 hover:text-white'
                                        }
                                    `}
                                >
                                    {item.label}
                                    {activeMenu === item.id && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-color)]" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
                {/* Galleries Section */}
                {activeMenu === 'galleries' && (
                    <>
                        {/* Title and Create Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light">Галереи</h2>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="px-4 py-2 bg-[var(--accent-color)] text-black font-medium rounded-lg hover:opacity-90"
                            >
                                + Новая галерея
                            </button>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="flex justify-center py-12">
                                <Loader size="md" />
                            </div>
                        )}

                        {/* Galleries Table */}
                        {!loading && galleries.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                Галерей пока нет. Создайте первую галерею.
                            </div>
                        )}

                        {!loading && galleries.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-zinc-800">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Email</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Папка</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Название</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Создано</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Просмотрено</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Скачивания</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {galleries.map((gallery) => (
                                            <tr key={gallery.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                                                <td className="py-4 px-4 text-sm">{gallery.client_email}</td>
                                                <td className="py-4 px-4 text-sm text-gray-400">{gallery.folder_name}</td>
                                                <td className="py-4 px-4 text-sm text-gray-400">{gallery.title || '-'}</td>
                                                <td className="py-4 px-4 text-sm text-gray-400">{formatDate(gallery.created_at)}</td>
                                                <td className="py-4 px-4 text-sm">
                                                    {gallery.viewed_at ? (
                                                        <span className="text-green-400">{formatDate(gallery.viewed_at)}</span>
                                                    ) : (
                                                        <span className="text-gray-500">Не просмотрено</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-center">{gallery.download_count}</td>
                                                <td className="py-4 px-4 text-sm text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <a
                                                            href={`/gallery/${gallery.token}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1 text-xs bg-zinc-700 rounded hover:bg-zinc-600"
                                                        >
                                                            Открыть
                                                        </a>
                                                        <button
                                                            onClick={() => handleResendEmail(gallery.id)}
                                                            className="px-3 py-1 text-xs bg-blue-600 rounded hover:bg-blue-500"
                                                        >
                                                            Отправить
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteGallery(gallery.id)}
                                                            className="px-3 py-1 text-xs bg-red-600 rounded hover:bg-red-500"
                                                        >
                                                            Удалить
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* Placeholder for future sections */}
                {activeMenu !== 'galleries' && (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-xl mb-2">Скоро будет</p>
                        <p className="text-sm">Этот раздел находится в разработке.</p>
                    </div>
                )}

                {/* Create Gallery Modal */}
                {showCreateForm && (
                    <div
                        className="fixed inset-0 bg-black/70 flex items-start sm:items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto"
                        onClick={(e) => e.target === e.currentTarget && setShowCreateForm(false)}
                    >
                        <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg p-4 sm:p-6 mt-16 sm:mt-0 sm:my-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-light">Создать новую галерею</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleCreateGallery} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={createData.client_email}
                                        onChange={(e) => setCreateData({ ...createData, client_email: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-[var(--accent-color)]"
                                        placeholder="client@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Название папки *</label>
                                    <input
                                        type="text"
                                        required
                                        value={createData.folder_name}
                                        onChange={(e) => setCreateData({ ...createData, folder_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-[var(--accent-color)]"
                                        placeholder="например, wedding-john-jane"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Путь в Bunny CDN: clients/[название_папки]</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Заголовок (опционально)</label>
                                    <input
                                        type="text"
                                        value={createData.title}
                                        onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-[var(--accent-color)]"
                                        placeholder="например, Свадебные фото"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Сообщение (опционально)</label>
                                    <textarea
                                        rows={3}
                                        value={createData.message}
                                        onChange={(e) => setCreateData({ ...createData, message: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-[var(--accent-color)] resize-none"
                                        placeholder="Личное сообщение для клиента..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Язык письма</label>
                                        <select
                                            value={createData.language}
                                            onChange={(e) => setCreateData({ ...createData, language: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-[var(--accent-color)]"
                                        >
                                            <option value="en">English</option>
                                            <option value="de">Deutsch</option>
                                            <option value="ru">Русский</option>
                                            <option value="uk">Українська</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Срок действия (дней)</label>
                                        <select
                                            value={createData.expires_in}
                                            onChange={(e) => setCreateData({ ...createData, expires_in: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-[var(--accent-color)]"
                                        >
                                            <option value={0}>Бессрочно</option>
                                            <option value={7}>7 дней</option>
                                            <option value={14}>14 дней</option>
                                            <option value={30}>30 дней</option>
                                            <option value={60}>60 дней</option>
                                            <option value={90}>90 дней</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-1 py-3 bg-zinc-700 rounded-lg hover:bg-zinc-600"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createLoading}
                                        className="flex-1 py-3 bg-[var(--accent-color)] text-black font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
                                    >
                                        {createLoading ? 'Создание...' : 'Создать и отправить'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
