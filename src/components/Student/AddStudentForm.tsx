import React, { useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";

interface AddStudentFormProps {
  onClose: () => void;
  onRefresh: () => void;
}

export default function AddStudentForm({ onClose, onRefresh }: AddStudentFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [birthday, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Xác nhận thêm sinh viên!")) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("birthday", birthday);
      formData.append("phone", phone);
      formData.append("gender", gender);
      if (avatar) formData.append("avatar", avatar);

      // Gửi request
      await axiosInstance.post(`/student/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Thêm sinh viên thành công");
      onClose();
      onRefresh();
    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Lỗi khi thêm sinh viên");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột 1 */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Họ và Tên <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
              placeholder="Nhập họ tên..."
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Mật khẩu <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
              placeholder="••••••"
            />
          </div>
        </div>

        {/* Cột 2 */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Ngày sinh <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="^[0-9]{9,11}$"
                placeholder="09xx..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-white"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Avatar Preview Section */}
      {avatar && (
        <div className="flex justify-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Xem trước ảnh</p>
            <img
              src={URL.createObjectURL(avatar)}
              alt="Avatar Preview"
              className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md mx-auto"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transition transform active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "Đang lưu..." : "Thêm mới"}
        </button>
      </div>
    </form>
  );
}