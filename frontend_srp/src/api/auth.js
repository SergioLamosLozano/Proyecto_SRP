import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api';

export const getAdministradores = async () => {

    return api.get('/')

}

export const login = (username, password) =>
    axios.post(`${baseURL}/token/`, { username, password });


export  const validationUser = async (username, password) => {

    return api.post('/login/', username, password);

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