// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';

// const Login = ({ onLogin }) => {
//   const [user, setUser] = useState({
//     email: '',
//     password: '',
//   });
//   const [successMessage, setSuccessMessage] = useState(''); // State for success message
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser({ ...user, [name]: value });
//   };

//   const login = async () => {
//     try {
//       const response = await axios.post('http://localhost:4000/api/users/login', user);
      
//       console.log(response.data); // Log the response data to check the structure

//       if (response.data && response.data.token) {
//         // Set success message
//         setSuccessMessage('Let\'s Go!');

//         // Store token in local storage
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('userId', response.data.user.id); // Store user ID

//         onLogin(response.data.user.id); // Call onLogin function passed as prop

//         // Redirect after a short delay to allow the message to be displayed
//         setTimeout(() => {
//           navigate('/business/search');
//         }, 2000); // Delay for 2 seconds
//       } else {
//         alert('Login failed. Please check your credentials.');
//       }
//     } catch (error) {
//       console.error('Error logging in:', error);
//       alert('Error logging in');
//     }
//   };

//   const navigateToRegister = () => {
//     navigate('/register');
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form>
//         <div>
//           <label>Email:</label>
//           <input type="email" name="email" value={user.email} onChange={handleChange} />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" name="password" value={user.password} onChange={handleChange} />
//         </div>
//         <button type="button" onClick={login}>Login</button>
//         <button type="button" onClick={navigateToRegister}>Go to Register</button>
//       </form>
//       {successMessage && (
//         <div className="success-message">{successMessage}</div> // Display success message
//       )}
//     </div>
//   );
// };

// export default Login;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for remembered email on component mount
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setUser(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
    
    // Animate in the elements
    const loginContainer = document.querySelector('.login-card');
    if (loginContainer) {
      loginContainer.classList.add('appear');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setErrorMessage(''); // Clear error message when user types
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const login = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', user);
      
      if (response.data && response.data.token) {
        setSuccessMessage('Login Successful!');
        setErrorMessage('');
        
        // Store token in local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user.id);
        
        // Store email in local storage if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', user.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        onLogin(response.data.user.id);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/business/search');
        }, 2000);
      } else {
        setErrorMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage(error.response?.data?.message || 'Error logging in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand-info">
          <div className="brand-logo">
            <span className="logo-text">NexTown </span>
          </div>
          <h2 className="brand-tagline">Your business companion</h2>
          <div className="brand-features">
            <div className="feature">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Streamlined business management</div>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <div className="feature-text">24/7 customer support</div>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Secure data encryption</div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome <span className="accent-text">Back</span></h1>
            <p className="subtitle">Please enter your credentials to continue</p>
          </div>
          
          {successMessage && (
            <div className="message success-message">
              <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="message error-message">
              <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={login} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-group">
                <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input 
                  id="email"
                  type="email" 
                  name="email" 
                  placeholder="Enter your email"
                  value={user.email} 
                  onChange={handleChange}
                  required 
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <input 
                  id="password"
                  type="password" 
                  name="password" 
                  placeholder="Enter your password"
                  value={user.password} 
                  onChange={handleChange}
                  required 
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={handleRememberMe}
                  className="checkbox"
                />
                <label htmlFor="remember" className="checkbox-label">Remember me</label>
              </div>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="login-btn"
                disabled={isLoading}
              >
                <span className="btn-text">{isLoading ? 'Logging in...' : 'Login'}</span>
                {isLoading && <span className="spinner"></span>}
              </button>
              
              <div className="separator">
                <span>OR</span>
              </div>
              
              <button type="button" className="google-btn">
                <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google" className="google-icon" />
                Sign in with Google
              </button>
              
              <div className="register-option">
                <span>Don't have an account?</span>
                <button 
                  type="button" 
                  className="register-btn" 
                  onClick={navigateToRegister}
                >
                  Create Account
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;