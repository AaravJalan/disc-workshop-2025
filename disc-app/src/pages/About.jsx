import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function About() {
  return (
    <main className="container main-container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--nu-purple)', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Home
        </Link>

        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>About Wildcat Connect</h1>

          <div style={{ lineHeight: '1.8', color: 'var(--text-color)' }}>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              Welcome to Wildcat Connect, your platform for discovering and connecting with fellow Northwestern students!
            </p>

            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Our Mission</h2>
            <p style={{ marginBottom: '1rem' }}>
              Wildcat Connect aims to help students find study partners, project collaborators, and friends
              with similar interests and goals. Whether you're looking for a gym buddy, a study group, or
              someone to explore campus with, this is the place to connect.
            </p>

            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Features</h2>
            <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Browse profiles of Northwestern students</li>
              <li style={{ marginBottom: '0.5rem' }}>Filter by major, graduation year, and more</li>
              <li style={{ marginBottom: '0.5rem' }}>Connect with students who share your interests</li>
              <li style={{ marginBottom: '0.5rem' }}>Create and manage your own profile</li>
            </ul>

            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Get Started</h2>
            <p style={{ marginBottom: '1rem' }}>
              Start by exploring the student directory, or create your own profile to let others discover you!
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Browse Students
              </Link>
              <Link to="/users/new" className="btn btn-outline" style={{ textDecoration: 'none' }}>
                Create Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default About;

