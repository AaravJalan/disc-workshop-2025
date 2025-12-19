import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../api/users';
import '../App.css';

function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    major: '',
    graduationYear: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const createPlaceholderImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#6c757d';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No Image', 100, 100);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], 'default.png', { type: 'image/png', lastModified: Date.now() }));
      }, 'image/png');
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const firstName = String(formData.firstName || '').trim();
    const lastName = String(formData.lastName || '').trim();
    const email = String(formData.email || '').trim();

    if (!firstName || !lastName || !email) {
      setError('First name, last name, and email are required.');
      return;
    }

    try {
      setLoading(true);

      let imageFile = null;

      // Try to fetch image from URL if provided
      if (formData.imageUrl && formData.imageUrl.trim()) {
        const imageUrl = formData.imageUrl.trim();
        console.log('Attempting to fetch image from URL:', imageUrl);

        try {
          const response = await fetch(imageUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
          });

          if (response.ok) {
            const blob = await response.blob();
            if (blob && blob.size > 0) {
              const urlParts = imageUrl.split('.');
              const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split('?')[0].split('#')[0] : 'png';
              const fileName = `image.${extension}`;
              imageFile = new File([blob], fileName, {
                type: blob.type || `image/${extension === 'jpg' ? 'jpeg' : extension}`,
                lastModified: Date.now()
              });
            }
          }
        } catch (fetchErr) {
          console.warn('Could not fetch image from URL:', fetchErr.message);
        }
      }

      // If no image from URL, create a placeholder
      if (!imageFile) {
        console.log('Creating default placeholder image');
        imageFile = await createPlaceholderImage();
      }

      const newUser = await createUser({
        firstName,
        lastName,
        email,
        bio: String(formData.bio || '').trim(),
        major: String(formData.major || '').trim(),
        graduationYear: String(formData.graduationYear || '').trim(),
        image: imageFile
      });

      console.log('User created:', newUser);
      navigate(`/users/${newUser.id}`);
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container main-container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--nu-purple)', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Home
        </Link>

        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>Create New User</h1>

          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              marginBottom: '1rem',
              color: '#c33'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="firstName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                First Name <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: 'var(--nu-purple)'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="lastName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Last Name <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: 'var(--nu-purple)'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Email <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: 'var(--nu-purple)'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="major" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Major
              </label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: 'var(--nu-purple)'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="graduationYear" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Graduation Year
              </label>
              <input
                type="text"
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g., 2026"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: 'var(--nu-purple)'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="bio" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  backgroundColor: 'white',
                  color: 'var(--nu-purple)'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="imageUrl" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Profile Picture URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: 'var(--nu-purple)'
                }}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Optional: Enter an image URL. If not provided, a default placeholder will be used.
              </small>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: '1' }}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
              <Link
                to="/"
                className="btn btn-outline"
                style={{ textDecoration: 'none', flex: '1', textAlign: 'center' }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateUser;
