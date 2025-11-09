import { createContext } from "react";

// Default user object with empty values
const defaultUser = {
  email: "",
  password: "",
  isLoggedIn: false,
};

// Default logOut function (empty function)
const defaultLogOut = () => {};

// Create and export React Context with default values
const AppContext = createContext({
  user: defaultUser,
  logOut: defaultLogOut,
});

export default AppContext;

