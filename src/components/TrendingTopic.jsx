import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TrendingTopics = () => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/trending`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrendingTopics(response.data);
      } catch (error) {
        console.error('Error fetching trending topics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendingTopics();
  }, []);

  if (loading) {
    return <div className="trending-loading">Loading trends...</div>;
  }

  return (
    <div className="trending-topics">
      <h3>Trending Topics</h3>
      <ul className="topics-list">
        {trendingTopics.map((topic, index) => (
          <li key={index}>
            <Link to={`/search?q=${encodeURIComponent(topic.tag)}`}>
              <span className="trend-number">{index + 1}</span>
              <div className="topic-info">
                <strong>#{topic.tag}</strong>
                <span>{topic.count} posts</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingTopics;