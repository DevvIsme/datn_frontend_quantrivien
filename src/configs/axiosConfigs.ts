import axios from "axios";
import { Cookies } from "react-cookie";
import { api_url } from "./environments";

const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: `${api_url}/api`, // Thay đổi thành URL API của bạn
  timeout: 10000, // Thời gian timeout cho yêu cầu
});

// Hàm renewToken sẽ gọi API để làm mới token
const renewToken = async () => {
  try {
    const refreshToken = cookies.get("refreshToken"); // Lấy refreshToken từ cookie
    if (refreshToken) {
      const response = await axios.post(`${api_url}/api/auth/refresh`, {
        refreshToken,
      }); 
      console.log(refreshToken);
      console.log(response);
      
      // Gọi API để làm mới token
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      // Giả sử API trả về accessToken và refreshToken mới
      console.log(newRefreshToken);

      cookies.set("accessToken", accessToken, {
        path: "/",
        maxAge: 60 * 5,
      }); // Lưu accessToken mới vào cookie
      cookies.set("refreshToken", newRefreshToken, {
        path: "/",
        maxAge: 60 * 60 * 24,
      }); // Lưu refreshToken mới vào cookie
      return accessToken; // Trả về accessToken mới
    }
    return null; // Không có refreshToken
  } catch (error) {
    cookies.remove("refreshToken");
    return null; // Nếu có lỗi xảy ra
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = cookies.get("accessToken"); // Lấy accessToken từ cookie
    if (!accessToken) {
      // Nếu không có accessToken, kiểm tra refreshToken
      accessToken = await renewToken(); // Gọi hàm renewToken
    }

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`; // Thêm token vào header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
