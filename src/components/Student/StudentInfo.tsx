import { Student } from "../../interfaces/Student.interface";

export default function StudentInfo({ student }: { student: Student }) {
  // Helper hiển thị giới tính
  const getGenderLabel = (g: string) => {
    if (g === "male") return "Nam";
    if (g === "female") return "Nữ";
    return "Khác";
  };

  // 👇 HÀM MỚI: Xử lý hiển thị Avatar (Cloudinary vs Local)
  const getAvatarSrc = (avatarName: string | undefined) => {
    if (!avatarName) return "https://via.placeholder.com/150";

    // Nếu là link Cloudinary (bắt đầu bằng http) -> Dùng luôn
    if (avatarName.startsWith("http")) {
      return avatarName;
    }

    // Nếu là ảnh cũ -> Nối domain server vào
    return `https://datn-backend-mjeb.onrender.com/public/avatars/${avatarName}`;
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6">

      {/* 1. Cột trái: Avatar + Tên + Email */}
      <div className="flex items-center gap-5 min-w-[300px]">
        <div className="relative">
          {/* 👇 SỬA LẠI SRC Ở ĐÂY */}
          <img
            src={getAvatarSrc(student.avatar)}
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
            alt={`${student.fullName}'s avatar`}
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow-sm"
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800">{student.fullName}</h2>
          <p className="text-gray-500 font-medium">{student.email}</p>
          <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
            Học viên
          </span>
        </div>
      </div>

      {/* Đường kẻ dọc ngăn cách trên Desktop */}
      <div className="hidden md:block w-px h-16 bg-gray-200 mx-4"></div>

      {/* 2. Cột phải: Thông tin chi tiết */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full">
        <InfoItem
          label="Ngày sinh"
          value={student.birthday ? new Date(student.birthday).toLocaleDateString("vi-VN") : "---"}
        />
        <InfoItem
          label="Số điện thoại"
          value={student.phone || "Chưa cập nhật"}
        />
        <InfoItem
          label="Giới tính"
          value={getGenderLabel(student.gender)}
        />
        <InfoItem
          label="Ngày tham gia"
          value={student.createdAt ? new Date(student.createdAt).toLocaleDateString("vi-VN") : "---"}
        />
      </div>
    </div>
  );
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">
      {label}
    </span>
    <span className="text-gray-700 font-medium text-sm">
      {value}
    </span>
  </div>
);