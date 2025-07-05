# Final-Year-Project
# Retail Store Inventory & Sales Management System

This project is a full-stack application designed to manage inventory, sales, and user roles for a retail store. It features a backend built with Node.js and Express, using Prisma ORM for database management, and a frontend (structure placeholder) for user interaction.

## Features
- Inventory management
- Sales tracking
- User authentication and roles
- Order and order status management

## Folder Structure
```
backend/    # Node.js/Express backend API
frontend/   # Frontend application (placeholder)
contracts/  # Shared contracts or types
scripts/    # Utility scripts
```

## Prerequisites
- Node.js (v16 or above recommended)
- npm (comes with Node.js)
- Git
- (For database) PostgreSQL or your preferred database supported by Prisma

## Installation
1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd finalyear
   ```
2. **Install backend dependencies:**
   ```sh
   cd backend
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your database credentials and other secrets.

4. **Run database migrations:**
   ```sh
   npx prisma migrate deploy
   ```

5. **Start the backend server:**
   ```sh
   npm start
   ```

6. **Frontend setup:**
   - Navigate to the `frontend` folder
   - ```sh
     cd frontend
     npm start
     ```

## Usage
- The backend server will run on the configured port (default: 3000).
- API endpoints are available for managing products, orders, users, and sales.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
