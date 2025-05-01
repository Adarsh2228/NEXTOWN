// import React, { useState } from 'react';

// const ServAddForm = ({ onSubmit }) => {
//   const [form, setForm] = useState({
//     name: '',
//     category: '',
//     subcategory: '',
//     description: '',
//     originalPrice: '',
//     discount: '',
//     image: null,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setForm((prev) => ({ ...prev, image: e.target.files[0] }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(form);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="serv-form">
//       <input name="name" placeholder="Product Name" onChange={handleChange} required />
//       <input name="category" placeholder="Category" onChange={handleChange} required />
//       <input name="subcategory" placeholder="Subcategory" onChange={handleChange} required />
//       <textarea name="description" placeholder="Description" onChange={handleChange} required />
//       <input name="originalPrice" type="number" placeholder="Original Price" onChange={handleChange} required />
//       <input name="discount" type="number" placeholder="Discount (%)" onChange={handleChange} required />
//       <input type="file" accept="image/*" onChange={handleFileChange} required />
//       <button type="submit">Add Product</button>
//     </form>
//   );
// };

// export default ServAddForm;










import React, { useState, useEffect } from 'react';
import { Upload, Check, DollarSign, Tag, Layers, Type, FileText, Image, Zap, X, Camera } from 'lucide-react';

