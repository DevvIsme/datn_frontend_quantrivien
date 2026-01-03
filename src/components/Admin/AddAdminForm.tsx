import { useState } from "react";
// import { adminSchema } from "../../interfaces/Admin.interface"; // Cần update schema này nếu nó validate permission
import axiosInstance from "../../configs/axiosConfigs";

export default function AddAdminForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("1"); // Mặc định 1: Normal Admin
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Bỏ qua validate permission cũ của zod schema nếu có, hoặc update lại schema sau.

    try {
      const response = await axiosInstance.post("/admin/create/", {
        fullName,
        email,
        password,
        role, // Gửi role lên
      });
      alert(response.data.data);
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data || "Có lỗi xảy ra");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white">
      <div className="space-y-5">

        {/* Họ Tên */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Họ Tên</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Nhập họ và tên..."
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="example@domain.com"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Vai trò */}
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
            {/* Custom Arrow Icon */}
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
          Thêm Quản trị viên
        </button>
      </div>
    </form>
  );
}