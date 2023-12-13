import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const getAllRequests = async (
  type: string | undefined,
  brokerId: string | undefined,
  page: number,
  pageSize: number,
  search: string,
  Statues?: number,
) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.requests}/GetAll?${
      type === 'viaBroker' && `ForBroker=true&BrokerId=${brokerId}&Statues=10`
    }&SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}&Statues=${Statues ? Statues : ''}`,
  );
};

const getPossibleClients = async (CompanyId: string | undefined, page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.requests}/GetAll?CompanyId=${CompanyId}&Statues=6&GetPossibleRequest=true&SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
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

export {
  getAllRequests,
  getPossibleClients,
  getRequestById,
  createRequest,
  DeleteRequest,
  UpdateRequest,
  confirmRequest,
  suitableForRequest,
};
