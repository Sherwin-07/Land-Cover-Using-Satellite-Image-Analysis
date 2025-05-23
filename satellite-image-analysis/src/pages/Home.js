import React from 'react';
import { Link } from 'react-router-dom';
import background from '../assets/background.jpg';
import cropAnalysisImg from '../assets/crop-analysis.jpeg';
import soilMapImg from '../assets/soil-map.jpg';
import farmerImg from '../assets/farmer.jpg';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div 
        className="position-relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '600px',
          color: 'white'
        }}
      >
        <div className="container h-100 d-flex flex-column justify-content-center">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-4">
                <span className="text-success">Terra</span>Health
              </h1>
              <h2 className="display-6 mb-4">Intelligent Soil Fertility Analysis</h2>
              <p className="lead mb-5">
                Unlock the potential of your land with our advanced AI-powered soil analysis. 
                Upload satellite imagery and get detailed fertility insights within seconds.
              </p>
              <Link to="/analyze" className="btn btn-success btn-lg px-5 py-3 rounded-pill">
                <i className="bi bi-camera me-2"></i>
                Analyze Your Land Now
              </Link>
            </div>
          </div>
        </div>
        <div 
          className="position-absolute bottom-0 w-100 text-center text-white py-4"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-3 mb-md-0">
                <i className="bi bi-graph-up text-success display-5"></i>
                <h5 className="mt-2">AI-Powered Analysis</h5>
              </div>
              <div className="col-md-4 mb-3 mb-md-0">
                <i className="bi bi-geo-alt text-success display-5"></i>
                <h5 className="mt-2">Regional Insights</h5>
              </div>
              <div className="col-md-4">
                <i className="bi bi-flower3 text-success display-5"></i>
                <h5 className="mt-2">Crop Recommendations</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-light py-5">
        <div className="container py-4">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src={cropAnalysisImg} 
                className="img-fluid rounded-4 shadow" 
                alt="Crop Analysis" 
                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="col-lg-6">
              <h2 className="display-6 mb-4">Land Classification Analysis</h2>
              <p className="lead text-muted mb-4">
                Our advanced deep learning models classify your land into precise categories,
                identifying everything from annual crops to forests and residential areas.
              </p>
              <div className="d-flex mb-3">
                <div className="me-3 text-success">
                  <i className="bi bi-check-circle-fill fs-4"></i>
                </div>
                <div>
                  <h5>10+ Land Classification Categories</h5>
                  <p className="text-muted">From agricultural land to industrial zones, we identify it all</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="me-3 text-success">
                  <i className="bi bi-check-circle-fill fs-4"></i>
                </div>
                <div>
                  <h5>High-Precision Confidence Scores</h5>
                  <p className="text-muted">Know exactly how certain our algorithm is about its assessment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row align-items-center mb-5 flex-lg-row-reverse">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src={soilMapImg} 
                className="img-fluid rounded-4 shadow" 
                alt="Soil Map" 
                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="col-lg-6">
              <h2 className="display-6 mb-4">Machine Learning Fertility Maps</h2>
              <p className="lead text-muted mb-4">
                Our proprietary algorithms generate detailed soil fertility heatmaps,
                giving you a visual representation of your land's productive potential.
              </p>
              <div className="d-flex mb-3">
                <div className="me-3 text-success">
                  <i className="bi bi-check-circle-fill fs-4"></i>
                </div>
                <div>
                  <h5>Precise Regional Analysis</h5>
                  <p className="text-muted">Identify specific areas of high, medium, and low fertility</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="me-3 text-success">
                  <i className="bi bi-check-circle-fill fs-4"></i>
                </div>
                <div>
                  <h5>ML-Powered Insights</h5>
                  <p className="text-muted">Leveraging cutting-edge machine learning for accurate predictions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src={farmerImg} 
                className="img-fluid rounded-4 shadow" 
                alt="Farmer" 
                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="col-lg-6">
              <h2 className="display-6 mb-4">Actionable Recommendations</h2>
              <p className="lead text-muted mb-4">
                Don't just analyze - take action. Get specific crop recommendations
                and farming strategies tailored to your unique soil conditions.
              </p>
              <div className="d-flex mb-3">
                <div className="me-3 text-success">
                  <i className="bi bi-check-circle-fill fs-4"></i>
                </div>
                <div>
                  <h5>Crop Recommendations</h5>
                  <p className="text-muted">Discover which crops will thrive in your specific soil conditions</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="me-3 text-success">
                  <i className="bi bi-check-circle-fill fs-4"></i>
                </div>
                <div>
                  <h5>Mixed Farming Strategies</h5>
                  <p className="text-muted">Get insights on optimal crop combinations for sustainable farming</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-success text-white py-5">
        <div className="container py-4 text-center">
          <h2 className="display-5 mb-4">Ready to Analyze Your Land?</h2>
          <p className="lead mb-5">
            Upload your satellite imagery now and get comprehensive soil fertility insights
          </p>
          <Link to="/analyze" className="btn btn-light btn-lg px-5 py-3 rounded-pill">
            <i className="bi bi-camera me-2"></i>
            Start Analysis
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;