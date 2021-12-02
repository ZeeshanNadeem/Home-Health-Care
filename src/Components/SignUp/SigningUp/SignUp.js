import config from "../../Api/config.json";
import axios from "axios";
const apiEndPoint = config.apiEndPoint + "/user";
export default async function signingUp(user) {
  return await axios.post(apiEndPoint, user);
}
