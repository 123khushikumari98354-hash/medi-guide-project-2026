import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Guide from './pages/Guide';
import Directory from './pages/Directory';
import MapPage from './pages/MapPage';
import Book from './pages/Book';
import Queue from './pages/Queue';
import Emergency from './pages/Emergency';
import Feedback from './pages/Feedback';
import Admin from './pages/Admin';
import About from './pages/About';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Guide />} />
        <Route path="directory" element={<Directory />} />
        <Route path="map" element={<MapPage />} />
        <Route path="book" element={<Book />} />
        <Route path="queue" element={<Queue />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="admin" element={<Admin />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Guide />} />
      </Route>
    </Routes>
  );
}
