import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  AiOutlineHome, AiOutlineMessage, AiOutlinePlusCircle, 
  AiOutlineProfile, AiOutlineSearch, AiOutlineMenu, AiOutlineClose,
  AiOutlineUser
} from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

const Sidebar = () => {
  const userId = useSelector(state => state?.user?.currentUser?.id);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showTabletSidebar, setShowTabletSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 600);
      setIsTablet(width >= 600 && width < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/', icon: <AiOutlineHome size={20}/>, label: 'Home' },
    { path: '/explore', icon: <AiOutlineSearch size={20}/>, label: 'Explore' },
    { path: '/create-post', icon: <AiOutlinePlusCircle size={20}/>, label: 'Create' },
    { path: '/messages', icon: <AiOutlineMessage size={20}/>, label: 'Messages' },
    { path: `/users/${userId}` , icon: <AiOutlineUser size={20}/>, label: 'Profile' },
  ];

  const toggleTabletSidebar = () => {
    setShowTabletSidebar(!showTabletSidebar);
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isTablet && showTabletSidebar && !e.target.closest('.sidebar')) {
        setShowTabletSidebar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTablet, showTabletSidebar]);

  const renderNavItem = (item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({isActive}) => 
        `sidebar__item ${isActive ? "active" : ""}`
      }
      onClick={() => setShowTabletSidebar(false)}
    >
      <div className='sidebar__icon'>{item.icon}</div>
      <p>{item.label}</p>
    </NavLink>
  );

  //Mobile View - No more "More" menu
  if (isMobile) {
    return (
      <menu className="sidebar mobile-sidebar">
        {navItems.map(renderNavItem)}
      </menu>
    );
  }

  // Tablet View
  if (isTablet) {
    return (
      <>
        <button 
          className="tablet-sidebar-toggle"
          onClick={toggleTabletSidebar}
        >
          {showTabletSidebar ? <AiOutlineClose size={24}/> : <AiOutlineMenu size={24}/>}
        </button>
        
        {showTabletSidebar && (
          <menu className="sidebar tablet-sidebar">
            {navItems.map(item => (
              <div key={item.path} className="sidebar__item-container">
                <NavLink
                  to={item.path}
                  className={({isActive}) => 
                    `sidebar__item ${isActive ? "active" : ""}`
                  }
                  onClick={() => setShowTabletSidebar(false)}
                >
                  <div className='sidebar__icon'>{item.icon}</div>
                </NavLink>
                <span className="sidebar__tooltip">{item.label}</span>
              </div>
            ))}
          </menu>
        )}
      </>
    );
  }

  // Desktop View
  return (
    <menu className="sidebar desktop-sidebar">
      {navItems.map(renderNavItem)}
    </menu>
  );
};

export default Sidebar;
