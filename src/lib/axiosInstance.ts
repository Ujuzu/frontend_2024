import { BASE_URl } from '@/data/url.data';
import axios, { AxiosInstance } from 'axios';

axios.defaults.baseURL = BASE_URl;
const axiosInstance: AxiosInstance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: true,

  withXSRFToken: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosInstance;
