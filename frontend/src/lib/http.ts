import axios from "axios";
import useToken from "hooks/useToken";

export interface ErrorResponse {
  status: number;
  message: string;
}
const http = axios.create({
  baseURL: "http://localhost:8080",
});
http.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
);
http.interceptors.request.use((config) => {
  const token = useToken.getState().token;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default http;
