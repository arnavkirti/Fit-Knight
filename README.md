
# FitKnight - Rise of the Fitness Crusaders

FitKnight is a full-stack fitness app designed to connect users with fitness buddies and groups based on location, provide a seamless group chat experience, and offer a personalized dashboard and notification system.

## Tech Stack

### Frontend
- **Vite**
- **React.js**
- **TailwindCSS**

### Backend
- **Node.js**
- **Express**
- **Socket.io** (WebSockets)
- **Zod**
- **bcrypt.js**
- **JWT** (JSON Web Tokens)
- **Multer**
- **Cloudinary**
- **Mongoose**
- **MongoDB** (Database)

---

## Features

### 1. Authentication
- Secure authentication using **JWT** and **bcrypt.js**.
- Users can upload and update their profile photos using **Multer** and **Cloudinary**.

### 2. Dashboard
- Displays fitness buddies and groups based on the user's location using **GEOJson** queries.
- Users can:
    - Manage his group, see recommended buddies and available groups.
- Admins can:
  - Create group.
  - View and manage join requests from users and created group.

### 3. Groups
- Group details include:
  - All the information about the group and its organizer.
  - A real-time group chat feature built with **Socket.io**.
  - A list of current group members.

### 4. Profile
- A dedicated profile page showing personal information.
- Users can update their personal details.

### 5. Notification Feed
- Notifications are sent for specific events, such as:
  - Buddy matches.
  - Join requests.

---

## Installation and Setup

### Prerequisites
- **Node.js** and **npm** installed on your system.
- **MongoDB** instance running locally or on the cloud.
- A **Cloudinary** account for image storage.

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/arnavkirti/Fit-Knight
   cd Fit-Knight
   ```

2. Install dependencies for the backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following keys:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

5. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## Folder Structure

### Backend (`/backend`)
- `modals/`: Contains MongoDB schemas and Zod validation and JWT Logic.
- `routes/`: API routes for authentication, groups, user, admin and profiles.
- `controllers/`: Logic for various routes.
- `middlewares/`: Custom middlewares for authentication and validation.

### Frontend (`/frontend`)
- `src/components/`: Main pages like Dashboard, Profile, and Group.
- `src/lib/`: TailwindCSS configurations.

---
