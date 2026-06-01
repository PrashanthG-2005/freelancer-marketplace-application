import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterFreelancer from './pages/RegisterFreelancer';
import RegisterClient from './pages/RegisterClient';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import EditProfile from './pages/EditProfile';

function AppContent() {
  const location = useLocation(); // eslint-disable-line no-unused-vars
  const isAuthPage = false;

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/freelancer" element={<RegisterFreelancer />} />
          <Route path="/register/client" element={<RegisterClient />} />
          <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

