# Freelancer Marketplace - MERN Stack

Full-stack Freelancer Marketplace web application built with MongoDB, Express.js, React.js, Node.js.

## Features
- Role-based authentication (Freelancer & Client)
- Freelancer dashboard with work requests
- Client dashboard with freelancer search & booking
- Real-time project management
- Responsive UI with Tailwind CSS

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone/Download the repo
2. Create `.env` files from `.env.example` in both `server/` and `client/` folders
3. Backend:
   ```bash
   cd server
   npm install
   npm run dev
   ```
4. Frontend (new terminal):
   ```bash
   cd client
   npm install
   npm start
   ```

### Environment Variables
See `.env.example` files for required variables.

### API Endpoints
See backend `routes/` folder for documentation.

### Project Structure
```
freelancer-marketplace/
├── server/          # Backend (Node/Express/MongoDB)
├── client/          # Frontend (React/Tailwind)
├── README.md
└── .env.example
```

## Tech Stack
**Backend:** Node.js, Express.js, MongoDB, JWT, Mongoose  
**Frontend:** React.js, Tailwind CSS, React Router, Redux Toolkit  
**Other:** Socket.io (real-time), Cloudinary (images)
