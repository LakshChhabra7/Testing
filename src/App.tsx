import React, { useState } from 'react';
import { ShelterProvider, useShelter } from './context/ShelterContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { JudgeModeGuide } from './components/judge/JudgeModeGuide';
import { BrandedLoadingScreen } from './components/loading/BrandedLoadingScreen';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DatasetExplorerPage } from './pages/DatasetExplorerPage';
import { DesignStudioPage } from './pages/DesignStudioPage';
import { ClimateHubPage } from './pages/ClimateHubPage';
import { MaterialsLabPage } from './pages/MaterialsLabPage';
import { SimulationPage } from './pages/SimulationPage';
import { OptimizationPage } from './pages/OptimizationPage';
import { Viewer3DPage } from './pages/Viewer3DPage';
import { ComparePage } from './pages/ComparePage';
import { MultiClimatePage } from './pages/MultiClimatePage';
import { ReportsPage } from './pages/ReportsPage';
import { AnsysAdapterPage } from './pages/AnsysAdapterPage';

const AppContent: React.FC = () => {
  const { activeTab } = useShelter();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <LandingPage />;
      case 'dataset':
        return <DatasetExplorerPage />;
      case 'studio':
        return <DesignStudioPage />;
      case 'climate':
        return <ClimateHubPage />;
      case 'materials':
        return <MaterialsLabPage />;
      case 'simulation':
        return <SimulationPage />;
      case 'optimization':
        return <OptimizationPage />;
      case 'viewer3d':
        return <Viewer3DPage />;
      case 'compare':
        return <ComparePage />;
      case 'multiclimate':
        return <MultiClimatePage />;
      case 'reports':
        return <ReportsPage />;
      case 'ansys':
        return <AnsysAdapterPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 w-full overflow-hidden">
        <div key={activeTab} className="animate-page-enter w-full">
          {renderActiveTab()}
        </div>
      </main>
      <Footer />
      <JudgeModeGuide />
    </div>
  );
};

export default function App() {
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  return (
    <ShelterProvider>
      {!hasLoaded ? (
        <BrandedLoadingScreen onComplete={() => setHasLoaded(true)} />
      ) : (
        <AppContent />
      )}
    </ShelterProvider>
  );
}
