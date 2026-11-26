# 📰 E-Pharmacy API

**E-Pharmacy API** is a RESTful backend application built with Node.js, Express.js, TypeScript, and MongoDB. It provides user authentication, pharmacy and medicine management, customer reviews, shopping cart functionality, and order processing.

## 🚀 Features

- User registration and authentication
- JWT-based authentication and authorization
- User profile retrieval
- Password hashing with bcrypt
- Pharmacy stores listing
- Nearest pharmacies listing
- Pharmacy opening status management
- Medicine listing with pagination, search, and category filtering
- Medicine details retrieval
- Product reviews with pagination
- Customer reviews retrieval
- Shopping cart management
- Adding and updating cart items
- Order creation and checkout
- Automatic cart clearing after successful checkout
- Input data validation with Joi
- MongoDB integration with Mongoose
- CORS configuration
- Environment variable management

## 🛠 Tech Stack

| Technology            | Purpose                           |
| :-------------------- | :----------------------------     |
| **Node.js**           | Backend runtime environment       |
| **Express.js**        | Web framework for building the API|
| **TypeScript**        | Static typing and improved code maintainability    |
| **MongoDB**           | NoSQL database                    |
| **Mongoose**          | MongoDB object modeling           |
| **JWT (jsonwebtoken)**  | Token-based authentication               |
| **bcrypt**            | Password hashing                  |
| **Joi**               | Request validation                |
| **dotenv**            | Environment variable management   |
| **cors**            | Cross-Origin Resource Sharing configuration   |

## 🔐 Authentication

- The API uses JSON Web Tokens (JWT) for user authentication.
- A JWT is generated upon successful registration or login.
- The token is returned to the client and used to access protected routes.
- Protected requests require an Authorization header with a Bearer token.
- Authentication is handled through custom Express middleware.
- Passwords are hashed using bcrypt before being stored in the database.

## 🌐 API

The backend is deployed and available at: https://e-pharmacy-backend-kml7.onrender.com .

## 👩‍💻 Author

**Olha Borzhynska** — Junior Full-Stack Developer

GitHub: https://github.com/OlhaBorzhynska

LinkedIn: www.linkedin.com/in/olha-borzhynska

Email: mykytlo@gmail.com

