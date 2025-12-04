import React, { useEffect, useState } from 'react';
import Modal from './Modal';

export default function OrderForm({ order, onCancel, onCreate, onUpdate, products }) {
  const isEdit = order && order.id;

  const [form, setForm] = useState({
    id: order?.id || '',
    orderdescription: order?.orderdescription || '',
    products: order?.products?.map(p => p.Id || p.id) || []
  });

  useEffect(() => {
    setForm({
      id: order?.id || '',
      orderdescription: order?.orderdescription || '',
      products: order?.products?.map(p => p.Id || p.id) || []
    });
  }, [order]);

  function handleInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function toggleProduct(id) {
    let selected = [...form.products];
    if (selected.includes(id)) {
      selected = selected.filter(x => x !== id);
    } else {
      selected.push(id);
    }
    setForm({ ...form, products: selected });
  }

  function submit() {
    const payload = {
      orderdescription: form.orderdescription,
      products: form.products
    };

    if (isEdit) onUpdate(form.id, payload);
    else onCreate(payload);
  }

  return (
    <Modal onClose={onCancel}>
      <div className="modal-title"> 
        {isEdit ? 'Edit Order' : 'Create Order'}
      </div>

      {!isEdit && (
        <div className="form-group">
          <label>Order ID</label>
          <input
            className="input-modern"
            name="id"
            placeholder="Enter Order ID"
            value={form.id}
            onChange={handleInput}
          />
        </div>
      )}

      <div className="form-group">
        <label>Description</label>
        <input
          className="input-modern"
          name="orderdescription"
          placeholder="Enter Description"
          value={form.orderdescription}
          onChange={handleInput}
        />
      </div>

      <div className="form-group">
        <label>Products</label>

        <div className="product-select-box">
          {products.map(p => {
            const id = p.Id || p.id;
            const name = p.productName || p.productname;
            const desc = p.productDescription || p.productdescription;

            return (
              <div
                key={id}
                className={`product-item ${form.products.includes(id) ? 'selected' : ''}`}
                onClick={() => toggleProduct(id)}
              >
                <div className="product-name">{name}</div>
                <div className="product-desc">{desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="modal-actions">
        <button className="secondary" onClick={onCancel}>Cancel</button>
        <button className="primary" onClick={submit}>
          {isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </Modal>
  );
}
