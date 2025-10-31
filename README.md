# Node.js + TypeScript + MySQL CRUD API

This project is a RESTful API built with **Node.js**, **Express**, and **TypeScript**.  
It provides complete **CRUD functionality** for managing users with advanced features like filtering, pagination, soft deletion, and user verification tracking.

---

## 🧩 Features

- Built with **TypeScript** and **Express.js**
- **MySQL** as the database
- CRUD operations for **User**
- **Soft delete** (records are not permanently deleted)
- **Dynamic filters** (name, email, verification status, and date range)
- **Pagination support**
- **Error and success response handler**
- **JWT-ready authentication structure**
- Clean architecture:
  - Modular route handling
  - Separation of concerns (controllers, services, repositories)
  - Type-safe code with TypeScript interfaces
  - Environment-based configuration (`.env` support)
---
## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** database
- **npm** or **yarn** package manager
- **TypeScript** installed globally (optional but recommended)
- **Postman** or **curl** for API testing (optional)
- **Git** for version control (optional)
- **VS Code** or any preferred code editor (optional)


## ⚙️ Project Setup

### 1️⃣ Clone the Repository 

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

### 2️⃣ Install Dependencies 

- **npm install**

### 3️⃣ Create Environment Variables

- PORT=5000
- NODE_ENV=development

- DATABASE_URL=mysql://root:password@localhost:3306/your_database_name

- JWT_SECRET=your_jwt_secret

4️⃣ Run Database Migrations


5️⃣ Start the Development Server
npm run dev


📡 API Endpoints

Method	Endpoint	    Description
POST	/api/users	    Create a new user
GET	    /api/users	    Get all users (supports filters and pagination)
GET	    /api/users/:id	Get user by ID
PUT	    /api/users/:id	Update user by ID
DELETE	/api/users/:id	Soft delete user by ID


🔍 Example API Requests

➕ Create User

    POST /api/users

    {
    "name": "Mostafa Mohammed",
    "email": "mostafa@example.com",
    "password": "123456",
    "is_verified": false
    }

📋 Get All Users (With Pagination & Filters)

    GET /api/users?page=1&limit=10&is_verified=true&name=mostafa

    Response:

    {
    "success": true,
    "message": "Users retrieved successfully",
    "data": [
        {
        "id": 1,
        "name": "Mostafa Mohammed",
        "email": "mostafa@example.com",
        "is_verified": true,
        "created_at": "2025-10-23T10:00:00Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1
    }
    }

✏️ Update User

    PUT /api/users/1

    {
    "name": "Mostafa M. Updated",
    "is_verified": true
    }

❌ Delete User (Soft Delete)

    DELETE /api/users/1

    Response:

    {
    "success": true,
    "message": "User deleted successfully."
    }

