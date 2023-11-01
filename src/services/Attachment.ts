import { httpApi } from '@app/api/httpApi';

const url = `/api/services/app/Attachment`;
// eslint-disable-next-line
export const uploadAttachment = async (data: FormData) => {
  return await httpApi.post(`${url}/Upload`, data);
};
export const UploadMultiAttachment = async (data: FormData) => {
  return await httpApi.post(`${url}/UploadMultiAttachment`, data);
};