const ProductAddForm = () => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    originalPrice: '',
    discount: '',
    image: null,
  });
  
  const [activeField, setActiveField] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  
  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = ['name', 'category', 'subcategory', 'description', 'originalPrice'];
    const completedFields = requiredFields.filter(field => form[field] && form[field].toString().trim() !== '');
    
    if (form.image) completedFields.push('image');
    
    const progress = Math.round((completedFields.length / (requiredFields.length + 1)) * 100);
    setFormProgress(progress);
  }, [form]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setFormErrors(prev => ({ ...prev, image: null }));
    }
  };
  
  const clearImagePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setForm(prev => ({ ...prev, image: null }));
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!form.name.trim()) errors.name = "Product name is required";
    if (!form.category.trim()) errors.category = "Category is required";
    if (!form.subcategory.trim()) errors.subcategory = "Subcategory is required";
    if (!form.description.trim()) errors.description = "Description is required";
    if (!form.originalPrice) errors.originalPrice = "Original price is required";
    if (form.originalPrice && isNaN(parseFloat(form.originalPrice))) errors.originalPrice = "Price must be a number";
    if (form.discount && (isNaN(parseFloat(form.discount)) || parseFloat(form.discount) < 0 || parseFloat(form.discount) > 100)) {
      errors.discount = "Discount must be a number between 0 and 100";
    }
    if (!form.image) errors.image = "Product image is required";
    
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      
      // Add shake animation to fields with errors
      Object.keys(errors).forEach(field => {
        const element = document.querySelector(`[name="${field}"]`);
        if (element) {
          const parent = element.closest('.form-group');
          if (parent) {
            parent.classList.add('animate-shake');
            setTimeout(() => {
              parent.classList.remove('animate-shake');
            }, 500);
          }
        }
      });
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setFormSubmitted(true);
      
      // Reset form after animation completes
      setTimeout(() => {
        setForm({
          name: '',
          category: '',
          subcategory: '',
          description: '',
          originalPrice: '',
          discount: '',
          image: null,
        });
        clearImagePreview();
        setFormSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getDiscountedPrice = () => {
    if (!form.originalPrice || isNaN(parseFloat(form.originalPrice))) return "0.00";
    
    const price = parseFloat(form.originalPrice);
    const discountPercent = form.discount && !isNaN(parseFloat(form.discount)) ? parseFloat(form.discount) : 0;
    
    const discountedPrice = price - (price * (discountPercent / 100));
    return discountedPrice.toFixed(2);
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
        crossOrigin="anonymous"
      />
      
      {/* Custom CSS */}
      <style jsx>{`
        :root {
          --primary: #4361ee;
          --primary-dark: #3a56d4;
          --secondary: #7209b7;
          --success: #10b981;
          --danger: #ef4444;
          --light-bg: #f9fafb;
          --dark-text: #1f2937;
          --light-text: #6b7280;
          --border-color: #e5e7eb;
          --input-focus: #eff6ff;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          --animation-duration: 0.3s;
        }
        
        body {
          background-color: #f8f9fa;
          font-family: 'Inter', sans-serif;
        }
        
        .product-form-container {
          max-width: 1100px;
          margin: 2rem auto;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transform: translateY(0);
          transition: transform 0.4s ease;
        }
        
        .product-form-container:hover {
          transform: translateY(-5px);
        }
        
        .gradient-border {
          height: 6px;
          background: linear-gradient(90deg, var(--primary), var(--secondary), #f72585);
          margin-bottom: 1rem;
          animation: gradientMove 6s linear infinite;
          background-size: 200% auto;
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        
        .form-title {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
        }
        
        .progress-container {
          width: 70%;
          margin: 0 auto 1.5rem;
        }
        
        .form-label {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: var(--dark-text);
          margin-bottom: 0.5rem;
        }
        
        .label-icon {
          margin-right: 0.5rem;
          color: var(--primary);
        }
        
        .form-group {
          margin-bottom: 1.25rem;
          transition: transform var(--animation-duration) ease;
        }
        
        .form-group:focus-within {
          transform: translateY(-2px);
        }
        
        .form-control:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25);
        }
        
        .image-upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 0.5rem;
          background-color: #f9fafb;
          transition: all var(--animation-duration) ease;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 2rem;
        }
        
        .image-upload-area:hover {
          border-color: var(--primary);
          background-color: rgba(239, 246, 255, 0.7);
        }
        
        .upload-icon-wrapper {
          width: 70px;
          height: 70px;
          background-color: rgba(67, 97, 238, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          transition: all var(--animation-duration) ease;
          color: var(--primary);
        }
        
        .image-upload-area:hover .upload-icon-wrapper {
          background-color: rgba(67, 97, 238, 0.2);
          transform: scale(1.05);
        }
        
        .image-preview-container {
          position: relative;
          display: flex;
          justify-content: center;
        }
        
        .preview-image {
          max-height: 200px;
          width: auto;
          border-radius: 0.5rem;
          box-shadow: var(--shadow-md);
          animation: fadeIn 0.5s ease;
        }
        
        .remove-image-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background-color: var(--danger);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--animation-duration) ease;
          box-shadow: var(--shadow-sm);
        }
        
        .remove-image-button:hover {
          transform: scale(1.1);
          background-color: #dc2626;
        }
        
        .price-calculator {
          background: linear-gradient(135deg, #eef2ff, #f5f3ff);
          border-radius: 0.5rem;
          padding: 1.25rem;
          box-shadow: var(--shadow-md);
          border: 1px solid #e0e7ff;
          animation: fadeIn 0.5s ease;
        }
        
        .calculator-header {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #c7d2fe;
          padding-bottom: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .calculator-icon {
          color: var(--primary);
          margin-right: 0.5rem;
        }
        
        .calculator-title {
          font-weight: 600;
          color: var(--primary-dark);
          font-size: 1.1rem;
        }
        
        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          color: var(--dark-text);
        }
        
        .discount-row {
          color: var(--danger);
        }
        
        .calculator-divider {
          height: 1px;
          background-color: #c7d2fe;
          margin: 0.75rem 0;
        }
        
        .final-price-row {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 1.25rem;
        }
        
        .final-price-label {
          color: var(--dark-text);
        }
        
        .final-price-value {
          color: var(--primary-dark);
        }
        
        .submit-button {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border: none;
          color: white;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 50px;
          font-size: 1.125rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .submit-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
        }
        
        .submit-button:active {
          transform: translateY(-1px);
        }
        
        .submit-button:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.6s ease;
        }
        
        .submit-button:hover:before {
          left: 100%;
        }
        
        .button-icon {
          margin-left: 0.75rem;
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .input-group-text {
          background-color: #f9fafb;
          color: #6b7280;
          border-right: none;
        }
        
        .input-group .form-control {
          border-left: none;
        }
        
        .input-group:focus-within .input-group-text {
          border-color: var(--primary);
          color: var(--primary);
        }
      `}</style>
      
      <div className="product-form-container">
        {/* Stylish gradient top border */}
        <div className="gradient-border"></div>
        
        <div className="container-fluid px-4 py-3">
          <div className="text-center mb-4">
            <h1 className="form-title">Add New Product</h1>
            
            {/* Progress Bar */}
            <div className="progress-container">
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-gradient" 
                  role="progressbar"
                  style={{
                    width: `${formProgress}%`,
                    background: 'linear-gradient(90deg, #4361ee, #7209b7)'
                  }}
                  aria-valuenow={formProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="text-muted small mt-1">{formProgress}% Complete</div>
            </div>
          </div>
          
          {/* Success Message */}
          {formSubmitted && (
            <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
              <div className="bg-success rounded-circle p-2 me-3 text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                <Check size={18} />
              </div>
              <div>
                <h5 className="alert-heading mb-1">Product Added Successfully!</h5>
                <p className="mb-0">Your product has been added to the catalog and will appear shortly.</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              {/* Left Column */}
              <div className="col-md-6 pe-md-4">
                {/* Product Name */}
                <div className={`form-group ${formErrors.name ? 'animate-shake' : ''}`}>
                  <label htmlFor="productName" className="form-label">
                    <Type className="label-icon" size={18} />
                    Product Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                    id="productName"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                  />
                  {formErrors.name && (
                    <div className="invalid-feedback">
                      {formErrors.name}
                    </div>
                  )}
                </div>
                
                {/* Category & Subcategory */}
                <div className="row">
                  <div className="col-md-6">
                    <div className={`form-group ${formErrors.category ? 'animate-shake' : ''}`}>
                      <label htmlFor="category" className="form-label">
                        <Layers className="label-icon" size={18} />
                        Category
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.category ? 'is-invalid' : ''}`}
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                      />
                      {formErrors.category && (
                        <div className="invalid-feedback">
                          {formErrors.category}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className={`form-group ${formErrors.subcategory ? 'animate-shake' : ''}`}>
                      <label htmlFor="subcategory" className="form-label">
                        <Layers className="label-icon" size={18} />
                        Subcategory
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.subcategory ? 'is-invalid' : ''}`}
                        id="subcategory"
                        name="subcategory"
                        value={form.subcategory}
                        onChange={handleChange}
                        placeholder="Enter subcategory"
                      />
                      {formErrors.subcategory && (
                        <div className="invalid-feedback">
                          {formErrors.subcategory}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className={`form-group ${formErrors.description ? 'animate-shake' : ''}`}>
                  <label htmlFor="description" className="form-label">
                    <FileText className="label-icon" size={18} />
                    Product Description
                  </label>
                  <textarea
                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter detailed product description"
                    rows={5}
                  ></textarea>
                  {formErrors.description && (
                    <div className="invalid-feedback">
                      {formErrors.description}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column */}
              <div className="col-md-6 ps-md-4">
                {/* Image Upload */}
                <div className="form-group mb-4">
                  <label className="form-label">
                    <Image className="label-icon" size={18} />
                    Product Image
                  </label>
                  {!imagePreview ? (
                    <div 
                      className={`image-upload-area ${formErrors.image ? 'border-danger' : ''}`}
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <div className="upload-icon-wrapper">
                        <Camera size={28} />
                      </div>
                      <h5 className="fw-semibold mb-2">Click to upload image</h5>
                      <p className="text-muted small mb-0">PNG, JPG, GIF up to 10MB</p>
                      
                      {formErrors.image && (
                        <div className="text-danger mt-3 small">
                          {formErrors.image}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Product Preview" className="preview-image" />
                      <button
                        type="button"
                        onClick={clearImagePreview}
                        className="remove-image-button"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Price Fields */}
                <div className="row">
                  <div className="col-md-6">
                    <div className={`form-group ${formErrors.originalPrice ? 'animate-shake' : ''}`}>
                      <label htmlFor="originalPrice" className="form-label">
                        <DollarSign className="label-icon" size={18} />
                        Original Price
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={`form-control ${formErrors.originalPrice ? 'is-invalid' : ''}`}
                          id="originalPrice"
                          name="originalPrice"
                          value={form.originalPrice}
                          onChange={handleChange}
                          placeholder="0.00"
                        />
                        {formErrors.originalPrice && (
                          <div className="invalid-feedback">
                            {formErrors.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className={`form-group ${formErrors.discount ? 'animate-shake' : ''}`}>
                      <label htmlFor="discount" className="form-label">
                        <Tag className="label-icon" size={18} />
                        Discount
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className={`form-control ${formErrors.discount ? 'is-invalid' : ''}`}
                          id="discount"
                          name="discount"
                          value={form.discount}
                          onChange={handleChange}
                          placeholder="0"
                        />
                        <span className="input-group-text">%</span>
                        {formErrors.discount && (
                          <div className="invalid-feedback">
                            {formErrors.discount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Price Calculator */}
                {form.originalPrice && !isNaN(parseFloat(form.originalPrice)) && (
                  <div className="price-calculator mt-4">
                    <div className="calculator-header">
                      <Zap className="calculator-icon" size={20} />
                      <span className="calculator-title">Price Calculator</span>
                    </div>
                    
                    <div className="price-row">
                      <span>Original Price:</span>
                      <span>${parseFloat(form.originalPrice).toFixed(2)}</span>
                    </div>
                    
                    {form.discount && !isNaN(parseFloat(form.discount)) && parseFloat(form.discount) > 0 && (
                      <div className="price-row discount-row">
                        <span>Discount ({form.discount}%):</span>
                        <span>-${(parseFloat(form.originalPrice) * (parseFloat(form.discount) / 100)).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="calculator-divider"></div>
                    
                    <div className="final-price-row">
                      <span className="final-price-label">Final Price:</span>
                      <span className="final-price-value">${getDiscountedPrice()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="text-center mt-5 mb-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? 'Processing...' : 'Add Product'}
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                ) : (
                  <Zap className="button-icon" size={20} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Bootstrap JS */}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
        crossOrigin="anonymous"
      ></script>
    </>
  );
};

export default ProductAddForm;