import jwt from "jsonwebtoken";

export const setLs = (key: string, value: string) => {
  window.sessionStorage.setItem(key, value);
  return value;
};

export const getLs = (key: string) => {
  return window.sessionStorage.getItem(key) || "";
};

export const removeLs = (key: string) => {
  return window.sessionStorage.removeItem(key);
};

export const getUserLs = () => {
  const currentUser: any = getLs("user");
  const decoded: any = currentUser && jwt.verify(currentUser, "smaro");
  const defaultUser = {
    lastLogin: "",
    username: "",
    expiry: "",
  };
  return currentUser ? decoded : defaultUser;
};

export const authorizeUser = () => {
  const currentUser = getUserLs();
  const currentTime = new Date().getTime();
  return currentUser.expiry > currentTime;
};

export const resetLs = () => {
  setLs("user", "");
  setLs("chatWith", "");
  setLs("chatClear", "");
};
