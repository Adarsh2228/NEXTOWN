


// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Register.css'; // Importing the CSS file for styling

// const Register = () => {
//   const [user, setUser] = useState({
//     name: '',
//     email: '',
//     password: '',
//     username: '',
//   });
//   const [loading, setLoading] = useState(false); // Added loading state
//   const [error, setError] = useState(''); // Added error state
//   const navigate = useNavigate();

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser({ ...user, [name]: value });
//     setError(''); // Clear error on input change
//   };

//   // Handle registration
//   const register = async () => {
//     if (!user.name || !user.email || !user.password || !user.username) {
//       setError('All fields are required');
//       return;
//     }

//     setLoading(true); // Start loading
//     setError(''); // Clear previous errors

//     try {
//       const response = await axios.post(
//         'http://localhost:4000/api/users/register',
//         user
//       );

//       // Show success message and redirect to login
//       alert(`Registration successful! Your user code: ${response.data.userCode}`);
//       navigate('/login');
//     } catch (error) {
//       // Handle errors
//       const message =
//         error.response?.data?.message ||
//         error.message ||
//         'Registration failed. Please try again.';
//       setError(message);
//       console.error('Registration error:', error);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // Navigate to login page
//   const navigateToLogin = () => {
//     navigate('/login');
//   };

//   return (
//     <div className="register-container">
//       <h2>Register</h2>
//       <form onSubmit={(e) => e.preventDefault()}>
//         <div className="input-container">
//           <label>Name:</label>
//           <input
//             type="text"
//             name="name"
//             value={user.name}
//             onChange={handleChange}
//             placeholder="Enter your name"
//             required
//           />
//         </div>
//         <div className="input-container">
//           <label>Email:</label>
//           <input
//             type="email"
//             name="email"
//             value={user.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//             required
//           />
//         </div>
//         <div className="input-container">
//           <label>Password:</label>
//           <input
//             type="password"
//             name="password"
//             value={user.password}
//             onChange={handleChange}
//             placeholder="Enter your password"
//             required
//           />
//         </div>
//         <div className="input-container">
//           <label>Username:</label>
//           <input
//             type="text"
//             name="username"
//             value={user.username}
//             onChange={handleChange}
//             placeholder="Choose a username"
//             required
//           />
//         </div>

//         {/* Display error message */}
//         {error && <div className="error-message">{error}</div>}

//         {/* Register button with loading state */}
//         <button
//           type="button"
//           onClick={register}
//           disabled={loading} // Disable button when loading
//         >
//           {loading ? 'Registering...' : 'Register'}
//         </button>

//         {/* Go to Login button */}
//         <button type="button" onClick={navigateToLogin}>
//           Go to Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [formCompleted, setFormCompleted] = useState(0);
  const navigate = useNavigate();

  // Check form completion percentage
  useEffect(() => {
    const filledFields = Object.values(user).filter(value => value.trim() !== '').length;
    const totalFields = Object.keys(user).length;
    setFormCompleted((filledFields / totalFields) * 100);
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setError('');
  };

  // Handle input focus
  const handleFocus = (field) => {
    setActiveField(field);
  };

  // Handle input blur
  const handleBlur = () => {
    setActiveField(null);
  };

  // Validate email format
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const isPasswordStrong = (password) => {
    return password.length >= 8;
  };

  // Handle registration
  const register = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!user.name || !user.email || !user.password || !user.username) {
      setError('All fields are required');
      return;
    }

    // Validate email format
    if (!isEmailValid(user.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password strength
    if (!isPasswordStrong(user.password)) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:4000/api/users/register',
        user
      );

      // Show success message and redirect to login
      setTimeout(() => {
        alert(`Registration successful! Your user code: ${response.data.userCode}`);
        navigate('/login');
      }, 1000); // Delay for animation
    } catch (error) {
      // Handle errors
      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';
      setError(message);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to login page
  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="form-header">
          <h2>Create Account</h2>
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${formCompleted}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(formCompleted)}% Complete</span>
        </div>

        <form onSubmit={register} className="register-form">
          <div className={`input-group ${activeField === 'name' ? 'active' : ''} ${user.name ? 'filled' : ''}`}>
            <div className="input-icon">
              <i className="icon-user"></i>
            </div>
            <div className="input-container">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className={`input-group ${activeField === 'email' ? 'active' : ''} ${user.email ? 'filled' : ''}`}>
            <div className="input-icon">
              <i className="icon-email"></i>
            </div>
            <div className="input-container">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className={`input-group ${activeField === 'username' ? 'active' : ''} ${user.username ? 'filled' : ''}`}>
            <div className="input-icon">
              <i className="icon-username"></i>
            </div>
            <div className="input-container">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleChange}
                onFocus={() => handleFocus('username')}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className={`input-group ${activeField === 'password' ? 'active' : ''} ${user.password ? 'filled' : ''}`}>
            <div className="input-icon">
              <i className="icon-password"></i>
            </div>
            <div className="input-container">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <i className="icon-error"></i>
              <span>{error}</span>
            </div>
          )}

          <div className="form-buttons">
            <button 
              type="submit" 
              className={`register-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Create Account'
              )}
            </button>
            
            <div className="login-option">
              <span>Already have an account?</span>
              <button type="button" className="login-link" onClick={navigateToLogin}>
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;