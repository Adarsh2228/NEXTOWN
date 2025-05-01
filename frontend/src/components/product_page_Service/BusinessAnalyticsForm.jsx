import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BusinessAnalyticsForm = () => {
  const [businessType, setBusinessType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/business/analytics/results', { state: { businessType } });
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-12 shadow-lg rounded-xl bg-white">
      <h2 className="text-2xl font-semibold mb-4">Enter Business Type</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g., Restaurant, Retail, IT"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Analyze
        </button>
      </form>
    </div>
  );
};

export default BusinessAnalyticsForm;
