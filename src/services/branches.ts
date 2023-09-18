import { httpApi } from '@app/api/httpApi';
import { BranchModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllBranches = async (CompanyId: string | undefined, page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.branches}/GetAll?CompanyId=${CompanyId}&SkipCount=${skip}&MaxResultCount=${pageSize}`,
  );
};

const createBranch = async (data: BranchModel) => {
  return await httpApi.post(`${apiPrefix.branches}/Create`, data);
};

const DeleteBranch = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.branches}/Delete?Id=${id}`);
};

export { getAllBranches, createBranch, DeleteBranch };
