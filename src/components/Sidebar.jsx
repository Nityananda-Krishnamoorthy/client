import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  AiOutlineHome, AiOutlineMessage, AiOutlinePlusCircle,
  AiOutlineSearch, AiOutlineMenu, AiOutlineClose, AiOutlineUser
} from 'react-icons/ai';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const userId = useSelector(state => state?.user?.currentUser?.id);

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showTabletSidebar, setShowTabletSidebar] = useState(false);

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 600);
      setIsTablet(width >= 600 && width < 1024);
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (isTablet && showTabletSidebar && !e.target.closest('.sidebar')) {
        setShowTabletSidebar(false);
      }
    };
    const closeOnEsc = (e) => {
      if (e.key === 'Escape' && showTabletSidebar) {
        setShowTabletSidebar(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEsc);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEsc);
    };
  }, [isTablet, showTabletSidebar]);

  const navItems = [
    { path: '/', icon: <AiOutlineHome size={20} />, label: 'Home' },
    { path: '/explore', icon: <AiOutlineSearch size={20} />, label: 'Explore' },
    { path: '/create-post', icon: <AiOutlinePlusCircle size={20} />, label: 'Create' },
    { path: '/messages', icon: <AiOutlineMessage size={20} />, label: 'Messages' },
    { path: `/users/${userId}`, icon: <AiOutlineUser size={20} />, label: 'Profile' },
  ];

  const renderNavItem = (item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `sidebar__item ${isActive ? 'active' : ''}`
      }
      onClick={() => setShowTabletSidebar(false)}
    >
      <div className="sidebar__icon">{item.icon}</div>
      <p className="sidebar__label">{item.label}</p>
    </NavLink>
  );

  // Mobile Sidebar
  if (isMobile) {
    return (
      <menu className="sidebar mobile-sidebar">
        {navItems.map(renderNavItem)}
      </menu>
    );
  }

  // Tablet Sidebar
  if (isTablet) {
    return (
      <>
        <button
          className="tablet-sidebar-toggle"
          onClick={() => setShowTabletSidebar(!showTabletSidebar)}
          aria-label="Toggle Sidebar"
        >
          {showTabletSidebar ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>

        <menu
          className={`sidebar tablet-sidebar transition-all duration-300 ${
            showTabletSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {navItems.map((item) => (
            <div key={item.path} className="sidebar__item-container">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar__item ${isActive ? 'active' : ''}`
                }
                onClick={() => setShowTabletSidebar(false)}
              >
                <div className="sidebar__icon">{item.icon}</div>
              </NavLink>
              <span className="sidebar__tooltip">{item.label}</span>
            </div>
          ))}
        </menu>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <menu className="sidebar desktop-sidebar">
      {navItems.map(renderNavItem)}
    </menu>
  );
};

export default Sidebar;
