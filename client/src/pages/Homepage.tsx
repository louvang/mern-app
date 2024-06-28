import { useState, useEffect } from 'react';
import { useCurrentUserQuery } from '../redux/services/authApi';

function Homepage() {
  const [username, setUsername] = useState('');
  const { data, isLoading } = useCurrentUserQuery();

  useEffect(() => {
    if (!isLoading && data) {
      if (data.user) {
        setUsername(data.user.username);
      }
    }
  }, [isLoading, data, setUsername]);

  const loginOrRegisterMsg = (
    <p>
      <a href="/login">Login</a> or <a href="/register">Register</a>
    </p>
  );
  const greeting = (
    <p>
      Hello, {username}. <a href="/logout">Log out</a>.
    </p>
  );

  return (
    <>
      <h1>Homepage</h1>
      {username === '' ? loginOrRegisterMsg : greeting}
    </>
  );
}

export default Homepage;
