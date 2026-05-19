import axios from 'axios';
import axiosInstance from './axiosConfig';

const API_URL = 'http://localhost:8000/api';
const baseURL = 'http://127.0.0.1:8000/api';

export const login = (username, password) =>
    axios.post(`${baseURL}/token/`, { username, password });

export const refreshToken = (refresh) =>
    axios.post(`${baseURL}/token/refresh/`, { refresh });