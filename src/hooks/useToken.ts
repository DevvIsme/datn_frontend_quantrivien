import { useCookies } from "react-cookie";

export const useAuthCookies = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "accessToken",
    "refreshToken",
  ]);

  const setAuthTokens = (accessToken: string, refreshToken: string) => {
    setCookie("accessToken", accessToken, {
      path: "/",
      maxAge: 60 * 5,
    }); // Expires in 5 mins
    setCookie("refreshToken", refreshToken, {
      path: "/",
      maxAge: 60 * 60 * 24,
    }); // Expires in 1 days
  };

  const getAccessToken = () => {
    return cookies.accessToken;
  };

  const getRefreshToken = () => {
    return cookies.refreshToken;
  };

  const clearAuthTokens = () => {
    removeCookie("accessToken", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
  };
  return {
    cookies,
    setAuthTokens,
    clearAuthTokens,
    getAccessToken,
    getRefreshToken,
  };
};
