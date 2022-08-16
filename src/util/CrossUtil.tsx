export const setLs = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
  return value;
};

export const getLs = (key: string) => {
  return window.localStorage.getItem(key) || "";
};

export const getUserLs = () => {
  const currentUser: any = getLs("user");
  const defaultUser = {
    defaultParam: {
      clearTime: 0,
      clearTimeMessage: "",
      signOutTime: 0,
    },
    chatClear: 0,
    lastLogin: "",
    username: "",
    loggedIn: false,
  };
  return currentUser ? JSON.parse(currentUser) : defaultUser;
};

export const authorizeUser = () => {
  const currentUser = getUserLs();
  return currentUser.loggedIn;
};

export const resetLs = () => {
  setLs("user", "");
  setLs("chatWith", "");
  setLs("chatClear", "");
};
