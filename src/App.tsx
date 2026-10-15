import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppSidebar } from './components/AppSidebar';
import { AppHeader } from './components/AppHeader';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { InsightsPage } from './pages/InsightsPage';
import { ExplainabilityPage } from './pages/ExplainabilityPage';
import { ModelsPage } from './pages/ModelsPage';
import { SettingsPage } from './pages/SettingsPage';

// Layout wrapper for dashboard routes
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Map route to title and subtitle
  const pageMeta: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': {
      title: 'Research Dashboard',
      subtitle: 'Pathological Myopia Deep Learning Workspace',
    },
    '/analyze': {
      title: 'Retinal Image Analysis',
      subtitle: 'Multi-Task Inference & Preprocessing Pipeline',
    },
    '/history': {
      title: 'Analysis History',
      subtitle: 'Workspace Cohort Records & Evaluation Log',
    },
    '/insights': {
      title: 'Research Insights',
      subtitle: 'Model Architecture Benchmarks & Training Evaluation',
    },
    '/explainability': {
      title: 'Explainability Explorer',
      subtitle: 'Latent Attribution & Grad-CAM Visualizations',
    },
    '/models': {
      title: 'Models & Methodology',
      subtitle: 'RETFound Multi-Task Architecture & Dataset Availability',
    },
    '/settings': {
      title: 'Workspace Settings',
      subtitle: 'Inference Backend Configuration & System Preferences',
    },
  };

  const currentMeta = pageMeta[location.pathname] || {
    title: 'Research Workspace',
    subtitle: 'Quantitative Retinal Phenotyping',
  };

  return (
    <div className="min-h-screen bg-[#F5F3ED] text-[#171A19] flex flex-col font-sans">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area shifted on large screens to accommodate fixed sidebar */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AppHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
        />
        <main className="flex-1 pb-12">{children}</main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Workspace Routes inside DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/analyze"
          element={
            <DashboardLayout>
              <AnalyzePage />
            </DashboardLayout>
          }
        />
        <Route
          path="/results/:id"
          element={
            <DashboardLayout>
              <ResultsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/history"
          element={
            <DashboardLayout>
              <HistoryPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/insights"
          element={
            <DashboardLayout>
              <InsightsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/explainability"
          element={
            <DashboardLayout>
              <ExplainabilityPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/models"
          element={
            <DashboardLayout>
              <ModelsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
