import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import Cookies from "universal-cookie";


export const useLogout = () => {
    const {dispatch} = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const cookies = new Cookies();
    const logout = () => {
        setIsLoading(true);
        setError(null)
        try{
            dispatch({type: 'LOGOUT'});
            cookies.remove('user', {path : '/'});
        }catch(err){
            setError('An error occurred during logout.');
        }finally{
            setIsLoading(false);
        }
    }
    return {logout, isLoading, error};
}