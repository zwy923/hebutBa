import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/header';
import Main from '../components/Main';
import Login from '../components/LoginForm';
import Register from '../components/RegisterForm';
import Footer from '../components/footer';
import Error from '../components/error'
import jwtDecode from 'jwt-decode';
import CreateSnippet from '../components/CreateSnippet';
const Navigation = () => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  if(token){
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp < Date.now() / 1000) {
      localStorage.removeItem('authToken')
    } else {
      // token is still valid
    }
  }
  
  
  // If a local token is detected
  useEffect(() => {
    const localToken = localStorage.getItem('authToken');
    if (localToken) {
      setToken(localToken);
    }
  }, [])

  const handleLoginSuccess = (token) => {
    setToken(token);
    localStorage.setItem('authToken', token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    window.location.reload()
  };

  return (
    <Router>
      <Header isLoggedIn={token !== null} onLogout={handleLogout} />
      <Routes>
        <Route path="*" element={<Error />} />
        <Route path="/" element={<Main  />} />
        <Route path='createsnippet' element={<CreateSnippet token={token} isLoggedIn={token !== null} />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer title="*-*" description="code communication" />
    </Router>
  );
};

export default Navigation;
