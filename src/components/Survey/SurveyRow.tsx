/* eslint-disable no-restricted-globals */
import { useState } from "react";
import { EyeIcon, TrashIcon, PencilIcon } from "@heroicons/react/solid";
import { Survey } from "../../interfaces/Survey.interface";
import { Link } from "react-router-dom";
import axiosInstance from "../../configs/axiosConfigs";

export default function SurveyRow({ survey, index }: { survey: Survey, index: number }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  // --- LOGIC GIỮ NGUYÊN ---
  const handleDelete = async (id: number | string) => {
    try {
      const isConfirm = confirm("Xác nhận xóa bài khảo sát này ?");
      if (!isConfirm) return;
      const response = await axiosInstance.delete(`/survey/delete/${id}`);
      alert(response.data.data || "Xóa thành công");
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const safeRenderDate = (dateString: any) => {
    try {
      if (!dateString) return "Invalid Date";
      if (typeof dateString === 'string' && dateString.includes(' : ')) {
        const parts = dateString.split(' : ');
        const d = parts[0].split('/');
        const t = parts[1].split(':');
        const dateObj = new Date(Number(d[2]), Number(d[1]) - 1, Number(d[0]), Number(t[0]), Number(t[1]), Number(t[2]));
        return dateObj.toLocaleString('vi-VN');
      }
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString('vi-VN');
    } catch (e) {
      return "Lỗi ngày tháng";
    }
  };

  // Logic hiển thị trạng thái (Chỉ style lại CSS Class, giữ nguyên logic if/else)
  const renderStatus = (status: string, dueAt: string | Date) => {
    const now = new Date();
    const endDate = new Date(dueAt);

    // Base style cho badge trạng thái
    const badgeStyle = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";

    if (now > endDate && status !== 'hidden') {
      return (
        <span className={`${badgeStyle} bg-orange-50 text-orange-700 ring-orange-600/20`}>
          Đã hết hạn
        </span>
      );
    }
    switch (status) {
      case "hidden":
        return (
          <span className={`${badgeStyle} bg-gray-50 text-gray-600 ring-gray-500/10`}>
            Ẩn
          </span>
        );
      case "locked":
        return (
          <span className={`${badgeStyle} bg-red-50 text-red-700 ring-red-600/10`}>
            Khóa
          </span>
        );
      default:
        return (
          <span className={`${badgeStyle} bg-green-50 text-green-700 ring-green-600/20`}>
            Hoạt động
          </span>
        );
    }
  };

  // --- GIAO DIỆN MỚI ---
  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors duration-200">
        {/* ID */}
        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500 font-mono">
          {index}
        </td>

        {/* Name */}
        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
          {survey.name}
        </td>

        {/* Status */}
        <td className="px-6 py-4 whitespace-nowrap">
          {renderStatus((survey as any).status || 'active', survey.dueAt)}
        </td>

        {/* Participated */}
        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
          {/* Hiển thị số lượng nổi bật hơn chút */}
          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {survey.participated}
          </span>
        </td>

        {/* Due Date */}
        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
          {safeRenderDate(survey.dueAt)}
        </td>

        {/* Created Date */}
        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
          {new Date(survey.createdAt).toLocaleDateString('vi-VN')}
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap font-medium">
          <div className="flex gap-2">
            <Link to={`/survey/${survey.slug}`} title="Xem chi tiết">
              <button className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-all">
                <EyeIcon className="h-5 w-5" />
              </button>
            </Link>

            <button
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-all"
              onClick={() => handleDelete(survey.id)}
              title="Xóa"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}