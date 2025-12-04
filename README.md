# ECOMMERCE Coding Test - Full Stack (NodeJS + React + PostgreSQL)

## Requirements
- Node >= 16
- npm or yarn
- PostgreSQL running locally (or remote)
- Optional: nodemon for development

## Setup backend
1. cd backend
2. copy `.env.example` to `.env` and edit `DATABASE_URL` to your postgres connection. Example:
   DATABASE_URL=postgresql://postgres:password@localhost:5432/ecomdb
3. install dependencies:
   npm install
4. create the database if not present:
   createdb ecomdb
5. initialize DB and seed products:
   npm run init-db
6. start server:
   npm run dev
   Server runs on http://localhost:4000

APIs:
- GET  /api/order         get all Orders
- GET  /api/order/:id     get Order by id
- POST /api/order         add new Order
  Body example:
  {
    "orderDescription": "My order",
    "productIds": [1,2]
  }
- PUT  /api/order/:id     update Order by id
  Body same as POST
- DELETE /api/order/:id   delete order

## Setup frontend
1. cd frontend
2. install:
   npm install
3. start:
   npm start
   Frontend runs on http://localhost:3000 and talks to backend at http://localhost:4000

## Notes and assumptions
- PRODUCTS table Ids are the integer values provided in the brief. Products are seeded by init-db.js
- Orders may be associated with zero or more products. OrderProductMap models many-to-many mapping
- No authentication required for this challenge
- Product list endpoint is not required by brief. I included a small frontend static product list provider. If you prefer, add a backend GET /api/products endpoint to fetch products dynamically
- The frontend is intentionally minimal and uses plain fetch for clarity. It is production ready in structure and suitable for small projects.

## Tradeoffs
- Simplicity and clarity prioritized over heavy frameworks. I used raw SQL and node-postgres for predictability and control.
- For production, add validation, pagination for GET /api/order, and a products endpoint
- For large scale, consider using an ORM, migrations (like knex or sequelize), and tests

## Tests
- Use Postman or curl to exercise endpoints
- Example create:
  curl -X POST http://localhost:4000/api/order -H "Content-Type: application/json" -d '{"orderDescription":"Test ord","productIds":[1,2]}'
