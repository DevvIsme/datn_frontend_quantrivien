import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import Pagination from "../../components/Pagination";
import SearchAndLimit from "../../components/SearchInput";
import { Exam } from "../../interfaces/Exam.interface";
import axiosInstance from "../../configs/axiosConfigs";
import LoadingSpinner from "../../components/Loading";
import IndexRow from "../../components/Exam/IndexRow";
import EditExamForm from "../../components/Exam/EditExamForm";
import AddExamForm from "../../components/Exam/AddExamForm";

export default function Page() {
  const [exams, setExam] = useState<Exam[]>([]);
  const [totalExam, setTotalExam] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const handleAddExam = () => {
    setModalTitle("Thêm bài thi");
    setModalContent(<AddExamForm />);
    setIsModalOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
  };

  const fetchExam = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/exam/list", {
        params: {
          limit,
          page,
          key_name: search,
        },
      });
      setExam(response.data.data.exams);
      console.log(response.data.data.exams);

      setTotalExam(response.data.data.count);
      let ttPage = Math.ceil(response.data.data.count / limit);
      setTotalPages(ttPage);
    } catch (error) {
      console.error("Error fetching Exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExam();
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
  return (
    <div className="flex flex-1 flex-col p-6 bg-gray-50 min-h-screen">
      {/* HEADER PAGE */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Bài thi</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng số bài thi hiện tại: <span className="font-semibold text-blue-600">{totalExam}</span></p>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2"
          onClick={handleAddExam}
        >
          <span>+</span> Thêm Bài thi
        </button>
      </div>

      {/* SEARCH BOX */}
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
          <table className="w-full text-base text-left text-gray-700">
            <thead className="text-sm text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 w-24 text-center font-bold">STT</th>
                <th scope="col" className="px-6 py-4 font-bold">Tên bài kiểm tra</th>
                <th scope="col" className="px-6 py-4 w-48 text-center font-bold">Chủ đề</th>
                <th scope="col" className="px-6 py-4 w-48 text-center font-bold">Ngày tạo</th>
                <th scope="col" className="px-6 py-4 w-40 text-center font-bold">Trạng thái</th>
                <th scope="col" className="px-6 py-4 w-32 text-center font-bold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exams.length > 0 ? (
                exams.map((exam,index) => (
                  <IndexRow
                    key={exam.id}
                    index={(page - 1) * 10 + (index + 1)}
                    exam={exam}
                    handleEdit={handleEditExam}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 italic">
                    Không tìm thấy bài thi nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
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