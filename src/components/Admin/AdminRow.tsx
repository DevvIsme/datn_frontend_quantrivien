/* eslint-disable no-restricted-globals */
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import { Admin } from "../../interfaces/Admin.interface";
import axiosInstance from "../../configs/axiosConfigs";

export default function AdminRow({
  admin,
  onUpdate,
}: {
  admin: Admin;
  onUpdate: (admin: Admin) => void;
}) {

  const handleDelete = async (id: string) => {
    // ... (Giữ nguyên logic delete)
    try {
      const isConfirm = confirm("Xác nhận xóa quản trị viên này ?");
      if (!isConfirm) return;

      const response = await axiosInstance.delete(`/admin/delete/${admin.id}`);
      alert(response.data.data || "Xóa thành công");
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <tr key={admin.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
      <td className="px-6 py-4 whitespace-nowrap text-center text-base text-gray-500 font-mono">
        #{admin.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
        {admin.fullName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
        {admin.email}
      </td>

      {/* Hiển thị Role với Badge màu cho đẹp */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${admin.role === "super_admin"
            ? "bg-purple-50 text-purple-700 border-purple-200" // Màu cho Quản trị viên
            : "bg-blue-50 text-blue-700 border-blue-200"     // Màu cho Giảng viên
            }`}
        >
          {admin.role === "super_admin" ? "Quản trị viên" : "Giảng viên"}
        </span>
      </td>

      {/* Cột Quyền hạn cũ đã bỏ, không render nữa */}

      <td className="px-6 py-4 whitespace-nowrap text-center text-base font-medium">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onUpdate(admin)}
            className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
            title="Sửa vai trò"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
            onClick={() => handleDelete(admin.id.toString())} // cast to string if needed
            title="Xóa"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}