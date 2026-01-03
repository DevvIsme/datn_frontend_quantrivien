import { useEffect, useState } from "react";
import axiosInstance from "../../../configs/axiosConfigs";
import SearchAndLimit from "../../SearchInput";
import Pagination from "../../Pagination";
import { Course } from "../../../interfaces/Course.interface";

interface Student {
  id: number;
  fullName: string;
}

export default function AddToCourseForm({
  course,
  onClose,
}: {
  course: Course;
  onClose: () => void;
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [search, setSearch] = useState<string>(""); // Biến state cho tìm kiếm
  const [limit, setLimit] = useState<number>(5); // Biến state cho số lượng mỗi trang
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại

  // Fetch danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get("/student/list");
      const data = response.data.data.students;

      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.log("Error fetching students:", error);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Hàm xử lý khi nhấn vào sinh viên
  const handleSelectStudent = (id: number) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((studentId) => studentId !== id)
        : [...prevSelected, id]
    );
  };

  // Hàm lọc sinh viên dựa trên tìm kiếm
  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // Hàm phân trang
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // Tổng số trang
  const totalPages = Math.ceil(filteredStudents.length / limit);

  // Submit mảng sinh viên đã chọn
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log(selectedStudents);

      await axiosInstance.post(`/course/add-student/${course.id}`, {
        list_student: selectedStudents,
      });
      alert("Thêm sinh viên vào khóa học thành công!");
      window.location.reload();
    } catch (error: any) {
      console.log("Error submitting students:", error);
      alert(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-bold mb-2">Chọn sinh viên để thêm vào khóa học</h3>

      {/* Tìm kiếm và chọn số lượng mỗi trang */}
      <SearchAndLimit
        search={search}
        setSearch={setSearch}
        limit={limit}
        setLimit={setLimit}
      />

      <table className="min-w-full border-collapse table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Chọn</th>
            <th className="border px-4 py-2">Tên sinh viên</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStudents.map((student) => (
            <tr key={student.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  value={student.id}
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleSelectStudent(student.id)}
                />
              </td>
              <td className="border px-4 py-2">{student.fullName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Thêm sinh viên
      </button>
    </form>
  );
}
