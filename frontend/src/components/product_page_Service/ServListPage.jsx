// src/components/product_page_Service/ServListPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ServCard from './ServCard';
import './ServListPage.css';

const ServListPage = ({ loggedInUserId }) => {
  const { id: businessId } = useParams();
  const [services, setServices] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`/api/services/business/${businessId}`);
        setServices(response.data.products);
        setOwnerId(response.data.ownerId); // Ensure this is a string (compare with typeof)
      } catch (err) {
        console.error('Error fetching services', err);
      }
    };
    fetchServices();
  }, [businessId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = (product) => {
    navigate(`/edit-service/${product._id}`, { state: { product } });
  };

  return (
    <div className="service-container">
      {services.map((product) => (
        <ServCard
          key={product._id}
          product={product}
          isOwner={String(loggedInUserId) === String(ownerId)} // Avoid object ID mismatch
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};

export default ServListPage;
