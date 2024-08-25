import axios from 'axios';

export const checkTokenValidity = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/token/validate', {
            withCredentials: true,
        });
        return response.data; 
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error validating token');
    }
};
