import { useEffect, useState } from "react";
import { Topic } from "../../interfaces/Topic.interface";
import axiosInstance from "../../configs/axiosConfigs";
import SearchAndLimit from "../../components/SearchInput";
import Modal from "../../components/Modal";
import LoadingSpinner from "../../components/Loading";
import AddTopicForm from "../../components/Topic/AddForm";
import { Link } from "react-router-dom";
import { EyeIcon, PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/solid"; // Thêm PlusIcon
import EditTopicForm from "../../components/Topic/EditForm";

export default function Page() {
  // --- LOGIC GỐC (GIỮ NGUYÊN 100%) ---
  const [topics, setTopics] = useState<Topic[]>([]);
  const [totalTopics, setTotalTopics] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/topic/list", {
        params: {
          key_name: search,
        },
      });
      setTopics(response.data.data.topics);
      setTotalTopics(response.data.data.count);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = () => {
    setModalTitle("Thêm chủ đề");
    setModalContent(<AddTopicForm />);
    setIsModalOpen(true);
  };
  const handleEditTopic = (topic: Topic) => {
    setModalTitle("Cập nhật chủ đề"); // Sửa nhẹ title cho đúng ngữ cảnh edit
    setModalContent(<EditTopicForm topic={topic} />);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, search]);

  // --- GIAO DIỆN STYLE MỚI ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Danh sách chủ đề
            </h1>
            <p className="mt-1 text-base text-gray-500">
              Quản lý các chủ đề đào tạo trong hệ thống.
            </p>
          </div>

          <button
            onClick={handleAddTopic}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm chủ đề
          </button>
        </div>

        {/* Filter & Search Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <SearchAndLimit
            search={search}
            setSearch={setSearch}
            limit={limit}
            setLimit={setLimit}
          />
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="relative">
              {/* Total Count Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <span className="text-base font-medium text-gray-500">
                  Tổng số: <span className="font-bold text-gray-900">{totalTopics}</span> chủ đề
                </span>
              </div>

              {/* Table Wrapper */}
              <div className="overflow-x-auto">
                <div className="max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                          STT
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Tên chủ đề
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topics.length > 0 ? (
                        topics.map((topic, index) => (
                          <tr key={topic.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-center text-base text-gray-500 font-mono">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 text-base font-medium text-gray-900">
                              {topic.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  to={`/topic/${topic.slug}`}
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                                  title="Xem chi tiết"
                                >
                                  <EyeIcon className="h-5 w-5" />
                                </Link>
                                <button
                                  className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
                                  onClick={() => handleEditTopic(topic)}
                                  title="Chỉnh sửa"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                                  title="Xóa"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">
                            Không có chủ đề nào được tìm thấy.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
          {modalContent}
        </Modal>
      </div>
    </div>
  );
}