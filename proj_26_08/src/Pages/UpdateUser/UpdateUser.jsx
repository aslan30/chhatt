import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdateUser() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    profile_picture: null,
    email: '',
  });
  const [originalProfilePicture, setOriginalProfilePicture] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/users/current_user/', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        setFormData({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          profile_picture: null,
          email: response.data.email,
        });
        setOriginalProfilePicture(response.data.profile_picture);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else if (err.response && err.response.status === 404) {
          navigate('/404');
        } else {
          console.error('Ошибка при загрузке данных:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === 'file') {
      if (files[0]) {
        setFormData({
          ...formData,
          [name]: files[0]
        });
        setPreviewImage(URL.createObjectURL(files[0])); // Предварительный просмотр изображения
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleModalSubmit = async () => {
    setPasswordError('');
    try {
      await axios.post('http://127.0.0.1:8000/api/v1/users/verify_password/', { password }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      await handleSubmit();
    } catch (err) {
      setPasswordError('Неверный пароль');
    }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    try {
      await axios.patch('http://127.0.0.1:8000/api/v1/users/update_user/', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });
      
      setSuccess(true);
      setError(null);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
      navigate('/');
    } catch (err) {
      console.error('Ошибка при обновлении данных пользователя:', err);
      setError('Ошибка при обновлении данных. Попробуйте снова.');
  
      if (err.response) {
        if (err.response.status === 401) {
          navigate('/login');
        } else {
          console.error(`Ошибка ${err.response.status}: ${err.response.data}`);
        }
      } else {
        console.error('Сетевая ошибка или ошибка сервера:', err);
      }
  
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCancelImage = () => {
    setFormData({
      ...formData,
      profile_picture: null
    });
    setPreviewImage(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700 dark:text-gray-300">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl dark:bg-gray-900 dark:text-gray-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Обновите свой профиль</h1>
      {success && <div className="text-green-800 mb-6 p-4 border border-green-300 bg-green-100 dark:bg-green-800 dark:text-green-200 rounded-lg shadow-lg transition-transform transform hover:scale-105">Профиль успешно обновлён!</div>}
      {error && <div className="text-red-800 mb-6 p-4 border border-red-300 bg-red-100 dark:bg-red-800 dark:text-red-200 rounded-lg shadow-lg transition-transform transform hover:scale-105">{error}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        encType="multipart/form-data"
        className="space-y-6"
      >
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Имя</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:focus:ring-indigo-600 transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Фамилия</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:focus:ring-indigo-600 transition duration-200 ease-in-out"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Электронная почта</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:focus:ring-indigo-600 transition duration-200 ease-in-out"
          />
        </div>
        <div>
          <label htmlFor="profile_picture" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Фото профиля</label>
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md file:bg-indigo-50 file:text-indigo-700 file:font-medium file:py-2 file:px-4 file:border-0 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-400 dark:hover:file:bg-indigo-800 transition duration-200 ease-in-out"
          />
          {previewImage ? (
            <div className="mt-4">
              <img 
                src={previewImage} 
                alt="Profile Preview" 
                className="mx-auto w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg"
              />
              <button
                type="button"
                onClick={handleCancelImage}
                className="mt-2 text-red-600 dark:text-red-400 hover:underline"
              >
                Отменить выбор изображения
              </button>
            </div>
          ) : originalProfilePicture && !formData.profile_picture && (
            <div className="mt-4">
              <img 
                src={`http://127.0.0.1:8000${originalProfilePicture}`} 
                alt="Profile Preview" 
                className="mx-auto w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gradient-to-l transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-600"
        >
          Изменить профиль
        </button>
      </form>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Подтвердите свой пароль</h2>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Введите ваш пароль"
              className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 dark:bg-gray-800 dark:text-gray-300"
            />
            {passwordError && <div className="text-red-600 dark:text-red-400 mb-4">{passwordError}</div>}
            <button
              onClick={handleModalSubmit}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:bg-gradient-to-l transition-colors duration-300"
            >
              Подтвердить
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="ml-4 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateUser;
