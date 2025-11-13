import type { ReactNode } from 'react';

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Loader size="large" />;
  return user ? children : <Navigate to="/login" replace />;
}
