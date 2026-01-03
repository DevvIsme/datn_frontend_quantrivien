import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import LoadingSpinner from "../Loading";
import { ExamListProps } from "../../interfaces/Exam.interface";
import Modal from "../Modal";
import { Document } from "../../interfaces/Document.interface";
import DocRow from "./Doc.row";
import AddDocForm from "./AddDocForm";
import EditDocForm from "./EditDocForm";
// import ExamRow from "./Exam.rows";
// import AddExamForm from "./AddExamForm";
// import EditExamForm from "./EditExamForm";

const DocumentList: React.FC<ExamListProps> = ({ course }) => {
  const [docs, setDocs] = useState<Document[]>([]);
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
          `/material/list-document/${course.slug}`
        );
        setDocs(response.data.data.docs);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [course]);

  const handleAddDoc = () => {
    setModalTitle("Thêm tài liệu!");
    setModalContent(<AddDocForm courseId={course.id} onClose={closeModal} onReload={closeModal} />);
    setIsModalOpen(true);
  };

  const handleEditDoc = (doc: Document) => {
    setModalTitle("Sửa tài liệu!");
    setModalContent(<EditDocForm doc={doc} onClose={closeModal} onReload={closeModal} />);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold ">Tổng số tài liệu: {docs.length}</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAddDoc}
        >
          Thêm tài liệu
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : docs.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 max-h-[200px] overflow-y-scroll">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Tên tài liệu</th>
              <th className="px-4 py-2 border">Nội dung</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody className="">
            {docs.map((doc: Document) => (
              <DocRow doc={doc} key={doc.id} handleEdit={handleEditDoc} />
            ))}
          </tbody>
        </table>
      ) : (
        <div>Chưa có tài liệu nào.</div>
      )}
    </div>
  );
};

export default DocumentList;
