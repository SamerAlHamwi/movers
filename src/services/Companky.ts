import { httpApi } from '@app/api/httpApi';

import { CompanyModal, UserModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

// eslint-disable-next-line
const getAllCompanies = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.companies}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}`);
};
// eslint-disable-next-line
const Deletce = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.users}/Delete?Id=${id}`);
};
// eslint-disable-next-line
const createCompany = async (data: CompanyModal) => {
  return await httpApi.post(`${apiPrefix.companies}/Create`, data);
};
// eslint-disable-next-line
const Updatce = async (data: CompanyModal) => {
  return await httpApi.put(`${apiPrefix.users}/Update`, data);
};
// eslint-disable-next-line
const ActivatCe = async (id: number) => {
  return await httpApi.post(`${apiPrefix.users}/Activate`, { id });
};
// eslint-disable-next-line
const DeActivatCCe = async (id: number) => {
  return await httpApi.post(`${apiPrefix.users}/DeActivate`, { id });
};

export { getAllCompanies, createCompany, Updatce, Deletce, ActivatCe, DeActivatCCe };
