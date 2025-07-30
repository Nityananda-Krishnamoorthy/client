import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CiSearch } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileImage from './ProfileImage';

const SearchBar = ({ isActive, onToggle, onClose }) => {
  const token = useSelector(state => state?.user?.currentUser?.token);
  const theme = useSelector(state => state.ui.theme); 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle search with debounce
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/search?q=${searchQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handler = setTimeout(() => searchUsers(), 300);
    return () => clearTimeout(handler);
  }, [searchQuery, token]);

  // Open dropdown when query is entered
  useEffect(() => {
    if (searchQuery.trim() && !isActive) {
      onToggle();
    }
  }, [searchQuery, isActive, onToggle]);

  return (
    <div className={`search-container dropdown-container ${theme}`}>
      <form className={`navbar__search ${theme}`}>
        <input 
          type="search" 
          placeholder='Search users...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim() && !isActive && onToggle()}
        />
        <button type='submit'><CiSearch/></button>
      </form>
      
      {isActive && (
        <div className={`search-dropdown ${theme}`}>
          {isLoading ? (
            <div className="loading-indicator">Searching...</div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="search-header">
                <h4>Search Results</h4>
                <button onClick={onClose}>Close</button>
              </div>
              <div className="search-results">
                {searchResults.map(user => (
                  <Link 
                    key={user._id} 
                    to={`/users/${user._id}`} 
                    className="search-result-item"
                    onClick={() => {
                      onClose();
                      setSearchQuery('');
                    }}
                  >
                    <ProfileImage image={user.profilePhoto} className="small" />
                    <div className="user-info">
                      <p className="username">{user.userName}</p>
                      <span className="fullname">{user.fullName}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              {searchQuery ? 'No users found' : 'Start typing to search'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;