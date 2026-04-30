import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import TravelIndex from './pages/travel/TravelIndex';
import DistrictPage from './pages/travel/DistrictPage';
import { wayanadData } from './data/travel/wayanad';

// To add a new district: import its data file and add one <Route> line below.
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/travel" element={<TravelIndex />} />
        <Route path="/travel/wayanad" element={<DistrictPage data={wayanadData} />} />
      </Routes>
    </BrowserRouter>
  );
}
