import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <Link className="text-decoration-none" to="/">
              <h3 className="text-white mb-3">
                <i className="bi bi-globe-americas text-success me-2"></i>
                <span className="text-success">Terra</span>Health
              </h3>
            </Link>
            <p className="text-light mb-4">
              Advanced soil analysis using AI and machine learning. Get comprehensive insights on soil fertility to maximize your land's potential.
            </p>
            <div className="d-flex gap-3 mb-4">
              <a href="#" className="text-white fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white fs-5">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="text-white fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white fs-5">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Navigation</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">
                  <i className="bi bi-chevron-right me-2 small text-success"></i>Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/analyze" className="text-light text-decoration-none">
                  <i className="bi bi-chevron-right me-2 small text-success"></i>Analyze Image
                </Link>
              </li>
              <li className="mb-2">
                <a href="#features" className="text-light text-decoration-none">
                  <i className="bi bi-chevron-right me-2 small text-success"></i>Features
                </a>
              </li>
              <li className="mb-2">
                <a href="#about" className="text-light text-decoration-none">
                  <i className="bi bi-chevron-right me-2 small text-success"></i>About Us
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-4 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Resources</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  <i className="bi bi-chevron-right me-2 small text-success"></i>Blog
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  <i className="bi bi-chevron-right me-2 small text-success"></i>Documentation
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  <i className="bi bi-chevron-right me-2 small text-success"></i>API Access
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  <i className="bi bi-chevron-right me-2 small text-success"></i>Case Studies
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <h5 className="text-uppercase mb-4">Contact</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <i className="bi bi-geo-alt-fill me-2 text-success"></i>
                123 Agriculture Way, San Francisco, CA 94107
              </li>
              <li className="mb-3">
                <i className="bi bi-envelope-fill me-2 text-success"></i>
                contact@terrahealth.ai
              </li>
              <li className="mb-3">
                <i className="bi bi-telephone-fill me-2 text-success"></i>
                +1 (800) 123-4567
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-7 mb-3 mb-md-0">
            <p className="mb-0 text-light">
              © 2025 TerraHealth. All rights reserved.
            </p>
          </div>
          <div className="col-md-5">
            <ul className="list-inline text-md-end mb-0">
              <li className="list-inline-item me-3">
                <a href="#" className="text-light text-decoration-none small">Privacy Policy</a>
              </li>
              <li className="list-inline-item me-3">
                <a href="#" className="text-light text-decoration-none small">Terms of Service</a>
              </li>
              <li className="list-inline-item">
                <a href="#" className="text-light text-decoration-none small">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;