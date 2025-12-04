const db = require('../db');

async function getAllOrders(req, res) {
  try {
    // Join to return products associated with orders
    const ordersRes = await db.query(`
      SELECT o.Id, o.orderDescription, o.createdAt,
        COALESCE(json_agg(
          json_build_object('productId', p.Id, 'productName', p.productName)
        ) FILTER (WHERE p.Id IS NOT NULL), '[]') AS products
      FROM ORDERS o
      LEFT JOIN OrderProductMap m ON m.orderId = o.Id
      LEFT JOIN PRODUCTS p ON p.Id = m.productId
      GROUP BY o.Id
      ORDER BY o.createdAt DESC;
    `);
    res.json(ordersRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getOrderById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const orderRes = await db.query(`
      SELECT o.Id, o.orderDescription, o.createdAt,
        COALESCE(json_agg(
          json_build_object('productId', p.Id, 'productName', p.productName)
        ) FILTER (WHERE p.Id IS NOT NULL), '[]') AS products
      FROM ORDERS o
      LEFT JOIN OrderProductMap m ON m.orderId = o.Id
      LEFT JOIN PRODUCTS p ON p.Id = m.productId
      WHERE o.Id = $1
      GROUP BY o.Id;
    `, [id]);

    if (orderRes.rows.length === 0) return res.status(404).json({ message: 'Order not found' });

    res.json(orderRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function createOrder(req, res) {
  try {
    const { orderDescription, productIds } = req.body;
    if (!orderDescription) return res.status(400).json({ message: 'orderDescription required' });

    // create order
    const insertOrder = await db.query(
      `INSERT INTO ORDERS (orderDescription, createdAt) VALUES ($1, now()) RETURNING Id, orderDescription, createdAt;`,
      [orderDescription]
    );
    const order = insertOrder.rows[0];

    // optionally map products
    if (Array.isArray(productIds) && productIds.length > 0) {
      for (const pid of productIds) {
        await db.query(
          `INSERT INTO OrderProductMap (orderId, productId) VALUES ($1, $2)`,
          [order.Id, pid]
        );
      }
    }

    // return created order
    const full = await db.query(`
      SELECT o.Id, o.orderDescription, o.createdAt,
        COALESCE(json_agg(
          json_build_object('productId', p.Id, 'productName', p.productName)
        ) FILTER (WHERE p.Id IS NOT NULL), '[]') AS products
      FROM ORDERS o
      LEFT JOIN OrderProductMap m ON m.orderId = o.Id
      LEFT JOIN PRODUCTS p ON p.Id = m.productId
      WHERE o.Id = $1
      GROUP BY o.Id;
    `, [order.Id]);

    res.status(201).json(full.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateOrder(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { orderDescription, productIds } = req.body;
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    // check exists
    const check = await db.query(`SELECT * FROM ORDERS WHERE Id = $1`, [id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'Order not found' });

    if (orderDescription) {
      await db.query(`UPDATE ORDERS SET orderDescription = $1 WHERE Id = $2`, [orderDescription, id]);
    }

    // update product mappings: simple approach remove existing and insert new
    if (Array.isArray(productIds)) {
      await db.query(`DELETE FROM OrderProductMap WHERE orderId = $1`, [id]);
      for (const pid of productIds) {
        await db.query(`INSERT INTO OrderProductMap (orderId, productId) VALUES ($1, $2)`, [id, pid]);
      }
    }

    const updated = await db.query(`
      SELECT o.Id, o.orderDescription, o.createdAt,
        COALESCE(json_agg(
          json_build_object('productId', p.Id, 'productName', p.productName)
        ) FILTER (WHERE p.Id IS NOT NULL), '[]') AS products
      FROM ORDERS o
      LEFT JOIN OrderProductMap m ON m.orderId = o.Id
      LEFT JOIN PRODUCTS p ON p.Id = m.productId
      WHERE o.Id = $1
      GROUP BY o.Id;
    `, [id]);

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteOrder(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    // cascade delete set by constraint will remove OrderProductMap rows
    const del = await db.query(`DELETE FROM ORDERS WHERE Id = $1 RETURNING *`, [id]);
    if (del.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
