import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ServAddForm from '../product_page_Service/ServAddForm';
import { addService } from '../product_page_Service/servAPI';

const ServAddPage = () => {
  const { id } = useParams(); // businessId
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    data.append('businessId', id);

    try {
      await addService(data);
      navigate(`/business/${id}/products-services`);
    } catch (err) {
      alert('Error adding product');
    }
  };

  return (
    <div>
      {/* <h2>Add New Product</h2> */}
      <ServAddForm onSubmit={handleSubmit} />
    </div>
  );
};

export default ServAddPage;
