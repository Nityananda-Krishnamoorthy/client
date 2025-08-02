import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import Feeds from '../components/Feeds';
import ProfileImage from '../components/ProfileImage';
import { createPortal } from 'react-dom';


const ExplorePage = () => {
  const token = useSelector(state => state?.user?.currentUser?.token);
  const userId = useSelector(state => state?.user?.currentUser?.id);
  const theme = useSelector(state => state.ui.theme);
  const navigate = useNavigate();


  const [trendingTopics, setTrendingTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [page, setPage] = useState(1);
 

  // Fetch trending topics
  const fetchTrendingTopics = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/trending`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTrendingTopics(response.data);
    } catch (error) {
      console.error('Error fetching trending topics:', error);
    }
  };

  

  // Search users
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

  // Handle search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Initial data fetch
  useEffect(() => {
    fetchTrendingTopics();
  }, [page]);

 

  // Handle outside click for search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSearchActive && !e.target.closest('.search-dropdown-portal') && 
          !e.target.closest('.search-bar')) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchActive]);

  return (

    <div className={`explore-page ${theme}`}>
      {/* Mobile Search Bar */}
      <div className="py-14 block lg:hidden ">
        <div className={`search-bar ${theme}`}>
          <input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchActive(true)}
          />
          <CiSearch className="search-icon" />
        </div>
      </div>

      {/* Portal for search dropdown */}
      {isSearchActive && createPortal(
        <div className="search-dropdown-overlay" onClick={() => setIsSearchActive(false)}>
          <div 
            className={`search-dropdown-portal ${theme}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-header">
              <h4>Search Results</h4>
              <button onClick={() => setIsSearchActive(false)}>Close</button>
            </div>
            
            {isLoading ? (
              <div className="loading-indicator">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="search-results">
                {searchResults.map(user => (
                  <Link
                    key={user._id}
                    to={`/users/${user._id}`}
                    className="search-result-item"
                    onClick={() => {
                      setIsSearchActive(false);
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
            ) : (
              <div className="no-results">
                {searchQuery ? 'No users found' : 'Start typing to search'}
              </div>
            )}
          </div>
        </div>,
        document.getElementById('portal-root')
      )}

      <div className="explore-content lg:py-10">
        {/* Trending Topics Section */}
        <div className="trending-section ">
          <h2>Trending Topics</h2>
          <div className="topics-container">
            {trendingTopics.length > 0 ? (
              trendingTopics.map((topic, index) => (
                <Link
                  key={index}
                  to={`/tag/${topic.tag}`}
                  className="topic-tag"
                >
                  #{topic.tag}
                  <span className="post-count">{topic.count} posts</span>
                </Link>
              ))
            ) : (
              <p>No trending topics</p>
            )}
          </div>
        </div>
        
      </div>
       <Feeds className=" mt-12"/>
    </div>
   
    
  );
};

export default ExplorePage;