import { httpApi } from '@app/api/httpApi';
import { BranchModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const createBranch = async (data: BranchModel) => {
  return await httpApi.post(`${apiPrefix.branches}/Create`, data);
};

export { createBranch };
