import React from 'react';
import './index.css';
import Dashboard from './Dashboard';

function App() {
  const handleBack = () => {
    console.log('Back button clicked');
    // Add your navigation logic here
  };

  return (
    <div className="App">
      <Dashboard onBack={handleBack} />
    </div>
  );
}

export default App;