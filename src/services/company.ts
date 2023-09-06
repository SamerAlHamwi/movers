import { httpApi } from '@app/api/httpApi';

import { CompanyModal, UserModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

// eslint-disable-next-line
const getAllCompanies = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.companies}/GetAll`);
};
const getcompany = async (id?: number) => {
  return await httpApi.get(`${apiPrefix.companies}/Get?Id=${id}`);
};
// eslint-disable-next-line
const Deletce = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.companies}/Delete?Id=${id}`);
};
// eslint-disable-next-line
const createCompany = async (data: CompanyModal) => {
  return await httpApi.post(`${apiPrefix.companies}/Create`, data);
};
// eslint-disable-next-line
const Updatce = async (data: CompanyModal) => {
  return await httpApi.put(`${apiPrefix.companies}/Update`, data);
};
// eslint-disable-next-line
const ActivatCe = async (id: number) => {
  return await httpApi.post(`${apiPrefix.companies}/Activate`, { id });
};
// eslint-disable-next-line
const DeActivatCCe = async (id: number) => {
  return await httpApi.post(`${apiPrefix.companies}/DeActivate`, { id });
};

export { getAllCompanies, getcompany, createCompany, Updatce, Deletce, ActivatCe, DeActivatCCe };
