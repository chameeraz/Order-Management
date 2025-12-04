const db = require('./db');

async function init() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS PRODUCTS (
        Id INT PRIMARY KEY,
        productName VARCHAR(100) NOT NULL,
        productDescription TEXT
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS ORDERS (
        Id SERIAL PRIMARY KEY,
        orderDescription VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS OrderProductMap (
        Id SERIAL PRIMARY KEY,
        orderId INT NOT NULL REFERENCES ORDERS(Id) ON DELETE CASCADE,
        productId INT NOT NULL REFERENCES PRODUCTS(Id) ON DELETE RESTRICT
      );
    `);

    const products = [
      [1, 'HP laptop', 'This is HP laptop'],
      [2, 'lenovo laptop', 'This is lenovo'],
      [3, 'Car', 'This is Car'],
      [4, 'Bike', 'This is Bike']
    ];

    for (const [id, name, desc] of products) {
      await db.query(
        `INSERT INTO PRODUCTS (Id, productName, productDescription)
         VALUES ($1, $2, $3)
         ON CONFLICT (Id) DO NOTHING;`,
         [id, name, desc]
      );
    }

    console.log('Database initialized and seeded.');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing DB', err);
    process.exit(1);
  }
}

init();
