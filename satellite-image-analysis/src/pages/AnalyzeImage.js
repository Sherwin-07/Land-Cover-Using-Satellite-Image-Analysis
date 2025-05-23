import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/background.jpg';

const AnalyzeImage = ({ setAnalysisData, setImageUrl, imageUrl }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file has a valid extension
      const validExtensions = ['tiff', 'jpg', 'jpeg', 'png'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        setError('Please upload a valid image file (TIFF, JPG, JPEG, PNG)');
        return;
      }
      
      // Create a new File object with the original name preserved
      const renamedFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      
      setImage(renamedFile);
      setImageUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze_image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.status === "Success") {
        setAnalysisData(data.response);
        navigate('/results');
      } else {
        throw new Error(data.response || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: "90vh",
        padding: '60px 0'
      }}
    >
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="display-4 mb-3">
            <i className="bi bi-upload text-success me-3"></i>
            Upload Your Land Image
          </h2>
          <p className="lead text-muted">
            Upload a satellite or aerial image of your land for comprehensive soil fertility analysis
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Upload Card */}
            <div className="card mb-4 border-0 shadow-lg rounded-4">
              <div className="card-header bg-success text-white p-4 rounded-top-4">
                <h4 className="mb-0">
                  <i className="bi bi-cloud-upload me-2"></i>
                  Image Upload
                </h4>
              </div>
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <div 
                      className="upload-container p-5 border-2 border-dashed rounded-4 text-center bg-light position-relative" 
                      style={{borderStyle: 'dashed', borderColor: '#198754'}}
                    >
                      <i className="bi bi-file-earmark-image text-success display-3 mb-3"></i>
                      <input
                        type="file"
                        className="form-control form-control-lg"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="imageInput"
                        style={{opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer'}}
                      />
                      <h5 className="mb-2">Drag and drop your image here</h5>
                      <p className="text-muted mb-0">or click to browse</p>
                      <small className="d-block mt-2 text-muted">Supported formats: PNG, JPG, JPEG, TIFF</small>
                    </div>
                  </div>
                  
                  {imageUrl && (
                    <div className="mb-4 text-center">
                      <div className="position-relative d-inline-block">
                        <img
                          src={imageUrl}
                          alt="Selected"
                          className="img-fluid rounded-4 shadow-sm"
                          style={{maxHeight: '400px'}}
                        />
                        <div className="position-absolute top-0 end-0 m-2">
                          <button 
                            type="button" 
                            className="btn btn-light btn-sm rounded-circle shadow"
                            onClick={() => {
                              setImage(null);
                              setImageUrl(null);
                            }}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={!image || loading}
                    className="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-pill shadow-sm"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="ms-2">Analyzing Your Land...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search"></i>
                        <span className="ms-2">Analyze Image</span>
                      </>
                    )}
                  </button>
                </form>

                {error && (
                  <div className="alert alert-danger mt-4 d-flex align-items-center rounded-3">
                    <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                    <div className="flex-grow-1">{error}</div>
                    <button 
                      type="button" 
                      className="btn-close"
                      onClick={() => setError(null)}
                    ></button>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions Card */}
            <div className="card border-0 shadow rounded-4">
              <div className="card-header bg-primary text-white p-3 rounded-top-4">
                <h5 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Tips for Best Results
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex mb-3">
                      <div className="me-3 text-primary">
                        <i className="bi bi-check-circle-fill fs-4"></i>
                      </div>
                      <div>
                        <h6>Use High-Resolution Images</h6>
                        <p className="text-muted small">Higher resolution provides more detailed analysis</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex mb-3">
                      <div className="me-3 text-primary">
                        <i className="bi bi-check-circle-fill fs-4"></i>
                      </div>
                      <div>
                        <h6>Clear Overhead Views</h6>
                        <p className="text-muted small">Satellite or drone imagery works best</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex mb-3 mb-md-0">
                      <div className="me-3 text-primary">
                        <i className="bi bi-check-circle-fill fs-4"></i>
                      </div>
                      <div>
                        <h6>Minimal Cloud Cover</h6>
                        <p className="text-muted small">Clouds can interfere with accurate analysis</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex">
                      <div className="me-3 text-primary">
                        <i className="bi bi-check-circle-fill fs-4"></i>
                      </div>
                      <div>
                        <h6>Recent Imagery</h6>
                        <p className="text-muted small">Recent images provide more accurate current conditions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeImage;