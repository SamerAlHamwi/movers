import { httpApi } from '@app/api/httpApi';
import { Broker, Partner, UserModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllM = async (page: number, pageSize: number, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.Mediator}/GetAll?${
      isActive ? `IsActive=${isActive}&` : ''
    }SkipCount=${skip}&MaxResultCount=${pageSize}`,
  );
};

const DeleteM = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.Mediator}/Delete?Id=${id}`);
};

const CreateM = async (data: Broker) => {
  return await httpApi.post(`${apiPrefix.Mediator}/Create`, data);
};

const Updatem = async (data: Broker) => {
  return await httpApi.put(`${apiPrefix.Mediator}/Update`, data);
};

export { getAllM, CreateM, Updatem, DeleteM };
