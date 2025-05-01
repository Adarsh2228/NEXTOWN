import React, { useState } from 'react';
import './PaymentDialog.css';

const PaymentDialog = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderDetails = {
      productId: product._id,
      name: product.name,
      quantity,
      address,
      deliveryTime,
      paymentMethod,
    };

    console.log("Order Placed:", orderDetails);
    alert(`Order placed for ${product.name} using ${paymentMethod}`);
    onClose();
  };

  return (
    <div className="payment-dialog-overlay">
      <div className="payment-dialog">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Buy Now - {product.name}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Quantity:
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </label>
          <label>
            Delivery Address:
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
          <label>
            Preferred Delivery Time:
            <input
              type="datetime-local"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              required
            />
          </label>
          <label>
            Payment Method:
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">-- Select Payment Method --</option>
              <option value="GPay">GPay</option>
              <option value="Paytm">Paytm</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </label>
          <button type="submit" className="submit-order-btn">Place Order</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentDialog;
