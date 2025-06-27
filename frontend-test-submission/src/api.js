import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

export const createShortURL = (data) => API.post('/shorturls', data);
export const getStats = (code) => API.get(`/shorturls/${code}`);
