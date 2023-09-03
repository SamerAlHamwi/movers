import { httpApi } from '@app/api/httpApi';
import { RoleModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllRequests = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.requests}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}`);
};

const getRequestById = async (id: number) => {
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

export { getAllRequests, getRequestById, createRequest, DeleteRequest, UpdateRequest };
