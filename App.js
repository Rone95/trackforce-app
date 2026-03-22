import React, { useState } from 'react';
import { firebase } from './firebase';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error("Login error: ", error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error("Registration error: ", error.message);
    }
  };

  const handleLogout = async () => {
    await firebase.auth().signOut();
    setUser(null);
  };

  return (
    <div>
      <h1>Firebase Auth Example</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.email}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      )}
    </div>
  );
};

export default App;