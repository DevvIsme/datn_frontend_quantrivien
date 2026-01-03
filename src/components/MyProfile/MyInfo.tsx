import { useState } from "react";
import { useUser } from "../../hooks/UserContext";
import axiosInstance from "../../configs/axiosConfigs";

export default function PersonalInfoForm() {
  const { user } = useUser() as any;
  const [email, setEmail] = useState<string>(user.email);

  // Hàm helper để lấy thông tin hiển thị (Tên + Màu) dựa trên role
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "super_admin":
        return {
          label: "Quản trị viên",
          colorClass: "bg-purple-100 text-purple-800 border border-purple-200", // Màu Tím
        };
      case "normal_admin":
        return {
          label: "Giáo viên",
          colorClass: "bg-blue-100 text-blue-800 border border-blue-200", // Màu Xanh
        };
      default:
        return {
          label: role, // Fallback nếu có role lạ
          colorClass: "bg-gray-100 text-gray-800",
        };
    }
  };

  const roleInfo = getRoleDisplay(user.role);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/admin/my-info/update`, {
        email,
      });
      alert(response.data.data.message);
    } catch (error: any) {
      alert("Có lỗi xảy ra, thay đổi thông tin không thành công!");
    }
  };

  return (
    <div className="space-y-8">
      {/* Thông tin cơ bản */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
            Tên hiển thị
          </label>
          <p className="text-lg font-semibold text-gray-900">{user.fullName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
            Vai trò hệ thống
          </label>
          {/* Hiển thị Badge với màu sắc động */}
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${roleInfo.colorClass}`}
          >
            {roleInfo.label}
          </span>
        </div>
      </div>

      {/* Form cập nhật Email */}
      <form onSubmit={handleEmailChange} className="max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cập nhật Email
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            required
            placeholder="nhập email mới..."
          />
          <button
            type="submit"
            className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}