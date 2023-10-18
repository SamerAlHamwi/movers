import { httpApi } from '@app/api/httpApi';
import { Broker } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllMediators = async (page: number, pageSize: number, search: string, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.Mediator}/GetAll?${
      isActive ? `IsActive=${isActive}&` : ''
    }SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
  );
};

const DeleteMediator = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.Mediator}/Delete?Id=${id}`);
};

const CreateMediator = async (data: Broker) => {
  return await httpApi.post(`${apiPrefix.Mediator}/Create`, data);
};

const UpdateMediator = async (data: Broker) => {
  return await httpApi.put(`${apiPrefix.Mediator}/Update`, data);
};

export { getAllMediators, CreateMediator, UpdateMediator, DeleteMediator };
