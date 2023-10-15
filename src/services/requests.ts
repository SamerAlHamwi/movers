import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const getAllRequests = async (page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.requests}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
  );
};

const getAllOffers = async (page: number, pageSize: number, search: string, id: string | undefined) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.offers}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}&RequestId=${id}`,
  );
};

const getRequestById = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.requests}/Get?Id=${id}`);
};

const createRequest = async (data: any) => {
  return await httpApi.post(`${apiPrefix.requests}/Create`, data);
};

const DeleteRequest = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.requests}/Delete?Id=${id}`);
};

const UpdateRequest = async (data: any) => {
  return await httpApi.put(`${apiPrefix.requests}/Update`, data);
};

const confirmRequest = async (data: any) => {
  return await httpApi.post(`${apiPrefix.requests}/ChangeStatuesForRequest`, data);
};

const suitableForRequest = async (data: any) => {
  return await httpApi.post(`${apiPrefix.requests}/InsertAndNoticFilteredCompanies?requestId=${data.id}`, data.request);
};

const sendForUser = async (data: any) => {
  return await httpApi.post(`${apiPrefix.offers}/ApproveOfferToSendItToUser`, data);
};

export {
  getAllRequests,
  getAllOffers,
  getRequestById,
  createRequest,
  DeleteRequest,
  UpdateRequest,
  confirmRequest,
  suitableForRequest,
  sendForUser,
};
