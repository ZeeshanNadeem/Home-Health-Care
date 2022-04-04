import config from "../../Api/config.json";
import axios from "axios";
const apiEndPoint = config.apiEndPoint + "/user";

export default async function signingUp(user,independent) {

  console.log("user::",user);
  if(independent){
    const apiEndPoint = config.apiEndPoint + "/user?indepedentServiceProvider=true";
    return await axios.post(apiEndPoint, user);

  }
  else
  return await axios.post(apiEndPoint, user);
}
