import { useAuthContext } from './useAuthContext'

export const useApi = () => {
    const { user } = useAuthContext()

    const apiCall = async (url: string, options: RequestInit = {}) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        }

        // Attach JWT token if user is logged in
        if (user?.token) {
            headers['Authorization'] = `Bearer ${user.token}`
        }

        const response = await fetch(url, {
            ...options,
            headers,
        })

        return response
    }

    return { apiCall }
}
