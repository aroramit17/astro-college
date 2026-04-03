import { Route, Routes } from 'react-router-dom';
import { OperationProvider } from './context/OperationContext';
import { MainLayout } from './components/layout/MainLayout';
import { AstronomyResearchPage } from './pages/AstronomyResearchPage';

function App() {
  return (
    <OperationProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<AstronomyResearchPage />} />
          <Route path="/astronomy-colleges" element={<AstronomyResearchPage />} />
        </Route>
      </Routes>
    </OperationProvider>
  );
}

export default App;
