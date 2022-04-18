import axios from 'axios';

axios.defaults.baseURL = 'https://product-test-task-backend.vercel.app/api/';

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');