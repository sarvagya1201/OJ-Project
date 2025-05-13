import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />           {/* Homepage */}
      <Route path="/login" element={<LoginPage />} />     {/* Login page */}
      <Route path="/register" element={<RegisterPage />} /> {/* Register page */}
    </Routes>
  );
};

export default AppRoutes;
