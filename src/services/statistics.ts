import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const GetStatisticsNumbers = async () => {
  return await httpApi.get(`${apiPrefix.statictics}/GetStatisticsNumbers`);
};

const GetCompaniesStatistics = async () => {
  return await httpApi.get(`${apiPrefix.companies}/GetInfoAboutRequestsCount`);
};

const GetBranchesStatistics = async () => {
  return await httpApi.get(`${apiPrefix.branches}/GetInfoAboutRequestsCount`);
};

const GetServiceStatistics = async () => {
  return await httpApi.get(`${apiPrefix.requests}/GetServiceStatistics`);
};

const GetCitiesStatistics = async () => {
  return await httpApi.get(`${apiPrefix.requests}/GetCitiesStatistics`);
};

export {
  GetStatisticsNumbers,
  GetCompaniesStatistics,
  GetBranchesStatistics,
  GetServiceStatistics,
  GetCitiesStatistics,
};
