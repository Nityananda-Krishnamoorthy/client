import React from 'react';
import { 
  FaUser, FaEdit, FaBan, FaLock, FaSignOutAlt, FaCog, 
  FaTrash,
  FaBook
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../store/user-slice'; 
import { AiOutlineSave } from 'react-icons/ai';

const SettingsDropdown = ({ isActive, onToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector(state => state.ui.theme);
  const currentUser = useSelector(state => state.user.currentUser);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    dispatch(userActions.changeCurrentUser(null));
    navigate('/login');
  };

  const menuItems = [
    { icon: <FaUser />, label: 'View Profile', path: `/users/${currentUser?._id}` },
    { icon: <FaBan />, label: 'Blocked Users', path: '/blocked-users' },
    { icon: <FaLock />, label: 'Reset Password', path: '/reset-password' },
    { icon: <FaTrash/>, label:'Recent Deleted', path: '/deleted'},
    { path: '/bookmarks', icon: <FaBook/>, label: 'Bookmarks' },
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
              <Link 
                to={item.path} 
                className="menu-item"
                onClick={() => onToggle(false)}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
              {index === menuItems.length - 2 && <hr className="divider" />}
            </React.Fragment>
          ))}
          <button className="menu-item logout" onClick={handleLogout}>
            <span className="icon"><FaSignOutAlt /></span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;