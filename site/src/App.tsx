import { Route, Routes } from 'react-router-dom';
import { OperationProvider } from './context/OperationContext';
import { MainLayout } from './components/layout/MainLayout';
import { AstronomyResearchPage } from './pages/AstronomyResearchPage';
import { HomePage } from './pages/HomePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

function App() {
  return (
    <OperationProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/astronomy-colleges" element={<AstronomyResearchPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>
      </Routes>
    </OperationProvider>
  );
}

export default App;
