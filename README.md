# Hotel Booking App

A full-stack web application for quick and easy hotel bookings. Users can browse hotels, view rooms, make bookings, and manage their reservations. Hotel owners can register their properties and manage rooms.

## Features

- **User Authentication**: Secure login and registration using Clerk.
- **Hotel Registration**: Hotel owners can register their hotels and add details.
- **Room Management**: Add, list, and manage hotel rooms with images and amenities.
- **Booking System**: Users can search, view, and book rooms with payment integration.
- **Dashboard**: Separate dashboards for users and hotel owners to manage bookings and listings.
- **Responsive Design**: Mobile-friendly interface built with React.
- **Real-time Updates**: Integrated with Clerk webhooks for seamless user management.

## Tech Stack

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **CSS**: Custom styling for responsive design.

### Backend
- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing user, hotel, room, and booking data.
- **Clerk**: Authentication and user management service.

### Deployment
- **Vercel**: Hosting platform for the application.

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- MongoDB database (local or cloud, e.g., MongoDB Atlas)
- Clerk account for authentication

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/hotel-booking.git
   cd hotel-booking
   ```

2. **Install server dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**:
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables**:
   - Create a `.env` file in the `server` directory with:
     ```
     MONGODB_URI=your_mongodb_connection_string
     CLERK_SECRET_KEY=your_clerk_secret_key
     ```
   - For the client, configure Clerk in `client/src/main.jsx` or via environment variables as per Clerk documentation.

5. **Run the application**:
   - Start the server:
     ```bash
     cd server
     npm start
     ```
   - Start the client:
     ```bash
     cd ../client
     npm run dev
     ```
   - Open your browser to `http://localhost:5173` (client) and ensure the server is running on its configured port (e.g., 5000).

## Usage

- **For Users**:
  - Register/Login via Clerk.
  - Browse hotels and rooms on the home page.
  - View room details and make bookings.
  - Manage bookings in the "My Bookings" section.
  - Complete payments for reservations.

- **For Hotel Owners**:
  - Register as a hotel owner.
  - Add and manage hotel details and rooms.
  - View bookings and revenue on the dashboard.

## Project Structure

```
hotel-booking/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images and icons
│   │   ├── components/     # Reusable React components
│   │   │   ├── hotelOwner/ # Owner-specific components
│   │   ├── pages/          # Page components
│   │   │   ├── hotelOwner/ # Owner-specific pages
│   │   ├── utils/          # Utility functions (e.g., API calls)
│   │   └── main.jsx        # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend Node.js application
│   ├── configs/            # Database configuration
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Authentication middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── package.json
│   └── server.js           # Server entry point
├── .gitignore
├── package.json            # Root package.json (if any)
├── README.md               # This file
├── TODO.md                 # Project tasks
└── vercel.json             # Vercel deployment config
```

## Contributing

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Make your changes and commit: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Output Preview

Here is a preview of the application UI:

![App Screenshot](client/public/screenshot-homepage.png)



### Hotel Booking Process
 ![alt text](hotel_bookig.gif)


<img src="client/public/hotel_booking.gif" alt="Hotel Booking" />

### Login and Register Process


![alt text](login_registration.gif)

<img src="client/public/login_register.gif" alt="Login and Register" />

*Note: Replace the above placeholder images with actual gifs of the running application. You can capture gifs of the app running locally at `http://localhost:5173` and save them in the `client/public` folder as `hotel_booking.gif` and `login_register.gif`. Then update the image paths above accordingly.*

## Contact

For questions or support, please contact [your-email@example.com].
