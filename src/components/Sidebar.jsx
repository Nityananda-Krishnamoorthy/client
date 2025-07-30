import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  AiOutlineGlobal, AiOutlineHome, AiOutlineMessage, 
  AiOutlineNotification, AiOutlinePlusCircle, AiOutlineProfile, 
  AiOutlineSave, AiOutlineSetting, AiOutlineMenu, AiOutlineClose, 
  AiOutlineSearch
} from 'react-icons/ai';
import { TbColorFilter } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { uiSliceAction } from '../store/ui-silce';

const Sidebar = () => {
  const userId = useSelector(state => state?.user?.currentUser?.id);
  const dispatch = useDispatch();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showTabletSidebar, setShowTabletSidebar] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 600);
      setIsTablet(width >= 600 && width < 1024);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openThemeModal = () => {
    dispatch(uiSliceAction.openThemeModal());
    setShowMoreMenu(false);
    setShowTabletSidebar(false);
  }

  // Navigation items
  const navItems = [
    { path: '/', icon: <AiOutlineHome size={20}/>, label: 'Home' },
    { path: '/explore', icon: <AiOutlineSearch size={20}/>, label: 'Explore' },
    { path: '/create-post', icon: <AiOutlinePlusCircle size={20}/>, label: 'Create' },
    { path: '/messages', icon: <AiOutlineMessage size={20}/>, label: 'Messages' },
    { path: `/users/${userId}` , icon: <AiOutlineProfile size={20}/>, label: 'Profile' },
    // { path: '/notifications', icon: <AiOutlineNotification size={20}/>, label: 'Notifications' },
    // { path: '/settings', icon: <AiOutlineSetting size={20}/>, label: 'Settings' },
    { action: openThemeModal, icon: <TbColorFilter size={20}/>, label: 'Theme' },
  ];

  const toggleTabletSidebar = () => {
    setShowTabletSidebar(!showTabletSidebar);
    setShowMoreMenu(false);
  }

  // Close sidebar when clicking outside (tablet view)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isTablet && showTabletSidebar && !e.target.closest('.sidebar')) {
        setShowTabletSidebar(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTablet, showTabletSidebar]);

  // Render navigation items
  const renderNavItem = (item) => {
    if (item.path) {
      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({isActive}) => 
            `sidebar__item ${isActive ? "active" : ""}`
          }
          onClick={() => {
            setShowMoreMenu(false);
            setShowTabletSidebar(false);
          }}
        >
          <div className='sidebar__icon'>{item.icon}</div>
          <p>{item.label}</p>
        </NavLink>
      );
    } else {
      return (
        <div
          key={item.label}
          className="sidebar__item"
          onClick={item.action}
        >
          <div className='sidebar__icon'>{item.icon}</div>
          <p>{item.label}</p>
        </div>
      );
    }
  };

  // Mobile view - Bottom navigation bar
  if (isMobile) {
    return (
      <menu className="sidebar mobile-sidebar">
        {/* Core navigation items */}
        {navItems.slice(0, 4).map(renderNavItem)}
        
        {/* More menu */}
        <div 
          className={`sidebar__item ${showMoreMenu ? "active" : ""}`}
          onClick={() => setShowMoreMenu(!showMoreMenu)}
        >
          <div className='sidebar__icon'>
            {showMoreMenu ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20}/>}
          </div>
          <p>More</p>
        </div>
        
        {/* Additional items dropdown */}
        {showMoreMenu && (
          <div className="sidebar__dropdown">
            {navItems.slice(4).map(renderNavItem)}
          </div>
        )}
      </menu>
    );
  }

  // Tablet view - Compact sidebar that overlays content
  if (isTablet) {
    return (
      <>
        {/* Floating toggle button */}
        <button 
          className="tablet-sidebar-toggle"
          onClick={toggleTabletSidebar}
        >
          {showTabletSidebar ? <AiOutlineClose size={24}/> : <AiOutlineMenu size={24}/>}
        </button>
        
        {/* Compact sidebar */}
        {showTabletSidebar && (
          <menu className="sidebar tablet-sidebar">
            {navItems.map(item => (
              <div key={item.label || item.path} className="sidebar__item-container">
                {item.path ? (
                  <NavLink
                    to={item.path}
                    className={({isActive}) => 
                      `sidebar__item ${isActive ? "active" : ""}`
                    }
                    onClick={() => setShowTabletSidebar(false)}
                  >
                    <div className='sidebar__icon'>{item.icon}</div>
                  </NavLink>
                ) : (
                  <div
                    className="sidebar__item"
                    onClick={item.action}
                  >
                    <div className='sidebar__icon'>{item.icon}</div>
                  </div>
                )}
                <span className="sidebar__tooltip">{item.label}</span>
              </div>
            ))}
          </menu>
        )}
      </>
    );
  }

  // Desktop view - Full sidebar
  return (
    <menu className="sidebar desktop-sidebar">
      {navItems.map(renderNavItem)}
    </menu>
  );
};

export default Sidebar;