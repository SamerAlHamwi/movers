import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const GetServiceStatistics = async () => {
  return await httpApi.get(`${apiPrefix.requests}/GetServiceStatistics`);
};

export { GetServiceStatistics };
