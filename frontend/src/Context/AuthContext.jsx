import React, { createContext, useReducer, useEffect } from "react";
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie'
import {checkTokenValidity} from '../Utils/TokenUtil'
export const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null};
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null });
    const cookies = new Cookies();

    useEffect(() => {
        // const validateToken  = async() => {
        //     try{
        //         const result = await checkTokenValidity();
        //         const user = cookies.get('user', {path : '/'})
        //         if(result.user){
        //             dispatch({type:'LOGIN', payload: user});
        //         }else{
        //             dispatch({type: 'LOGOUT'});
        //         }
        //     }catch(err){
        //         dispatch({ type: 'LOGOUT' });
        //     }
        // }
        // validateToken ();
        // const intervalId = setInterval(checkTokenValidity, 60000);
        // return () => clearInterval(intervalId);
        
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
