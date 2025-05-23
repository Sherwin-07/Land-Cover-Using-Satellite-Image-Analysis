import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg ${scrolled ? 'navbar-light bg-white shadow-sm' : location.pathname === '/' ? 'navbar-dark bg-transparent' : 'navbar-light bg-white shadow-sm'} fixed-top transition-all`}
         style={{ transition: 'all 0.3s ease' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <i className="bi bi-globe-americas text-success me-2"></i>
          <span className="text-success">Terra</span>Health
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link px-3 ${location.pathname === '/' ? 'active' : ''}`} to="/">
                <i className="bi bi-house me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${location.pathname === '/analyze' ? 'active' : ''}`} to="/analyze">
                <i className="bi bi-search me-1"></i> Analyze
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3" href="#features">
                <i className="bi bi-grid me-1"></i> Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3" href="#about">
                <i className="bi bi-info-circle me-1"></i> About
              </a>
            </li>
          </ul>
          <Link to="/analyze" className={`btn btn-success rounded-pill ms-3 px-4 ${location.pathname === '/' && !scrolled ? 'btn-outline-light border-2' : ''}`}>
            <i className="bi bi-camera me-2"></i>
            Upload Image
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;