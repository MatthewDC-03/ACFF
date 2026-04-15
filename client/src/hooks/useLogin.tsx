import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

interface LoginResponse {
    success?: boolean;
    error?: any;
}

export const useLogin = () => {
    
    
    const [error,setError] = useState<boolean | null >(null)
    const [isLoading,setIsLoading] = useState<boolean | null>(false)
    const { dispatch } = useAuthContext()

    const login = async (username: string, password: string): Promise<LoginResponse> => {
        setIsLoading(true)
        setError(null)

        /* 
        For hosted website use this fetch:  https://acff-api.vercel.app/api/user/login
        for local website use this fetch: api/user/login
        */

        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username,password}) // convert to json file
        })
        const json: LoginResponse = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
            return { error: json.error };
        }
        if(response.ok){
            
            // save the user to local storage
            localStorage.setItem('user',JSON.stringify(json))

            // update the auth context
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
        }
        return { success: true }
    }
    return { login, isLoading, error }
}
