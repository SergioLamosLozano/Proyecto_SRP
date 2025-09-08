import axios from 'axios';

export const  api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/login/", 
});


export const getAdministradores = async () => {

    return api.get('/')

}

export  const validationUser = async (username, password) => {

    return api.post('/', username, password);

}

export const deleteAdministrador = async (id) => {

    return api.delete(`/${id}/`);

}

export const updateAdministrador = async (id, admin) => {

    return api.put(`/${id}/`, admin);

}

export const getAdministradorid = async (id) => {

    return api.get(`/${id}/`);

}

//