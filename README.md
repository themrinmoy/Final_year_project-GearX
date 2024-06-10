# Final Year Project - GearX

[![Live Demo 1](https://gearx.mrinmoy.org/images/fontPage.png)](https://gearx.mrinmoy.org)
[![Live Demo 2](https://gearx.mrinmoy.org/images/adminPage.png)](https://gearx2.mrinmoy.org)
[![Live Demo 3](https://gearx.mrinmoy.org/images/rentPage.png)](https://final-year-project-gearx.onrender.com)

## Table of Contents
- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Dependencies](#dependencies)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [FAQ](#faq)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Overview
GearX is a rental web application designed for bike enthusiasts, allowing them to rent various bike tour-related products such as tour kits, helmets, jackets, and bikes for specific timelines. Users also have the option to purchase these products if they find them beneficial for longer durations. Our goal is to make long bike tours affordable for everyone and promote environmental sustainability through product reuse.

## Problem Statement
Long bike tours can be prohibitively expensive due to the high cost of necessary gear and equipment. Riders often need to invest in costly items for safety and comfort, which they might not use frequently. This makes long-distance biking inaccessible for many enthusiasts and contributes to environmental waste as gear is often discarded after minimal use.

## Solution
GearX addresses these issues by providing a rental platform where users can rent high-quality biking gear and equipment at an affordable price. This approach:
- Makes long bike tours accessible to a broader audience by reducing the upfront cost.
- Encourages the reuse of products, promoting environmental sustainability.
- Offers an option to purchase the gear if users wish to keep it for longer, ensuring flexibility and convenience.

## Features
- **User Authentication**: Secure login for users and admins using JWT and customized Passport.js integrated with Google Oauth2.0.
- **Authorization**: Differentiate between user roles (admin, regular user) for specific functionalities.
- **Product Rental and Purchase**: Browse and rent or buy various bike tour-related products.
- **Secure Payment**: Integrated with Stripe for safe and secure transactions.
- **Email Notifications**: Notifications for rentals and purchases using Mailtrap.
- **Admin Dashboard**: Manage products, orders, and users.
- **View Templating**: Renders dynamic content using EJS templates.
- **Session Management**: Uses `express-session` with `connect-mongo` for session storage in MongoDB.
- **Error Handling**: Custom error handling for 404 and database connection errors.
- **Rate Limiting and Security**: Protection against common web vulnerabilities using Helmet and express-rate-limit.
- **Image Upload**: Supports image upload for product listings and user avatars.

## Technologies Used
GearX leverages a variety of technologies to provide a robust and efficient rental platform:

- **Backend**: Node.js and Express.js for building the server-side application.
- **Frontend**: EJS for server-side rendering of views.
- **Database**: MongoDB, accessed via Mongoose for data storage and retrieval.
- **Authentication**: Passport.js for authentication, supporting local and Google OAuth strategies.
- **Payment Processing**: Stripe for secure and reliable payment handling.
- **Email Notifications**: Nodemailer integrated with Mailtrap for email functionality.
- **Security**: Helmet for securing HTTP headers, express-rate-limit for rate limiting.
- **File Uploads**: Multer for handling multipart/form-data.
- **Scheduling**: Node-cron for scheduling tasks.
- **Deployment**: Hosted on Oracle server with Nginx, also deployed on Railway.app and Render.
- **Development**: Nodemon for hot-reloading during development.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js and npm installed on your machine.
- MongoDB set up and running.
- Stripe account for payment processing.
- Mailtrap account for email notifications.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/themrinmoy/Final_year_project.git
    cd Final_year_project
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables as mentioned below.

4. Start the application:
    ```bash
    npm start
    ```

## Usage
- **User Login**:
    - Username/Email: `user` or `user@mrinmoy.org`
    - Password: `test`

- **Admin Login**:
    - Username/Email: `admin` or `admin@mrinmoy.org`
    - Password: `test`

Visit [https://gearx.mrinmoy.org](https://gearx.mrinmoy.org), [https://gearx2.mrinmoy.org](https://gearx2.mrinmoy.org), or [https://final-year-project-gearx.onrender.com](https://final-year-project-gearx.onrender.com) to explore the live demo.

**Test Payment**: Use the following test card number for Stripe payment in India:
- **Card Number**: `4000 0035 6000 0008`
- **Card Name**: Any random name
- **CVV**: Any random 3-digit number

## Environment Variables
Create a `.env` file in the root directory and add the following environment variables:
```env
MONGODB_URI="your_mongodb_uri"
MAILTRAP_API_KEY="your_mailtrap_api_key"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
JWT_SECRET="your_jwt_secret"
DOMAIN="your_domain"
PORT="your_port"
```

## Dependencies
- `bcryptjs`: ^2.4.3
- `body-parser`: ^1.20.2
- `compression`: ^1.7.4
- `connect-mongo`: ^5.1.0
- `ejs`: ^3.1.10
- `express`: ^4.19.2
- `express-flash`: ^0.0.2
- `express-rate-limit`: ^7.1.5
- `express-session`: ^1.18.0
- `helmet`: ^7.1.0
- `jsonwebtoken`: ^9.0.2
- `mongoose`: ^8.1.1
- `multer`: ^1.4.5-lts.1
- `node-cron`: ^3.0.3
- `nodemailer`: ^6.9.11
- `nodemon`: ^3.0.3
- `passport`: ^0.7.0
- `passport-google-oauth2`: ^0.2.0
- `passport-google-oauth20`: ^2.0.0
- `passport-local`: ^1.0.0
- `passport-local-mongoose`: ^8.0.0
- `retry`: ^0.13.1
- `stripe`: ^14.19.0

## Testing
To run tests, execute the following command:
```bash
npm test
```
(not functional yet!)

## Screenshots
![Home Page](https://gearx.mrinmoy.org/images/fontPage.png)
*Home Page*

![Admin Dashboard](https://gearx.mrinmoy.org/images/adminPage.png)
*Admin Dashboard*

![Rent Page](https://gearx.mrinmoy.org/images/rentPage.png)
*Rent Page*
![Rent Cart Page](https://gearx.mrinmoy.org/images/rentCartPage.png)
*Rent Cart Page*
![Rent payment Page](https://gearx.mrinmoy.org/images/rentPaymentPage.png)
*Rent payment Page*

![Reantals Page](https://gearx.mrinmoy.org/images/rentalsPage2.png)
*Reantals Page*

![Rented product return Mail](https://gearx.mrinmoy.org/images/reminderMail.png)
*Rented product return Mail*

![Product Page](https://gearx.mrinmoy.org/images/productPage.png)
*Product Page*
## FAQ
**Q1: How can I reset my password?**
A1: Click on "Forgot Password" on the login page and follow the instructions.

**Q2: Can I extend my rental period?**
A2: Yes, you can extend your rental period from your account dashboard.

**Q3: What payment methods are supported?**
A3: Currently, we support payments through Stripe.

## Future Enhancements
- Mobile app version of GearX.
- Integration with additional payment gateways.
- Enhanced user profile with rental history and recommendations.
- Social media sharing options for rented or purchased gear.
- AI-based gear recommendations based on user preferences.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the project's coding standards and include relevant tests.

## License
This project is licensed under the ISC License.

## Contact
For any inquiries or issues, please open an issue on the [GitHub repository](https://github.com/themrinmoy/Final_year_project/issues) or contact the author:
- **Author**: Mrinmoy Chakraborty
- **GitHub**: [themrinmoy](https://github.com/themrinmoy)

Explore the project further on GitHub: [Final Year Project - GearX](https://github.com/themrinmoy/Final_year_project)

