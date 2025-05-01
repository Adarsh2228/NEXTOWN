





// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import components
// import Register from './components/Register';
// import Login from './components/Login';
// import BusinessRegistration from './components/BusinessRegistration';
// import BusinessProfile from './components/BusinessProfile';
// import BusinessPromotion from './components/BusinessPromotion';
// import BusinessSearch from './components/BusinessSearch';
// import ChatPage from './components/ChatPage';
// import ChatRequestsPage from './components/ChatRequests';
// import QAPage from './components/QAPages';

// // Service & Product Components
// import ServAddPage from './components/product_page_Service/ServAddPage';
// import ServListPage from './components/product_page_Service/ServListPage';

// function App() {
//   const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId') || null);
//   const [userEmail, setUserEmail] = useState('');

//   const handleLogin = (userId, email) => {
//     localStorage.setItem('userId', userId);
//     setCurrentUserId(userId);
//     setUserEmail(email);
//   };

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setCurrentUserId(storedUserId);
//     }
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         {/* Auth Routes */}
//         <Route path="/" element={<Login onLogin={handleLogin} />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login onLogin={handleLogin} />} />

//         {/* Business Routes */}
//         <Route path="/business/register" element={<BusinessRegistration />} />
//         <Route path="/business/search" element={<BusinessSearch />} />
//         <Route path="/business/:id" element={<BusinessProfile loggedInUserId={currentUserId} />} />
//         <Route path="/business/promotion/:id" element={<BusinessPromotion />} />

//         {/* Service/Product Routes */}
//         <Route path="/business/:id/services/manage" element={<ServAddPage />} />
//         <Route path="/business/:id/products-services" element={<ServListPage loggedInUserId={currentUserId} />} />

//         {/* Chat Routes */}
//         <Route path="/chat/:businessId/:userId" element={<ChatPage loggedInUserId={currentUserId} />} />
//         <Route path="/business/:businessId/chat-requests" element={<ChatRequestsPage loggedInUserId={currentUserId} />} />

//         {/* Q&A Routes */}
//         <Route path="/qa" element={<QAPage userEmail={userEmail} />} />
//         <Route path="/business/:businessId/qa" element={<QAPage loggedInUserId={currentUserId} />} />

//         {/* Catch-All */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;import React, { useState, useEffect } from 'react';



// import React, { useState, useEffect } from 'react';

// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Auth Components
// import Register from './components/Register';
// import Login from './components/Login';

// // Business Components
// import BusinessRegistration from './components/BusinessRegistration';
// import BusinessProfile from './components/BusinessProfile';
// import BusinessPromotion from './components/BusinessPromotion';
// import BusinessSearch from './components/BusinessSearch';

// // Chat & Q&A
// import ChatPage from './components/ChatPage';
// import ChatRequestsPage from './components/ChatRequests';
// import QAPage from './components/QAPages';

// // Product/Service Components
// import ServAddPage from './components/product_page_Service/ServAddPage';
// import ProductsServicesPage from './components/product_page_Service/ProductsServicesPage';
// import EditServicePage from './components/product_page_Service/EditServicePage';

// function App() {
//   const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId') || null);
//   const [userEmail, setUserEmail] = useState('');

//   const handleLogin = (userId, email) => {
//     localStorage.setItem('userId', userId);
//     setCurrentUserId(userId);
//     setUserEmail(email);
//   };

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setCurrentUserId(storedUserId);
//     }
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         {/* Auth Routes */}
//         <Route path="/" element={<Login onLogin={handleLogin} />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login onLogin={handleLogin} />} />

//         {/* Business Routes */}
//         <Route path="/business/register" element={<BusinessRegistration />} />
//         <Route path="/business/search" element={<BusinessSearch />} />
//         <Route path="/business/:id" element={<BusinessProfile loggedInUserId={currentUserId} />} />
//         <Route path="/business/promotion/:id" element={<BusinessPromotion />} />

//         {/* Services / Products Routes */}
//         <Route path="/business/:id/services/manage" element={<ServAddPage />} />
//         <Route
//           path="/business/:id/products-services"
//           element={<ProductsServicesPage currentUserId={currentUserId} />}
//         />
//         <Route path="/edit-service/:id" element={<EditServicePage />} />

//         {/* Chat Routes */}
//         <Route
//           path="/chat/:businessId/:userId"
//           element={<ChatPage loggedInUserId={currentUserId} />}
//         />
//         <Route
//           path="/business/:businessId/chat-requests"
//           element={<ChatRequestsPage loggedInUserId={currentUserId} />}
//         />

//         {/* Q&A Routes */}
//         <Route path="/qa" element={<QAPage userEmail={userEmail} />} />
//         <Route
//           path="/business/:businessId/qa"
//           element={<QAPage loggedInUserId={currentUserId} />}
//         />

//         {/* Fallback Route */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Components
import Register from './components/Register';
import Login from './components/Login';

// Business Components
import BusinessRegistration from './components/BusinessRegistration';
import BusinessProfile from './components/BusinessProfile';
import BusinessPromotion from './components/BusinessPromotion';
import BusinessSearch from './components/BusinessSearch';

// Analytics Page (only one)
import BusinessAnalytics from './components/product_page_Service/BusinessAnalytics';

// Chat & Q&A
import ChatPage from './components/ChatPage';
import ChatRequestsPage from './components/ChatRequests';
import QAPage from './components/QAPages';

// Product/Service Components
import ServAddPage from './components/product_page_Service/ServAddPage';
import ProductsServicesPage from './components/product_page_Service/ProductsServicesPage';
import EditServicePage from './components/product_page_Service/EditServicePage';

function App() {
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId') || null);
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = (userId, email) => {
    localStorage.setItem('userId', userId);
    setCurrentUserId(userId);
    setUserEmail(email);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) setCurrentUserId(storedUserId);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Business */}
        <Route path="/business/register" element={<BusinessRegistration />} />
        <Route path="/business/search" element={<BusinessSearch />} />
        <Route path="/business/:id" element={<BusinessProfile loggedInUserId={currentUserId} />} />
        <Route path="/business/promotion/:id" element={<BusinessPromotion />} />
        <Route path="/business/:id/analytics" element={<BusinessAnalytics />} /> {/* ✅ Analytics route */}

        {/* Products & Services */}
        <Route path="/business/:id/services/manage" element={<ServAddPage />} />
        <Route path="/business/:id/products-services" element={<ProductsServicesPage currentUserId={currentUserId} />} />
        <Route path="/edit-service/:id" element={<EditServicePage />} />

        {/* Chat & Q&A */}
        <Route path="/chat/:businessId/:userId" element={<ChatPage loggedInUserId={currentUserId} />} />
        <Route path="/business/:businessId/chat-requests" element={<ChatRequestsPage loggedInUserId={currentUserId} />} />
        <Route path="/qa" element={<QAPage userEmail={userEmail} />} />
        <Route path="/business/:businessId/qa" element={<QAPage loggedInUserId={currentUserId} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
