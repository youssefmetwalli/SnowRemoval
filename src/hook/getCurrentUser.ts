export const getCurrentUser = () => {
      const rawUserData = localStorage.getItem("loggedInUser");
      let name: string | null = null;
      let userId: string[] | null = null;
      try {
        if (rawUserData) {
          const userData = JSON.parse(rawUserData);
          name = userData?.field_1754549790;
          userId = userData?.field_1754635302;
        }
      } catch (error) {
        console.error("Failed to parse JSON from localStrage.", error);
      }
      return {name, userId};
}