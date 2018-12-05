const initialState = {
    isLogined: false,
    jwtTocken: null
};
  
function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'USER_AUTHENTICATE': {
            return { ...state, fullname: action.payload.login, isLogined: true };
        }
        default: {
            return state;
        } 
    }
}

export default userReducer;