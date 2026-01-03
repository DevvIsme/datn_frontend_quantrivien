/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import SearchAndLimit from "../../SearchInput";
import Modal from "../../Modal";
// import AddToCourseForm from "./AddStudentToCourse";
import axiosInstance from "../../../configs/axiosConfigs";
import Pagination from "../../Pagination";
import { ExamQuestion } from "../../../interfaces/Exam.interface";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import AddQuestionForm from "./AddQuestionForm";
import UploadExcelForm from "./AddByExcell";
import EditQuestionForm from "./EditQuestionForm";

export default function QuestionList({ id }: { id: string }) {
  const [list, setList] = useState<ExamQuestion[]>([]);
  const [limit, setLimit] = useState(5);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchQuestion = async () => {
    try {
      const response = await axiosInstance.get(`/exam/list-question/${id}`, {
        params: {
          limit,
          page,
          key_name: search,
        },
      });
      let data = response.data.data;
      setList(data.questions); // sửa 'stundents' thành 'students'
      setTotalQuestions(data.count);
      let ttPage = Math.ceil(data.count / limit);
      setTotalPages(ttPage);
    } catch (error: any) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, search]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleAddQuestion = () => {
    setIsModalOpen(true);
    setModalTitle("Thêm câu hỏi");
    setModalContent(<AddQuestionForm id={id} />);
  };

  const handleAddFile = () => {
    setIsModalOpen(true);
    setModalTitle("Thêm câu hỏi");
    setModalContent(<UploadExcelForm id={id} />);
  };

  const handleEdit = (question: ExamQuestion) => {
    setIsModalOpen(true);
    setModalTitle("Sửa câu hỏi");
    setModalContent(<EditQuestionForm question={question} />);
  };

  const handleDelete = async (id: string) => {
    try {
      const isYes = confirm("Xác nhận xóa câu hỏi này?");
      if (!isYes) {
        return;
      }
      await axiosInstance.delete(`/exam/delete-question/${id}`);
      alert("Xóa câu hỏi thành công!");
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-h-[410px] overflow-y-scroll">
      <h1 className="mb-2 font-bold text-xl">
        Tổng số câu hỏi trong ngân hàng : {totalQuestions}
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAddQuestion} // Thêm sự kiện mở modal
          >
            Thêm Câu hỏi
          </button>
          {/* <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleAddFile} // Thêm sự kiện mở modal
          >
            Thêm Câu hỏi bằng file
          </button> */}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Tên câu hỏi</th>
            <th className="px-4 py-2 border">Dạng câu hỏi</th>
            <th className="px-4 py-2 border">Đáp án đúng</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item: any) => (
            <tr key={item.id}>
              <td className="px-4 py-1 border text-center">{item.id}</td>
              <td className="px-4 py-1 border text-left">{item.name}</td>
              <td className="px-4 py-1 border text-left">{item.type}</td>
              <td className="px-4 py-1 border text-left">
                {item.correctAns.join(", ")}
              </td>
              <td className="px-4 py-1 border">
                <div className="flex justify-center gap-2">
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => {
                      handleEdit(item);
                    }}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
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
