export const authReducer = (state = { isLoggedIn: false }, action:any) => {
  switch (action.type) {
    case "auth/login":
      return { ...state, isLoggedIn: true };
    case "auth/logout":
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
};
