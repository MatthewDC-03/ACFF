import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'

// Redirects to login if not authenticated, preserving the intended destination
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthContext()
    const location = useLocation()

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
