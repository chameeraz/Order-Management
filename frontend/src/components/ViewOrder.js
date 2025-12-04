import React from 'react';
import Modal from './Modal';

export default function ViewOrder({ order, onClose }) {
  if (!order) return null;

  return (
    <Modal onClose={onClose}>
      <h2 style={{ marginTop: 0 }}>Order Details</h2>

      <p><strong>ID:</strong> {order.id}</p>
      <p><strong>Description:</strong> {order.orderdescription}</p>
      <p><strong>Products:</strong> 
        {order.products && order.products.length > 0
          ? order.products.map(p => p.productName).join(', ')
          : 'None'}
      </p>
      <p><strong>Created At:</strong> {new Date(order.createdat).toLocaleString()}</p>

      <div style={{ textAlign: 'right', marginTop: 20 }}>
        <button className="primary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}
