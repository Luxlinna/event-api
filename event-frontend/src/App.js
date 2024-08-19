import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MainContent from './components/MainContent';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <MainContent />
      <Footer />
    </div>
  );
}

export default App;
