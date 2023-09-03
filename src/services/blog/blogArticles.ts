import { httpApi } from '@app/api/httpApi';
import { Translation, Attachment } from '@app/interfaces/interfaces';
import { BlogActivationData } from '@app/interfaces/interfaces';

const baseURL = `/api/services/app/Blog`;

export type blog_article = {
  blogCategoryId: number;
  link: string;
  translations: Translation[];
  attachments: Attachment[];
};
// eslint-disable-next-line
const getAllBlog = async (page: number, pageSize: number, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${baseURL}/GetAll?${isActive ? `IsActive=${isActive}&` : ``}SkipCount=${skip}&MaxResultCount=${pageSize}`,
  );
};
// eslint-disable-next-line
const getBlogById = async (id: number) => {
  return await httpApi.get(`${baseURL}/Get?Id=${id}`);
};
// eslint-disable-next-line
const createBlog = async (data: blog_article) => {
  return httpApi.post(`${baseURL}/Create`, data);
};
// eslint-disable-next-line
const updateBlog = async (data: blog_article) => {
  return httpApi.put(`${baseURL}/Update`, data);
};
// eslint-disable-next-line
const deleteBlog = async (id: number) => {
  return httpApi.delete(`${baseURL}/Delete?Id=${id}`);
};
// eslint-disable-next-line
const switchBlogActivation = async (data: BlogActivationData) => {
  return await httpApi.put(`${baseURL}/SwitchActivation`, data);
};

export { getAllBlog, getBlogById, createBlog, updateBlog, deleteBlog, switchBlogActivation };
