// dream/pages/clientregister.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/registration.module.css';
import '../styles/globalregistration.css';

import { useRouter } from 'next/router';

const ClientRegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phoneno: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch('/api/clientregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        window.location.href = '/';
        // setFormData({
        //   firstname: '',
        //   lastname: '',
        //   email: '',
        //   password: '',
        //   phoneno: '',
        //   address: '',
        // });
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      phoneno: '',
      address: '',
    });
  };

  const handleCancel = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Client Registration</title>
      </Head>

      <header>
        <img src="/pic/logo.png" alt="Logo" />
        <h1>CLIENT REGISTRATION</h1>
        <div>
          <Link href="/clientregister" className={styles.highlight}>Client</Link> &nbsp;|&nbsp;
          <Link href="/constructorregister" className={styles.nonhighlight}>Constructor</Link>{' '}
        </div>
      </header>

      <div className={styles.container}>
        <form action="#" method="post" onSubmit={handleRegister} onReset={handleReset}>
          <div className={styles.formGroup}>
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneno">Phone Number</label>
            <input
              type="number"
              id="phoneno"
              name="phoneno"
              value={formData.phoneno}
              onChange={handleChange}
              min="00000000000"
              max="9999999999"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Current Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="checkbox"
              id="agree"
              name="agree"
              required
            />
            <label htmlFor="agree" className={styles.terms}>
              I agree to the terms and conditions
            </label>
          </div>

          <div className={styles.buttons}>
            <button className={styles.resetBtn} type="reset" onClick={handleReset}>
              Reset
            </button>
            <button className={styles.registerBtn} type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <button className={styles.cancelBtn} type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>

        <div className={styles.loginLink}>
          <a href="/" onClick={() => window.location.href = '/'}>
            Already have an account? Login
          </a>
        </div>

      </div>
    </>
  );
};

export default ClientRegisterPage;