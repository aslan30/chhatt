import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onSelectChat, onUsersLoaded }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(true);
            setError(null);
    
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }
    
                const response = await axios.get('http://127.0.0.1:8000/api/v1/chats/list_chats/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                setConversations(response.data.conversations);
    
                if (onUsersLoaded) {
                    const userProfiles = response.data.conversations.reduce((acc, conversation) => {
                        acc[conversation.user_id] = conversation.user_profile;
                        return acc;
                    }, {});
                    onUsersLoaded(userProfiles);
                }
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 401) {
                        navigate('/login');
                    } else if (err.response.status === 404) {
                        navigate('/404');
                    }
                } else {
                    console.error('Ошибка при загрузке данных:', err);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchConversations();
    }, [onUsersLoaded, navigate]);

    return (
        <div className="w-56 bg-white dark:bg-gray-900 p-4 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700 shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Чат</h3>
            {loading && <p className="text-blue-500 dark:text-blue-400">Загрузка...</p>}
            {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
            <ul className="list-none p-0">
                {conversations.length === 0 && !loading && (
                    <p className="text-gray-500 dark:text-gray-400">Нет чатов</p>
                )}
                {conversations.map(conversation => (
                    <li
                        key={conversation.user_id}
                        onClick={() => onSelectChat(conversation.user_id)}
                        className="cursor-pointer p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center transition-colors duration-200 ease-in-out relative"
                    >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-2">
                            <img
                                src={conversation.user_profile.profile_picture ? `http://127.0.0.1:8000${conversation.user_profile.profile_picture}` : '/default-avatar.png'}
                                alt={`${conversation.user_profile.first_name || 'User'} ${conversation.user_profile.last_name || ''}`}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                {`${conversation.user_profile.first_name || 'Неизвестно'} ${conversation.user_profile.last_name || 'Пользователь'}`}
                            </p>
                            {conversation.latest_message && (
                                <p className="text-gray-600 dark:text-gray-400 text-xs truncate">{conversation.latest_message}</p>
                            )}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                            {conversation.latest_message_date
                                ? new Date(conversation.latest_message_date).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                                : '—'}
                        </div>
                        {conversation.unread_count > 0 && (
                            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {conversation.unread_count}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
