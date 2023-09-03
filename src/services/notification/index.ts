import { httpApi } from '@app/api/httpApi';
import { Notification } from '@app/components/Admin/Notifications';

const baseURL = `/api/services/app/PushNotification`;
// eslint-disable-next-line
const createNotification = async (data: Notification) => {
  return await httpApi.post(`${baseURL}/Create`, data);
};
// eslint-disable-next-line
const DeleteNotifaction = async (id: number) => {
  return await httpApi.delete(`${baseURL}/Delete?Id=${id}`);
};
const UpdateNotification = async (data: Notification) => {
  return await httpApi.put(`${baseURL}/Update`, data);
};

// eslint-disable-next-line
const getAllNotification = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${baseURL}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}`);
};

export { createNotification, getAllNotification, DeleteNotifaction, UpdateNotification };
