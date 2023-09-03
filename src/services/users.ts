import { httpApi } from '@app/api/httpApi';
import { UserModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

// eslint-disable-next-line
const getAllUsers = async (
  page: number,
  pageSize: number,
  GetAdminsAndCustomerServices: boolean,
  GetBasicUserAndCompanyUsers: boolean,
  userType?: any,
  isActive?: boolean,
) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.users}/GetAll?${
      isActive ? `IsActive=${isActive}&` : ''
    }UserType=${userType}&SkipCount=${skip}&MaxResultCount=${pageSize}&GetAdminsAndCustomerServices=${GetAdminsAndCustomerServices}&GetBasicUserAndCompanyUsers=${GetBasicUserAndCompanyUsers}`,
  );
};
// eslint-disable-next-line
const Delete = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.users}/Delete?Id=${id}`);
};
// eslint-disable-next-line
const Create = async (data: UserModel) => {
  return await httpApi.post(`${apiPrefix.users}/Create`, data);
};
// eslint-disable-next-line
const Update = async (data: UserModel) => {
  return await httpApi.put(`${apiPrefix.users}/Update`, data);
};
// eslint-disable-next-line
const Activate = async (id: number) => {
  return await httpApi.post(`${apiPrefix.users}/Activate`, { id });
};
// eslint-disable-next-line
const DeActivate = async (id: number) => {
  return await httpApi.post(`${apiPrefix.users}/DeActivate`, { id });
};

export { getAllUsers, Create, Update, Delete, Activate, DeActivate };
