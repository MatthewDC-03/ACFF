import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/Signin';
import Register from "./pages/Register"
import Hardware from './pages/Hardware';
import WiFiConnection from './pages/WiFiConnection';
import ClockComponent from './pages/TimeFeed';
import FeedLogs from './pages/FeedLogs';
import ProfilePage from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes — redirect to home if already logged in */}
          <Route path='login' element={<GuestRoute><SignIn /></GuestRoute>} />
          <Route path='register' element={<GuestRoute><Register /></GuestRoute>} />

          {/* Protected routes — redirect to login if not authenticated */}
          <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='feed' element={<ProtectedRoute><Hardware /></ProtectedRoute>} />
          <Route path='wifi' element={<ProtectedRoute><WiFiConnection /></ProtectedRoute>} />
          <Route path='clock' element={<ProtectedRoute><ClockComponent /></ProtectedRoute>} />
          <Route path='logs' element={<ProtectedRoute><FeedLogs /></ProtectedRoute>} />
          <Route path='profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
