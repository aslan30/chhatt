// import logo from './logo.svg';
// import './App.css';
// import { Routes, Route, Link } from 'react-router-dom'
// import Main from './components/Main/Main'
// import Users from './components/Users/Users';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [timer, setTimer] = useState(new Date());


//   useEffect(()=> {
//     const timerInterval = setInterval(() => {
//       console.log('Interval Timer works')
//       setTimer(new Date());
//     }, 1000)

//     return () => {
//       clearInterval(timerInterval);
//     }
//   })

  

//   return (
//     <>
//       {timer.toLocaleString()}
//       {/* <Main></Main> */}
//       <Users></Users>
//     </>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Users from './Pages/Users/Users';
import UpdateUser from './Pages/UpdateUser/UpdateUser';
import Layout from './components/Layout/Layout';
import ChatPage from './Pages/Chat/Chat';
import ChatListPage from './Pages/ChatListPage/ChatListPage';
import NotFound from './Pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prevDarkMode) => {
      const newDarkMode = !prevDarkMode;
      const newTheme = newDarkMode ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newDarkMode);
      return newDarkMode;
    });
  };

  return (
    <Routes>
      <Route element={<Layout path="/" darkMode={darkMode} toggleTheme={toggleTheme} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route index element={<Users />} />
        <Route path="/update-user/:userId" element={<UpdateUser />} />
        <Route path="/chat/:receiverId" element={<ChatPage />} />
        <Route path="/chats" element={<ChatListPage />} />
        <Route path="/messages/:receiverId" element={<ChatPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

