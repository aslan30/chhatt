import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  
  const fileInputRef = useRef(null);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(previewUrl);
    } else {
      setProfilePicturePreview('');
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setError('Пароли не совпадают');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }
    formData.append('date_of_birth', dateOfBirth);
    formData.append('password', password);
    formData.append('email', email);

    try {
      await axios.post('http://127.0.0.1:8000/api/v1/users/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const loginResponse = await axios.post('http://127.0.0.1:8000/api/v1/users/login/', {
        username: username,
        password: password
      });

      localStorage.setItem('authToken', loginResponse.data.access); 

      setSuccess('Регистрация и вход прошли успешно');
      setError(null);

      setTimeout(() => navigate('/'), 1000);

    } catch (err) {
      const errorMessage = 'Произошла ошибка';
      setError(errorMessage);
      setSuccess(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Регистрация</h2>
        {success && <p className="text-green-600 mb-4">{success}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">UserName:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Имя:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300 transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Фамилия:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300 transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Фото профиля:</label>
            <input
              type="file"
              onChange={handleProfilePictureChange}
              ref={fileInputRef}
              className="mt-1 block w-full text-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-700 dark:text-gray-300 transition-colors"
            />
            {profilePicturePreview && (
              <div className="mt-4">
                <img
                  src={profilePicturePreview}
                  alt="Preview"
                  className="rounded-lg w-32 h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveProfilePicture}
                  className="mt-2 text-red-500 underline"
                >
                  Отменить изображение
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Дата рождения:</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300 transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Подтвердите пароль:</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Электронная почта:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-gradient-to-l hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Зарегистрироваться
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
          Уже есть аккаунт? <Link to="/login" className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300">Войти</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
