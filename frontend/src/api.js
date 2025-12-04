const BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/order';

export async function fetchOrders() {
  const res = await fetch(BASE);
  return res.json();
}

export async function fetchOrder(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (res.status === 404) return null;
  return res.json();
}

export async function createOrder(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function updateOrder(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteOrder(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchProducts() {
  const res = await fetch('http://localhost:4000/api/products');
  return res.json();
}

