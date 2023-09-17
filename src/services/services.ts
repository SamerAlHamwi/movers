import { ServiceModel } from '../interfaces/interfaces';
import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

// Services
const getAllServices = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.services}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}`);
};

const getServices = async () => {
  return await httpApi.get(`${apiPrefix.services}/GetAll`);
};

const createService = async (data: ServiceModel) => {
  return await httpApi.post(`${apiPrefix.services}/Create`, data);
};

const DeleteService = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.services}/Delete?Id=${id}`);
};

const UpdateService = async (data: any) => {
  return await httpApi.put(`${apiPrefix.services}/Update`, data);
};

// Sub Services
const getAllSubServices = async (id: string | undefined, page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.subServices}/GetAll?ServiceId=${id}&SkipCount=${skip}&MaxResultCount=${pageSize}`,
  );
};
const getsubServices = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.subServices}/GetAll?ServiceId=${id}`);
};

const createSubService = async (data: ServiceModel) => {
  return await httpApi.post(`${apiPrefix.subServices}/Create`, data);
};

const DeleteSubService = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.subServices}/Delete?Id=${id}`);
};

const UpdateSubService = async (data: any) => {
  return await httpApi.put(`${apiPrefix.subServices}/Update`, data);
};

export {
  getAllServices,
  getServices,
  getsubServices,
  createService,
  DeleteService,
  UpdateService,
  getAllSubServices,
  createSubService,
  DeleteSubService,
  UpdateSubService,
};
