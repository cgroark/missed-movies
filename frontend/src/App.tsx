import { Routes, Route, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MovieProvider } from './context/MoviesContext';
import { CategoryProvider } from './context/CategoriesContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Header from './components/layout/Header';
import Home from './components/layout/Home';
import FindMovies from './components/movies/FindMovies';
import SignUp from './components/auth/SignUp';

function AppContent() {
  const { isRecoveringPassword } = useAuth();
  const location = useLocation();
  if (isRecoveringPassword && location.pathname !== '/reset-password') {
    return <Navigate to="/reset-password" replace />;
  }
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <FindMovies />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<SignUp key="login" />} />
        <Route path="/reset-password" element={<SignUp key="reset" resetPassword />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <CategoryProvider>
          <ToastProvider>
            <Router>
              <AppContent />
            </Router>
          </ToastProvider>
        </CategoryProvider>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;
