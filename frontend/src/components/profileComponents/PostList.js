




// import React, { useState, useEffect, useRef } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { 
//   faHeart as farHeart, 
//   faComment as farComment, 
//   faPaperPlane as farPaperPlane, 
//   faBookmark as farBookmark 
// } from "@fortawesome/free-regular-svg-icons";
// import { 
//   faHeart as fasHeart,
//   faEllipsisH, 
//   faBookmark as fasBookmark,
//   faXmark,
//   faShare
// } from "@fortawesome/free-solid-svg-icons";
// import { QRCodeCanvas } from "qrcode.react";
// import "./PostList.css";

// const PostList = ({ posts = [], error }) => {
//   const [likedPosts, setLikedPosts] = useState({});
//   const [savedPosts, setSavedPosts] = useState({});
//   const [commentVisible, setCommentVisible] = useState({});
//   const [comments, setComments] = useState({});
//   const [shareLinks, setShareLinks] = useState({});
//   const [activeQR, setActiveQR] = useState(null);
//   const [expandedPost, setExpandedPost] = useState(null);
//   const [lscData, setLscData] = useState({});
//   const [isLoading, setIsLoading] = useState({});
//   const [loadingPosts, setLoadingPosts] = useState(true);
//   const [hoverStates, setHoverStates] = useState({});
//   const [animatingLike, setAnimatingLike] = useState({});
  
//   // References for smooth animations
//   const likeAnimationTimeouts = useRef({});
//   const observerRef = useRef(null);
//   const postRefs = useRef({});

//   // ✅ Get current user business name from localStorage
//   const userData = JSON.parse(localStorage.getItem("user")) || {};
//   const businessName = userData?.businessName || "Anonymous";

//   // 🔄 Setup Intersection Observer for lazy loading and animations
//   useEffect(() => {
//     observerRef.current = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           const postId = entry.target.dataset.postid;
//           if (postId) {
//             // Add animation class when post comes into view
//             entry.target.classList.add('post-card-visible');
            
//             // Only fetch if we haven't already
//             if (!lscData[postId]) {
//               fetchLSCData(postId);
//             }
//           }
//         }
//       });
//     }, { threshold: 0.1 });
    
//     // Clean up observer on unmount
//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
      
//       // Clear any pending animation timeouts
//       Object.values(likeAnimationTimeouts.current).forEach(timeout => {
//         clearTimeout(timeout);
//       });
//     };
//   }, []);

//   // Observe post elements when they're added to the DOM
//   useEffect(() => {
//     if (posts.length > 0 && observerRef.current) {
//       setLoadingPosts(false);
      
//       // Give DOM time to update before observing
//       setTimeout(() => {
//         Object.entries(postRefs.current).forEach(([postId, ref]) => {
//           if (ref) {
//             observerRef.current.observe(ref);
//           }
//         });
//       }, 100);
//     }
//   }, [posts]);

//   // 🔄 Fetch LSC Data for a specific post
//   const fetchLSCData = async (postId) => {
//     if (isLoading[postId]) return;
    
//     setIsLoading(prev => ({ ...prev, [postId]: true }));
//     try {
//       const res = await fetch(`http://localhost:4000/api/lsc/${postId}`);
//       if (!res.ok) throw new Error('Failed to fetch LSC data');
      
//       const data = await res.json();
//       setLscData(prev => ({ ...prev, [postId]: data }));
      
//       // Set liked status based on data from server
//       const isLiked = data.likes && data.likes.includes(businessName);
//       setLikedPosts(prev => ({ ...prev, [postId]: isLiked }));
//     } catch (error) {
//       console.error("Failed to load LSC data:", error);
//     } finally {
//       setIsLoading(prev => ({ ...prev, [postId]: false }));
//     }
//   };

//   // ❤️ Toggle Like with animation
//   const toggleLike = async (postId) => {
//     if (isLoading[postId]) return;
    
//     // Start like animation
//     setAnimatingLike(prev => ({ ...prev, [postId]: true }));
    
//     // Clear any existing timeout for this post
//     if (likeAnimationTimeouts.current[postId]) {
//       clearTimeout(likeAnimationTimeouts.current[postId]);
//     }
    
//     // Set a timeout to end the animation
//     likeAnimationTimeouts.current[postId] = setTimeout(() => {
//       setAnimatingLike(prev => ({ ...prev, [postId]: false }));
//     }, 1000);
    
//     setIsLoading(prev => ({ ...prev, [postId]: true }));
    
//     // Optimistic update
//     const newLikedState = !likedPosts[postId];
//     setLikedPosts(prev => ({ ...prev, [postId]: newLikedState }));
    
//     // Update like count optimistically
//     setLscData(prev => {
//       const currentData = prev[postId] || { likes: [] };
//       const currentLikes = [...currentData.likes];
      
//       if (newLikedState && !currentLikes.includes(businessName)) {
//         currentLikes.push(businessName);
//       } else if (!newLikedState) {
//         const index = currentLikes.indexOf(businessName);
//         if (index > -1) currentLikes.splice(index, 1);
//       }
      
//       return { 
//         ...prev, 
//         [postId]: { 
//           ...currentData, 
//           likes: currentLikes 
//         } 
//       };
//     });
    
//     try {
//       const response = await fetch(`http://localhost:4000/api/lsc/${postId}/like`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ businessName }),
//       });
      
//       if (!response.ok) throw new Error('Failed to like post');
      
//       // Refresh data to ensure UI is in sync with server
//       fetchLSCData(postId);
//     } catch (error) {
//       console.error("Failed to like post:", error);
//       // Revert optimistic update on error
//       setLikedPosts(prev => ({ ...prev, [postId]: !newLikedState }));
//       fetchLSCData(postId);
//     } finally {
//       setIsLoading(prev => ({ ...prev, [postId]: false }));
//     }
//   };

//   // Double-click like effect
//   const handleDoubleClick = (postId) => {
//     if (!likedPosts[postId]) {
//       toggleLike(postId);
//     }
//   };

//   // 🔖 Toggle Save Post
//   const toggleSave = (postId) => {
//     setSavedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
//   };

//   // 💬 Toggle Comment Section
//   const toggleCommentVisibility = (postId) => {
//     setCommentVisible(prev => ({ ...prev, [postId]: !prev[postId] }));
//   };

//   // ✍️ Handle Input
//   const handleCommentChange = (postId, event) => {
//     setComments(prev => ({ ...prev, [postId]: event.target.value }));
//   };

//   // 📬 Submit Comment with Business Name
//   const submitComment = async (postId) => {
//     if (!comments[postId]?.trim() || isLoading[postId]) return;
    
//     setIsLoading(prev => ({ ...prev, [postId]: true }));
    
//     try {
//       const response = await fetch(`http://localhost:4000/api/lsc/${postId}/comment`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           text: comments[postId], 
//           user: businessName 
//         }),
//       });
      
//       if (!response.ok) throw new Error('Failed to submit comment');
      
