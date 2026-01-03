import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../configs/axiosConfigs";
import { passwordSchema } from "../../interfaces/Admin.interface";

export default function NewPassword() {
  const { string: token } = useParams(); // Lấy token từ URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Track trạng thái loading của API

  useEffect(() => {
    // Kiểm tra tính hợp lệ của token khi component được render
    const checkToken = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/forgot-password/${token}`
        );
        if (response.status !== 200) {
          navigate("/auth/forgot-password"); // Redirect nếu token không hợp lệ
        }
        console.log(response);
      } catch (err) {
        console.error(err);
        navigate("/auth/forgot-password"); // Redirect nếu có lỗi
      } finally {
        setLoading(false); // Dừng loading sau khi kiểm tra xong
      }
    };

    checkToken();
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      passwordSchema.parse(password); // Validate mật khẩu
    } catch (zodError: any) {
      const firstError = zodError.errors[0]?.message || "Invalid password"; // Lấy lỗi đầu tiên từ Zod
      setError(firstError);
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/admin/forgot-password/${token}`,
        {
          new_password: password,
          confirm_password: confirmPassword,
        }
      );

      if (response.status === 200) {
        alert("Thay đổi mật khẩu thành công!");
        navigate("/auth/login"); // Redirect sau khi đổi mật khẩu thành công
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err); // Log lỗi để debug
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Hiển thị loading trong lúc kiểm tra token
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Change Password
        </button>
      </form>
    </>
  );
}
