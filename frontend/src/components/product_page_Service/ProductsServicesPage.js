import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ServCard from './ServCard';
import PaymentDialog from './PaymentDialog';
import './ProductsServicesPage.css';

const ProductsServicesPage = ({ currentUserId }) => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // For Buy Now modal

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/services/business/${id}`);
        setProducts(response.data.products);
        setOwnerId(response.data.ownerId);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, currentUserId]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:4000/api/services/${productId}`);
        setProducts(products.filter(product => product._id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    window.location.href = `/edit-service/${product._id}`;
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product) => {
    alert(`${product.name} added to cart!`);
  };

  const isOwner = currentUserId && ownerId && String(currentUserId) === String(ownerId);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products-services-page">
      <h1>Products & Services</h1>

      {isOwner && (
        <div className="owner-actions">
          <a href={`/add-service/${id}`} className="add-service-btn">
            Add New Product/Service
          </a>
        </div>
      )}

      <div className="products-grid">
        {products.length === 0 ? (
          <p className="no-products">No products or services available</p>
        ) : (
          products.map(product => (
            <ServCard
              key={product._id}
              product={product}
              isOwner={isOwner}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>

      {selectedProduct && (
        <PaymentDialog
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductsServicesPage;
