import React from 'react';
import { useNavigate } from 'react-router-dom';
import notFoundImage from '../assets/nf.png';

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div 
      className="flex flex-col items-center justify-between min-h-screen"
      style={{
        backgroundImage: `url(${notFoundImage})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex-grow" />

      <button
        onClick={handleClick}
        className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:bg-blue-700 cursor-pointer"
        style={{ width: '80%', maxWidth: '300px' }}
      >
        Вернуться на главную
      </button>
    </div>
  );
};

export default NotFound;
