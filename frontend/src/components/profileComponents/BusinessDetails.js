// import React from 'react';
// import './BusinessDetails.css'; // Import your CSS file

// const BusinessDetails = ({ business }) => {
//   return (
//     <div className="business-details">
//       <h2 className="business-name">{business.businessName}</h2>
//       <div className="detail-item">
//         <strong>Category:</strong> <span>{business.category}</span>
//       </div>
//       <div className="detail-item">
//         <strong>Username:</strong> <span>{business.username}</span>
//       </div>
//       <div className="detail-item">
//         <strong>Phone Number:</strong> <span>{business.phoneNumber}</span>
//       </div>
//       <div className="detail-item">
//         <strong>Email:</strong> <span>{business.email}</span>
//       </div>
//       <div className="detail-item">
//         <strong>Address:</strong> <span>{business.shopAddress}</span>
        
//       </div>
//     </div>
//   );
// };

// export default BusinessDetails;





import React from 'react';
import './BusinessDetails.css';

const BusinessDetails = ({ business }) => {
  return (
    <div className="business-details">
      <h2 className="business-name">{business.businessName}</h2>
      <div className="detail-item">
        <strong>Category:</strong> <span>{business.category}</span>
      </div>
      <div className="detail-item">
        <strong>Phone Number:</strong> <span>{business.phoneNumber}</span>
      </div>
      <div className="detail-item">
        <strong>Email:</strong> <span>{business.email}</span>
      </div>
      <div className="detail-item">
        <strong>Address:</strong> <span>{business.shopAddress}</span>
      </div>
      {business.shopWebsite && (
        <div className="detail-item">
          <strong>Website:</strong> <a href={business.shopWebsite} target="_blank" rel="noopener noreferrer">{business.shopWebsite}</a>
        </div>
      )}
      <div className="detail-item">
        <strong>Description:</strong> <span>{business.shopDescription}</span>
      </div>
    </div>
  );
};

export default BusinessDetails;