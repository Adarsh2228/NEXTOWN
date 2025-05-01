import React from 'react';

const BestMonthsForm = ({
  categoryValue, 
  setCategoryValue, 
  retrieveBestMonths, 
  isLoadingBestMonths, 
  errorFetchingMonths, 
  topPerformingMonths
}) => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: 'auto' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Check Best Performance Months</h3>
      
      {/* Category Input */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Enter business category"
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
      </div>
      
      {/* Get Best Months Button */}
      <button 
        onClick={retrieveBestMonths} 
        disabled={isLoadingBestMonths} 
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: isLoadingBestMonths ? '#ddd' : '#007BFF',
          color: '#fff',
          borderRadius: '4px',
          border: 'none',
          cursor: isLoadingBestMonths ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {isLoadingBestMonths ? 'Fetching...' : 'Get Top Months'}
      </button>

      {/* Error Message */}
      {errorFetchingMonths && (
        <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
          {errorFetchingMonths}
        </p>
      )}
      
      {/* Best Months Display */}
      {Array.isArray(topPerformingMonths) && topPerformingMonths.length > 0 ? (
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Top performing months: {topPerformingMonths.map((month, index) => `${index + 1}: ${month}`).join(', ')}
        </p>
      ) : (
        <p style={{ marginTop: '20px', textAlign: 'center' }}>No data available for best months.</p>
      )}
    </div>
  );
};

export default BestMonthsForm;
