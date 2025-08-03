import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home/home-page.tsx';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
