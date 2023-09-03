import { httpApi } from '@app/api/httpApi';
import { Notification } from '@app/components/Admin/Notifications';
import { PrivacyPolicy } from '@app/components/Admin/PrivacyPolicy';

const baseURL = `/api/services/app/PrivacyPolicy`;
// eslint-disable-next-line
const createPrivacy = async (data: PrivacyPolicy) => {
  return await httpApi.post(`${baseURL}/Create`, data);
};
// eslint-disable-next-line
const Deleteprivacy = async (id: number) => {
  return await httpApi.delete(`${baseURL}/Delete?Id=${id}`);
};
const Updateprivacy = async (data: PrivacyPolicy) => {
  return await httpApi.put(`${baseURL}/Update`, data);
};

// eslint-disable-next-line
const getAllprivacy = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${baseURL}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}`);
};

export { createPrivacy, getAllprivacy, Deleteprivacy, Updateprivacy };
