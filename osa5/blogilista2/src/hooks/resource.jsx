import { useSelector } from 'react-redux';
import axios from 'axios';

let config = null;

export default function resource(baseUrl) {
  const selector = useSelector({});

  const login = async (credentials) => {
    const response = await axios.post('/api/login', credentials);
    return response.data;
  };

  const setToken = (newToken) => {
    config = {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    };
  };

  const getAll = async () => {
    const response = await axios.get(baseUrl, config);
    return response.data;
  };

  const create = async (item) => {
    const response = await axios.post(baseUrl, item, config);
    return response.data;
  };

  const update = async (item) => {
    const response = await axios.put(`${baseUrl}/${item.id}`, item, config);
    return response.data;
  };

  const remove = async ({ id }) => {
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response.data;
  };

  const service = {
    getAll,
    create,
    update,
    remove,
    setToken,
    login,
  };

  return [resources, service];
}
