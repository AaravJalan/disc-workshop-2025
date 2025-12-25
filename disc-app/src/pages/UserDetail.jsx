import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserByID, deleteUser } from '../api/users';
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

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const fetchedUser = await getUserByID(parseInt(id));
        console.log('Fetched user:', fetchedUser);
        setUser(fetchedUser);
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

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    try {
      setDeleting(true);
      await deleteUser(parseInt(id));
      console.log('User deleted successfully');

      // Create a replacement user as required by assignment
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
        ctx.fillText('Replacement', 100, 90);
        ctx.fillText('User', 100, 120);

        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve(new File([blob], 'placeholder.png', { type: 'image/png' }));
          }, 'image/png');
        });
      };

      const { createUser } = await import('../api/users');
      const replacementUserData = {
        firstName: 'Replacement',
        lastName: 'User',
        email: `replacement${Date.now()}@example.com`,
        bio: 'This user was created to replace a deleted user.',
        major: 'Computer Science',
        graduationYear: '2026',
        image: await createPlaceholderImage()
      };

      try {
        await createUser(replacementUserData);
        console.log('Replacement user created');
      } catch (createErr) {
        console.error('Error creating replacement user:', createErr);
      }

      navigate('/');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="container main-container">
        <LoadingSpinner />
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="container main-container">
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontSize: '1.2rem' }}>{error || 'User not found'}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <main className="container main-container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--nu-purple)', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Home
        </Link>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '200px', height: '200px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={fullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '3rem', color: '#6c757d' }}>IMG</span>
              )}
            </div>

            <div style={{ textAlign: 'center', width: '100%' }}>
              <h1 style={{ marginBottom: '0.5rem' }}>{fullName}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                {user.major || 'N/A'} • {user.graduationYear || 'N/A'}
              </p>
              <p style={{ color: 'var(--text-muted)' }}>{user.email}</p>
            </div>

            {user.bio && (
              <div style={{ width: '100%', paddingTop: '1rem', borderTop: '1px solid #e9ecef' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>About</h3>
                <p style={{ color: 'var(--text-color)', lineHeight: '1.6' }}>{user.bio}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
              <Link
                to={`/users/${id}/edit`}
                className="btn btn-primary"
                style={{ textDecoration: 'none', flex: '1', maxWidth: '200px', textAlign: 'center' }}
              >
                Edit User
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-outline"
                style={{ flex: '1', maxWidth: '200px', color: '#dc3545', borderColor: '#dc3545' }}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default UserDetail;
