import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { EedooTransitionProvider } from './components/transitions/EedooTransition';
import { EyadTransitionProvider } from './components/transitions/EyadTransition';
import HomePage from './pages/HomePage';
import EedooPage from './pages/EedooPage';
import EyadPage from './pages/EyadPage';

export let isInitialAppLoad = true;

const App = () => {
  useEffect(() => {
    isInitialAppLoad = false;
  }, []);
  return (
    <EyadTransitionProvider>
      <EedooTransitionProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/eedoo" element={<EedooPage />} />
          <Route path="/eyad" element={<EyadPage />} />
        </Routes>
      </EedooTransitionProvider>
    </EyadTransitionProvider>
  );
};

export default App;
