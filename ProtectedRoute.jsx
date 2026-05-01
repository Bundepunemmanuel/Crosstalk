import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ user, children, adminOnly = false }) {
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.email !== 'bundepunemmanuel@gmail.com') {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
