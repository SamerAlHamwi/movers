import { httpApi } from '@app/api/httpApi';
import { CompanyModal } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllCompanies = async (page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.companies}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
  );
};

const getSuitableCompanies = async (page: number, pageSize: number, search: string, requestId: string | undefined) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.companies}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}&RequestId=${requestId}&IsForFilter=true`,
  );
};

const getCompanyById = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.companies}/Get?Id=${id}`);
};

const DeleteCompany = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.companies}/Delete?Id=${id}`);
};

const createCompany = async (data: CompanyModal) => {
  return await httpApi.post(`${apiPrefix.companies}/Create`, data);
};

const updateCompany = async (data: CompanyModal) => {
  return await httpApi.put(`${apiPrefix.companies}/Update`, data);
};

const confirmCompany = async (data: any) => {
  return await httpApi.post(`${apiPrefix.companies}/ConfirmCompanyByAdmin`, data);
};

export {
  getAllCompanies,
  getSuitableCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  DeleteCompany,
  confirmCompany,
};
