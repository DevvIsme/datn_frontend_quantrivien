/* eslint-disable no-restricted-globals */
import { useState } from "react";
import { Admin } from "../../interfaces/Admin.interface";
import axiosInstance from "../../configs/axiosConfigs";

export default function UpdatePermissionForm({ admin }: { admin: Admin }) {
  // Convert role string từ API ("super_admin" / "normal_admin") về value số ("2" / "1")
  const initialRoleValue = admin.role === "super_admin" ? "2" : "1";
  const [role, setRole] = useState<string>(initialRoleValue);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const isConfirm = confirm("Xác nhận thay đổi vai trò?");
      if (!isConfirm) return;

      const response = await axiosInstance.put(
        `/admin/update-role/${admin.id}`, // Gọi route mới
        { role }
      );
      alert(response.data.data); // Hoặc response.data
      window.location.reload();
    } catch (error: any) {
      alert("Lỗi cập nhật");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white">
      <div className="space-y-5">

        {/* Họ Tên (Disabled) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Họ Tên</label>
          <input
            type="text"
            value={admin.fullName}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Email (Disabled) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={admin.email}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Vai trò (Select) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Vai trò
          </label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="1">Giảng viên</option>
              <option value="2">Quản trị viên</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cập nhật Vai trò
        </button>
      </div>
    </form>
  );
}