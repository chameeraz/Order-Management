import React, { useEffect, useState } from 'react';
import Modal from './Modal';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    Id: '',
    productName: '',
    productDescription: ''
  });

  async function load() {
    const res = await fetch('http://localhost:4000/api/products');
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => { load(); }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveProduct() {
    await fetch('http://localhost:4000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setForm({ Id: '', productName: '', productDescription: '' });
    setShowForm(false);
    await load();
  }

  async function deleteProduct(id) {
    await fetch(`http://localhost:4000/api/products/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div>
      <div className="product-header">
        <h2>Products</h2>
        <button className="primary" onClick={() => setShowForm(true)}>Add Product</button>
      </div>

      <table className="orders">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Description</th><th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => {
            const id = p.Id || p.id;
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{p.productName || p.productname}</td>
                <td>{p.productDescription || p.productdescription}</td>
                <td>
                  <button className="danger" onClick={() => deleteProduct(id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <div className="modal-title">Add Product</div>

          <div className="form-group">
            <label>Product ID</label>
            <input
              className="input-modern"
              name="Id"
              value={form.Id}
              placeholder="Product ID"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              className="input-modern"
              name="productName"
              value={form.productName}
              placeholder="Product Name"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              className="input-modern"
              name="productDescription"
              value={form.productDescription}
              placeholder="Description"
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="primary" onClick={saveProduct}>Save Product</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
