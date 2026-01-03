import { useEffect, useState } from "react";
import { Student } from "../../../interfaces/Student.interface";
import { Course } from "../../../interfaces/Course.interface";
import SearchAndLimit from "../../SearchInput";
import Modal from "../../Modal";
import AddToCourseForm from "./AddStudentToCourse";
import axiosInstance from "../../../configs/axiosConfigs";
import Pagination from "../../Pagination";
import * as XLSX from "xlsx";

export default function StudentList({ course }: { course: Course }) {
  const [list, setList] = useState<Student[]>([]);
  const [limit, setLimit] = useState(5);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get(
        `/course/list-student/${course.id}`,
        {
          params: {
            limit ,
            page,
            key_name: search,
          },
        }
      );
      let data = response.data.data;
      setList(data.students); // sửa 'stundents' thành 'students'
      setTotalStudents(data.count);
      let ttPage = Math.ceil(data.count / limit);
      setTotalPages(ttPage);
    } catch (error: any) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, search]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleAddStudent = () => {
    setIsModalOpen(true);
  };

  // --- MỚI: Hàm xử lý xuất Excel ---
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);

      // Gọi API lấy dữ liệu (limit lớn để lấy hết)
      const response = await axiosInstance.get(
        `/course/list-student/${course.id}`,
        {
          params: { limit: 1000, page: 1, key_name: search },
        }
      );

      // Lấy dữ liệu an toàn (tránh lỗi undefined)
      const resData = response.data.data || response.data;
      const students = resData.students || [];
      const all_lessons = resData.all_lessons || []; // Danh sách các cột bài học

      if (students.length === 0) {
        alert("Không có dữ liệu để xuất!");
        setIsExporting(false);
        return;
      }

      // Xử lý từng dòng dữ liệu
      const excelData = students.map((std: any) => {
        // 1. Các cột cố định
        const row: any = {
          "ID": std.id,
          "Họ và Tên": std.fullName,
          "Email": std.email,
          "Ngày tham gia": std.createdAt ? new Date(std.createdAt).toLocaleDateString('vi-VN') : "",
          "Tiến trình": `${std.process}%`, // Cột tiến trình tổng quan
        };

        // 2. Tạo các cột bài học ĐỘNG (Matrix)
        if (all_lessons.length > 0) {
          all_lessons.forEach((lesson: any) => {
            // Kiểm tra xem ID bài học có nằm trong danh sách đã học của User không
            const completedIds = std.completed_lesson_ids || [];
            const isCompleted = completedIds.includes(lesson.id);

            // Tên cột là Tên bài học. Giá trị là "v" nếu đã học, ngược lại để trống
            row[lesson.name] = isCompleted ? "v" : "";
          });
        }

        return row;
      });

      // Tạo file Excel
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Chỉnh độ rộng cột cho đẹp
      const wscols = [
        { wch: 5 },  // ID
        { wch: 20 }, // Tên
        { wch: 25 }, // Email
        { wch: 15 }, // Ngày
        { wch: 10 }, // Tiến trình
      ];
      worksheet['!cols'] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "TienDoChiTiet");
      XLSX.writeFile(workbook, `TienDo_${course.id}.xlsx`);

    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      alert("Có lỗi khi xuất file. Kiểm tra lại Backend đã trả về all_lessons chưa.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-h-[410px] overflow-y-scroll">
      <h1 className="mb-2 font-bold text-xl">
        Tổng số học viên : {totalStudents}
      </h1>
      <div className="flex items-center justify-between">
        <SearchAndLimit
          search={search}
          setSearch={setSearch}
          limit={limit}
          setLimit={setLimit}
        />

        <div className="mb-4 flex gap-2">
          <button
            className={`px-4 py-2 rounded text-white flex items-center gap-2 ${isExporting
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
              }`}
            onClick={handleExportExcel}
            disabled={isExporting}
          >
            {isExporting ? "Đang xuất..." : "Xuất Excel"}
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAddStudent} // Thêm sự kiện mở modal
          >
            Thêm Sinh viên
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={"Thêm sinh viên vào khóa học"}
      >
        <AddToCourseForm course={course} onClose={closeModal} />
      </Modal>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Họ Tên</th>
            <th className="px-4 py-2 border">Tiến trình học</th>
            <th className="px-4 py-2 border">Ngày tham gia</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item: any) => (
            <tr key={item.id}>
              <td className="px-4 py-1 border text-center">{item.id}</td>
              <td className="px-4 py-1 border text-left">{item.fullName}</td>
              <td className="px-4 py-1 border text-left">{item.process}</td>
              <td className="px-4 py-1 border text-left">{item.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={page}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
}
