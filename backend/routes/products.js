const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await db.query(`
      SELECT Id, productName, productDescription
      FROM PRODUCTS
      ORDER BY Id ASC
    `);
    res.json(products.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET product by id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM PRODUCTS WHERE Id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Product not found' });

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE product
router.post('/', async (req, res) => {
  const { Id, productName, productDescription } = req.body;

  try {
    await db.query(
      `INSERT INTO PRODUCTS (Id, productName, productDescription)
       VALUES ($1, $2, $3)`,
      [Id, productName, productDescription]
    );

    res.status(201).json({ message: 'Product created' });
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
});

// UPDATE product
router.put('/:id', async (req, res) => {
  const { productName, productDescription } = req.body;

  try {
    await db.query(
      `UPDATE PRODUCTS
       SET productName=$1, productDescription=$2
       WHERE Id = $3`,
      [productName, productDescription, req.params.id]
    );

    res.json({ message: 'Product updated' });
  } catch {
    res.status(500).json({ message: 'Update failed' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await db.query(`DELETE FROM PRODUCTS WHERE Id = $1`, [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
