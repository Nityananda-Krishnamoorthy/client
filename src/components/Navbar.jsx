import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileImage from './ProfileImage';
import NotificationIcon from './NotificationIcon';
import SettingsDropdown from './SettingsDropdown';
import SearchBar from './SearchBar';
import BetaBadge from './BetaBadge';

const Navbar = () => {
  const userId = useSelector(state => state?.user?.currentUser?.id);
  const token = useSelector(state => state?.user?.currentUser?.token);
  const profilePhoto = useSelector(state => state?.user?.currentUser?.profilePhoto);
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dispatch = useDispatch();

  const fetchUser = async () => {
  const res = await axios.get(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  dispatch(updateUser(res.data)); // Replace with actual Redux action
};


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleToggleDropdown = (dropdownName) => {
    setActiveDropdown(prev => prev === dropdownName ? null : dropdownName);
  };

  const handleCloseDropdown = () => {
    setActiveDropdown(null);
  };

  // Redirect to login if no token
  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);


  return (
    <nav className='navbar py-3'>
      <div className="container navbar__container">
        {/* Left: Logo */}
        <Link to="/" className='navbar__logo'>
          <span className="logo-symbol">N</span>
          <span className="logo-text">EXIS</span>
           &nbsp; &nbsp;
          <span className="logo-symbol mb-3"><BetaBadge/></span>

        </Link>

        {/* Middle: Search */}
        <SearchBar 
          isActive={activeDropdown === 'search'}
          onToggle={() => handleToggleDropdown('search')}
          onClose={handleCloseDropdown}
        />

        {/* Right: Icons */}
        <div className="navbar__right">
          <NotificationIcon 
            isActive={activeDropdown === 'notifications'}
            onToggle={() => handleToggleDropdown('notifications')}
          />

          <SettingsDropdown 
            isActive={activeDropdown === 'settings'}
            onToggle={() => handleToggleDropdown('settings')}
          />
          
          <Link to={`/users/${userId}`} className='navbar__profile'>
            <ProfileImage image={profilePhoto} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;