import axios from 'axios';
import Cookies from 'universal-cookie';
const API_URL = 'http://localhost:3000/api/user';

export const userLogin = async (username, password) => {
    try {
        const { data } = await axios.post(`${API_URL}/login`, { username, password }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return data;
    } catch (err) {
        throw err.response?.data?.error || 'An error occurred';
    }
};
