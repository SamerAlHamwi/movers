import { CountryModel } from './../interfaces/interfaces';
import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const GetEmailSetting = async () => {
  return await httpApi.get(`${apiPrefix.configurations}/GetEmailSetting`);
};

const UpdateEmailSetting = async (data: any) => {
  return await httpApi.put(`${apiPrefix.configurations}/SetEmailSetting`, data);
};

const AddCotactUs = async (data: CountryModel) => {
  return await httpApi.post(`${apiPrefix.configurations}/Create`, data);
};

export { GetEmailSetting, AddCotactUs, UpdateEmailSetting };
