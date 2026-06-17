const USER_KEY = "snowremovalUser";

export type CurrentUser = {
  id: string;
  name: string;
  workerRef: string[];
};

export const storeCurrentUser = (user: CurrentUser) => {
  localStorage.removeItem("loggedInUser");
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = () => {
  const rawUserData = localStorage.getItem(USER_KEY);
  let name: string | null = null;
  let userId: string[] | null = null;

  try {
    if (rawUserData) {
      const userData = JSON.parse(rawUserData) as CurrentUser;
      name = userData.name;
      userId = userData.workerRef;
    }
  } catch (error) {
    clearCurrentUser();
    console.error("Failed to parse current user data.", error);
  }

  return { name, userId };
};
