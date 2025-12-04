import React from 'react';
import Modal from './Modal';

export default function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel}>
      <h2 style={{ marginTop: 0 }}>Delete Order?</h2>
      <p>This action cannot be undone. Are you sure you want to delete this order?</p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 25 }}>
        <button className="secondary" onClick={onCancel}>Cancel</button>
        <button className="danger" onClick={onConfirm}>Delete</button>
      </div>
    </Modal>
  );
}
