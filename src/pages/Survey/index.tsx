import { useEffect, useState } from "react";
import { Survey } from "../../interfaces/Survey.interface";
import axiosInstance from "../../configs/axiosConfigs";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";
import LoadingSpinner from "../../components/Loading";
import SearchAndLimit from "../../components/SearchInput";
import SurveyRow from "../../components/Survey/SurveyRow";
import AddSurveyForm from "../../components/Survey/AddSurveyForm";

export default function Page() {
  // --- LOGIC GỐC (GIỮ NGUYÊN 100%) ---
  const [surveys, setSurvey] = useState<Survey[]>([]);
  const [totalSurvey, setTotalSurvey] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const handleAddSurvey = () => {
    setModalTitle("Thêm bài khảo sát");
    setModalContent(<AddSurveyForm />);
    setIsModalOpen(true);
  };

  const fetchSurvey = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/survey/list", {
        params: {
          limit,
          page,
          key_name: search,
        },
      });
      setSurvey(response.data.data.surveys);
      setTotalSurvey(response.data.data.count);
      let ttPage = Math.ceil(response.data.data.count / limit);
      setTotalPages(ttPage);
    } catch (error) {
      console.error("Error fetching Surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurvey();
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

  // --- PHẦN GIAO DIỆN (ĐÃ STYLE LẠI) ---
  return (
    <div className="flex flex-1 flex-col p-6 bg-gray-50 min-h-screen">
      {/* Header Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Danh sách bài khảo sát
        </h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý các bài khảo sát trong hệ thống</p>
      </div>

      {/* Control Bar: Search & Add Button */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <SearchAndLimit
            search={search}
            setSearch={setSearch}
            limit={limit}
            setLimit={setLimit}
          />
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
          onClick={handleAddSurvey}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Thêm bài khảo sát
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>

      {loading ? (
        <div className="flex justify-center items-center h-80 bg-white rounded-xl shadow-sm border border-gray-200">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          {/* Header of Table Section */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">
              Tổng số bài khảo sát: <span className="text-blue-600 text-lg">{totalSurvey}</span>
            </h2>
          </div>

          {/* Table Container with Scroll */}
          <div className="relative overflow-x-auto">
            <div className="max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    {["STT", "Tên bài khảo sát", "Trạng thái", "Số người đã tham gia", "Thời gian kết thúc", "Thời gian khởi tạo", "Hành động"].map((header) => (
                      <th key={header} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {surveys.length > 0 ? (
                    surveys.map((survey, index) => (
                      <SurveyRow index={(page - 1) * 5 + (index + 1)} key={survey.id} survey={survey} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-gray-500 italic">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/30">
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