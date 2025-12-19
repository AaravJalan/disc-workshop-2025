import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../api/users';
import '../App.css';

const ProfileCard = ({ user, isConnected, onConnect, onDelete, deletingUserId }) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  const graduationYear = user.graduationYear || 'N/A';

  return (
    <div className="card">
      <div className="card-img-placeholder">
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={fullName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          'IMG'
        )}
      </div>
      <div className="card-body">
        <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="card-title">{fullName}</h3>
        </Link>
        <div className="card-subtitle">{user.major || 'N/A'} • {graduationYear}</div>
        <p className="card-text">{user.bio || 'No bio available'}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            className={isConnected ? "btn btn-outline" : "btn btn-primary"}
            onClick={() => onConnect(user.id)}
          >
            {isConnected ? "Request Sent" : "Connect"}
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to={`/users/${user.id}/edit`}
              className="btn btn-outline"
              style={{ flex: '1', textDecoration: 'none', textAlign: 'center', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              Edit
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onDelete) onDelete(user);
              }}
              className="btn btn-outline"
              style={{ flex: '1', fontSize: '0.9rem', color: '#dc3545', borderColor: '#dc3545' }}
              disabled={deletingUserId === user.id}
            >
              {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Loading users...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectedIds, setConnectedIds] = useState([]);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getAllUsers();
      console.log('Fetched users:', fetchedUsers);
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleConnect = (id) => {
    if (connectedIds.includes(id)) {
      setConnectedIds(connectedIds.filter(existingId => existingId !== id));
    } else {
      setConnectedIds([...connectedIds, id]);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    try {
      setDeletingUserId(user.id);
      const { deleteUser } = await import('../api/users');
      await deleteUser(user.id);
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

      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return (
      <main className="container main-container">
        <LoadingSpinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="container main-container">
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontSize: '1.2rem' }}>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container main-container">
      <div className="col-content" style={{ width: '100%' }}>
        <div className="content-header">
          <h1 className="page-title">All Users</h1>
          <span className="results-count">Showing {users.length} {users.length === 1 ? 'result' : 'results'}</span>
        </div>

        {users.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontSize: '1.2rem' }}>No users found.</p>
          </div>
        ) : (
          <div className="profile-grid">
            {users.map((user) => (
              <ProfileCard
                key={user.id}
                user={user}
                isConnected={connectedIds.includes(user.id)}
                onConnect={handleConnect}
                onDelete={handleDelete}
                deletingUserId={deletingUserId}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AllUsers;
