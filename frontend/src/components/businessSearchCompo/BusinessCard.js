import React from 'react';
import './BusinessCard.css'; // Ensure this CSS file is created

const BusinessCard = ({ business, onClick }) => {
  return (
    <div className="business-card" onClick={onClick}>
      <h3>{business.businessName}</h3>
      <p>Category: {business.category}</p>
      <p>Phone: {business.phoneNumber}</p>
      <p>Email: {business.email}</p>
      <p>Address: {business.address}</p>
    </div>
  );
};

export default BusinessCard;