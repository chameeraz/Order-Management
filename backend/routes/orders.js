const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

// GET api/order  get all Orders
router.get('/', controller.getAllOrders);

// GET api/order/:id get Order by id
router.get('/:id', controller.getOrderById);

// POST api/orders add new Order
router.post('/', controller.createOrder);

// PUT api/orders/:id update Order by id
router.put('/:id', controller.updateOrder);

// DELETE api/orders/:id remove Order by id
router.delete('/:id', controller.deleteOrder);

module.exports = router;
