export const authorizeUser = () => {
  const currentUser: any = window.localStorage.getItem("user");
  return Boolean(currentUser);
};

export const getChatClear = () => {
  const currentUser: any = window.localStorage.getItem("user");
  const chatClear = currentUser
    ? Math.floor(
        300000 + Number(JSON.parse(currentUser).chatClear - Date.now()) / 1000
      ) % 300
    : 0;
  return chatClear;
};

export const getReadbleTime = (timeInSec: number) => {
  const seconds = timeInSec % 60;
  const minutes = Math.floor(timeInSec / 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};
