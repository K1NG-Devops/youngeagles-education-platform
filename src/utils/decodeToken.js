export const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decoded);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };