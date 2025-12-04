import React, { useEffect, useState } from 'react';
import {
  fetchOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  fetchProducts
} from './api';

import OrderList from './components/OrderList';
import OrderForm from './components/OrderForm';
import ProductManagement from './components/ProductManagement';
import Toast from './components/Toast';
import DeleteConfirm from './components/DeleteConfirm';
import ViewOrder from './components/ViewOrder';

function App() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(null);

  const [screen, setScreen] = useState('orders');

  function notify(message, type = 'success') {
    setToast({ message, type });
  }

  async function loadOrders() {
    const data = await fetchOrders();
    setOrders(data);
  }

  async function loadProducts() {
    const data = await fetchProducts();
    setProducts(data);
  }

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  const onCreate = async (payload) => {
    try {
      await createOrder(payload);
      notify('Order created successfully');
      setEditingOrder(null);
      await loadOrders();
    } catch {
      notify('Creation failed', 'error');
    }
  };

  const onUpdate = async (id, payload) => {
    try {
      await updateOrder(id, payload);
      notify('Order updated');
      setEditingOrder(null);
      await loadOrders();
    } catch {
      notify('Update failed', 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteOrder(deletingId);
      notify('Order deleted');
      setDeletingId(null);
      await loadOrders();
    } catch {
      notify('Delete failed', 'error');
    }
  };

  const filtered = orders.filter(o => {
    const q = query.toLowerCase();
    return (
      String(o.id).includes(q) ||
      (o.orderdescription || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="container">
      <h1>Order Management System</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          className={screen === 'orders' ? 'primary' : 'secondary'}
          onClick={() => setScreen('orders')}
        >
          Orders
        </button>

        <button
          className={screen === 'products' ? 'primary' : 'secondary'}
          onClick={() => setScreen('products')}
        >
          Products
        </button>
      </div>

      {screen === 'orders' && (
        <>
          <div className="topbar">
            <input
              placeholder="Search orders"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="primary" onClick={() => setEditingOrder({})}>
              Create Order
            </button>
          </div>

          <OrderList
            orders={filtered}
            onEdit={setEditingOrder}
            onDelete={(id) => setDeletingId(id)}
            onView={setViewingOrder}
          />

          {editingOrder && (
            <OrderForm
              order={editingOrder}
              onCancel={() => setEditingOrder(null)}
              onCreate={onCreate}
              onUpdate={onUpdate}
              products={products}
            />
          )}
        </>
      )}

      {screen === 'products' && <ProductManagement />}

      {deletingId !== null && (
        <DeleteConfirm
          onCancel={() => setDeletingId(null)}
          onConfirm={confirmDelete}
        />
      )}

      {viewingOrder !== null && (
        <ViewOrder
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
