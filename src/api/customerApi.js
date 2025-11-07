import axiosClient from './axiosClient';

export const customerApi = {
  getProfile: () => axiosClient.get('/user/profile'),
  updateProfile: (data) => axiosClient.put('/customer/profile', data),
  getBookings: () => axiosClient.get('/customer/bookings'),
  createBooking: (data) => axiosClient.post('/customer/bookings', data),
};
