import axiosClient from './axiosClient';
import axios from 'axios';

export const authApi = {
  customerSignup: (data) => axiosClient.post('/auth/register', data),
  customerLogin: (data) => axiosClient.post('/auth/signin', data),
  workerSignup: (data) => axiosClient.post('/auth/register', data),
  workerLogin: (data) => axiosClient.post('/auth/signin', data),
  // Verify endpoints
  verifySignup: (data) => axiosClient.post('/auth/verify', data),
  // verify-signin is hosted on local dev server per your note; use absolute URL
  verifySignin: (data) =>
    axios.post(
      'https://jinnar-marketplace.onrender.com/api/auth/verify-signin',
      data
    ),
};
