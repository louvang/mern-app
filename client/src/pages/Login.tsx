import { useState, useEffect } from 'react';
import {
  useCurrentUserQuery,
  useLoginMutation,
} from '../redux/services/authApi';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const {
    data: authData,
    isLoading: isAuthLoading,
    error: authError,
  } = useCurrentUserQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && authData) {
      navigate('/');
    }
  }, [isAuthLoading, authData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ username, password });

      if (result.data) {
        console.log(result.data);
        navigate('/');
      } else {
        console.log('Login failed.');
      }
    } catch (err) {
      console.error('Login error', err);
    }
  };

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Login</h1>

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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button disabled={isLoading}>Login</button> or{' '}
        <a href="/register">Register</a>
        <div>
          {error && (
            <p style={{ color: 'red' }}>There was an error logging in!</p>
          )}
          {authError && (
            <p style={{ color: 'red' }}>Error checking authentication status</p>
          )}
        </div>
      </form>
    </>
  );
}

export default Login;
