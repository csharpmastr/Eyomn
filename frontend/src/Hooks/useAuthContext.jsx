import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export const useAuthContext = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
}