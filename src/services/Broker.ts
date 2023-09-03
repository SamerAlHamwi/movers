import { httpApi } from '@app/api/httpApi';
import { Broker, Partner, UserModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

// eslint-disable-next-line
const getAllM = async (
  page: number,
  pageSize: number,

  isActive?: boolean,
) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.Mediator}/GetAll?${
      isActive ? `IsActive=${isActive}&` : ''
    }SkipCount=${skip}&MaxResultCount=${pageSize}`,
  );
};
// eslint-disable-next-line
const DeleteM = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.Mediator}/Delete?Id=${id}`);
};
// eslint-disable-next-line
const CreateM = async (data: Broker) => {
  return await httpApi.post(`${apiPrefix.Mediator}/Create`, data);
};
// eslint-disable-next-line
const Updatem = async (data: Broker) => {
  return await httpApi.put(`${apiPrefix.Mediator}/Update`, data);
};
// eslint-disable-next-line

export { getAllM, CreateM, Updatem, DeleteM };
