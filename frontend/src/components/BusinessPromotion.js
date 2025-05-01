
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PostList from './profileComponents/PostList';
import { motion } from 'framer-motion';
import './BusinessPromotion.css';

const BusinessPromotion = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const headerRef = useRef(null);

  
  useEffect(() => {
    fetchAllPosts();
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (headerRef.current) {
        headerRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/posts');
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      handleRequestError(error);
      setLoading(false);
    }
  };

  
  const handleRequestError = (error) => {
    console.error('Error fetching data:', error);
    if (error.response) {
      setError(`Could not fetch data: ${error.response.data.error || 'Unknown error'}`);
    } else if (error.request) {
      setError('No response received from the server.');
    } else {
      setError('An error occurred while fetching data.');
    }
  };

  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  
  const getFilteredPosts = () => {
    if (activeFilter === 'all') return posts;
    return posts.filter(post => post.category === activeFilter);
  };

  
  return (
    <div className="business-promotion-page">
      
      <header className="header" ref={headerRef}>
        <div className="header-content">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="main-title"
          >
            Business Promotion
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="subtitle"
          >
            Showcase your business with engaging posts
          </motion.p>
        </div>
        
        {/* <motion.div 
          className="search-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <input type="text" placeholder="Search promotions..." className="search-input" />
          <button className="search-button">Search</button>
        </motion.div> */}
      </header>
      
      
      <div className="filter-container">
        <div className="filter-wrapper">
          {['all', 'food', 'retail', 'service', 'tech'].map(filter => (
            <button 
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      
      <div className="stats-banner">
        <div className="stat-item">
          <span className="stat-number">{posts.length}</span>
          <span className="stat-label">Promotions</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">24</span>
          <span className="stat-label">Categories</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">124k</span>
          <span className="stat-label">Engagements</span>
        </div>
      </div>

      
      <div className="content-wrapper">
        <div className="posts-container">
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
              <p>Loading amazing promotions...</p>
            </div>
          ) : (
 <PostList posts={getFilteredPosts()} error={error} />
          )}
        </div>
      </div>
      
      
      <footer className="promotion-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Business Promotions</h3>
            <p>Connect with businesses and discover amazing promotions in your area.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#top">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@businesspromotions.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Business Promotions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessPromotion;