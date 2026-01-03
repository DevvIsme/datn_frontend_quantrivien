import { Student } from "../../interfaces/Student.interface";
import axiosInstance from "../../configs/axiosConfigs";

import "../../css/statusButton.css";
// @ts-ignore
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid";

import { useState } from "react";
import { Link } from "react-router-dom";

export default function StudentRow({
  student,
  stt,
  onDelete,
  onEdit,
}: {
  student: Student;
  stt: number;
  onDelete: (id: number) => void;
  onEdit: (student: Student) => void;
}) {
  const [status, setStatus] = useState<boolean>(student.status);

  // --- GIỮ NGUYÊN LOGIC ---
  const handleStatusChange = async (id: number) => {
    try {
      let newStatus = !status;
      const response = await axiosInstance.put(`/student/change_status/${id}`, {
        status: !status,
      });
      setStatus(newStatus);
      alert(response.data.data);
    } catch (error: any) {
      alert(error.response.data.error);
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      const isConfirmed = confirm(
        "Bạn có chắc chắn muốn xóa sinh viên này không?"
      );
      if (isConfirmed) {
        const response = await axiosInstance.delete(`/student/delete/${id}`);
        alert(response.data.data);
        onDelete(id);
      }
    } catch (error: any) {
      alert(error.response.data.error);
    }
  };

  // --- SỬA GIAO DIỆN: Badge to hơn ---
  const renderGender = (gender: string) => {
    // Tăng px-2 -> px-3, py-1, text-xs -> text-sm
    const baseClass = "px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full";

    if (gender === "male")
      return <span className={`${baseClass} bg-blue-100 text-blue-800`}>Nam</span>;
    if (gender === "female")
      return <span className={`${baseClass} bg-pink-100 text-pink-800`}>Nữ</span>;
    return <span className={`${baseClass} bg-gray-100 text-gray-800`}>Khác</span>;
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 last:border-b-0">
      {/* STT: Tăng size lên text-base */}
      <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600 text-center font-medium">
        {stt}
      </td>

      {/* Họ Tên: Tăng lên text-lg (18px) và font-bold */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="text-lg font-bold text-gray-900">{student.fullName}</div>
      </td>

      {/* Email: Tăng lên text-base */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="text-base text-gray-600">{student.email}</div>
      </td>

      {/* Giới tính */}
      <td className="px-6 py-5 whitespace-nowrap">
        {renderGender(student.gender)}
      </td>

      {/* Điện thoại: Tăng lên text-base */}
      <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600 font-medium">
        {student.phone || "---"}
      </td>

      {/* Ngày sinh: Tăng lên text-base */}
      <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600">
        {student.birthday ? new Date(student.birthday).toLocaleDateString("vi-VN") : "---"}
      </td>

      {/* Ngày tạo: Tăng lên text-base */}
      <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600 text-center">
        {new Date(student.createdAt).toLocaleDateString("vi-VN")}
      </td>

      {/* Hành động */}
      <td className="px-6 py-5 whitespace-nowrap text-center text-sm font-medium">
        <div className="flex justify-center space-x-4"> {/* Tăng khoảng cách nút space-x-3 -> space-x-4 */}
          <Link
            to={`/student/${student.id}`}
            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2.5 rounded-full transition-colors"
            title="Chi tiết"
          >
            {/* Tăng size icon h-4 -> h-5 */}
            <EyeIcon className="h-5 w-5" />
          </Link>

          <button
            className="text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 p-2.5 rounded-full transition-colors"
            onClick={() => onEdit(student)}
            title="Sửa"
          >
            <PencilIcon className="h-5 w-5" />
          </button>

          <button
            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2.5 rounded-full transition-colors"
            onClick={() => deleteStudent(student.id)}
            title="Xóa"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
} 