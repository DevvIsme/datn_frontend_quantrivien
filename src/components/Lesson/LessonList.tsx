import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import LoadingSpinner from "../Loading";
import LessonRow from "./Lesson.row";
import { Lesson, LessonListProps } from "../../interfaces/Lesson.interface";
import Modal from "../Modal";
import SelectLessonForm from "./SelectLessonForm"; // <--- Import component mới
import EditLessonForm from "./EditLessonForm";
import { Course } from "../../interfaces/Course.interface";

const LessonList: React.FC<LessonListProps> = ({
  course,
}: {
  course: Course;
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  // 1. Định nghĩa hàm fetch data riêng để tái sử dụng
  const fetchLessons = useCallback(async () => {
    if (!course.slug) return;
    try {
      // setLoading(true); // Tùy chọn: có thể bỏ để đỡ nháy màn hình khi reload ngầm
      const response = await axiosInstance.get(
        `/material/list-lesson/${course.slug}`
      );
      // Lưu ý: Check cấu trúc data trả về từ API ListLesson bạn vừa sửa
      setLessons(response.data.data.lessons || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [course.slug]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 2. Sửa hàm này: Gọi Form chọn bài học
  const handleAddLesson = () => {
    setModalTitle("Chọn bài học vào khóa học");
    setModalContent(
      <SelectLessonForm
        courseId={Number(course.id)} // Truyền ID khóa học vào
        onClose={closeModal}
        onReload={fetchLessons} // Truyền hàm fetch để reload list sau khi thêm
      />
    );
    setIsModalOpen(true);
  };

  const handleEditLesson = (lessonId: string) => {
    setModalTitle("Sửa thông tin bài học!");
    setModalContent(
      <EditLessonForm
        lessonId={lessonId}
        onClose={closeModal}
        onReload={fetchLessons} // Truyền fetchLessons thay vì closeModal
      />
    );
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          Tổng số bài học: <span className="text-blue-600">{lessons.length}</span>
        </h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
          onClick={handleAddLesson}
        >
          <span>+</span> Thêm bài học từ thư viện
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>

      {loading ? (
        <div className="flex justify-center h-40 items-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded border border-red-200">{error}</div>
      ) : lessons.length > 0 ? (
        // --- BẮT ĐẦU PHẦN TABLE ĐÃ CSS LẠI ---
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
  {/* QUAN TRỌNG: Thêm 'table-fixed' để khóa cứng độ rộng cột */}
  <table className="w-full table-fixed text-base text-left text-gray-700">
    <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
      <tr>
        {/* 1. STT: Cố định 60px */}
        <th scope="col" className="px-4 py-3 w-[60px] text-center font-bold">
          STT
        </th>

        {/* 2. Tên bài học: Không set width, nó sẽ chiếm hết phần còn lại */}
        <th scope="col" className="px-4 py-3 text-left font-bold">
          Tên bài học
        </th>

        {/* 3. Loại: Cố định 160px (đủ cho badge dài nhất) */}
        <th scope="col" className="px-4 py-3 w-[160px] text-center font-bold">
          Loại
        </th>

        {/* 4. Ngày tạo: Cố định 160px */}
        <th scope="col" className="px-4 py-3 w-[160px] text-center font-bold">
          Ngày tạo
        </th>

        {/* 5. Hành động: Cố định 120px */}
        <th scope="col" className="px-4 py-3 w-[120px] text-center font-bold">
          Hành động
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {lessons.map((lesson: Lesson, index: number) => (
        <LessonRow
          key={lesson.id}
          index={index}
          lesson={lesson}
          handleEdit={handleEditLesson}
          onReload={fetchLessons}
        />
      ))}
    </tbody>
  </table>
</div>
        // --- KẾT THÚC PHẦN TABLE ---
      ) : (
        <div className="text-gray-500 italic mt-8 text-center border-2 border-dashed border-gray-300 p-8 rounded-lg bg-gray-50">
          Chưa có bài học nào trong khóa này. Hãy thêm bài học ngay!
        </div>
      )}
    </div>
  );
};

export default LessonList;