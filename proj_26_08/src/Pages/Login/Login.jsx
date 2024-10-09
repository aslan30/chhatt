import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/users/login/', {
        username,
        password
      });

      if (response.status === 200) {
        const { access } = response.data;
        localStorage.setItem('authToken', access);
        navigate('/');
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (err) {
      setError('Неверное имя пользователя или пароль');
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-600 dark:text-gray-300">UserName:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300 transition-colors"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-600 dark:text-gray-300">Пароль:</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300 transition-colors"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-gradient-to-l hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Войти
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Нет аккаунта?{' '}
          <Link
            to="/register"
            className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300"
          >
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
  
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Ошибка!</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={closeModal}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:bg-gradient-to-l hover:from-purple-500 hover:to-pink-500"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
