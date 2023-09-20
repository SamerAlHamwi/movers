import { httpApi } from '@app/api/httpApi';
import { Partner, UserModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllPartner = async (page: number, pageSize: number, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.partner}/GetAll?${
      isActive ? `IsActive=${isActive}&` : ''
    }SkipCount=${skip}&MaxResultCount=${pageSize}`,
  );
};

const DeletePartner = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.partner}/Delete?Id=${id}`);
};

const CreatePartner = async (data: Partner) => {
  return await httpApi.post(`${apiPrefix.partner}/Create`, data);
};

const UpdatePartner = async (data: Partner) => {
  return await httpApi.put(`${apiPrefix.partner}/Update`, data);
};

const ActivatePartner = async (id: number) => {
  return await httpApi.post(`${apiPrefix.partner}/Activate`, { id });
};

const DeActivatePartner = async (id: number) => {
  return await httpApi.post(`${apiPrefix.partner}/DeActivate`, { id });
};

export { getAllPartner, CreatePartner, UpdatePartner, DeletePartner, ActivatePartner, DeActivatePartner };