//       // Clear comment input
//       setComments(prev => ({ ...prev, [postId]: "" }));
      
//       // Refresh LSC data to show new comment
//       fetchLSCData(postId);
//     } catch (error) {
//       console.error("Failed to submit comment:", error);
//     } finally {
//       setIsLoading(prev => ({ ...prev, [postId]: false }));
//     }
//   };

//   // 🔗 Share Post (Generate QR code)
//   const sharePost = async (postId) => {
//     if (isLoading[postId]) return;
    
//     setIsLoading(prev => ({ ...prev, [postId]: true }));
    
//     try {
//       // First update the share count on the server
//       await fetch(`http://localhost:4000/api/lsc/${postId}/share`, {
//         method: "POST",
//       });
      
//       // Then generate and display the share link
//       const url = `${window.location.origin}/post/${postId}`;
//       setShareLinks(prev => ({ ...prev, [postId]: url }));
//       setActiveQR(postId);
      
//       // Refresh LSC data
//       fetchLSCData(postId);
//     } catch (error) {
//       console.error("Failed to share post:", error);
//     } finally {
//       setIsLoading(prev => ({ ...prev, [postId]: false }));
//     }
//   };

//   // Modal controls
//   const closeQRModal = () => setActiveQR(null);
//   const expandPost = (post) => setExpandedPost(post);
//   const closeExpandedView = () => setExpandedPost(null);
  
//   // Mouse enter/leave effects
//   const handleMouseEnter = (postId) => {
//     setHoverStates(prev => ({ ...prev, [postId]: true }));
//   };
  
//   const handleMouseLeave = (postId) => {
//     setHoverStates(prev => ({ ...prev, [postId]: false }));
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now - date;
//     const diffSecs = Math.floor(diffMs / 1000);
//     const diffMins = Math.floor(diffSecs / 60);
//     const diffHours = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHours / 24);
    
//     if (diffSecs < 60) return `${diffSecs}s ago`;
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
    
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
//     });
//   };

//   // Handle Enter key press for comments
//   const handleKeyPress = (e, postId) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       submitComment(postId);
//     }
//   };

//   if (loadingPosts) {
//     return (
//       <div className="loading-container">
//         <div className="spinner-grow text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="post-container">
//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}
      
//       {posts.length === 0 && !error && (
//         <div className="empty-state">
//           <div className="empty-icon">📷</div>
//           <h3>No Posts Yet</h3>
//           <p>Share your first moment or follow others to see their posts</p>
//         </div>
//       )}

//       <div className="post-grid">
//         {posts.map(post => {
//           const postLscData = lscData[post._id] || { likes: [], comments: [] };
//           const likeCount = postLscData.likes?.length || 0;
//           const commentCount = postLscData.comments?.length || 0;
//           const isPostLiked = likedPosts[post._id] || false;
//           const isPostSaved = savedPosts[post._id] || false;
//           const isHovered = hoverStates[post._id] || false;
          
//           return (
//             <div 
//               key={post._id} 
//               className="post-card" 
//               data-postid={post._id}
//               ref={el => postRefs.current[post._id] = el}
//               onMouseEnter={() => handleMouseEnter(post._id)}
//               onMouseLeave={() => handleMouseLeave(post._id)}
//             >
//               {/* Post Header */}
//               <div className="post-header">
//                 <div className="user-info">
//                   <div className="avatar-container">
//                     <img 
//                       src={`https://ui-avatars.com/api/?name=${post.author || 'User'}&background=random&bold=true&rounded=true`} 
//                       alt="User avatar" 
//                       className="avatar" 
//                     />
//                   </div>
//                   <div className="user-details">
//                     <span className="username">{post.author || 'User'}</span>
//                     <span className="location">{post.location || 'Somewhere amazing'}</span>
//                   </div>
//                 </div>
//                 <button className="action-button options-btn">
//                   <FontAwesomeIcon icon={faEllipsisH} />
//                 </button>
//               </div>
              
//               {/* 📷 Media Container */}
//               <div className="media-container" onDoubleClick={() => handleDoubleClick(post._id)}>
//                 {animatingLike[post._id] && (
//                   <div className="heart-animation">
//                     <FontAwesomeIcon icon={fasHeart} />
//                   </div>
//                 )}
                
//                 {post.images?.[0] && (
//                   <img
//                     src={`http://localhost:4000/${post.images[0]}`}
//                     alt="Post content"
//                     className="post-media"
//                     onClick={() => expandPost(post)}
//                     loading="lazy"
//                   />
//                 )}
//                 {post.videos?.[0] && (
//                   <div className="video-wrapper">
//                     <video className="post-media" controls onClick={() => expandPost(post)}>
//                       <source src={`http://localhost:4000/${post.videos[0]}`} type="video/mp4" />
//                       Your browser doesn't support HTML5 video.
//                     </video>
//                   </div>
//                 )}
//               </div>

//               {/* 🛠 Actions Bar */}
//               <div className="post-actions">
//                 <div className="action-group">
//                   <button 
//                     className={`action-button ${isPostLiked ? 'liked' : ''}`} 
//                     onClick={() => toggleLike(post._id)}
//                     disabled={isLoading[post._id]}
//                   >
//                     <FontAwesomeIcon 
//                       icon={isPostLiked ? fasHeart : farHeart} 
//                       className={isPostLiked ? 'text-danger' : ''} 
//                     />
//                   </button>
//                   <button 
//                     className="action-button" 
//                     onClick={() => toggleCommentVisibility(post._id)}
//                   >
//                     <FontAwesomeIcon icon={farComment} />
//                   </button>
//                   <button 
//                     className="action-button" 
//                     onClick={() => sharePost(post._id)}
//                     disabled={isLoading[post._id]}
//                   >
//                     <FontAwesomeIcon icon={faShare} />
//                   </button>
//                 </div>
//                 <button 
//                   className="action-button bookmark-btn" 
//                   onClick={() => toggleSave(post._id)}
//                 >
//                   <FontAwesomeIcon 
//                     icon={isPostSaved ? fasBookmark : farBookmark} 
//                     className={isPostSaved ? 'text-warning' : ''} 
//                   />
//                 </button>
//               </div>

//               {/* Post Details */}
//               <div className="post-details">
//                 {/* Like Count */}
//                 {likeCount > 0 && (
//                   <div className="likes-display">
//                     <strong>{likeCount.toLocaleString()}</strong> {likeCount === 1 ? 'like' : 'likes'}
//                   </div>
//                 )}
                
//                 {/* Caption */}
//                 {post.caption && (
//                   <div className="caption">
//                     <span className="username">{post.author || 'User'}</span> {post.caption}
//                   </div>
//                 )}
                
//                 {/* Comment Count */}
//                 {commentCount > 0 && !commentVisible[post._id] && (
//                   <button 
//                     className="view-comments-btn"
//                     onClick={() => toggleCommentVisibility(post._id)}
//                   >
//                     View all {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
//                   </button>
//                 )}
                
