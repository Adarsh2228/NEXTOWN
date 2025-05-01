




import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BusinessDetails from './profileComponents/BusinessDetails';
import PostForm from './profileComponents/PostForm';
import PostList from './profileComponents/PostList';
import './BusinessProfile.css';

const BusinessProfile = ({ loggedInUserId, loggedInUserName, socket }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [bestMonths, setBestMonths] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [loadingBestMonths, setLoadingBestMonths] = useState(false);
  const [bestMonthsError, setBestMonthsError] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const fetchPosts = useCallback(async (businessId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/posts/business/${businessId}`);
      setPosts(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred while fetching posts.');
    }
  }, []);

  const fetchBusinessDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/businesses/${id}`);
      if (response.data) {
        setBusiness(response.data);
        fetchPosts(response.data._id);
      } else {
        throw new Error('No data returned');
      }
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred while fetching business details.');
    }
  }, [id, fetchPosts]);

  useEffect(() => {
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      fetchBusinessDetails();
    } else {
      setError('A valid Business ID is required to fetch data.');
    }
  }, [id, fetchBusinessDetails]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!business) return;

    const formData = new FormData();
    formData.append('content', content);
    formData.append('businessId', business._id);
    if (media) {
      formData.append('media', media);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPosts([response.data, ...posts]);
      setContent('');
      setMedia(null);
      setMediaPreview(null);
      setError(null);
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred while creating the post.');
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    } else {
      setMedia(null);
      setMediaPreview(null);
    }
  };

  const fetchBestMonths = async () => {
    if (!categoryInput) return;
    setLoadingBestMonths(true);
    setBestMonthsError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/ml/bestmonths', { category: categoryInput });

      if (response.data) {
        const formattedData = Object.entries(response.data).map(([month, profit]) => ({ month, profit }));
        setBestMonths(formattedData);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      setBestMonthsError(error.response ? error.response.data.error : 'Failed to fetch best-performing months.');
    } finally {
      setLoadingBestMonths(false);
    }
  };

  const handleButtonClick = () => {
    setIsButtonClicked(true);
    setTimeout(() => setIsButtonClicked(false), 2000);
  };

  const handleChatClick = () => {
    if (!loggedInUserId) {
      navigate('/login');
    } else if (business) {
      navigate(`/chat/${business._id}/${loggedInUserId}`, {
        state: { senderName: loggedInUserName },
      });
    } else {
      alert('Business details are not available. Please try again later.');
    }
  };

  const handleChatRequestsClick = () => {
    if (business) {
      navigate(`/business/${business._id}/chat-requests`);
    } else {
      alert('Business details are not available. Please try again later.');
    }
  };

  const handleQAClick = () => {
    if (business) {
      navigate(`/business/${business._id}/qa`);
    } else {
      alert('Business details are not available. Please try again later.');
    }
  };

  const handleAddServicesClick = () => {
    if (!loggedInUserId) {
      navigate('/login');
    } else if (business) {
      navigate(`/business/${business._id}/services/manage`);
    } else {
      alert('Business details are not available. Please try again later.');
    }
  };

  const handleProductsPageClick = () => {
    if (business) {
      navigate(`/business/${business._id}/products-services`);
    }
  };



  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        setPosts((prevPosts) => [...prevPosts, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off('receiveMessage');
      }
    };
  }, [socket]);

  if (!business) return <div>Loading...</div>;

  const isOwner = loggedInUserId === business.userId;

  return (
    <div className="business-profile-container">
      <div className="BusinessDetails">
        <BusinessDetails business={business} />
      </div>

      {isOwner && (
        <div className="Best-month-pred">
          <input
            type="text"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            placeholder="Enter Business Category"
          />
          <button className="profile-button" onClick={fetchBestMonths}>Fetch Best Months</button>
          <h3>Best Performing Months</h3>
          {loadingBestMonths ? (
            <p>Loading...</p>
          ) : bestMonthsError ? (
            <p>Error: {bestMonthsError}</p>
          ) : (
            <div className="prediction-list">
              {bestMonths.map((monthData) => (
                <div className="prediction-item" key={monthData.month}>
                  Month: {monthData.month}, Predicted Profit: ${monthData.profit.toFixed(2)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isOwner && (
        <div className="create-post-section">
          <h3>Create Post</h3>
          <PostForm
            content={content}
            setContent={setContent}
            mediaPreview={mediaPreview}
            handleMediaChange={handleMediaChange}
            handlePostSubmit={handlePostSubmit}
            businessCategory={business?.category || ''}
          />
        </div>
      )}

      <div className="post-section">
        <button className="profile-button" onClick={handleChatClick}>
          <i className="fas fa-comment"></i> Chat Now
        </button>

        <button className="profile-button" onClick={handleQAClick}>
          <i className="fas fa-question-circle"></i> Q&A
        </button>

        <button className="profile-button" onClick={handleProductsPageClick}>
          <i className="fas fa-box"></i> Products & Services
        </button>

        {isOwner && (
          <button className="profile-button" onClick={handleChatRequestsClick}>
            <i className="fas fa-envelope"></i> Chat Requests
          </button>
        )}

        {isOwner && (
          <Link to={`/business/promotion/${business._id}`} style={{ textDecoration: 'none' }}>
            <button className={`profile-button ${isButtonClicked ? 'clicked' : ''}`} onClick={handleButtonClick}>
              Business Promotion Page
            </button>
          </Link>
        )}

        {isOwner && (
          <button className="profile-button owner-service-btn" onClick={handleAddServicesClick}>
            Add Services
          </button>
        )}

<button
  className="profile-button analytics-btn"
  onClick={() => navigate(`/business/${business._id}/analytics`, { state: { business } })}
>
  Business Analytics
</button>


      </div>

      <div className="post-list-section">
        <h3>Posts</h3>
        <PostList posts={posts} error={error} businessName={business.businessName} />
      </div>
    </div>
  );
};

export default BusinessProfile;
