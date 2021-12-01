import axios, { AxiosError } from "axios";
import useSnackbar from "hooks/useSnackbar";
import useToken from "hooks/useToken";
import config from "config";
export interface ErrorResponse {
  status: number;
  message: string;
}
const http = axios.create({
  baseURL: config.SERVER_URL,
});
http.interceptors.response.use(
  (res) => res.data,
  (err: AxiosError<ErrorResponse>) => {
    if (!err.response) {
      useSnackbar.getState().error("Vui lòng kiểm tra kết nối internet");
    }
    return Promise.reject(err);
  }
);
http.interceptors.request.use((config) => {
  const token = useToken.getState().token;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default http;
