import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import NewSessionSetup from './pages/NewSessionSetup';
import EvaluationSession from './pages/EvaluationSession';
import ReportPreview from './pages/ReportPreview';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Flows */}
          <Route path="/session/new" element={<NewSessionSetup />} />
          <Route path="/session/new/:templateId" element={<NewSessionSetup />} /> {/* Handle direct link redirect */}
          <Route path="/session/run/:templateId" element={<EvaluationSession />} />
          
          <Route path="/report/:id" element={<ReportPreview />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;