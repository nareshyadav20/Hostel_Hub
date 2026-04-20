import React from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <div className="search-bar"><span>📍</span><input type="text" placeholder="Search by location..." /></div>
          <div className="user-profile"><ThemeToggle /><div className="notifications">🔔</div><div className="avatar">RS</div></div>
        </header>
        <div className="content-body">{children}</div>
      </main>
    </div>
  );
};
export default Layout;
