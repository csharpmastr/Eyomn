import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { userLogin } from "../Service/UserService";
import Cookies from "universal-cookie";

export const useLogin = () => {
    const cookies = new Cookies();
    const {dispatch} = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)


    const login = async (username , password) => {
        setIsLoading(true);
        setError(null)
        try{
            const data = await userLogin(username, password);
            dispatch({type: 'LOGIN', payload : data});
            cookies.set('user', JSON.stringify(data),
            {path : '/'});
        }catch(err){
            setError(err.response?.data?.error || 'An error occurred during login.');
        }finally{
            setIsLoading(false)
        }
    }    
    return {login, isLoading, error};
}