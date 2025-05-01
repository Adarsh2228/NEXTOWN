// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './BusinessRegistration.css';

// const BusinessRegistration = ({ user }) => {
//   const [business, setBusiness] = useState({
//     category: '',
//     businessName: '',
//     phoneNumber: '',
//     email: '',
//     shopAddress: '',
//     shopWebsite: '',
//     shopDescription: '',
//   });

//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setBusiness({ ...business, [name]: value });
//   };

//   const registerBusiness = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!business.category || !business.businessName || !business.phoneNumber || 
//         !business.email || !business.shopAddress || !business.shopDescription) {
//       setError('All fields are required except website.');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('You must be logged in to register a business.');
//         return;
//       }

//       const response = await axios.post('http://localhost:4000/api/businesses/register', business, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data) {
//         alert('Business registered successfully');
//         navigate(`/business/${response.data._id}`);
//       }
//     } catch (error) {
//       console.error('Error registering business:', error);
//       setError(error.response?.data?.error || 'Error registering business. Please try again.');
//     }
//   };

//   return (
//     <div className="registration-container">
//       <h2>Business Registration</h2>
//       {error && <div className="error-message">{error}</div>}
//       <form onSubmit={registerBusiness}>
//         <div className="form-grid">
//           <div>
//             <label className="label">Category:</label>
//             <select name="category" value={business.category} onChange={handleChange} required>
//               <option value="">Select Category</option>
//               <option value="Ice Cream Parlor">Ice Cream Parlor</option>
//               <option value="Clothing Store">Clothing Store</option>
//               <option value="Shoe Store">Shoe Store</option>
//               <option value="Fruit Vendor">Fruit Vendor</option>
//               <option value="Pharmacy">Pharmacy</option>
//               <option value="Pet Shop">Pet Shop</option>
//               <option value="Electrical Appliances">Electrical Appliances</option>
//               <option value="Bakery">Bakery</option>
//               <option value="Sweet Shop">Sweet Shop</option>
//               <option value="Gym">Gym</option>
//               <option value="Spice Shop">Spice Shop</option>
//               <option value="Auto Parts Shop">Auto Parts Shop</option>
//               <option value="Toy Shop">Toy Shop</option>
//               <option value="Photo Studio">Photo Studio</option>
//               <option value="Tea Stall">Tea Stall</option>
//               <option value="Stationery Shop">Stationery Shop</option>
//               <option value="Optician">Optician</option>
//               <option value="Vegetable Vendor">Vegetable Vendor</option>
//               <option value="Bookstore">Bookstore</option>
//               <option value="Cyber Cafe">Cyber Cafe</option>
//               <option value="Tailor Shop">Tailor Shop</option>
//               <option value="Dry Cleaning Service">Dry Cleaning Service</option>
//               <option value="Hair Salon">Hair Salon</option>
//               <option value="Furniture Store">Furniture Store</option>
//               <option value="Grocery Store">Grocery Store</option>
//               <option value="Flower Shop">Flower Shop</option>
//               <option value="Street Food Vendor">Street Food Vendor</option>
//               <option value="Jewelry Store">Jewelry Store</option>
//               <option value="Tech Shop">Tech Shop</option>
//               <option value="Mobile Repair Shop">Mobile Repair Shop</option>
//             </select>
//           </div>

//           <div>
//             <label className="label">Business Name:</label>
//             <input type="text" name="businessName" value={business.businessName} onChange={handleChange} required />
//           </div>

//           <div>
//             <label className="label">Phone Number:</label>
//             <input type="tel" name="phoneNumber" value={business.phoneNumber} onChange={handleChange} required />
//           </div>

//           <div>
//             <label className="label">Email:</label>
//             <input type="email" name="email" value={business.email} onChange={handleChange} required />
//           </div>

//           <div>
//             <label className="label">Shop Address:</label>
//             <input type="text" name="shopAddress" value={business.shopAddress} onChange={handleChange} required />
//           </div>

//           <div>
//             <label className="label">Shop Website:</label>
//             <input type="url" name="shopWebsite" value={business.shopWebsite} onChange={handleChange} />
//           </div>

