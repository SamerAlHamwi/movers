import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const getAllGroups = async () => {
  return await httpApi.get(`${apiPrefix.commissionGroups}/GetAll?`);
};

const createGroup = async (data: any) => {
  return await httpApi.post(`${apiPrefix.commissionGroups}/Create`, data);
};

export { getAllGroups, createGroup };
