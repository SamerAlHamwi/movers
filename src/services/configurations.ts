import { CountryModel } from '../interfaces/interfaces';
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

const GetFileSizeSetting = async () => {
  return await httpApi.get(`${apiPrefix.configurations}/GetFileSizeSetting`);
};

const UpdateFileSizeSetting = async (data: any) => {
  return await httpApi.post(`${apiPrefix.configurations}/SetFileSizeSetting`, data);
};

const GetHoursInSystemSetting = async () => {
  return await httpApi.get(`${apiPrefix.configurations}/GetHoursInSystem`);
};

const UpdateHoursInSystemSetting = async (data: any) => {
  return await httpApi.post(`${apiPrefix.configurations}/SetHoursInSystem`, data);
};

const GetDiscountPercentageSetting = async () => {
  return await httpApi.get(`${apiPrefix.configurations}/GetDiscountPercentage`);
};

const UpdateDiscountPercentageSetting = async (data: any) => {
  return await httpApi.post(`${apiPrefix.configurations}/SetDiscountPercentage`, data);
};

export {
  GetEmailSetting,
  UpdateEmailSetting,
  GetSmsSetting,
  UpdateSmsSetting,
  GetFileSizeSetting,
  UpdateFileSizeSetting,
  GetHoursInSystemSetting,
  UpdateHoursInSystemSetting,
  GetDiscountPercentageSetting,
  UpdateDiscountPercentageSetting,
};
