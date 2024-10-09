import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = ({ darkMode, toggleTheme }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isErrorPage = location.pathname === '*' || location.pathname.startsWith('/404');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && !isErrorPage && <Header darkMode={darkMode} toggleTheme={toggleTheme} />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && !isErrorPage && <Footer darkMode={darkMode} />}
    </div>
  );
};

export default Layout;

