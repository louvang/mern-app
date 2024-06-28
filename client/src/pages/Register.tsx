import React, { useState, useEffect } from 'react';
import {
  useRegisterMutation,
  useCurrentUserQuery,
} from '../redux/services/authApi';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [register, { isLoading, error }] = useRegisterMutation();
  const { data: authData, isLoading: isAuthLoading } = useCurrentUserQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && authData) {
      if (authData.user) {
        navigate('/');
      }
    }
  }, [isAuthLoading, authData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await register({ username, email, password });

      if (result.data) {
        console.log(result.data);
        navigate('/login');
      } else {
        console.log('Registration failed');
      }
    } catch (err) {
      console.log('Login error', err);
    }
  };

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button disabled={isLoading}>Register</button> or{' '}
        <a href="/login">Login</a>
      </form>

      <div>
        {error && (
          <p style={{ color: 'red' }}>There was an error with registration!</p>
        )}
      </div>
    </>
  );
}

export default Register;
