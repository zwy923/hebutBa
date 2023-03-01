import React, { useState } from 'react';

const RegistrationForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };
  
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await fetch('http://localhost:1234/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        });
        const data = await response.json();
        if (response.ok) {
          // handle successful registration
        } else {
          setError(data.error);
        }
      } catch (error) {
        console.error(error);
        setError('Something went wrong');
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        {error && <div>{error}</div>}
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <button type="submit">Register</button>
      </form>
    );
  };


export default RegistrationForm