//           <div>
//             <label className="label">Shop Description:</label>
//             <textarea name="shopDescription" value={business.shopDescription} onChange={handleChange} required></textarea>
//           </div>
//         </div>

//         <button type="submit" className="submit-button">Register Business</button>
//       </form>
//     </div>
//   );
// };

// export default BusinessRegistration;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BusinessRegistration.css';

const BusinessRegistration = ({ user }) => {
  const [business, setBusiness] = useState({
    category: '',
    businessName: '',
    phoneNumber: '',
    email: '',
    shopAddress: '',
    shopWebsite: '',
    shopDescription: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusiness({ ...business, [name]: value });
  };

  // Handle business registration
  const registerBusiness = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (
      !business.category ||
      !business.businessName ||
      !business.phoneNumber ||
      !business.email ||
      !business.shopAddress ||
      !business.shopDescription
    ) {
      setError('All fields are required except website.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to register a business.');
        return;
      }

      // Send the registration request to the backend
      const response = await axios.post('http://localhost:4000/api/businesses/register', business, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.business) {
        // Redirect to the business profile page after successful registration
        navigate(`/business/${response.data.business._id}`);
      } else {
        setError('Failed to register business. Please try again.');
      }
    } catch (error) {
      console.error('Error registering business:', error);
      setError(error.response?.data?.error || 'Error registering business. Please try again.');
    }
  };

  return (
    <div className="registration-container">
      <h2>Business Registration</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={registerBusiness}>
        <div className="form-grid">
          <div>
            <label className="label">Category:</label>
            <select name="category" value={business.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Ice Cream Parlor">Ice Cream Parlor</option>
              <option value="Clothing Store">Clothing Store</option>
              <option value="Shoe Store">Shoe Store</option>
              <option value="Fruit Vendor">Fruit Vendor</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Pet Shop">Pet Shop</option>
              <option value="Electrical Appliances">Electrical Appliances</option>
              <option value="Bakery">Bakery</option>
              <option value="Sweet Shop">Sweet Shop</option>
              <option value="Gym">Gym</option>
              <option value="Spice Shop">Spice Shop</option>
              <option value="Auto Parts Shop">Auto Parts Shop</option>
              <option value="Toy Shop">Toy Shop</option>
              <option value="Photo Studio">Photo Studio</option>
              <option value="Tea Stall">Tea Stall</option>
              <option value="Stationery Shop">Stationery Shop</option>
              <option value="Optician">Optician</option>
              <option value="Vegetable Vendor">Vegetable Vendor</option>
              <option value="Bookstore">Bookstore</option>
              <option value="Cyber Cafe">Cyber Cafe</option>
              <option value="Tailor Shop">Tailor Shop</option>
              <option value="Dry Cleaning Service">Dry Cleaning Service</option>
              <option value="Hair Salon">Hair Salon</option>
              <option value="Furniture Store">Furniture Store</option>
              <option value="Grocery Store">Grocery Store</option>
              <option value="Flower Shop">Flower Shop</option>
              <option value="Street Food Vendor">Street Food Vendor</option>
              <option value="Jewelry Store">Jewelry Store</option>
              <option value="Tech Shop">Tech Shop</option>
              <option value="Mobile Repair Shop">Mobile Repair Shop</option>
            </select>
          </div>

          <div>
            <label className="label">Business Name:</label>
            <input type="text" name="businessName" value={business.businessName} onChange={handleChange} required />
          </div>

          <div>
            <label className="label">Phone Number:</label>
            <input type="tel" name="phoneNumber" value={business.phoneNumber} onChange={handleChange} required />
          </div>

          <div>
            <label className="label">Email:</label>
            <input type="email" name="email" value={business.email} onChange={handleChange} required />
          </div>

          <div>
            <label className="label">Shop Address:</label>
            <input type="text" name="shopAddress" value={business.shopAddress} onChange={handleChange} required />
          </div>

          <div>
            <label className="label">Shop Website:</label>
            <input type="url" name="shopWebsite" value={business.shopWebsite} onChange={handleChange} />
          </div>

          <div>
            <label className="label">Shop Description:</label>
            <textarea name="shopDescription" value={business.shopDescription} onChange={handleChange} required></textarea>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Register Business
        </button>
      </form>
    </div>
  );
};

export default BusinessRegistration;