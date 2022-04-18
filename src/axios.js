import axios from 'axios';

axios.defaults.baseURL = 'https://product-testtask-backend.vercel.app/api/api/';

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
