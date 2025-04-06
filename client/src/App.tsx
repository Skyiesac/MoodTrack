import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import JournalEntries from './pages/journalEntries';
import NewJournal from './pages/newJournal';
import './styles/App.css';

const App: React.FC = () => (
  <Router>
    <div id="root">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h2>Journal Dashboard</h2>
        <Link to="/entries">Entries</Link>
        <Link to="/new">New Journal</Link>
        <footer>&copy; 2025 Journal App</footer>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <Routes>
          <Route path="/entries" element={<JournalEntries />} />
          <Route path="/new" element={<NewJournal />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default App;