//                 {/* Timestamp */}
//                 <div className="post-timestamp">
//                   {formatDate(post.createdAt)}
//                 </div>
//               </div>

//               {/* 💬 Comments Section */}
//               {commentVisible[post._id] && (
//                 <div className="comment-section">
//                   <div className="past-comments">
//                     {postLscData.comments && postLscData.comments.length > 0 ? (
//                       postLscData.comments.map((comment, index) => (
//                         <div key={index} className="comment">
//                           <span className="comment-username">{comment.user}</span>
//                           <span className="comment-text">{comment.text}</span>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="no-comments">No comments yet. Be the first to comment!</p>
//                     )}
//                   </div>
//                   <div className="comment-input-container">
//                     <input
//                       type="text"
//                       placeholder="Add a comment..."
//                       value={comments[post._id] || ""}
//                       onChange={(e) => handleCommentChange(post._id, e)}
//                       onKeyPress={(e) => handleKeyPress(e, post._id)}
//                       className="comment-input"
//                     />
//                     <button 
//                       className={`post-comment-btn ${!comments[post._id]?.trim() ? 'disabled' : ''}`}
//                       onClick={() => submitComment(post._id)}
//                       disabled={!comments[post._id]?.trim() || isLoading[post._id]}
//                     >
//                       {isLoading[post._id] ? (
//                         <div className="spinner-border spinner-border-sm" role="status">
//                           <span className="visually-hidden">Loading...</span>
//                         </div>
//                       ) : (
//                         'Post'
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* 📲 QR Modal for Sharing */}
//       {activeQR && (
//         <div className="qr-modal-overlay" onClick={closeQRModal}>
//           <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="close-modal-btn" onClick={closeQRModal}>
//               <FontAwesomeIcon icon={faXmark} />
//             </button>
//             <h4>Share This Post</h4>
//             <div className="qr-container">
//               <QRCodeCanvas value={shareLinks[activeQR]} size={200} bgColor="#ffffff" fgColor="#000000" level="H" />
//             </div>
//             <div className="share-link-container">
//               <input type="text" readOnly value={shareLinks[activeQR]} className="share-link-input" />
//               <button 
//                 className="copy-link-btn"
//                 onClick={() => {
//                   navigator.clipboard.writeText(shareLinks[activeQR]);
//                   // You could add a toast notification here
//                 }}
//               >
//                 Copy
//               </button>
//             </div>
//             <div className="share-options">
//               <button className="share-option">
//                 <i className="fab fa-facebook"></i>
//                 Facebook
//               </button>
//               <button className="share-option">
//                 <i className="fab fa-twitter"></i>
//                 Twitter
//               </button>
//               <button className="share-option">
//                 <i className="fab fa-instagram"></i>
//                 Instagram
//               </button>
//               <button className="share-option">
//                 <i className="fab fa-whatsapp"></i>
//                 WhatsApp
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🔍 Full Post Modal */}
//       {expandedPost && (
//         <div className="expanded-post-overlay" onClick={closeExpandedView}>
//           <div className="expanded-post-container" onClick={(e) => e.stopPropagation()}>
//             <button className="close-expanded-btn" onClick={closeExpandedView}>
//               <FontAwesomeIcon icon={faXmark} />
//             </button>
            
//             <div className="expanded-post-content">
//               {/* Left side - Media */}
//               <div className="expanded-media-container">
//                 {expandedPost.images?.[0] && (
//                   <img 
//                     src={`http://localhost:4000/${expandedPost.images[0]}`} 
//                     alt="Post content" 
//                     className="expanded-media"
//                   />
//                 )}
//                 {expandedPost.videos?.[0] && (
//                   <video controls className="expanded-media">
//                     <source src={`http://localhost:4000/${expandedPost.videos[0]}`} type="video/mp4" />
//                     Your browser doesn't support HTML5 video.
//                   </video>
//                 )}
//               </div>
              
//               {/* Right side - Details */}
//               <div className="expanded-details">
//                 {/* Header */}
//                 <div className="expanded-header">
//                   <div className="user-info">
//                     <img 
//                       src={`https://ui-avatars.com/api/?name=${expandedPost.author || 'User'}&background=random&bold=true&rounded=true`} 
//                       alt="User avatar" 
//                       className="avatar" 
//                     />
//                     <div>
//                       <div className="username">{expandedPost.author || 'User'}</div>
//                       <div className="location">{expandedPost.location || 'Somewhere amazing'}</div>
//                     </div>
//                   </div>
//                   <button className="action-button">
//                     <FontAwesomeIcon icon={faEllipsisH} />
//                   </button>
//                 </div>
                
//                 {/* Comments area */}
//                 <div className="expanded-comments-container">
//                   {/* Caption as first comment */}
//                   {expandedPost.caption && (
//                     <div className="expanded-comment">
//                       <img 
//                         src={`https://ui-avatars.com/api/?name=${expandedPost.author || 'User'}&background=random&bold=true&rounded=true`} 
//                         alt="User avatar" 
//                         className="comment-avatar" 
//                       />
//                       <div className="comment-content">
//                         <span className="comment-username">{expandedPost.author || 'User'}</span>
//                         <span className="comment-text">{expandedPost.caption}</span>
//                         <div className="comment-timestamp">{formatDate(expandedPost.createdAt)}</div>
//                       </div>
//                     </div>
//                   )}
                  
//                   {/* Other comments */}
//                   {lscData[expandedPost._id]?.comments?.map((comment, index) => (
//                     <div key={index} className="expanded-comment">
//                       <img 
//                         src={`https://ui-avatars.com/api/?name=${comment.user}&background=random&bold=true&rounded=true`} 
//                         alt="User avatar" 
//                         className="comment-avatar" 
//                       />
//                       <div className="comment-content">
//                         <span className="comment-username">{comment.user}</span>
//                         <span className="comment-text">{comment.text}</span>
//                         <div className="comment-timestamp">{formatDate(comment.timestamp)}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 {/* Actions bar */}
//                 <div className="expanded-actions">
//                   <div className="action-group">
//                     <button 
//                       className={`action-button ${likedPosts[expandedPost._id] ? 'liked' : ''}`}
//                       onClick={() => toggleLike(expandedPost._id)}
//                     >
//                       <FontAwesomeIcon 
//                         icon={likedPosts[expandedPost._id] ? fasHeart : farHeart} 
//                         className={likedPosts[expandedPost._id] ? 'text-danger' : ''} 
//                       />
//                     </button>
//                     <button className="action-button">
//                       <FontAwesomeIcon icon={farComment} />
//                     </button>
//                     <button 
//                       className="action-button"
//                       onClick={() => sharePost(expandedPost._id)}
//                     >
//                       <FontAwesomeIcon icon={faShare} />
//                     </button>
//                   </div>
//                   <button 
//                     className="action-button bookmark-btn"
//                     onClick={() => toggleSave(expandedPost._id)}
//                   >
//                     <FontAwesomeIcon 
//                       icon={savedPosts[expandedPost._id] ? fasBookmark : farBookmark} 
//                       className={savedPosts[expandedPost._id] ? 'text-warning' : ''} 
//                     />
//                   </button>
//                 </div>
                
