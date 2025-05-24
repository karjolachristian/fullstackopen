import axios from 'axios';
import { getConfig } from './login';

const baseUrl = '/api/users';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (item) => {
  const response = await axios.post(baseUrl, item);
  return response.data;
};

const update = async (item) => {
  const response = await axios.put(`${baseUrl}/${item.id}`, item, getConfig());
  return response.data;
};

const remove = async ({ id }) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig());
  return response.data;
};

export default {
  getAll,
  create,
  update,
  remove,
};
