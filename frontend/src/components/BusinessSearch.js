// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './BusinessSearch.css';

// const BusinessSearch = () => {
//   const [businesses, setBusinesses] = useState([]);
//   const [filteredBusinesses, setFilteredBusinesses] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchBusinesses();
//   }, []);

//   const fetchBusinesses = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/api/businesses');
//       setBusinesses(response.data);
//       setFilteredBusinesses(response.data);
//     } catch (error) {
//       console.error('Error fetching businesses:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);

//     if (term.length > 0) {
//       const filteredSuggestions = businesses
//         .filter((b) => b.category.toLowerCase().includes(term.toLowerCase()))
//         .map((b) => b.category);
//       setSuggestions([...new Set(filteredSuggestions)]);
//     } else {
//       setSuggestions([]);
//     }

//     const filtered = businesses.filter((business) =>
//       business.category.toLowerCase().includes(term.toLowerCase())
//     );
//     setFilteredBusinesses(filtered);
//   };

//   const handleAddBusiness = () => {
//     navigate('/business/register');
//   };

//   return (
//     <div>
//       <h1>Search Businesses</h1>
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         <input
//           type="text"
//           placeholder="Search by business type or category..."
//           value={searchTerm}
//           onChange={handleInputChange}
//           style={{ flex: 1 }}
//         />
//         <button onClick={handleAddBusiness} style={{ marginLeft: '10px', fontSize: '24px' }}>
//           +
//         </button>
//       </div>
      
//       {suggestions.length > 0 && (
//         <ul className="suggestion-list">
//           {suggestions.map((suggestion, index) => (
//             <li key={index}>{suggestion}</li>
//           ))}
//         </ul>
//       )}
      
//       <div className="business-cards">
//         {filteredBusinesses.map((business) => (
//           <div 
//             key={business._id} 
//             className="business-card"
//             onClick={() => navigate(`/business/${business._id}`)} // Navigate to profile page on click
//             style={{ cursor: 'pointer' }} // Change cursor to pointer for better UX
//           >
//             <h3>{business.businessName}</h3>
//             <p>Category: {business.category}</p>
//             <p>Phone: {business.phoneNumber}</p>
//             <p>Email: {business.email}</p>
//             <p>Address: {business.address}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BusinessSearch;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BusinessCard from './businessSearchCompo/BusinessCard';
import './BusinessSearch.css';

const BusinessSearch = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/businesses');
      setBusinesses(response.data);
      setFilteredBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const filteredSuggestions = businesses
        .filter((b) => b.category.toLowerCase().includes(term.toLowerCase()))
        .map((b) => b.category);
      setSuggestions([...new Set(filteredSuggestions)]);
    } else {
      setSuggestions([]);
    }

    const filtered = businesses.filter((business) =>
      business.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBusinesses(filtered);
  };

  const handleAddBusiness = () => {
    navigate('/business/register');
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    const filtered = businesses.filter((business) =>
      business.category.toLowerCase().includes(suggestion.toLowerCase())
    );
    setFilteredBusinesses(filtered);
  };

  return (
    <div className="business-search-container">
      <header className="search-header fixed-header">
        <div className="header-left">
          <h1 className="business-title">Businesses Search Page</h1>
        </div>
        <div className="header-center">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by business type or category..."
              value={searchTerm}
              onChange={handleInputChange}
              className="search-input"
            />
          </div>
        </div>
        <div className="header-right">
          <button onClick={handleAddBusiness} className="add-business-button">
            +
          </button>
        </div>
      </header>

      {suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      <div className="business-cards">
        {filteredBusinesses.map((business) => (
          <BusinessCard 
            key={business._id} 
            business={business} 
            onClick={() => navigate(`/business/${business._id}`)} // Navigate to profile page on click
          />
        ))}
      </div>
    </div>
  );
};

export default BusinessSearch;
