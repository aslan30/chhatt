import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatListPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserData = useCallback(async (token) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/users/current_user/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    navigate('/login');
                } else {
                    navigate('/404');
                }
            } else {
                console.error('Ошибка при запросе:', error);
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/login');
        } else {
            fetchUserData(authToken);
        }
    }, [fetchUserData, navigate]);

    const handleSelectChat = (userId) => {
        navigate(`/chat/${userId}`);
    };

    return (
        <div className="relative flex h-screen bg-gradient-to-r from-teal-100 via-blue-100 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-black text-gray-900 dark:text-gray-100">
            <div
                className={`fixed inset-y-0 left-0 bg-gradient-to-b from-white to-teal-200 dark:from-gray-900 dark:to-gray-800 border-r border-gray-300 dark:border-gray-700 p-4 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-30`}
                style={{ width: '16rem' }}
            >
                <Sidebar onSelectChat={handleSelectChat} />
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-40 z-20"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-0' : ''}`}>
                <header className="bg-gradient-to-r from-teal-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-300 dark:border-gray-700 p-4 shadow-lg">
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">Список чатов</h2>
                </header>

                <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
                    {loading ? (
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Загрузка...</p>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Чтобы просмотреть список чатов, нажмите на стрелку слева.</p>
                    )}
                </main>
            </div>

            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-1/2 left-0 transform -translate-y-1/2 p-2 rounded-full bg-teal-200 dark:bg-gray-700 hover:bg-teal-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 z-40"
                aria-label="Toggle Sidebar"
            >
                <svg className={`w-4 h-4 text-gray-700 dark:text-gray-100 ${sidebarOpen ? 'hidden' : 'block'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <svg className={`w-4 h-4 text-gray-700 dark:text-gray-100 ${sidebarOpen ? 'block' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>
    );
};

export default ChatListPage;
