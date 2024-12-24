import { useEffect, useState } from 'react';
import AppRouter from './AppRouter';
import LandingPage from './pages/public/LandingPage';


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ?
        <LandingPage />
        : <AppRouter />
      }
    </div>
  );
}

export default App;