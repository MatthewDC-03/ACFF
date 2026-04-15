import { useState } from "react";
import { useAuthContext } from "./useAuthContext";


export const useSignup = () => {
    const [error,setError] = useState<boolean | null >(null)
    const [isLoading,setIsLoading] = useState<boolean | null>(null)
    const { dispatch } = useAuthContext()

    const signup = async (username: string, email: string, password: string) => {
        setIsLoading(true)
        setError(null)

        /* 
        For hosted website use this fetch:  https://acff-api.vercel.app/api/user/register
        for local website use this fetch: /api/user/register
        */

        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username,email,password}) // convert to json file
        })
        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok){
            // save the user to local storage
            localStorage.setItem('user',JSON.stringify(json))

            // update the auth context
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
        }
    }
    return { signup, isLoading, error }
}
