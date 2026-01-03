import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import LoadingSpinner from "../Loading";
import { Exam, ExamListProps } from "../../interfaces/Exam.interface";
import Modal from "../Modal";
import ExamRow from "./Exam.rows";
import AddExamForm from "./AddExamForm";
import EditExamForm from "./EditExamForm";

const ExamList: React.FC<ExamListProps> = ({ course }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/exam/list?topic_id=${course.topic.id}`
        );
        setExams(response.data.data.exams);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [course]);

  const handleAddExam = () => {
    setModalTitle("Thêm bài thi!");
    setModalContent(<AddExamForm />);
    setIsModalOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    setModalTitle("Thêm bài thi!");
    setModalContent(<EditExamForm exam={exam} onClose={closeModal} onReload={closeModal} />);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold ">Tổng số bài thi: {exams.length}</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAddExam}
        >
          Thêm bài thi
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : exams.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 max-h-[200px] overflow-y-scroll">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Tên bài thi</th>
              <th className="px-4 py-2 border">Số câu hỏi </th>
              <th className="px-4 py-2 border">Thời gian làm</th>
              <th className="px-4 py-2 border">Số lần được làm lại</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody className="">
            {exams.map((exam: Exam) => (
              <ExamRow key={exam.id} exam={exam} handleEdit={handleEditExam} />
            ))}
          </tbody>
        </table>
      ) : (
        <div>Chưa có bài thi nào.</div>
      )}
    </div>
  );
};

export default ExamList;
