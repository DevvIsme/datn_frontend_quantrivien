import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axiosInstance from "../configs/axiosConfigs";
import { api_url } from "../configs/environments";
import LoadingSpinner from "../components/Loading"; // Đảm bảo bạn đã tạo component LoadingSpinner
import { useAuthCookies } from "./useToken";

export interface User {
  fullName: string;
  email: string;
  course_permission: boolean;
  student_permission: boolean;
  exam_permission: boolean;
  role: "normal_admin" | "super_admin";
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUserInfo: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { clearAuthTokens } = useAuthCookies();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading

  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get(`${api_url}/api/admin/my-info`);
      setUser(response.data.data);
    } catch (error) {
      clearAuthTokens();
      console.error("Failed to fetch user info", error);
    } finally {
      setLoading(false); // Đảm bảo set loading là false sau khi fetch xong
    }
  };

  useEffect(() => {
    fetchUserInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <LoadingSpinner />; // Hiển thị spinner khi loading
  }

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
