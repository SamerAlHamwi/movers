import { CountryModel } from './../interfaces/interfaces';
import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const GetEmailSetting = async () => {
  return await httpApi.get(`${apiPrefix.configurations}/GetEmailSetting`);
};

const UpdateEmailSetting = async (data: any) => {
  return await httpApi.post(`${apiPrefix.configurations}/SetEmailSetting`, data);
};

const GetSmsSetting = async () => {
  return await httpApi.get(`${apiPrefix.configurations}/GetSmsSetting`);
};

const UpdateSmsSetting = async (data: any) => {
  return await httpApi.post(`${apiPrefix.configurations}/SetSmsSetting`, data);
};

export { GetEmailSetting, UpdateEmailSetting, GetSmsSetting, UpdateSmsSetting };