//                 {/* Like count */}
//                 <div className="expanded-likes">
//                   {(lscData[expandedPost._id]?.likes?.length || 0) > 0 ? (
//                     <strong>{(lscData[expandedPost._id]?.likes?.length || 0).toLocaleString()}</strong>
//                   ) : 'No'} {(lscData[expandedPost._id]?.likes?.length || 0) === 1 ? 'like' : 'likes'}
//                 </div>
                
//                 {/* Timestamp */}
//                 <div className="expanded-timestamp">
//                   {formatDate(expandedPost.createdAt)}
//                 </div>
                
//                 {/* Comment input */}
//                 <div className="expanded-comment-input">
//                   <input
//                     type="text"
//                     placeholder="Add a comment..."
//                     value={comments[expandedPost._id] || ""}
//                     onChange={(e) => handleCommentChange(expandedPost._id, e)}
//                     onKeyPress={(e) => handleKeyPress(e, expandedPost._id)}
//                   />
//                   <button 
//                     className={`post-comment-btn ${!comments[expandedPost._id]?.trim() ? 'disabled' : ''}`}
//                     onClick={() => submitComment(expandedPost._id)}
//                     disabled={!comments[expandedPost._id]?.trim() || isLoading[expandedPost._id]}
//                   >
//                     Post
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostList;






import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  X, 
  Share2,
  Check,
  Star,
  StarHalf
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import "./PostList.css";

