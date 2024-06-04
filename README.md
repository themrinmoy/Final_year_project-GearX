### Bike Tour Rental Website

This repository contains the code for a bike tour rental website where users can rent and purchase various biking products if needed. Below is an overview of the project structure and setup.

### Live Demo

## Visit the live demo of the project[railway.app]: [Bike Tour Rental Website Demo](https://gearx.mrinmoy.org/)

 ## Visit the live demo2 of the project[onrender]: [Bike Tour Rental Website Demo2](https://final-year-project-gearx.onrender.com/)


- **User Login:**
  - **Username/email:** user  or `user@mrinmoy.org`
  - **Password:** test

- **Admin Login:**
  - **Username/email:** test  or `test@mrinmoy.org`
  - **Password:** test

### Getting Started

To run this project locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/themrinmoy/Final_year_project.git
   ```

2. **Install Dependencies**
   ```bash
   cd Final_year_project
   npm install
   ```

3. **Set Up MongoDB**
   - Make sure you have MongoDB installed and running.
   - Update the MongoDB URI in `app.js` to point to your database.

4. **Start the Application**
   ```bash
   npm start (before Run this command integrate with Ur MongoDB database Url)
   ```

### Project Structure

```
├── images/                   # Directory to store uploaded images
├── models/                   # Mongoose models for database schemas
│   ├── User.js               # User model for authentication
├── public/                   # Static assets (stylesheets, scripts, images)
├── routes/                   # Route handlers
│   ├── auth.js               # Authentication routes (login, register)
│   ├── admin.js              # Admin routes (dashboard, manage products)
│   ├── shop.js               # Shop routes (product listing, details)
│   ├── cart.js               # Cart routes (add, remove items)
│   ├── rent.js               # Rental routes (rental product listing, booking)
│   └── user.js               # User profile routes
├── views/                    # EJS templates for rendering views
│   ├── auth/                 # Authentication-related views (login, register)
│   ├── admin/                # Admin views (dashboard, product management)
│   ├── shop/                 # Shop views (product listing, details)
│   ├── cart/                 # Cart views (cart display)
│   ├── rent/                 # Rental views (product listing, booking)
│   ├── user/                 # User profile views
│   ├── partials/             # Reusable partials for views (header, footer)
│   └── error.ejs             # Error page template
├── controllers/              # Route controllers
│   └── error.js              # Controller for handling errors (404, etc.)
├── app.js                    # Main application file
├── package.json              # Project configuration and dependencies
└── README.md                 # This file
```

### Features

- **User Authentication**: Users can register, login, and manage their profiles.
- **Admin Panel**: Admin users have access to special functionalities like managing products.
- **Authorization**: Differentiate between user roles (admin, regular user) for specific functionalities.
- **Image Upload**: Supports image upload for product listings and user avatars.
- **Session Management**: Uses `express-session` with `connect-mongo` for session storage in MongoDB.
- **Error Handling**: Custom error handling for 404 and database connection errors.
- **MongoDB Integration**: Utilizes Mongoose for MongoDB database interactions.
- **Security Middleware**: Implements `helmet` and `express-rate-limit` for security and rate limiting.
- **View Templating**: Renders dynamic content using EJS templates.
- **File Upload**: Uses `multer` for handling file uploads.

### Technologies Used

- **Node.js** and **Express.js**: Server-side JavaScript runtime and web application framework.
- **MongoDB**: NoSQL database for data storage.
- **Stripe**: For payment Gateway.
- **MailTrap**: I have used Mailtrap for sending authentication mail via `nodemailer`.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Passport.js**: Authentication middleware for Node.js.
- **Multer**: Middleware for handling file uploads.
- **EJS**: Embedded JavaScript templates for dynamic content rendering.
- **JWT (JSON Web Tokens)**: Used for user authentication and authorization.





### License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---

For more details, visit the [GitHub repository](https://github.com/themrinmoy/Final_year_project#readme). If you have any questions or need further assistance, please feel free to reach out!
