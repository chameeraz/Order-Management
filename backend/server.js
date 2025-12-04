const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/order', ordersRouter);
app.use('/api/products', productsRouter);
// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
