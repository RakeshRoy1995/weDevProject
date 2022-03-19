
const initialState = {
  cart: []
}


const commonReducer = (state = initialState, action:any) => {
    switch (action.type) {
      case "CART_INFORMATION":
        return action.value;
        break;

      default:
        return state;
        
    }
  }

  export default commonReducer;