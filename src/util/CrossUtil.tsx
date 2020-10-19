export const setLs = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
  return value
};

export const getLs = (key: string) => {
  return window.localStorage.getItem(key);
};

export const getUserLs = () => {
  const currentUser: any = getLs("user");
  const defaultUser = {
    defaultParam: {
      clearTime: 0,
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

export const getChatClear = () => {
  let chatClearLs = getLs("chatClear");
  if (!chatClearLs) {
    const user = getUserLs();
    chatClearLs = (Math.floor(Number(user.chatClear) / 1000)).toString()
    setLs("chatClear", chatClearLs);
  }
  return Number(chatClearLs);
};

export const getReadbleTime = (timeInSec: number) => {
  const seconds = timeInSec % 60;
  const minutes = Math.floor(timeInSec / 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export const resetLs = () => {
  setLs("user", "");
  setLs("chatWith", "");
  setLs("chatClear", "");
}