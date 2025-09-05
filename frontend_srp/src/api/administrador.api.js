import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:8000/administradores/api/v1/administradores/'
});

export const getAdministradores = async () => {

    return api.get('/')

}

export  const createAdministrador = async (admin) => {

    return api.post('/', admin);

}