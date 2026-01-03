import { Course } from "../../interfaces/Course.interface";
import axiosInstance from "../../configs/axiosConfigs";
import "../../css/statusButton.css";
// @ts-ignore
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

export default function CourseRow({
  course,
  onDelete,
  handleEdit,
  index,
  onReload,
}: {
  course: Course;
  handleEdit: (id: string, slug: string) => void;
  onDelete: (id: string) => void;
  onReload: () => void;
  index: number
}) {
  console.log(course);

  // BADGE: Tăng lên text-base (14px) cho dễ đọc
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "hidden": return <span className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-full text-base font-medium">Đang ẩn</span>;
      case "locked": return <span className="bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-base font-medium">Đang khóa</span>;
      default: return <span className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full text-base font-medium">Hoạt động</span>;
    }
  }

  const deleteStudent = async (id: string) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      const isConfirmed = confirm("Bạn có chắc chắn muốn xóa khóa học này không?");
      if (isConfirmed) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await axiosInstance.delete(`/course/delete/${id}`);
        alert('Xóa khóa học thành công');
        onDelete(id);
        onReload();
      }
    } catch (error: any) {
      alert(error.response.data.error);
    }
  };

  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors duration-150">
      {/* ID: text-base (16px) */}
      <td className="px-6 py-4 text-center font-medium text-gray-900 text-base">
        {index}
      </td>

      {/* Tên khóa học: text-base (16px) & bold hơn */}
      <td className="px-6 py-4 text-left font-bold text-gray-900 text-base">
        {course.name}
      </td>

      {/* Danh mục: text-base (14px) */}
      <td className="px-6 py-4 text-center">
        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-base font-medium border border-blue-100">
          {course.topic?.name || "Chưa phân loại"}
        </span>
      </td>

      {/* Học viên: text-base */}
      <td className="px-6 py-4 text-center text-gray-700 font-medium text-base">
        {course.studentCount}
      </td>

      {/* Ngày tạo: Tăng lên text-base (14px) thay vì text-xs bé xíu */}
      <td className="px-6 py-4 text-center text-gray-600 text-base">
        {course.createdAt}
      </td>

      {/* Trạng thái */}
      <td className="px-6 py-4 text-center">
        {renderStatusBadge(course.status)}
      </td>

      {/* Hành động */}
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center items-center space-x-2">
          <Link
            to={`/course/${course.slug}`}
            className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-md transition-colors hover:bg-blue-100"
            title="Xem chi tiết"
          >
            {/* Icon to hơn một chút h-5 w-5 */}
            <EyeIcon className="h-5 w-5" />
          </Link>

          <button
            className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-md transition-colors hover:bg-red-100"
            onClick={() => deleteStudent(course.id)}
            title="Xóa khóa học"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}