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

const INITIAL_PROFILES = [
  { id: 1, name: "Willie Wildcat", major: "Computer Science", year: "'26", bio: "Loves hackathons and late night runs. Looking for a gym buddy!" },
  { id: 2, name: "Sarah Medill", major: "Journalism", year: "'28", bio: "Always chasing a story. Coffee enthusiast." },
  { id: 3, name: "Josh Econ", major: "Economics", year: "'27", bio: "Into finance and board games. Trying to find a Poker group for weekends." },
  { id: 4, name: "Alex Stage", major: "Theatre", year: "'26", bio: "Improv actor. I love spontaneous adventures and deep conversations." },
  { id: 5, name: "Jordan Eng", major: "Mechanical Eng", year: "'29", bio: "Building robots in the Garage. Big fan of rock climbing and hiking." },
  { id: 6, name: "Taylor Music", major: "Violin Performance", year: "'26", bio: "Classical musician but loves jazz. Always down for a jam session." },
];

const NavBar = () => (
  <nav className="navbar">
    <div className="container navbar-content">
      <div className="brand">Wildcat Connect</div>
      <ul className="nav-links">
        <li className="nav-link">Home</li>
        <li className="nav-link">All Users</li>
        <li className="nav-link">My Profile</li>
        <li className="nav-link">About</li>
        <li className="nav-link">Log Out</li>
      </ul>
    </div>
  </nav>
);

const FilterSidebar = () => (
  <div className="col-sidebar">
    <div className="filter-card">
      <h3 className="filter-header">Filters</h3>

      <div className="filter-group">
        <label className="filter-label">Major</label>
        <select className="form-select">
          <option>All Majors</option>
          <option>Computer Science</option>
          <option>Journalism</option>
          <option>Economics</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Year</label>
        <select className="form-select">
          <option>All Years</option>
          <option>2026</option>
          <option>2027</option>
          <option>2028</option>
          <option>2029</option>
        </select>
      </div>
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
