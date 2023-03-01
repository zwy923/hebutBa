import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/header';
import Main from '../components/Main';
import Login from '../components/LoginForm';
import Register from '../components/RegisterForm';
import Footer from '../components/footer';
import Error from '../components/error'

const Navigation = () => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const handleLoginSuccess = (token) => {
    setToken(token);
    localStorage.setItem('authToken', token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <Router>
      <Header onLogout={handleLogout} />
      <Routes>
        <Route path="*" element={<Error />} />
        <Route path="/" element={<Main onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer title="*-*" description="code communication" />
    </Router>
  );
};

export default Navigation;
