import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditServicePage.css';

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    originalPrice: '',
    discount: '',
    sellingPrice: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`/api/services/${id}`);
        setForm(response.data);
      } catch (err) {
        console.error('Error loading service data:', err);
      }
    };
    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/services/${id}`, form);
      navigate(-1); // Go back to previous page
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="edit-service-container">
      <h2>Edit Service</h2>
      <form onSubmit={handleSubmit} className="edit-service-form">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Service Name" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
        <input name="subcategory" value={form.subcategory} onChange={handleChange} placeholder="Subcategory" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="Original Price" required />
        <input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Discount (%)" required />
        <input name="sellingPrice" type="number" value={form.sellingPrice} onChange={handleChange} placeholder="Selling Price" required />
        <button type="submit">Update Service</button>
      </form>
    </div>
  );
};

export default EditServicePage;
