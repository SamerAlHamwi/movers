import { httpApi } from '@app/api/httpApi';
import { Term } from '@app/components/Admin/Term&condition';
import apiPrefix from '@app/constants/apiPrefix';

const getAllTerm = async (page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.Term}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`);
};

const createTerm = async (data: Term) => {
  return await httpApi.post(`${apiPrefix.Term}/Create`, data);
};

const DeleteTerm = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.Term}/Delete?Id=${id}`);
};

const UpdateTerm = async (data: Term) => {
  return await httpApi.put(`${apiPrefix.Term}/Update`, data);
};

export { getAllTerm, createTerm, DeleteTerm, UpdateTerm };
