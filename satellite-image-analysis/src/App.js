import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AnalyzeImage from './pages/AnalyzeImage';
import Results from './pages/Results';

const App = () => {
  const [analysisData, setAnalysisData] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/analyze" 
              element={
                <AnalyzeImage 
                  setAnalysisData={setAnalysisData} 
                  setImageUrl={setImageUrl}
                  imageUrl={imageUrl}
                />
              } 
            />
            <Route 
              path="/results" 
              element={
                <Results 
                  analysis={analysisData} 
                  imageUrl={imageUrl}
                />
              } 
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;