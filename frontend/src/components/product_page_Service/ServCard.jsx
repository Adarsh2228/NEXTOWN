// // src/components/product_page_Service/ServCard.jsx
// import React, { useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './ServCard.css';

// const ServCard = ({ product, isOwner, onDelete, onEdit }) => {
//   const {
//     name,
//     category,
//     subcategory,
//     description,
//     originalPrice,
//     discount,
//     sellingPrice,
//     imageUrl,
//     _id
//   } = product;

//   const navigate = useNavigate();
//   const cardRef = useRef(null);
//   const innerRef = useRef(null);

//   const handleMouseMove = (e) => {
//     const card = cardRef.current;
//     const inner = innerRef.current;
//     const rect = card.getBoundingClientRect();

//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;

//     const rotateX = ((y - centerY) / centerY) * -10;
//     const rotateY = ((x - centerX) / centerX) * 10;

//     inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
//   };

//   const handleMouseLeave = () => {
//     const inner = innerRef.current;
//     inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
//   };

//   return (
//     <div
//       className="serv-card-wrapper"
//       ref={cardRef}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//     >
//       <div className="serv-card-inner" ref={innerRef}>
//         <div className="image-container">
//           <img src={`http://localhost:4000/uploads/${imageUrl}`} alt={name} />
//         </div>
//         <div className="serv-card-info">
//           <h3>{name}</h3>
//           <p>{category} - {subcategory}</p>
//           <p>{description}</p>
//           <p>
//             <del>₹{originalPrice}</del>{' '}
//             <strong>₹{sellingPrice}</strong> ({discount}% OFF)
//           </p>

//           {isOwner && (
//             <div className="button-group">
//               <button className="edit-btn" onClick={() => onEdit(product)}>Edit</button>
//               <button className="delete-btn" onClick={() => onDelete(_id)}>Delete</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServCard;





import React, { useRef } from 'react';
import './ServCard.css';

const ServCard = ({ product, isOwner, onDelete, onEdit, onBuyNow, onAddToCart }) => {
  const {
    _id,
    name,
    category,
    subcategory,
    description,
    originalPrice,
    discount,
    sellingPrice,
    imageUrl
  } = product;

  const cardRef = useRef(null);
  const innerRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const inner = innerRef.current;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    innerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <div 
      className="serv-card-wrapper"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="serv-card-inner" ref={innerRef}>
        <div className="image-container">
          <img 
            src={imageUrl ? `http://localhost:4000/uploads/${imageUrl}` : 'https://via.placeholder.com/300x200?text=No+Image'} 
            alt={name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>

        <div className="serv-card-info">
          <h3>{name}</h3>
          <p className="category">{category} - {subcategory}</p>
          <p className="description">{description}</p>
          <p className="price">
            <del>₹{originalPrice}</del>{' '}
            <strong>₹{sellingPrice}</strong>{' '}
            <span className="discount">({discount}% OFF)</span>
          </p>

          <div className="button-group">
            {isOwner ? (
              <>
                <button 
                  className="edit-btn" 
                  onClick={() => onEdit(product)}
                  type="button"
                >
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => onDelete(_id)}
                  type="button"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button 
                  className="buy-btn" 
                  onClick={() => onBuyNow(product)}
                  type="button"
                >
                  Buy Now
                </button>
                <button 
                  className="cart-btn" 
                  onClick={() => onAddToCart(product)}
                  type="button"
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServCard;
