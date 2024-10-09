import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Users({ darkMode }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [perPage, setPerPage] = useState(() => parseInt(localStorage.getItem('perPage') || '6', 10));
  const [page, setPage] = useState(() => parseInt(localStorage.getItem('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [userLoading, setUserLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortByNameDirection, setSortByNameDirection] = useState(() => localStorage.getItem('sortByNameDirection') || 'asc');
  const [sortByAgeDirection, setSortByAgeDirection] = useState(() => localStorage.getItem('sortByAgeDirection') || 'asc');
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('searchQuery') || '');
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setModalVisible(false);

    axios.get('http://127.0.0.1:8000/api/v1/users/users/', {
      params: {
        page: page,
        limit: perPage,
        search: searchQuery,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(res => {
      const data = res.data;
      setUsers(data.result || []);
      setFilteredUsers(data.result || []);
      setTotalPages(Math.ceil(data.count / perPage));
      setUserLoading(false);
      setIsLoading(false);
    })
    .catch(err => {
      setIsLoading(false);
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else if (err.response && err.response.status === 404) {
        navigate('/404');
      } else {
        console.error('Ошибка при загрузке данных:', err);
      }
    });
  }, [perPage, page, searchQuery, navigate]);

  useEffect(() => {
    const filtered = users.filter(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setNoResults(filtered.length === 0 && searchQuery.trim() !== '');
  }, [searchQuery, users]);

  useEffect(() => {
    localStorage.setItem('sortByNameDirection', sortByNameDirection);
    localStorage.setItem('sortByAgeDirection', sortByAgeDirection);
    localStorage.setItem('searchQuery', searchQuery);
  }, [sortByNameDirection, sortByAgeDirection, searchQuery]);

  const handlePerPageChange = (event) => {
    const newPerPage = parseInt(event.target.value, 10);
    setPerPage(newPerPage);
    setPage(1);
    localStorage.setItem('perPage', newPerPage);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
      localStorage.setItem('page', page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
      localStorage.setItem('page', page + 1);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPage(1);
  };

  const handleSortByName = () => {
    const newDirection = sortByNameDirection === 'asc' ? 'desc' : 'asc';
    const sorted = [...filteredUsers].sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return newDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setFilteredUsers(sorted);
    setSortByNameDirection(newDirection);
  };

  const handleSortByAge = () => {
    const newDirection = sortByAgeDirection === 'asc' ? 'desc' : 'asc';
    const sorted = [...filteredUsers].sort((a, b) => {
      const ageA = a.date_of_birth ? new Date().getFullYear() - new Date(a.date_of_birth).getFullYear() : 0;
      const ageB = b.date_of_birth ? new Date().getFullYear() - new Date(b.date_of_birth).getFullYear() : 0;
      return newDirection === 'asc' ? ageA - ageB : ageB - ageA;
    });
    setFilteredUsers(sorted);
    setSortByAgeDirection(newDirection);
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'dark' : ''}`}>
      {modalVisible && selectedUser && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-transform transform scale-95 hover:scale-100 w-full max-w-md text-center">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              aria-label="Закрыть"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Информация о пользователе</h2>
            <img
              src={selectedUser.profile_picture || '/path/to/fallback-image.jpg'}
              alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-indigo-500 dark:border-yellow-400 shadow-lg"
            />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{selectedUser.first_name} {selectedUser.last_name}</p>
            <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
            <p className="text-gray-500 dark:text-gray-500">{selectedUser.date_of_birth}</p>
            <div className="mt-4 flex justify-center items-center">
              <Link to={`/messages/${selectedUser.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center transition-colors duration-200">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l9 6 9-6-9-6-9 6z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10v11l9-6 9 6V10"></path>
                </svg>
                <span className="ml-2 text-lg font-medium">Отправить сообщение</span>
              </Link>
            </div>
          </div>
        </div>
      )}
  
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Загрузка...</p>
          </div>
        </div>
      )}
  
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск пользователей"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
        />
      </div>
      <div className="mb-6 flex space-x-4">
        <button
          onClick={handleSortByName}
          className="bg-indigo-500 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-300 hover:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          Сортировать по имени ({sortByNameDirection === 'asc' ? 'По возрастанию' : 'По убыванию'})
        </button>
        <button
          onClick={handleSortByAge}
          className="bg-indigo-500 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-300 hover:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          Сортировать по возрасту ({sortByAgeDirection === 'asc' ? 'По возрастанию' : 'По убыванию'})
        </button>
      </div>
      <div className="mb-6 flex items-center space-x-4">
        <label htmlFor="perPageSelect" className="text-lg font-medium text-gray-800 dark:text-gray-200">Результатов на странице:</label>
        <select
          id="perPageSelect"
          value={perPage}
          onChange={handlePerPageChange}
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={18}>18</option>
          <option value={24}>24</option>
        </select>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {userLoading && !isLoading ? (
          <div className="col-span-full text-center text-xl text-gray-700 dark:text-gray-300">Загрузка...</div>
        ) : noResults ? (
          <div className="col-span-full text-center text-xl text-gray-700 dark:text-gray-300">Результатов не найдено</div>
        ) : (
          filteredUsers.map((user, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => handleUserClick(user)}
            >
              <img
                src={user.profile_picture || '/path/to/fallback-image.jpg'}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-indigo-300 dark:border-yellow-400 shadow-lg"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">{user.first_name} {user.last_name}</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">{user.email}</p>
              <p className="text-center text-gray-500 dark:text-gray-400">{user.date_of_birth || 'Не указано'}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          className="bg-indigo-500 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors duration-300"
          onClick={handlePrevPage}
          disabled={page === 1}
          aria-label="Предыдущая страница"
        >
          &laquo;
        </button>
        <span className="text-lg text-gray-700 dark:text-gray-300">
          Страница {page} из {totalPages}
        </span>
        <button
          className="bg-indigo-500 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors duration-300"
          onClick={handleNextPage}
          disabled={page === totalPages}
          aria-label="Следующая страница"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}

export default Users;