const PostList = ({ posts = [], error }) => {
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [commentVisible, setCommentVisible] = useState({});
  const [comments, setComments] = useState({});
  const [shareLinks, setShareLinks] = useState({});
  const [activeQR, setActiveQR] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [lscData, setLscData] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [hoverStates, setHoverStates] = useState({});
  const [animatingLike, setAnimatingLike] = useState({});
  const [copied, setCopied] = useState(false);
  // Add rating state
  const [postRatings, setPostRatings] = useState({});
  const [hoverRating, setHoverRating] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [activeRatingPost, setActiveRatingPost] = useState(null);
  
  // References for smooth animations
  const likeAnimationTimeouts = useRef({});
  const observerRef = useRef(null);
  const postRefs = useRef({});

  // Get current user business name from localStorage
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const businessName = userData?.businessName || "Anonymous";

  // Add Bootstrap CSS to head
  useEffect(() => {
    // Add Bootstrap CSS
    const bootstrapCSS = document.createElement("link");
    bootstrapCSS.rel = "stylesheet";
    bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
    bootstrapCSS.integrity = "sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN";
    bootstrapCSS.crossOrigin = "anonymous";
    document.head.appendChild(bootstrapCSS);

    // Add Bootstrap Icons
    const bootstrapIcons = document.createElement("link");
    bootstrapIcons.rel = "stylesheet";
    bootstrapIcons.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css";
    document.head.appendChild(bootstrapIcons);

    // Add Font Awesome
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
    document.head.appendChild(fontAwesome);

    // Add Bootstrap JS
    const bootstrapJS = document.createElement("script");
    bootstrapJS.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js";
    bootstrapJS.integrity = "sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL";
    bootstrapJS.crossOrigin = "anonymous";
    document.body.appendChild(bootstrapJS);

    // Clean up function
    return () => {
      document.head.removeChild(bootstrapCSS);
      document.head.removeChild(bootstrapIcons);
      document.head.removeChild(fontAwesome);
      document.body.removeChild(bootstrapJS);
    };
  }, []);

  // Setup Intersection Observer for lazy loading and animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const postId = entry.target.dataset.postid;
          if (postId) {
            // Add animation class when post comes into view
            entry.target.classList.add('post-card-visible');
            
            // Only fetch if we haven't already
            if (!lscData[postId]) {
              fetchLSCData(postId);
            }
          }
        }
      });
    }, { threshold: 0.1 });
    
    // Clean up observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      // Clear any pending animation timeouts
      Object.values(likeAnimationTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // Observe post elements when they're added to the DOM
  useEffect(() => {
    if (posts.length > 0 && observerRef.current) {
      setLoadingPosts(false);
      
      // Give DOM time to update before observing
      setTimeout(() => {
        Object.entries(postRefs.current).forEach(([postId, ref]) => {
          if (ref) {
            observerRef.current.observe(ref);
          }
        });
      }, 100);
    }
  }, [posts]);

  // Fetch LSC Data for a specific post
  const fetchLSCData = async (postId) => {
    if (isLoading[postId]) return;
    
    setIsLoading(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch(`http://localhost:4000/api/lsc/${postId}`);
      if (!res.ok) throw new Error('Failed to fetch LSC data');
      
      const data = await res.json();
      setLscData(prev => ({ ...prev, [postId]: data }));
      
      // Set liked status based on data from server
      const isLiked = data.likes && data.likes.includes(businessName);
      setLikedPosts(prev => ({ ...prev, [postId]: isLiked }));
      
      // Set rating if available
      if (data.ratings) {
        const userRating = data.ratings.find(r => r.user === businessName);
        if (userRating) {
          setPostRatings(prev => ({ ...prev, [postId]: userRating.rating }));
        }
        
        // Calculate average rating for display
        if (data.ratings.length > 0) {
          const sum = data.ratings.reduce((acc, curr) => acc + curr.rating, 0);
          const avg = sum / data.ratings.length;
          data.averageRating = avg.toFixed(1);
          setLscData(prev => ({ ...prev, [postId]: data }));
        }
      }
    } catch (error) {
      console.error("Failed to load LSC data:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Toggle Like with animation
  const toggleLike = async (postId) => {
    if (isLoading[postId]) return;
    
    // Start like animation
    setAnimatingLike(prev => ({ ...prev, [postId]: true }));
    
    // Clear any existing timeout for this post
    if (likeAnimationTimeouts.current[postId]) {
      clearTimeout(likeAnimationTimeouts.current[postId]);
    }
    
    // Set a timeout to end the animation
    likeAnimationTimeouts.current[postId] = setTimeout(() => {
      setAnimatingLike(prev => ({ ...prev, [postId]: false }));
    }, 1000);
    
    setIsLoading(prev => ({ ...prev, [postId]: true }));
    
    // Optimistic update
    const newLikedState = !likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: newLikedState }));
    
    // Update like count optimistically
    setLscData(prev => {
      const currentData = prev[postId] || { likes: [] };
      const currentLikes = [...currentData.likes || []];
      
      if (newLikedState && !currentLikes.includes(businessName)) {
        currentLikes.push(businessName);
      } else if (!newLikedState) {
        const index = currentLikes.indexOf(businessName);
        if (index > -1) currentLikes.splice(index, 1);
      }
      
      return { 
        ...prev, 
        [postId]: { 
          ...currentData, 
          likes: currentLikes 
        } 
      };
    });
    
    try {
      const response = await fetch(`http://localhost:4000/api/lsc/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ businessName }),
      });
      
      if (!response.ok) throw new Error('Failed to like post');
      
      // Refresh data to ensure UI is in sync with server
      fetchLSCData(postId);
    } catch (error) {
      console.error("Failed to like post:", error);
      // Revert optimistic update on error
      setLikedPosts(prev => ({ ...prev, [postId]: !newLikedState }));
      fetchLSCData(postId);
    } finally {
      setIsLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Submit rating
  const submitRating = async (postId, rating) => {
    if (isLoading[postId]) return;
    
    setIsLoading(prev => ({ ...prev, [postId]: true }));
    
    // Optimistic update
    setPostRatings(prev => ({ ...prev, [postId]: rating }));
    
    try {
      const response = await fetch(`http://localhost:4000/api/lsc/${postId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user: businessName,
          rating 
        }),
      });
      
      if (!response.ok) throw new Error('Failed to submit rating');
      
      // Close the rating modal
      setShowRatingModal(false);
      setActiveRatingPost(null);
      
      // Refresh LSC data to update average rating
      fetchLSCData(postId);
      
      // Show success toast
      showToast(`You rated this product ${rating} stars!`);
    } catch (error) {
      console.error("Failed to submit rating:", error);
      // Revert optimistic update on error
      setPostRatings(prev => {
        const newState = { ...prev };
        delete newState[postId];
        return newState;
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Show toast message
  const showToast = (message) => {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = 'toast show';
    toastEl.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">Notification</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;
    
    toastContainer.appendChild(toastEl);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      toastEl.remove();
    }, 3000);
  };

  // Open rating modal
  const openRatingModal = (postId) => {
    setActiveRatingPost(postId);
    setShowRatingModal(true);
  };

  // Double-click like effect
  const handleDoubleClick = (postId) => {
    if (!likedPosts[postId]) {
      toggleLike(postId);
    }
  };

  // Toggle Save Post
  const toggleSave = (postId) => {
    setSavedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    showToast(savedPosts[postId] ? "Post removed from saved items" : "Post saved to collection");
  };

  // Toggle Comment Section
  const toggleCommentVisibility = (postId) => {
    setCommentVisible(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Handle Input
  const handleCommentChange = (postId, event) => {
    setComments(prev => ({ ...prev, [postId]: event.target.value }));
  };

  // Submit Comment with Business Name
  const submitComment = async (postId) => {
    if (!comments[postId]?.trim() || isLoading[postId]) return;
    
    setIsLoading(prev => ({ ...prev, [postId]: true }));
    
    try {
      const response = await fetch(`http://localhost:4000/api/lsc/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: comments[postId], 
          user: businessName 
        }),
      });
      
      if (!response.ok) throw new Error('Failed to submit comment');
      
      // Clear comment input
      setComments(prev => ({ ...prev, [postId]: "" }));
      
      // Refresh LSC data to show new comment
      fetchLSCData(postId);
      
      // Show success toast
      showToast("Comment posted successfully!");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      showToast("Failed to post comment. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Share Post (Generate QR code)
  const sharePost = async (postId) => {
    if (isLoading[postId]) return;
    
    setIsLoading(prev => ({ ...prev, [postId]: true }));
    
    try {
      // First update the share count on the server
      await fetch(`http://localhost:4000/api/lsc/${postId}/share`, {
        method: "POST",
      });
      
      // Then generate and display the share link
      const url = `${window.location.origin}/post/${postId}`;
      setShareLinks(prev => ({ ...prev, [postId]: url }));
      setActiveQR(postId);
      
      // Refresh LSC data
      fetchLSCData(postId);
    } catch (error) {
      console.error("Failed to share post:", error);
      showToast("Failed to share post. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Copy link to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Modal controls
  const closeQRModal = () => setActiveQR(null);
  const expandPost = (post) => setExpandedPost(post);
  const closeExpandedView = () => setExpandedPost(null);
  const closeRatingModal = () => {
    setShowRatingModal(false);
    setActiveRatingPost(null);
    setHoverRating({});
  };
  
  // Mouse enter/leave effects for posts
  const handleMouseEnter = (postId) => {
    setHoverStates(prev => ({ ...prev, [postId]: true }));
  };
  
  const handleMouseLeave = (postId) => {
    setHoverStates(prev => ({ ...prev, [postId]: false }));
  };
  
  // Mouse enter/leave effects for star ratings
// Modify the handleStarHover function to update both the hover state and the rating state
const handleStarHover = (postId, rating) => {
  setHoverRating(prev => ({ ...prev, [postId]: rating }));
  // Also update the postRatings when hovering
  setPostRatings(prev => ({ ...prev, [postId]: rating }));
};

// Update handleStarLeave to NOT clear the rating when mouse leaves
const handleStarLeave = (postId) => {
  // Only clear the hover state, but keep the selected rating
  setHoverRating(prev => {
    const newState = { ...prev };
    delete newState[postId];
    return newState;
  });
  // Do NOT reset the postRatings so the selection remains visible
};
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  // Handle Enter key press for comments
  const handleKeyPress = (e, postId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitComment(postId);
    }
  };

  // Render star rating component// Render star rating component
const renderStars = (rating, postId, interactive = false) => {
  const stars = [];
  // Update this line to maintain the selected rating even after leaving
  const displayRating = hoverRating[postId] || postRatings[postId] || rating || 0;
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span 
        key={i}
        className={`star ${interactive ? 'interactive' : ''} ${displayRating >= i ? 'filled' : ''}`}
        onClick={interactive ? () => submitRating(postId, i) : undefined}
        onMouseEnter={interactive ? () => handleStarHover(postId, i) : undefined}
        onMouseLeave={interactive ? () => handleStarLeave(postId) : undefined}
      >
        {displayRating >= i ? (
          <Star fill="#f39c12" color="#f39c12" size={interactive ? 32 : 16} />
        ) : displayRating >= i - 0.5 ? (
          <StarHalf fill="#f39c12" color="#f39c12" size={interactive ? 32 : 16} />
        ) : (
          <Star color="#aaa" size={interactive ? 32 : 16} />
        )}
      </span>
    );
  }
  
  return <div className={`star-rating ${interactive ? 'interactive' : ''}`}>{stars}</div>;
};
  if (loadingPosts) {
    return (
      <div className="loading-container d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="post-container">
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}
      
      {posts.length === 0 && !error && (
        <div className="empty-state card text-center p-5 shadow-sm">
          <div className="empty-icon mb-3">
            <i className="bi bi-camera text-muted" style={{ fontSize: '3rem' }}></i>
          </div>
          <h3 className="fw-bold">No Posts Yet</h3>
          <p className="text-muted">Share your first moment or follow others to see their posts</p>
          <button className="btn btn-primary mt-3">
            <i className="bi bi-plus-circle me-2"></i>Create Post
          </button>
        </div>
      )}

      <div className="post-grid row g-4">
        {posts.map(post => {
          const postLscData = lscData[post._id] || { likes: [], comments: [], ratings: [] };
          const likeCount = postLscData.likes?.length || 0;
          const commentCount = postLscData.comments?.length || 0;
          const userRating = postRatings[post._id] || 0;
          const averageRating = postLscData.averageRating || 0;
          const ratingCount = postLscData.ratings?.length || 0;
          const isPostLiked = likedPosts[post._id] || false;
          const isPostSaved = savedPosts[post._id] || false;
          const isHovered = hoverStates[post._id] || false;
          
          return (
            <div 
              key={post._id}
              className="col-12 col-md-6 col-lg-4"
            >
              <div 
                className="post-card card shadow border-0 overflow-hidden h-100" 
                data-postid={post._id}
                ref={el => postRefs.current[post._id] = el}
                onMouseEnter={() => handleMouseEnter(post._id)}
                onMouseLeave={() => handleMouseLeave(post._id)}
              >
                {/* Post Header */}
                <div className="post-header card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center p-3">
                  <div className="user-info d-flex align-items-center">
                    <div className="avatar-container me-2">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${post.author || 'User'}&background=random&bold=true&rounded=true`} 
                        alt="User avatar" 
                        className="avatar rounded-circle" 
                        width="38"
                        height="38"
                      />
                    </div>
                    <div className="user-details">
                      <div className="username fw-bold text-dark">{post.author || 'User'}</div>
                      <div className="location text-muted small">
                        <i className="bi bi-geo-alt-fill me-1"></i>
                        {post.location || 'Somewhere amazing'}
                      </div>
                    </div>
                  </div>
                  <div className="dropdown">
                    <button 
                      className="btn btn-sm btn-light rounded-circle" 
                      id={`dropdownMenuButton-${post._id}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenuButton-${post._id}`}>
                      <li><button className="dropdown-item" onClick={() => openRatingModal(post._id)}>
                        <i className="bi bi-star-fill me-2 text-warning"></i>Rate Product
                      </button></li>
                      <li><button className="dropdown-item" onClick={() => sharePost(post._id)}>
                        <i className="bi bi-share me-2"></i>Share
                      </button></li>
                      <li><button className="dropdown-item" onClick={() => toggleSave(post._id)}>
                        <i className={`bi ${isPostSaved ? 'bi-bookmark-fill text-primary' : 'bi-bookmark'} me-2`}></i>
                        {isPostSaved ? 'Unsave' : 'Save'}
                      </button></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger">
                        <i className="bi bi-flag me-2"></i>Report
                      </button></li>
                    </ul>
                  </div>
                </div>
                
                {/* Media Container */}
                <div 
                  className="media-container position-relative" 
                  onDoubleClick={() => handleDoubleClick(post._id)}
                >
                  {animatingLike[post._id] && (
                    <div className="heart-animation position-absolute top-50 start-50 translate-middle">
                      <Heart fill="red" color="red" size={80} className="heart-pulse" />
                    </div>
                  )}
                  
                  {post.images?.[0] && (
                    <img
                      src={`http://localhost:4000/${post.images[0]}`}
                      alt="Post content"
                      className="post-media card-img-top"
                      onClick={() => expandPost(post)}
                      loading="lazy"
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                  )}
                  {post.videos?.[0] && (
                    <div className="video-wrapper">
                      <video 
                        className="post-media w-100" 
                        controls 
                        onClick={() => expandPost(post)}
                        style={{ height: '300px', objectFit: 'cover' }}
                      >
                        <source src={`http://localhost:4000/${post.videos[0]}`} type="video/mp4" />
                        Your browser doesn't support HTML5 video.
                      </video>
                    </div>
                  )}
                  
                  {/* Product badge */}
                  <div className="position-absolute top-0 start-0 m-2">
                    <span className="badge bg-primary">
                      <i className="bi bi-tag-fill me-1"></i>Product
                    </span>
                  </div>
                </div>

                <div className="card-body pb-0">
                  {/* Product Rating Display */}
                  <div className="product-rating d-flex align-items-center mb-2">
                    {renderStars(averageRating, post._id)}
                    <span className="ms-2 text-muted small">
                      {averageRating > 0 ? (
                        <>
                          <span className="fw-bold">{averageRating}</span>/5 
                          <span className="ms-1">({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
                        </>
                      ) : (
                        'No ratings yet'
                      )}
                    </span>
                    <button 
                      className="btn btn-sm btn-outline-warning ms-auto" 
                      onClick={() => openRatingModal(post._id)}
                    >
                      <i className="bi bi-star me-1"></i>
                      {userRating > 0 ? 'Update Rating' : 'Rate'}
                    </button>
                  </div>

                  {/* Caption */}
                  {post.caption && (
                    <div className="caption mb-3">
                      <p className="card-text">
                        <span className="fw-bold me-1">{post.author || 'User'}</span>
                        {post.caption}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="post-actions card-footer bg-white border-top-0 pt-0">
                  <div className="d-flex">
                    <div className="action-group d-flex">
                      <button 
                        className={`btn btn-sm btn-link ${isPostLiked ? 'text-danger' : 'text-dark'}`}
                        onClick={() => toggleLike(post._id)}
                        disabled={isLoading[post._id]}
                      >
                        <Heart 
                          size={22} 
                          fill={isPostLiked ? "red" : "none"} 
                          color={isPostLiked ? "red" : "currentColor"} 
                        />
                        {likeCount > 0 && <span className="ms-1">{likeCount}</span>}
                      </button>
                      <button 
                        className="btn btn-sm btn-link text-dark"
                        onClick={() => toggleCommentVisibility(post._id)}
                      >
                        <MessageCircle size={22} />
                        {commentCount > 0 && <span className="ms-1">{commentCount}</span>}
                      </button>
                      <button 
                        className="btn btn-sm btn-link text-dark"
                        onClick={() => sharePost(post._id)}
                        disabled={isLoading[post._id]}
                      >
                        <Share2 size={22} />
                      </button>
                    </div>
                    <button 
                      className="btn btn-sm btn-link ms-auto"
                      onClick={() => toggleSave(post._id)}
                    >
                      <Bookmark 
                        size={22} 
                        fill={isPostSaved ? "#f39c12" : "none"} 
                        color={isPostSaved ? "#f39c12" : "currentColor"} 
                      />
                    </button>
                  </div>

                  {/* Post Details */}
                  <div className="post-details">
                    {/* Like Count */}
                    {likeCount > 0 && (
                      <div className="likes-display mt-2">
                        <strong>{likeCount.toLocaleString()}</strong> {likeCount === 1 ? 'like' : 'likes'}
                      </div>
                    )}
                    
                    {/* Comment Count */}
                    {commentCount > 0 && !commentVisible[post._id] && (
                      <button 
                        className="btn btn-sm btn-link p-0 mt-1 text-muted"
                        onClick={() => toggleCommentVisibility(post._id)}
                      >
                        View all {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                      </button>
                    )}
                    
                    {/* Timestamp */}
                    <div className="post-timestamp text-muted small mt-2">
                      <i className="bi bi-clock me-1"></i>
                      {formatDate(post.createdAt)}
                    </div>
                  </div>

             
{commentVisible[post._id] && (
  <div className="comment-section mt-3 pt-3 border-top">
    <h6 className="fw-bold mb-3">
      <i className="bi bi-chat-left-text me-2"></i>
      Comments ({commentCount})
    </h6>
    
    <div className="past-comments">
      {postLscData.comments && postLscData.comments.length > 0 ? (
        postLscData.comments.map((comment, index) => (
          <div key={index} className="comment d-flex mb-3">
            <img 
              src={`https://ui-avatars.com/api/?name=${comment.user}&background=random&bold=true&rounded=true`} 
              alt="User avatar" 
              className="rounded-circle me-2" 
              width="32"
              height="32"
            />
            <div className="comment-bubble p-2 bg-light rounded flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="comment-username fw-bold">{comment.user}</span>
                <small className="text-muted">{formatDate(comment.timestamp)}</small>
              </div>
              <p className="comment-text m-0">{comment.text}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-3 text-muted">
          <i className="bi bi-chat-square me-2"></i>
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
    
    <div className="comment-input-container d-flex mt-3">
      <div className="input-group">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comments[post._id] || ""}
          onChange={(e) => handleCommentChange(post._id, e)}
          onKeyPress={(e) => handleKeyPress(e, post._id)}
          className="form-control"
        />
        <button 
          className="btn btn-primary"
          onClick={() => submitComment(post._id)}
          disabled={!comments[post._id]?.trim() || isLoading[post._id]}
        >
          {isLoading[post._id] ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  </div>
)}
</div>
</div>
</div>
);
})}
</div>

{/* QR Modal for Sharing */}
{activeQR && (
<div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" onClick={closeQRModal}>
<div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
<div className="modal-content">
<div className="modal-header">
<h5 className="modal-title">
<i className="bi bi-share-fill me-2 text-primary"></i>
Share This Post
</h5>
<button type="button" className="btn-close" onClick={closeQRModal}></button>
</div>
<div className="modal-body text-center">
<div className="qr-container p-3 bg-light rounded mb-3">
<QRCodeCanvas value={shareLinks[activeQR]} size={200} bgColor="#ffffff" fgColor="#000000" level="H" />
</div>
<div className="input-group mb-3">
<input type="text" readOnly value={shareLinks[activeQR]} className="form-control" />
<button 
  className="btn btn-outline-primary"
  onClick={() => copyToClipboard(shareLinks[activeQR])}
>
  {copied ? <Check size={16} /> : "Copy"}
</button>
</div>
<div className="share-options d-flex justify-content-center flex-wrap gap-2">
<button className="btn btn-sm btn-primary" title="Share on Facebook">
  <i className="fab fa-facebook me-2"></i>Facebook
</button>
<button className="btn btn-sm btn-info text-white" title="Share on Twitter">
  <i className="fab fa-twitter me-2"></i>Twitter
</button>
<button className="btn btn-sm btn-danger" title="Share on Instagram">
  <i className="fab fa-instagram me-2"></i>Instagram
</button>
<button className="btn btn-sm btn-success" title="Share on WhatsApp">
  <i className="fab fa-whatsapp me-2"></i>WhatsApp
</button>
</div>
</div>
</div>
</div>
</div>
)}

{activeQR && <div className="modal-backdrop fade show"></div>}

{/* Rating Modal */}
{showRatingModal && (
<div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" onClick={closeRatingModal}>
<div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
<div className="modal-content">
<div className="modal-header">
<h5 className="modal-title">
<i className="bi bi-star-fill me-2 text-warning"></i>
Rate This Product
</h5>
<button type="button" className="btn-close" onClick={closeRatingModal}></button>
</div>
<div className="modal-body text-center">
<p className="mb-4">How would you rate this product?</p>
{renderStars(postRatings[activeRatingPost], activeRatingPost, true)}
<div className="rating-labels d-flex justify-content-between px-4 mt-2 text-muted">
<span>Poor</span>
<span>Excellent</span>
</div>
<div className="current-rating mt-4">
{hoverRating[activeRatingPost] || postRatings[activeRatingPost] ? (
  <div className="alert alert-info">
    You've selected <strong>{hoverRating[activeRatingPost] || postRatings[activeRatingPost]}</strong> stars
  </div>
) : (
  <div className="alert alert-secondary">
    Tap on a star to rate
  </div>
)}
</div>
</div>
<div className="modal-footer">
<button type="button" className="btn btn-secondary" onClick={closeRatingModal}>Cancel</button>
<button 
type="button" 
className="btn btn-primary" 
disabled={!postRatings[activeRatingPost] && !hoverRating[activeRatingPost]}
onClick={() => submitRating(activeRatingPost, hoverRating[activeRatingPost] || postRatings[activeRatingPost])}
>
Submit Rating
</button>
</div>
</div>
</div>
</div>
)}

{showRatingModal && <div className="modal-backdrop fade show"></div>}

{/* Full Post Modal */}
{expandedPost && (
<div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" onClick={closeExpandedView}>
<div className="modal-dialog modal-xl modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
<div className="modal-content">
<div className="modal-header">
<div className="user-info d-flex align-items-center">
<img 
  src={`https://ui-avatars.com/api/?name=${expandedPost.author || 'User'}&background=random&bold=true&rounded=true`} 
  alt="User avatar" 
  className="avatar rounded-circle me-2" 
  width="38"
  height="38"
/>
<div>
  <div className="username fw-bold">{expandedPost.author || 'User'}</div>
  <div className="location text-muted small">
    <i className="bi bi-geo-alt-fill me-1"></i>
    {expandedPost.location || 'Somewhere amazing'}
  </div>
</div>
</div>
<button type="button" className="btn-close" onClick={closeExpandedView}></button>
</div>

<div className="modal-body p-0">
<div className="row g-0">
{/* Left side - Media */}
<div className="col-12 col-lg-8 bg-black">
  <div className="expanded-media-container d-flex align-items-center justify-content-center" style={{height: '80vh'}}>
    {expandedPost.images?.[0] && (
      <img 
        src={`http://localhost:4000/${expandedPost.images[0]}`} 
        alt="Post content" 
        className="expanded-media img-fluid" 
        style={{maxHeight: '100%', objectFit: 'contain'}}
      />
    )}
    {expandedPost.videos?.[0] && (
      <video controls className="expanded-media w-100 h-100" style={{objectFit: 'contain'}}>
        <source src={`http://localhost:4000/${expandedPost.videos[0]}`} type="video/mp4" />
        Your browser doesn't support HTML5 video.
      </video>
    )}
  </div>
</div>

{/* Right side - Details */}
<div className="col-12 col-lg-4">
  <div className="expanded-details d-flex flex-column h-100">
    {/* Product Rating Display */}
    <div className="border-bottom p-3">
      <div className="product-rating d-flex align-items-center mb-2">
        {renderStars(lscData[expandedPost._id]?.averageRating || 0, expandedPost._id)}
        <span className="ms-2 text-muted">
          {lscData[expandedPost._id]?.averageRating > 0 ? (
            <>
              <span className="fw-bold">{lscData[expandedPost._id]?.averageRating}</span>/5 
              <span className="ms-1">({lscData[expandedPost._id]?.ratings?.length || 0} reviews)</span>
            </>
          ) : (
            'No ratings yet'
          )}
        </span>
      </div>
      <button 
        className="btn btn-sm btn-outline-warning"
        onClick={() => {
          closeExpandedView();
          setTimeout(() => openRatingModal(expandedPost._id), 500);
        }}
      >
        <i className="bi bi-star me-1"></i>
        {postRatings[expandedPost._id] ? 'Update Rating' : 'Rate Product'}
      </button>
    </div>
    
    {/* Caption */}
    {expandedPost.caption && (
      <div className="p-3 border-bottom">
        <div className="d-flex">
          <img 
            src={`https://ui-avatars.com/api/?name=${expandedPost.author || 'User'}&background=random&bold=true&rounded=true`} 
            alt="User avatar" 
            className="rounded-circle me-2" 
            width="32"
            height="32"
          />
          <div>
            <p className="mb-1">
              <span className="fw-bold me-2">{expandedPost.author || 'User'}</span>
              {expandedPost.caption}
            </p>
            <small className="text-muted">{formatDate(expandedPost.createdAt)}</small>
          </div>
        </div>
      </div>
    )}
    
    {/* Comments area */}
    <div className="expanded-comments-container flex-grow-1 overflow-auto p-3" style={{maxHeight: '40vh'}}>
      <h6 className="fw-bold mb-3">
        <i className="bi bi-chat-left-text me-2"></i>
        Comments ({lscData[expandedPost._id]?.comments?.length || 0})
      </h6>
      
      {lscData[expandedPost._id]?.comments?.length > 0 ? (
        lscData[expandedPost._id].comments.map((comment, index) => (
          <div key={index} className="expanded-comment d-flex mb-3">
            <img 
              src={`https://ui-avatars.com/api/?name=${comment.user}&background=random&bold=true&rounded=true`} 
              alt="User avatar" 
              className="rounded-circle me-2" 
              width="32"
              height="32"
            />
            <div className="comment-bubble p-2 bg-light rounded flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="comment-username fw-bold">{comment.user}</span>
                <small className="text-muted">{formatDate(comment.timestamp)}</small>
              </div>
              <p className="comment-text m-0">{comment.text}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-muted">
          <i className="bi bi-chat-square me-2"></i>
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
    
    {/* Actions bar */}
    <div className="expanded-actions p-3 border-top">
      <div className="d-flex mb-3">
        <div className="action-group d-flex">
          <button 
            className={`btn btn-sm btn-link ${likedPosts[expandedPost._id] ? 'text-danger' : 'text-dark'}`}
            onClick={() => toggleLike(expandedPost._id)}
          >
            <Heart 
              size={24} 
              fill={likedPosts[expandedPost._id] ? "red" : "none"} 
              color={likedPosts[expandedPost._id] ? "red" : "currentColor"} 
            />
          </button>
          <button className="btn btn-sm btn-link text-dark">
            <MessageCircle size={24} />
          </button>
          <button 
            className="btn btn-sm btn-link text-dark"
            onClick={() => {
              closeExpandedView();
              setTimeout(() => sharePost(expandedPost._id), 500);
            }}
          >
            <Share2 size={24} />
          </button>
        </div>
        <button 
          className="btn btn-sm btn-link ms-auto"
          onClick={() => toggleSave(expandedPost._id)}
        >
          <Bookmark 
            size={24} 
            fill={savedPosts[expandedPost._id] ? "#f39c12" : "none"} 
            color={savedPosts[expandedPost._id] ? "#f39c12" : "currentColor"} 
          />
        </button>
      </div>
      
      {/* Like count */}
      <div className="expanded-likes mb-2">
        {(lscData[expandedPost._id]?.likes?.length || 0) > 0 ? (
          <span><strong>{(lscData[expandedPost._id]?.likes?.length || 0).toLocaleString()}</strong> likes</span>
        ) : (
          <span className="text-muted">No likes yet</span>
        )}
      </div>
      
      {/* Timestamp */}
      <div className="expanded-timestamp text-muted small mb-3">
        <i className="bi bi-clock me-1"></i>
        {formatDate(expandedPost.createdAt)}
      </div>
      
      {/* Comment input */}
      <div className="expanded-comment-input">
        <div className="input-group">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comments[expandedPost._id] || ""}
            onChange={(e) => handleCommentChange(expandedPost._id, e)}
            onKeyPress={(e) => handleKeyPress(e, expandedPost._id)}
            className="form-control"
          />
          <button 
            className="btn btn-primary"
            onClick={() => submitComment(expandedPost._id)}
            disabled={!comments[expandedPost._id]?.trim() || isLoading[expandedPost._id]}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</div>
</div>
</div>
</div>
)}

{expandedPost && <div className="modal-backdrop fade show"></div>}

{/* Custom CSS */}
<style jsx="true">{`
.post-card {
transition: all 0.3s ease;
transform: translateY(20px);
opacity: 0;
}

.post-card-visible {
transform: translateY(0);
opacity: 1;
}

.heart-animation {
display: flex;
justify-content: center;
align-items: center;
position: absolute;
width: 100%;
height: 100%;
z-index: 10;
pointer-events: none;
}

.heart-pulse {
animation: heart-pulse 1s ease-in-out;
}

@keyframes heart-pulse {
0% {
transform: scale(0);
opacity: 0;
}
50% {
transform: scale(1.2);
opacity: 1;
}
100% {
transform: scale(1);
opacity: 0;
}
}

.star-rating {
display: flex;
align-items: center;
}

.star-rating.interactive {
justify-content: center;
gap: 8px;
}

.star {
cursor: default;
}

.star.interactive {
cursor: pointer;
transition: transform 0.2s;
}

.star.interactive:hover {
transform: scale(1.2);
}

.comment-bubble {
border-radius: 18px;
}

.action-button:hover {
transform: scale(1.1);
}

.action-button {
transition: all 0.2s;
}

.avatar {
transition: all 0.2s;
}

.avatar:hover {
transform: scale(1.1);
}

.modal {
background-color: rgba(0, 0, 0, 0.5);
}

.expanded-comment {
animation: fade-in 0.3s ease-in;
}

@keyframes fade-in {
from {
opacity: 0;
transform: translateY(10px);
}
to {
opacity: 1;
transform: translateY(0);
}
}

/* Toast styling */
.toast-container {
z-index: 1060;
}

/* Loading spinner styles */
.loading-container {
height: 300px;
}
`}</style>
</div>
);
};

export default PostList;