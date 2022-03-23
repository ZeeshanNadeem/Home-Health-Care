
import jwtDecode from "jwt-decode";
 export default ()=>{
    const jwt = localStorage.getItem("token");
    if(jwt){
    const user = jwtDecode(jwt);
    
    return user;}
    else return null;
}