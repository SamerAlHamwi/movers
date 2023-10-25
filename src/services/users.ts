import { httpApi } from '@app/api/httpApi';
import { UserModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllUsers = async (
  page: number,
  pageSize: number,
  GetAdminsAndCustomerServices: boolean,
  GetBasicUserAndCompanyUsers: boolean,
  search: string,
  userType?: any,
  isActive?: boolean,
) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.users}/GetAll?${
      isActive ? `IsActive=${isActive}&` : ''
    }UserType=${userType}&SkipCount=${skip}&MaxResultCount=${pageSize}&GetAdminsAndCustomerServices=${GetAdminsAndCustomerServices}&GetBasicUserAndCompanyUsers=${GetBasicUserAndCompanyUsers}&KeyWord=${search}`,
  );
};

const getAllUsersForAddRequest = async (search: string) => {
  return await httpApi.get(`${apiPrefix.users}/GetAll?UserType=2&KeyWord=${search}`);
};

const Delete = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.users}/Delete?Id=${id}`);
};

const Create = async (data: UserModel) => {
  return await httpApi.post(`${apiPrefix.users}/Create`, data);
};

const Update = async (data: UserModel) => {
  return await httpApi.put(`${apiPrefix.users}/Update`, data);
};

const Activate = async (id: number) => {
  return await httpApi.post(`${apiPrefix.users}/Activate`, { id });
};

const DeActivate = async (id: number) => {
  return await httpApi.post(`${apiPrefix.users}/DeActivate`, { id });
};

export { getAllUsers, getAllUsersForAddRequest, Create, Update, Delete, Activate, DeActivate };
