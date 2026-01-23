import { Link } from "react-router-dom";
import axiosInstance from "../../configs/axiosConfigs";
import { Exam } from "../../interfaces/Exam.interface";
// @ts-ignore
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid";

export default function IndexRow({
  exam,
  handleEdit,
  index,
}: {
  exam: Exam;
  handleEdit: (exam: Exam) => void;
  index: number;
}) {
  const handleDelete = async (id: string) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      const isConfirm = confirm("Bạn chắc chắn muốn xóa bài học này");
      if (!isConfirm) {
        return;
      }
      const response = await axiosInstance.delete(`/exam/delete/${id}`);
      alert(response.data.data);
      window.location.reload();
    } catch (error: any) {
      alert(error.response.data.error);
    }
  };

  const renderStatusBadge = (examItem: Exam) => {
    // Logic giữ nguyên, chỉ thay đổi class CSS
    if (examItem.status === 0) {
      return <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Ẩn</span>;
    }
    if (examItem.status === 2) {
      return <span className="bg-orange-100 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Đang khóa</span>;
    }

    const now = new Date().getTime();
    const start = examItem.start_date ? new Date(examItem.start_date).getTime() : null;
    const end = examItem.end_date ? new Date(examItem.end_date).getTime() : null;

    if (start && now < start) {
      return <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">Sắp diễn ra</span>;
    }

    if (end && now > end) {
      return <span className="bg-red-100 text-red-800 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">Đã kết thúc</span>;
    }

    return <span className="bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">Đang diễn ra</span>;
  }

  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors duration-150">
      {/* ID: Center, text-base */}
      <td className="px-6 py-4 text-center font-medium text-gray-900 text-base">
        {index}
      </td>

      {/* Tên: Left, Bold */}
      <td className="px-6 py-4 text-left font-bold text-gray-900 text-base">
        {exam.name}
      </td>

      {/* Chủ đề: Badge */}
      <td className="px-6 py-4 text-center">
        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-sm font-medium border border-blue-100">
          {exam.topic.name}
        </span>
      </td>

      {/* Ngày tạo: Small text */}
      <td className="px-6 py-4 text-center text-gray-600 text-sm">
        {exam.createdAt}
      </td>

      {/* Trạng thái */}
      <td className="px-6 py-4 text-center">
        {renderStatusBadge(exam)}
      </td>

      {/* Hành động */}
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center items-center space-x-2">
          <Link
            to={`/exam/${exam.id}`}
            className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-md transition-colors hover:bg-blue-100"
            title="Xem chi tiết"
          >
            <EyeIcon className="h-5 w-5" />
          </Link>

          {/* Nút Edit (Đang ẩn) - Giữ nguyên logic */}
          {/* <button
            className="text-yellow-600 hover:text-yellow-800 bg-yellow-50 p-2 rounded-md transition-colors hover:bg-yellow-100"
            onClick={() => handleEdit(exam)}
          >
            <PencilIcon className="h-5 w-5" />
          </button> */}

          <button
            className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-md transition-colors hover:bg-red-100"
            onClick={() => handleDelete(exam.id)}
            title="Xóa bài thi"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}