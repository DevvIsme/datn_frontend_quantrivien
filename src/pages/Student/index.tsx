import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/Loading";
import axiosInstance from "../../configs/axiosConfigs";
import { Student } from "../../interfaces/Student.interface";
import Pagination from "../../components/Pagination";
import StudentRow from "../../components/Student/student.row";
import SearchAndLimit from "../../components/SearchInput";
import Modal from "../../components/Modal"; // Import Modal component
import AddStudentForm from "../../components/Student/AddStudentForm"; // Import AddStudentForm
import AddByExcelForm from "../../components/Student/AddByExcelForm"; // Import AddByExcelForm
import EditStudentForm from "../../components/Student/EditStudentForm"; // import


export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/student/list", {
        params: {
          limit,
          page,
          key_name: search,
        },
      });
      setStudents(response.data.data.students);
      setTotalStudents(response.data.data.count);
      let ttPage = Math.ceil(response.data.data.count / limit);
      setTotalPages(ttPage);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = (id: number) => {
    setTotalStudents(totalStudents - 1);
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== id)
    );
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

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleImportFromFile = () => {
    setModalTitle("Nhập dữ liệu từ file Excel");
    // Truyền onRefresh để sau khi import xong thì reload lại bảng
    setModalContent(<AddByExcelForm onClose={closeModal} onRefresh={fetchStudents} />);
    setIsModalOpen(true);
  };
  const handleAddStudent = () => {
    setModalTitle("Thêm Sinh viên");
    setModalContent(<AddStudentForm 
      onClose={closeModal}
       onRefresh={fetchStudents} />);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setModalTitle("Chỉnh sửa Sinh viên");
    setModalContent(
      <EditStudentForm
        student={student}
        onClose={closeModal}
        onRefresh={fetchStudents}
      />
    );
    setIsModalOpen(true);
  };
  return (
    <div className="flex flex-1 flex-col p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Học viên</h1>
        <p className="text-gray-500 mt-1">Tổng số: {totalStudents} học viên</p>
      </div>

      {/* Toolbar: Search & Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <SearchAndLimit
          search={search}
          setSearch={setSearch}
          limit={limit}
          setLimit={setLimit}
        />

        <div className="flex gap-3">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all text-sm font-medium flex items-center"
            onClick={handleAddStudent}
          >
            + Thêm mới
          </button>

          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all text-sm font-medium flex items-center"
            onClick={handleImportFromFile}
          >
            Nhập Excel
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>

      {/* Table Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Họ Tên
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giới tính
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Điện thoại
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày sinh
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <StudentRow
                    key={student.id}
                    stt={(page - 1) * limit + index + 1}
                    student={student}
                    onDelete={handleDeleteStudent}
                    onEdit={handleEditStudent}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={page}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
