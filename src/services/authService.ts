import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const authService = {
  login: async (login: { email: string; password: string }) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, login);
    return response.data;
  },
};
