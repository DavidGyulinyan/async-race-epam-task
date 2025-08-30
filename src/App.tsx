import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header/Header';
import Garage from './pages/Garage/Garage';
import Winners from './pages/Winners/Winners';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <main className="App__main">
            <Routes>
              <Route path="/" element={<Navigate to="/garage" replace />} />
              <Route path="/garage" element={<Garage />} />
              <Route path="/winners" element={<Winners />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
