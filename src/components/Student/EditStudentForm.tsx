import React, { useState, useEffect } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import { Student } from "../../interfaces/Student.interface";

interface EditStudentFormProps {
    student: Student;
    onClose: () => void;
    onRefresh: () => void;
}

export default function EditStudentForm({ student, onClose, onRefresh }: EditStudentFormProps) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthday, setBirthday] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("male");
    const [avatar, setAvatar] = useState<File | null>(null);

    // Hàm xử lý link ảnh thông minh (Cloudinary vs Local)
    const getAvatarSrc = (avatarName: string | undefined) => {
        if (!avatarName) return "https://via.placeholder.com/150";
        // Nếu là link Cloudinary (bắt đầu bằng http)
        if (avatarName.startsWith("http")) {
            return avatarName;
        }
        // Nếu là ảnh cũ lưu trên server (sửa lại domain cho đúng với server Render của bạn)
        return `https://datn-backend-mjeb.onrender.com/public/avatars/${avatarName}`;
    };

    useEffect(() => {
        if (student) {
            setFullName(student.fullName || "");
            setEmail(student.email || "");
            let formattedBirthday = "";
            if (student.birthday) {
                const dateObj = new Date(student.birthday);
                if (!isNaN(dateObj.getTime())) {
                    try {
                        formattedBirthday = dateObj.toISOString().split("T")[0];
                    } catch (e) {
                        console.error("Lỗi format ngày:", e);
                    }
                }
            }
            setBirthday(formattedBirthday);
            setPhone(student.phone || "");
            setGender(student.gender || "male");
        }
    }, [student]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.confirm("Bạn có chắc chắn muốn lưu thay đổi?")) return;

        try {
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("birthday", birthday);
            formData.append("phone", phone);
            formData.append("gender", gender);

            // Chỉ gửi password nếu người dùng nhập mới
            if (password) formData.append("password", password);

            // Chỉ gửi avatar nếu người dùng chọn file mới
            if (avatar) formData.append("avatar", avatar);

            await axiosInstance.put(`/student/update/${student.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Cập nhật thông tin thành công!");
            onClose();
            onRefresh();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Lỗi khi cập nhật sinh viên";
            alert(msg);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAvatar(file);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex gap-6 flex-col md:flex-row">

                {/* Cột trái: Avatar */}
                <div className="w-full md:w-1/3 flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <div className="relative group">
                        {avatar ? (
                            // Ảnh preview khi vừa chọn file mới
                            <img
                                src={URL.createObjectURL(avatar)}
                                alt="New Avatar"
                                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
                            />
                        ) : (
                            // Ảnh hiện tại (Dùng hàm getAvatarSrc để xử lý link)
                            <img
                                src={getAvatarSrc(student.avatar)}
                                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
                                alt="Current Avatar"
                                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
                            />
                        )}
                    </div>

                    <div className="w-full">
                        <label className="block text-center text-sm font-medium text-blue-600 cursor-pointer hover:underline mb-2">
                            Thay đổi ảnh
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-gray-400 text-center">Hỗ trợ .jpg, .png</p>
                    </div>
                </div>

                {/* Cột phải: Thông tin */}
                <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Họ tên</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Ngày sinh</label>
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Giới tính</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Số điện thoại</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Mật khẩu mới</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Để trống nếu không đổi"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">
                    Hủy
                </button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition">
                    Lưu thay đổi
                </button>
            </div>
        </form>
    );
}