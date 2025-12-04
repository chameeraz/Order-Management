const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv'); // Not strictly needed in Vercel prod, but fine to keep
// dotenv.config();

const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/order', ordersRouter);
app.use('/api/products', productsRouter);

app.get('/', (req, res) => res.json({ status: 'Backend is OK' }));

// --- CHANGE IS HERE ---
// Only listen when running locally.
// On Vercel, we must export the app.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;