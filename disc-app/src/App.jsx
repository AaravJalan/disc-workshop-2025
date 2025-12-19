import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AllUsers from './pages/AllUsers';
import UserDetail from './pages/UserDetail';
import CreateUser from './pages/CreateUser';
import UpdateUser from './pages/UpdateUser';
import About from './pages/About';
import MyProfile from './pages/MyProfile';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    alert('Logout functionality with authentication.');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          Wildcat Connect
        </Link>
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/all-users"
              className={`nav-link ${isActive('/all-users') ? 'active' : ''}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              All Users
            </Link>
          </li>
          <li>
            <Link
              to="/my-profile"
              className={`nav-link ${isActive('/my-profile') ? 'active' : ''}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              My Profile
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              About
            </Link>
          </li>
          <li>
            <a
              href="#"
              className="nav-link"
              onClick={handleLogout}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/users/new" element={<CreateUser />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/users/:id/edit" element={<UpdateUser />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <footer className="footer">
        <p>&copy; 2025 Wildcat Connect</p>
      </footer>
    </div>
  );
}

export default App;
