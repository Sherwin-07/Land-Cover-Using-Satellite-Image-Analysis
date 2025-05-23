import React from 'react';
import { Link } from 'react-router-dom';
import background from '../assets/background.jpg';

const Results = ({ analysis, imageUrl }) => {
  if (!analysis) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          No analysis data available. Please upload and analyze an image first.
        </div>
        <Link to="/analyze" className="btn btn-primary mt-3">
          Go to Analysis Page
        </Link>
      </div>
    );
  }

  // Utility functions moved from original code
  const getFertilityColor = (level) => {
    const colors = {
      High: 'bg-success text-white',
      Medium: 'bg-warning text-dark',
      Low: 'bg-danger text-white'
    };
    return colors[level] || 'bg-secondary';
  };
  
  const getLandUseIcon = (landUseClass) => {
    const icons = {
      'AnnualCrop': 'bi-flower1',
      'Forest': 'bi-tree',
      'HerbaceousVegetation': 'bi-flower3',
      'Highway': 'bi-signpost-split',
      'Industrial': 'bi-building',
      'Pasture': 'bi-globe',
      'PermanentCrop': 'bi-flower2',
      'Residential': 'bi-house',
      'River': 'bi-water',
      'SeaLake': 'bi-tsunami'
    };
    return icons[landUseClass] || 'bi-question-circle';
  };

  const getLandUseColor = (landUseClass) => {
    const colors = {
      'AnnualCrop': 'bg-success',
      'Forest': 'bg-success',
      'HerbaceousVegetation': 'bg-success',
      'Highway': 'bg-secondary',
      'Industrial': 'bg-danger',
      'Pasture': 'bg-info',
      'PermanentCrop': 'bg-success',
      'Residential': 'bg-warning',
      'River': 'bg-primary',
      'SeaLake': 'bg-primary'
    };
    return colors[landUseClass] || 'bg-secondary';
  };
  
  const hasValidSection = (analysis, section) => {
    if (!analysis) return false;
    
    switch(section) {
      case 'location':
        return Boolean(analysis.llm_analysis);
      case 'regions':
        return Boolean(analysis.llm_analysis?.result?.regions) && 
               Object.keys(analysis.llm_analysis.result.regions).length > 0;
      case 'overall_fertility':
        return Boolean(analysis.llm_analysis?.result?.overall_fertility);
      case 'suggestions':
        return Boolean(analysis.llm_analysis?.result?.suggestions);
      default:
        return false;
    }
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: "100vh"
      }}
    >
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 mb-3">
            <i className="bi bi-clipboard-data text-success me-3"></i>
            <span className="text-success">Terra</span>Health Analysis Results
          </h1>
          <p className="lead text-muted mb-5">
            Comprehensive soil fertility insights for your land
          </p>
          
          {/* Image preview */}
          {imageUrl && (
            <div className="mb-5">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-header bg-dark text-white p-3">
                      <h5 className="mb-0">Analyzed Image</h5>
                    </div>
                    <div className="card-body p-0">
                      <img
                        src={imageUrl}
                        alt="Analyzed Land"
                        className="img-fluid w-100"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Dashboard */}
        <div className="row g-4">
          {/* Main Summary Card */}
          {hasValidSection(analysis, 'location') && (
            <div className="col-12">
              <div className="card border-0 shadow-lg rounded-4 mb-4">
                <div className="card-header bg-success text-white p-4 rounded-top-4">
                  <h4 className="mb-0">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    Location and Overview
                  </h4>
                </div>
                <div className="card-body p-4">
                  <div className="alert alert-success rounded-3 d-flex align-items-center border-0 shadow-sm">
                    <i className="bi bi-pin-map-fill fs-4 me-3"></i>
                    <span className="fw-bold">{analysis.llm_analysis?.location || 'Location not available'}</span>
                  </div>
                  <p className="lead">
                    <i className="bi bi-info-circle me-2 text-success"></i>
                    {analysis.llm_analysis?.analysis || 'Analysis not available'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Land Use Classification */}
          {analysis.dl_analysis && !analysis.dl_analysis.error && (
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-header bg-dark text-white p-3 rounded-top-4">
                  <h5 className="mb-0">
                    <i className="bi bi-layers me-2"></i>
                    Land Use Classification
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-lg-5 text-center mb-4 mb-lg-0">
                      <div className="card border-0 shadow-sm rounded-3 p-3 h-100">
                        <h6 className="text-muted mb-3">Primary Land Use</h6>
                        <div className={`rounded-circle ${getLandUseColor(analysis.dl_analysis.land_use_class)} d-inline-flex align-items-center justify-content-center mb-3 mx-auto`} style={{width: '100px', height: '100px'}}>
                          <i className={`bi ${getLandUseIcon(analysis.dl_analysis.land_use_class)} text-white`} style={{fontSize: '48px'}}></i>
                        </div>
                        <h3 className="mb-1">{analysis.dl_analysis.land_use_class}</h3>
                        <span className="badge bg-info px-3 py-2 d-inline-block mx-auto mb-2">
                          {(analysis.dl_analysis.confidence * 100).toFixed(1)}% Confidence
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-lg-7">
                      <h5 className="mb-3">
                        <i className="bi bi-bar-chart-steps me-2 text-primary"></i>
                        Classification Breakdown
                      </h5>
                      {analysis.dl_analysis.top_classes && analysis.dl_analysis.top_classes.map((cls, index) => (
                        <div key={index} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span>
                              <i className={`bi ${getLandUseIcon(cls.class)} me-2`}></i>
                              {cls.class}
                            </span>
                            <span className="badge bg-primary">{(cls.confidence * 100).toFixed(1)}%</span>
                          </div>
                          <div className="progress rounded-pill" style={{height: '10px'}}>
                            <div
                              className={`progress-bar ${getLandUseColor(cls.class)}`}
                              role="progressbar"
                              style={{ width: `${cls.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      
                      <div className="alert alert-light border mt-4 rounded-3">
                        <h6 className="mb-2">
                          <i className="bi bi-lightbulb me-2 text-warning"></i>
                          Land Use Impact
                        </h6>
                        <p className="mb-0 small">
                          {analysis.dl_analysis.land_use_class === 'AnnualCrop' && "Annual crop areas typically have managed soil fertility with regular fertilization cycles. The soil condition depends on farming practices."}
                          {analysis.dl_analysis.land_use_class === 'Forest' && "Forest areas generally have good organic matter content but may have acidic soil. Natural decomposition helps maintain fertility."}
                          {analysis.dl_analysis.land_use_class === 'HerbaceousVegetation' && "Areas with herbaceous vegetation often have moderate fertility levels. These areas benefit from natural nutrient cycling."}
                          {analysis.dl_analysis.land_use_class === 'Highway' && "Highway and paved areas have severely compromised soil fertility due to compaction and lack of water infiltration."}
                          {analysis.dl_analysis.land_use_class === 'Industrial' && "Industrial areas typically have poor soil fertility due to contamination, compaction, and lack of organic matter."}
                          {analysis.dl_analysis.land_use_class === 'Pasture' && "Pasture lands generally maintain good fertility through grazing management and minimal tillage."}
                          {analysis.dl_analysis.land_use_class === 'PermanentCrop' && "Permanent crop areas often have managed fertility with focused fertilization programs specific to the crop type."}
                          {analysis.dl_analysis.land_use_class === 'Residential' && "Residential areas have variable fertility, generally compromised by development but may have improved areas in gardens."}
                          {analysis.dl_analysis.land_use_class === 'River' && "River areas deposit nutrients during flooding events, creating naturally fertile soils in floodplains."}
                          {analysis.dl_analysis.land_use_class === 'SeaLake' && "Sea and lake areas have no soil fertility relevance on the water surface, but may impact surrounding soils."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ML Analysis Visualization */}
          {analysis.ml_analysis && (
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-header bg-primary text-white p-3 rounded-top-4">
                  <h5 className="mb-0">
                    <i className="bi bi-graph-up me-2"></i>
                    ML-Based Fertility Map
                  </h5>
                </div>
                <div className="card-body p-4">
                  {analysis.ml_analysis && (
                    <div>
                      <div className="alert alert-primary border-0 shadow-sm rounded-3 mb-4">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-info-circle fs-4 me-3"></i>
                          <div>
                            <h6 className="mb-1">Confidence Score</h6>
                            <div className="progress rounded-pill" style={{ height: '8px', width: '100%' }}>
                              <div 
                                className="progress-bar bg-primary" 
                                role="progressbar" 
                                style={{ width: `${(analysis.combined_metrics?.fertility_confidence * 100 || 0)}%` }}
                              ></div>
                            </div>
                            <span className="small">{(analysis.combined_metrics?.fertility_confidence * 100 || 0).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        {/* Display ML fertility map as a heatmap */}
                        <div 
                          className="fertility-map-container shadow-sm rounded-4 overflow-hidden"
                          style={{ 
                            position: 'relative',
                            width: '100%',
                            maxWidth: '600px',
                            margin: '0 auto'
                          }}
                        >
                          <canvas
                            ref={(canvas) => {
                              if (canvas && analysis.ml_analysis?.fertility_map) {
                                try {
                                  const ctx = canvas.getContext('2d');
                                  if (!ctx) return;
                                  
                                  const map = analysis.ml_analysis.fertility_map;
                                  const width = map[0]?.length || 0;
                                  const height = map.length || 0;
                                  
                                  if (width === 0 || height === 0) return;
                                  
                                  canvas.width = width;
                                  canvas.height = height;
                                  
                                  const imageData = ctx.createImageData(width, height);
                                  
                                  for (let y = 0; y < height; y++) {
                                    for (let x = 0; x < width; x++) {
                                      const value = map[y][x];
                                      const idx = (y * width + x) * 4;
                                      
                                      // Create a heatmap color based on fertility value
                                      const color = value === 2 ? [0, 255, 0] : // High - Green
                                                  value === 1 ? [255, 255, 0] : // Medium - Yellow
                                                  [255, 0, 0]; // Low - Red
                                      
                                      imageData.data[idx] = color[0];     // R
                                      imageData.data[idx + 1] = color[1]; // G
                                      imageData.data[idx + 2] = color[2]; // B
                                      imageData.data[idx + 3] = 255;      // A
                                    }
                                  }
                                  
                                  ctx.putImageData(imageData, 0, 0);
                                } catch (error) {
                                  console.error('Error rendering fertility map:', error);
                                }
                              }
                            }}
                            style={{
                              width: '100%',
                              height: 'auto'
                            }}
                          />
                        </div>
                        
                        <div className="mt-4">
                          <div className="d-flex justify-content-center gap-4">
                            <span className="badge bg-success px-3 py-2 d-flex align-items-center">
                              <i className="bi bi-circle-fill me-2"></i>
                              High Fertility
                            </span>
                            <span className="badge bg-warning px-3 py-2 d-flex align-items-center">
                              <i className="bi bi-circle-fill me-2"></i>
                              Medium Fertility
                            </span>
                            <span className="badge bg-danger px-3 py-2 d-flex align-items-center">
                              <i className="bi bi-circle-fill me-2"></i>
                              Low Fertility
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Regional Analysis */}
          {hasValidSection(analysis, 'regions') && (
            <div className="col-12 mb-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-success text-white p-3 rounded-top-4">
                  <h5 className="mb-0">
                    <i className="bi bi-grid-3x3 me-2"></i>
                    Regional Analysis
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    {Object.entries(analysis.llm_analysis.result.regions).map(([region, data]) => (
                      <div key={region} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100 border-0 shadow-sm rounded-3">
                          <div className={`card-header ${getFertilityColor(data.fertility)} py-3`}>
                            <h6 className="mb-0 text-capitalize d-flex align-items-center">
                              <i className="bi bi-geo me-2"></i>
                              {region} Region
                              <span className="ms-auto">
                                <i className="bi bi-star-fill"></i>
                                <i className={`bi ${data.fertility === 'High' ? 'bi-star-fill' : 'bi-star'}`}></i>
                                <i className={`bi ${data.fertility === 'High' ? 'bi-star-fill' : data.fertility === 'Medium' ? 'bi-star' : 'bi-star'}`}></i>
                              </span>
                            </h6>
                          </div>
                          <div className="card-body">
                            <span className={`badge ${getFertilityColor(data.fertility)} mb-3 px-3 py-2`}>
                              <i className="bi bi-star-fill me-2"></i>
                              Fertility: {data.fertility}
                            </span>
                            <h6 className="mt-3 text-muted">
                              <i className="bi bi-list-check me-2"></i>
                              Assessment Factors:
                            </h6>
                            <ul className="list-group list-group-flush">
                              {data.reasons && data.reasons.map((reason, idx) => (
                                <li key={idx} className="list-group-item border-0 py-2 px-0 d-flex">
                                  <i className="bi bi-check-circle-fill text-success me-2 mt-1 flex-shrink-0"></i>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overall Fertility & Suggestions */}
          <div className="col-12 mb-4">
            <div className="row g-4">
              {/* Overall Fertility */}
              {hasValidSection(analysis, 'overall_fertility') && (
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-header bg-warning text-dark p-3 rounded-top-4">
                      <h5 className="mb-0">
                        <i className="bi bi-graph-up me-2"></i>
                        Overall Fertility
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      {analysis.llm_analysis.result.overall_fertility && (
                        <div className="text-center mb-4">
                          <div className={`rounded-circle ${getFertilityColor(analysis.llm_analysis.result.overall_fertility)} d-inline-flex align-items-center justify-content-center mb-3`} style={{width: '120px', height: '120px'}}>
                            <div>
                              <i className="bi bi-star-fill d-block" style={{fontSize: '32px'}}></i>
                              <h3 className="mb-0 mt-1">{analysis.llm_analysis.result.overall_fertility}</h3>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {analysis.llm_analysis.result.probabilities && (
                        <>
                          <h6 className="mb-3">
                            <i className="bi bi-bar-chart-fill me-2 text-primary"></i>
                            Probability Distribution
                          </h6>
                          {Object.entries(analysis.llm_analysis.result.probabilities).map(([level, prob]) => (
                            <div key={level} className="mb-3">
                              <div className="d-flex justify-content-between mb-1">
                                <span className="text-capitalize">
                                  <i className={`bi bi-circle-fill me-2 ${level === 'high' ? 'text-success' : level === 'medium' ? 'text-warning' : 'text-danger'}`}></i>
                                  {level}
                                </span>
                                <span className="badge bg-primary">{(prob * 100).toFixed(0)}%</span>
                              </div>
                              <div className="progress rounded-pill" style={{height: '10px'}}>
                                <div
                                  className={`progress-bar ${level === 'high' ? 'bg-success' : level === 'medium' ? 'bg-warning' : 'bg-danger'}`}
                                  role="progressbar"
                                  style={{ width: `${prob * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {hasValidSection(analysis, 'suggestions') && (
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-header bg-primary text-white p-3 rounded-top-4">
                      <h5 className="mb-0">
                        <i className="bi bi-lightbulb me-2"></i>
                        Recommendations
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="mb-4">
                        <h6 className="mb-3">
                          <i className="bi bi-flower1 me-2 text-success"></i>
                          Recommended Crops
                        </h6>
                        <div>
                          {analysis.llm_analysis.result.suggestions.best_crops.map(crop => (
                            <span
                              key={crop}
                              className="badge bg-success me-2 mb-2 px-3 py-2"
                            >
                              <i className="bi bi-tree me-2"></i>
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="mb-3">
                          <i className="bi bi-distribute-vertical me-2 text-primary"></i>
                          Mixed Crop Farming
                        </h6>
                        <div className="alert alert-primary border-0 rounded-3">
                          <i className="bi bi-check-circle me-2"></i>
                          {analysis.llm_analysis.result.suggestions.mixed_crop_farming}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="col-12 text-center mt-3">
            <Link to="/analyze" className="btn btn-outline-primary me-3 px-4 py-2 rounded-pill">
              <i className="bi bi-arrow-left me-2"></i>
              Analyze Another Image
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;