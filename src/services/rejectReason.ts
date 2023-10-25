import { httpApi } from '@app/api/httpApi';
import { Point } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllRejectReasons = async (page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.rejectReason}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
  );
};

const CreatePoint = async (data: Point) => {
  return await httpApi.post(`${apiPrefix.rejectReason}/Create`, data);
};

const DeletePoint = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.rejectReason}/Delete?Id=${id}`);
};

const UpdatePoint = async (data: Point) => {
  return await httpApi.put(`${apiPrefix.rejectReason}/Update`, data);
};

const ActivatePoint = async (id: number) => {
  return await httpApi.put(`${apiPrefix.rejectReason}/SwitchActivation`, { id, isActive: true });
};

const DeActivatePoint = async (id: number) => {
  return await httpApi.put(`${apiPrefix.rejectReason}/SwitchActivation`, { id, isActive: false });
};

export { getAllRejectReasons, CreatePoint, UpdatePoint, DeletePoint, ActivatePoint, DeActivatePoint };
