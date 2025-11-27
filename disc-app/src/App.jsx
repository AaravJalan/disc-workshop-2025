import React, { useState, useEffect } from 'react';
import './App.css';

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
        <li className="nav-link">Browse</li>
        <li className="nav-link">My Profile</li>
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

       <div className="filter-group">
        <label className="filter-label">Dorm</label>
        <select className="form-select">
          <option>All Dorms</option>
          <option>North</option>
          <option>South</option>
        </select>
      </div>
    </div>
  </div>
);

const ProfileCard = ({ profile, isConnected, onConnect }) => (
  <div className="card">
    <div className="card-img-placeholder">
      IMG
    </div>
    <div className="card-body">
      <h3 className="card-title">{profile.name}</h3>
      <div className="card-subtitle">{profile.major} • {profile.year}</div>
      <p className="card-text">{profile.bio}</p>
      <button
        className={isConnected ? "btn btn-outline" : "btn btn-primary"}
        onClick={() => onConnect(profile.id)}
      >
        {isConnected ? "Request Sent" : "Connect"}
      </button>
    </div>
  </div>
);

function App() {
  const [connectedIds, setConnectedIds] = useState([]);

  useEffect(() => {
    console.log("Current Connection Requests:", connectedIds);
  }, [connectedIds]);

  const handleConnect = (id) => {
    if (connectedIds.includes(id)) {
      setConnectedIds(connectedIds.filter(existingId => existingId !== id));
    } else {
      setConnectedIds([...connectedIds, id]);
    }
  };

  return (
    <div>
      <NavBar />
      <main className="container main-container">
        <div className="row">

          <FilterSidebar />

          <div className="col-content">
            <div className="content-header">
              <h1 className="page-title">Discover Students</h1>
              <span className="results-count">Showing {INITIAL_PROFILES.length} results</span>
            </div>

            <div className="profile-grid">
              {INITIAL_PROFILES.map((student) => (
                <ProfileCard
                  key={student.id}
                  profile={student}
                  isConnected={connectedIds.includes(student.id)}
                  onConnect={handleConnect}
                />
              ))}
            </div>
          </div>

        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Wildcat Connect</p>
      </footer>
    </div>
  );
}

export default App;
