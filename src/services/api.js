// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL, // Substitua pela URL base do seu servidor
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para logging (opcional, mas útil para debug)
api.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.log('Error:', error);
    return Promise.reject(error);
  }
);

export default api;