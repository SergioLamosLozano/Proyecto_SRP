import {api} from "../api/auth";

export const validationUser = async (username, password) => {
try {
        const response = await api.post("",{
            username,
            password,
            });
        return response.data; 
        } catch (error) {
        throw error.response?.data || { error: "Error en la autenticación" };
    }
};