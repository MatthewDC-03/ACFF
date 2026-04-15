import { useState } from "react";

export const useSignup = () => {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean | null>(null)

    const signup = async (username: string, email: string, password: string): Promise<boolean> => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
            return false
        }

        setIsLoading(false)
        return true
    }

    return { signup, isLoading, error }
}
