import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const getAllDrafts = async (UserId: string | undefined) => {
  return await httpApi.get(`${apiPrefix.drafts}/GetAll?UserId=${UserId}`);
};

const getDraftById = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.drafts}/Get?Id=${id}`);
};

const sendForUser = async (data: any) => {
  return await httpApi.post(`${apiPrefix.drafts}/ApproveOfferToSendItToUser`, data);
};

export { getAllDrafts, getDraftById, sendForUser };
