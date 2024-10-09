import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

function Header({ darkMode, toggleTheme }) {
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      navigate('/login');
      return;
    }
  
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/users/current_user/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else if (err.response && err.response.status === 404) {
          navigate('/404');
        } else {
          console.error('Ошибка при загрузке данных:', err);
        }
      }
    };
  
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchNewMessagesCount = async () => {
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        navigate('/login');
        return;
      }
  
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/chats/list_chats/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        const conversations = response.data.conversations || [];
        const totalUnreadCount = conversations.reduce((acc, conversation) => acc + conversation.unread_count, 0);
        setNewMessagesCount(totalUnreadCount);
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
      }
    };
  
    fetchNewMessagesCount();
  }, [navigate]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const profilePictureUrl = `http://127.0.0.1:8000${userData?.profile_picture || ''}`;

  return (
    <header className={`relative flex items-center justify-between p-5 transition-all duration-500 ${
        darkMode
          ? 'bg-gradient-to-r from-gray-900 via-purple-900 to-black text-white border-b border-gray-800'
          : 'bg-gradient-to-r from-indigo-200 via-purple-300 to-indigo-400 text-gray-900 border-b border-gray-300'
      } shadow-lg`}>
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className={`text-3xl font-bold text-transparent bg-clip-text ${
            darkMode
              ? 'bg-gradient-to-r from-yellow-400 to-pink-600'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          } hover:opacity-90 transition duration-300`}
        >
          MyApp
        </Link>
      </div>
      <div className="relative flex items-center gap-4">
        {userData ? (
          <div className="relative">
            <img
              src={profilePictureUrl}
              alt="Пользователь"
              className={`w-12 h-12 rounded-full cursor-pointer border-2 ${
                darkMode
                  ? 'border-yellow-400 shadow-lg hover:shadow-yellow-500'
                  : 'border-indigo-500 shadow-md hover:shadow-indigo-700'
              } hover:scale-105 transition-transform duration-300`}
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl z-50 overflow-hidden transition-opacity ${
                darkMode
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900'
              }`}>
                <div className="p-5 flex flex-col items-center border-b">
                  <img
                    src={profilePictureUrl}
                    alt={`${userData.username}`}
                    className={`w-24 h-24 rounded-full mb-4 object-cover border-2 ${
                      darkMode
                        ? 'border-yellow-500 shadow-lg'
                        : 'border-indigo-500 shadow-lg'
                    }`}
                  />
                  <p className="font-semibold text-lg truncate">{userData.username}</p>
                  <p className="text-sm text-gray-400 truncate">{userData.email}</p>
                  <Link
                    to={`/update-user/${userData.id}`}
                    className={`mt-4 px-5 py-2 w-full text-center font-semibold rounded-lg transition-colors duration-300 ${
                      darkMode
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    Изменить профиль
                  </Link>
                  <Link
                    to="/chats"
                    className={`relative mt-4 px-5 py-2 w-full text-center font-semibold rounded-lg transition-colors duration-300 ${
                      darkMode
                        ? 'bg-pink-500 hover:bg-pink-600 text-gray-900'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Чат
                    {newMessagesCount > 0 && (
                      <span className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                        {newMessagesCount}
                      </span>
                    )}
                  </Link>
                  <div className="mt-6">
                    <ThemeSwitcher isDarkMode={darkMode} toggleTheme={toggleTheme} />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`w-full px-5 py-2 font-semibold rounded-b-xl transition-colors duration-300 ${
                    darkMode
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400">Загрузка...</p>
        )}
      </div>
    </header>
  );
}

export default Header;
