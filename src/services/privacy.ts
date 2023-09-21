import { httpApi } from '@app/api/httpApi';
import { PrivacyPolicy } from '@app/components/Admin/PrivacyPolicy';
import apiPrefix from '@app/constants/apiPrefix';

const createPrivacy = async (data: PrivacyPolicy) => {
  return await httpApi.post(`${apiPrefix.privacyPolicy}/Create`, data);
};

const Deleteprivacy = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.privacyPolicy}/Delete?Id=${id}`);
};

const Updateprivacy = async (data: PrivacyPolicy) => {
  return await httpApi.put(`${apiPrefix.privacyPolicy}/Update`, data);
};

const getAllprivacy = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.privacyPolicy}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}`);
};

export { createPrivacy, getAllprivacy, Deleteprivacy, Updateprivacy };