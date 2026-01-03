import axiosInstance from "../../configs/axiosConfigs";
import { Lesson } from "../../interfaces/Lesson.interface";
import dayjs from "dayjs";
// @ts-ignore
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";

interface LessonRowProps {
  lesson: Lesson;
  index: number;
  handleEdit: (id: string) => void;
  onReload: () => void;
}

export default function LessonRow({
  lesson,
  index,
  handleEdit,
  onReload,
}: LessonRowProps) {

  const typeMap: Record<string, string> = {
    pdf: "Tài liệu (PDF)",
    upload_video: "Video (Upload)",
    video: "Youtube Video",
    text: "Tự nhập",
    file: "File khác",
  };

  // --- CẬP NHẬT MÀU SẮC KHÁC NHAU TẠI ĐÂY ---
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'video':          // Youtube -> Đỏ
        return 'bg-red-100 text-red-800 border-red-200';

      case 'upload_video':   // Video tải lên -> Tím (Purple)
        return 'bg-purple-100 text-purple-800 border-purple-200';

      case 'pdf':            // PDF -> Vàng cam (Amber)
        return 'bg-amber-100 text-amber-800 border-amber-200';

      case 'text':           // Text -> Xanh dương (Blue)
        return 'bg-blue-100 text-blue-800 border-blue-200';

      default:               // File khác -> Xám (Gray)
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      const isConfirm = confirm("Bạn chắc chắn muốn xóa bài học này khỏi khóa học?");
      if (!isConfirm) return;

      const response = await axiosInstance.delete(`/lesson/delete/${id}`);
      alert(response.data?.message || "Xóa bài học thành công!");
      onReload();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Có lỗi xảy ra khi xóa");
    }
  };
  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100">
      {/* 1. STT: To hơn và đậm hơn */}
      <td className="px-5 py-5 text-center text-lg font-semibold text-gray-600">
        {index}
      </td>

      {/* 2. Tên bài học: To (text-lg) và In đậm (font-bold) */}
      <td className="px-5 py-5 text-left text-lg font-bold text-gray-900 truncate" title={lesson.name}>
        {lesson.name}
      </td>

      {/* 3. Loại: Badge to hơn (text-sm, padding lớn hơn) */}
      <td className="px-5 py-5">
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${getTypeBadgeClass(lesson.type)} shadow-sm whitespace-nowrap`}>
          {typeMap[lesson.type] || lesson.type}
        </span>
      </td>

      {/* 4. Ngày tạo: Chữ thường (text-base) cho dễ đọc */}
      <td className="px-5 py-5 text-base text-gray-700 whitespace-nowrap ">
        {dayjs(lesson.createdAt).format("DD/MM/YYYY HH:mm")}
      </td>

      {/* 5. Hành động: Icon to hơn */}
      <td className="px-5 py-5 text-center">
        <div className="flex justify-center items-center space-x-3">
          <button
            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2.5 rounded-md transition-colors"
            onClick={() => handleEdit(lesson.id)}
            title="Sửa bài học"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2.5 rounded-md transition-colors"
            onClick={() => handleDelete(lesson.id)}
            title="Xóa bài học"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}