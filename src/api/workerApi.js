import axiosClient from './axiosClient';

export const workerApi = {
  getDashboard: () => axiosClient.get('/worker/dashboard'),
  getJobs: () => axiosClient.get('/worker/jobs'),
  addJob: (data) => axiosClient.post('/worker/jobs', data),
  updateJob: (id, data) => axiosClient.put(`/worker/jobs/${id}`, data),
};
