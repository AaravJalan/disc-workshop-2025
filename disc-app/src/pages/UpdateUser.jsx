import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserByID, updateUser } from '../api/users';
import '../App.css';

const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid var(--nu-purple)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Loading user...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function UpdateUser() {
  const { id } = useParams();
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
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await getUserByID(parseInt(id));
        console.log('Fetched user for editing:', user);

        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          bio: user.bio || '',
          major: user.major || '',
          graduationYear: user.graduationYear || '',
          imageUrl: ''
        });

        if (user.profilePicture) {
          setExistingImageUrl(user.profilePicture);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

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
      setSaving(true);

      let imageFile = null;

      // If new image URL provided, try to fetch it
      if (formData.imageUrl && formData.imageUrl.trim()) {
        const imageUrl = formData.imageUrl.trim();
        console.log('Fetching new image from URL:', imageUrl);

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
          console.warn('Could not fetch new image from URL:', fetchErr.message);
        }
      }

      // If no new image and existing image exists, try to use existing
      if (!imageFile && existingImageUrl) {
        console.log('Attempting to use existing image from:', existingImageUrl);
        try {
          const response = await fetch(existingImageUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
          });

          if (response.ok) {
            const blob = await response.blob();
            if (blob && blob.size > 0) {
              const urlParts = existingImageUrl.split('.');
              const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split('?')[0].split('#')[0] : 'png';
              const fileName = `existing-image.${extension}`;
              imageFile = new File([blob], fileName, {
                type: blob.type || `image/${extension === 'jpg' ? 'jpeg' : extension}`,
                lastModified: Date.now()
              });
            }
          }
        } catch (fetchErr) {
          console.warn('Could not fetch existing image:', fetchErr.message);
        }
      }

      // If still no image, create placeholder
      if (!imageFile) {
        console.log('Creating default placeholder image');
        imageFile = await createPlaceholderImage();
      }

      const updatedUser = await updateUser(parseInt(id), {
        firstName,
        lastName,
        email,
        bio: String(formData.bio || '').trim(),
        major: String(formData.major || '').trim(),
        graduationYear: String(formData.graduationYear || '').trim(),
        image: imageFile
      });

      console.log('User updated successfully:', updatedUser);
      navigate(`/users/${updatedUser.id}`);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="container main-container">
        <LoadingSpinner />
      </main>
    );
  }

  if (error && !formData.firstName) {
    return (
      <main className="container main-container">
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontSize: '1.2rem' }}>{error}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container main-container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link to={`/users/${id}`} style={{ textDecoration: 'none', color: 'var(--nu-purple)', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to User
        </Link>

        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>Edit User</h1>

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

          {existingImageUrl && (
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Current Profile Picture:</p>
              <img
                src={existingImageUrl}
                alt="Current profile"
                style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '4px' }}
              />
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
                New Profile Picture URL (Optional)
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
                Leave empty to keep the current image, or enter a new image URL to replace it.
              </small>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ flex: '1' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                to={`/users/${id}`}
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

export default UpdateUser;
