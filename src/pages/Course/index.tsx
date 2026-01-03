import { useEffect, useState } from "react";
import { Course } from "../../interfaces/Course.interface";
import Pagination from "../../components/Pagination";
import SearchAndLimit from "../../components/SearchInput";
import Modal from "../../components/Modal";
import LoadingSpinner from "../../components/Loading";
import CourseRow from "../../components/Course/Course.row";
import axiosInstance from "../../configs/axiosConfigs";
import AddCourseForm from "../../components/Course/AddCourseForm";
import EditCourseForm from "../../components/Course/EditCourseForm";

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/course/list", {
        params: {
          limit,
          page,
          key_name: search,
        },
      });
      setCourses(response.data.data.courses);
      setTotalCourses(response.data.data.count);
      let ttPage = Math.ceil(response.data.data.count / limit);
      setTotalPages(ttPage);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, search]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const handleDeleteCourse = (id: string) => {
    setTotalCourses(totalCourses - 1);
    setCourses((prevCourses) =>
      prevCourses.filter((Course) => Course.id !== id)
    );
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddCourse = () => {
    setModalTitle("Thêm khóa học!");
    setModalContent(<AddCourseForm onClose={closeModal} onReload={fetchCourses} />);
    setIsModalOpen(true);
  };

  const handleEditCourse = (id: string, slug: string) => {
    setModalTitle("Sửa thông tin khóa học!");
    setModalContent(
      <EditCourseForm id={id} slug={slug} onClose={closeModal} onReload={fetchCourses} />
    );
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Khóa học</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng số khóa học hiện tại: <span className="font-semibold text-blue-600">{totalCourses}</span></p>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2"
          onClick={handleAddCourse}
        >
          <span>+</span> Thêm Khóa học
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <SearchAndLimit
          search={search}
          setSearch={setSearch}
          limit={limit}
          setLimit={setLimit}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow-md rounded-lg border border-gray-200">
          {/* TĂNG SIZE CHỮ TOÀN BỘ TABLE */}
          <table className="w-full text-base text-left text-gray-700">
            {/* HEADER: Tăng từ text-xs lên text-sm */}
            <thead className="text-sm text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 w-24 text-center font-bold">STT</th>
                <th scope="col" className="px-6 py-4 font-bold">Tên khóa học</th>
                <th scope="col" className="px-6 py-4 w-48 text-center font-bold">Danh mục</th>
                <th scope="col" className="px-6 py-4 w-40 text-center font-bold">Học viên</th>
                <th scope="col" className="px-6 py-4 w-48 text-center font-bold">Ngày tạo</th>
                <th scope="col" className="px-6 py-4 w-40 text-center font-bold">Trạng thái</th>
                <th scope="col" className="px-6 py-4 w-32 text-center font-bold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.length > 0 ? (
                courses.map((course,index) => (
                  <CourseRow
                    key={course.id}
                    index={(page - 1) * 10 + (index + 1)}
                    course={course}
                    handleEdit={handleEditCourse}
                    onDelete={handleDeleteCourse}
                    onReload={fetchCourses}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 italic">
                    Không tìm thấy khóa học nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Pagination
          currentPage={page}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}