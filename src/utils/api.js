import axios from "axios";
import { API_URL } from "../config";

export const userLogin = async (body) => {
  const response = await axios
    .post(`${API_URL}/user/login`, body)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });

  return response;
};
