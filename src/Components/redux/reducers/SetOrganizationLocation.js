

const initialState={};

const SetLocation=(state=initialState,action)=>{

 switch(action.type){

    case "LOCATION": return action.payload;
    default:return state;
 }

}

export default SetLocation;