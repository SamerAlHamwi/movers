import { SourceTypeModel } from './../interfaces/interfaces';
import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const getAllTools = async (
  serviceId: string | undefined,
  subServiceId: string | undefined,
  page: number,
  pageSize: number,
) => {
  const skip = (page - 1) * pageSize;
  if (serviceId && !subServiceId) {
    return await httpApi.get(
      `${apiPrefix.tools}/GetAll?ServiceId=${serviceId}&SkipCount=${skip}&MaxResultCount=${pageSize}`,
    );
  } else if (serviceId && subServiceId) {
    return await httpApi.get(
      `${apiPrefix.tools}/GetAll?SubServiceId=${subServiceId}&SkipCount=${skip}&MaxResultCount=${pageSize}`,
    );
  }
};

const createTool = async (data: SourceTypeModel) => {
  return await httpApi.post(`${apiPrefix.tools}/Create`, data);
};

const DeleteTool = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.tools}/Delete?Id=${id}`);
};

const UpdateTool = async (data: any) => {
  return await httpApi.put(`${apiPrefix.tools}/Update`, data);
};

export { getAllTools, createTool, DeleteTool, UpdateTool };
