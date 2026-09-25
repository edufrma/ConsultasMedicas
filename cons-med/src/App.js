import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Consultas from './Consultas';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/consultas" element={<Consultas />} />
    </Routes>
  );
}

export default App;