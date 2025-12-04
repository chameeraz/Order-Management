import React from 'react';

export default function OrderList({ orders, onEdit, onDelete, onView }) {
  return (
    <table className="orders">
      <thead>
        <tr>
          <th>Id</th>
          <th>Description</th>
          <th>Products</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {orders.map(o => (
          <tr key={o.id}>
            <td>{o.id}</td>
            <td>{o.orderdescription}</td>
            <td>
              {o.products && o.products.length > 0
                ? o.products.map(p => p.productName).join(', ')
                : 'None'}
            </td>
            <td>{new Date(o.createdat).toLocaleString()}</td>

            <td style={{ display: 'flex', gap: '8px' }}>
              <button className="primary" onClick={() => onView(o)}>View</button>
              <button className="primary" onClick={() => onEdit(o)}>Edit</button>
              <button className="danger" onClick={() => onDelete(o.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
