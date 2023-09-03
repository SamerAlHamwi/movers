import { LanguageType } from '@app/interfaces/interfaces';
import { httpApi } from '@app/api/httpApi';

type BlogCatTranslation = {
  name: string;
  language: LanguageType;
};

const baseURL = `/api/services/app/BlogCategory`;

const getAllBlogCategory = async (page: number, pageSize: number, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${baseURL}/GetAll?${isActive ? `IsActive=${isActive}&` : ''}SkipCount=${skip}&MaxResultCount=${pageSize}`,
  );
};

const createBlogCategory = async (translations: BlogCatTranslation) => {
  return await httpApi.post(`${baseURL}/Create`, translations);
};

const updateBlogCategory = async (translations: BlogCatTranslation) => {
  return await httpApi.put(`${baseURL}/Update`, translations);
};

const deleteBlogCategory = async (id: number) => {
  return await httpApi.delete(`${baseURL}/Delete?Id=${id}`);
};

const switchBlogCategoryActivation = async (id: number, isActive: boolean) => {
  return await httpApi.put(`${baseURL}/SwitchActivation`, { id, isActive });
};

export { getAllBlogCategory, createBlogCategory, updateBlogCategory, deleteBlogCategory, switchBlogCategoryActivation };
