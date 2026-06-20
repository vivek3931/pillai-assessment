import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import Analytics from './components/Analytics';
import logo from '../public/pillaiuniversity_logo.jpeg'
import Footer from './components/Footer';
import { BarChart2, UserPlus } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-canvas">
        {/* Navigation - simple Ollama style */}
        <nav className="h-14 flex items-center justify-between px-6 border-b border-hairline sticky top-0 bg-canvas z-10">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-body-sm-strong text-ink no-underline flex items-center gap-2">
              <img src={logo} alt="Logo" style={{ width: '50px', height: '50px' }} />
              
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/analytics" className="text-body-sm-strong text-body hover:text-ink no-underline transition-colors flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4" />
              Analytics
            </Link>
            <Link to="/add" className="btn-primary no-underline flex items-center gap-1.5">
              <UserPlus className="w-4 h-4" />
              Add Student
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto py-8 sm:py-[88px] px-4 sm:px-6">
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/add" element={<StudentForm />} />
            <Route path="/edit/:id" element={<StudentForm />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
