import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function MyProfile() {
  const handleLogout = () => {
    alert('Logout functionality with authentication.');
  };

  return (
    <main className="container main-container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--nu-purple)', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Home
        </Link>

        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>My Profile</h1>

          <div style={{ lineHeight: '1.8', color: 'var(--text-color)' }}>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              This is your profile page. Here you can view and manage your account information.
            </p>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              marginTop: '2rem'
            }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                You can:
              </p>
              <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>View your profile information</li>
                <li style={{ marginBottom: '0.5rem' }}>Edit your profile</li>
                <li style={{ marginBottom: '0.5rem' }}>Manage your connections</li>
                <li style={{ marginBottom: '0.5rem' }}>Update your preferences</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Browse All Users
              </Link>
              <Link to="/users/new" className="btn btn-outline" style={{ textDecoration: 'none' }}>
                Create New User
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MyProfile;
