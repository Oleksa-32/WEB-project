import { Route, Routes } from 'react-router-dom';
import Booking from './pages/Booking.jsx';
import Home from './pages/Home.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking/:trainId" element={<Booking />} />
    </Routes>
  );
}
