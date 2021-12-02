import config from "../../Api/config.json";
import axios from "axios";
const apiEndPoint = config.apiEndPoint + "/auth";

export default async function login(email, password) {
  return await axios.post(apiEndPoint, { email, password });
}
