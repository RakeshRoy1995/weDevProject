const initialState = {
  logged_contact: []
}

const user_contactReducer = (state = initialState, action) => {

    switch (action.type) {
      case "USER_INFORMATION":
        return action.value;
      default:
        return state;
        
    }
  }

  export default user_contactReducer;