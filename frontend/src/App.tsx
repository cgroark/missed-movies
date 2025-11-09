import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { AuthProvider } from "./context/AuthContext";
import { MovieProvider } from './context/MoviesContext';
import { CategoryProvider } from './context/CategoriesContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from "./components/ProtectedRoute";
import Header from './components/Header';
import Home from './components/Home';
import FindMovies from './components/FindMovies';
import SignUp from './components/SignUp';

function AppContent() {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
          } />
        <Route path='/search' element={
          <ProtectedRoute>
            <FindMovies />
          </ProtectedRoute>
          } />
        <Route path='/login' element={<SignUp />} />
      </Routes>
    </>
  )
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
  )
}

export default App;
