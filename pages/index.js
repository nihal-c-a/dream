// dream/pages/index.js
import React, { useState } from 'react';
import styles from '../styles/login.module.css';
import '../styles/global.css';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
       

        // Set the session data in sessionStorage
        sessionStorage.setItem('sessionId', data.sessionId);
        sessionStorage.setItem('userType', data.userType);

        // Redirect to the respective home page based on userType
        if (data.userType === 'client') {
          alert('client login successful');
          window.location.href = '/clienthome';
        } else if (data.userType === 'constructor') {
          alert('constructor login successful');
          window.location.href = '/constructorhome';
        }
      } else {
        
        alert(data.userType,'Invalid password or email');
        console.error(data.message);
      }
    } catch (error) {
      alert(error);
      console.error('An error occurred during login:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.logoContainer}>
          <img src="/pic/logo.png" alt="Logo" className={styles.logo} />
          <h1>DREAM <br />CRAFTERS</h1>
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.loginContainer}>
          <h2>LOGIN</h2>
          <form onSubmit={handleLogin}>
            <div className={styles.labelTextbox}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                className={styles.email}
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.labelTextbox}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                className={styles.password}
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <a href="#" className={styles.forgotPass}>
              Forgot Password?
            </a>
            <br />
            <button type="submit">Login</button>
            <p>
              <Link href="/clientregister">Don't have an account? Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;