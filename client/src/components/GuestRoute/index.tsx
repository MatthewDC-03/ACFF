import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'

// Redirects logged-in users away from login/register pages
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthContext()

    if (user) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default GuestRoute
