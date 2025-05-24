import axios from 'axios';
const baseUrl = '/api/login';

let config = null;

const setToken = (newToken) => {
  config = {
    headers: {
      Authorization: `Bearer ${newToken}`,
    },
  };
};

export const getConfig = () => config;

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login, setToken };
