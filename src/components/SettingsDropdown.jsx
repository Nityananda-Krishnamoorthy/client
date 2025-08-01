import React from 'react';
import {
  FaUser, FaBan, FaTrash, FaBook, FaCog, FaSignOutAlt
} from 'react-icons/fa';
import { TbColorFilter } from 'react-icons/tb';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../store/user-slice';
import { uiSliceAction } from '../store/ui-silce';

const SettingsDropdown = ({ isActive, onToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector(state => state.ui.theme);
  const currentUserId = useSelector(state => state?.user?.currentUser?._id);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    dispatch(userActions.changeCurrentUser(null));
    navigate('/login');
  };

  const confirmAndLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      handleLogout();
    }
  };

  const openThemeModal = () => {
    dispatch(uiSliceAction.openThemeModal());
    onToggle(false); // close dropdown
  };

  const menuItems = [
    ...(currentUserId
      ? [{ icon: <FaUser />, label: 'View Profile', path: `/user/${currentUserId}` }]
      : []),
    { icon: <FaBan />, label: 'Blocked Users', path: '/blocked-users' },
    { icon: <FaTrash />, label: 'Recently Deleted', path: '/deleted' },
    { icon: <FaBook />, label: 'Bookmarks', path: '/bookmarks' },
    { icon: <TbColorFilter />, label: 'Theme', action: openThemeModal },
    { icon: <FaCog />, label: 'Deactivate Account', path: '/deactivate' },
  ];

  return (
    <div className={`settings-dropdown dropdown-container ${theme}`}>
      <button
        className="settings-button"
        onClick={() => onToggle()}
        aria-label="Settings"
      >
        <FaCog className="icon" />
      </button>

      {isActive && (
        <div className={`dropdown-menu ${theme}`}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              {item.action ? (
                <button
                  className="menu-item"
                  onClick={() => {
                    item.action();
                  }}
                >
                  <span className="icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.path}
                  className="menu-item"
                  onClick={() => onToggle(false)}
                >
                  <span className="icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
              {index === menuItems.length - 2 && <hr className="divider" />}
            </React.Fragment>
          ))}
          <button className="menu-item logout" onClick={confirmAndLogout}>
            <span className="icon"><FaSignOutAlt /></span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
