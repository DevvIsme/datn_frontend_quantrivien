/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfigs";
import LoadingSpinner from "../Loading";
import Modal from "../Modal";
import Pagination from "../Pagination"; // Import Pagination
import { Question } from "../../interfaces/Questions.interface";
import QuestionRow from "./QuestionRow";
import QuestionForm from "./QuestionForm";
// @ts-ignore
import { SearchIcon, PlusIcon, UploadIcon, SparklesIcon } from "@heroicons/react/solid";
import { Topic } from "../../interfaces/Topic.interface";
import ImportQuestionModal from "./ImportQuestionModal";

export default function QuestionList() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    // --- STATE PHÂN TRANG & TÌM KIẾM ---
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10); // Giới hạn 10 câu/trang
    const [totalPages, setTotalPages] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
    const [modalTitle, setModalTitle] = useState("");

    // Topic State
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string>("");

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await axios.get("/topic/list");
                setTopics(res.data.data.topics || []);
            } catch (e) { console.error(e); }
        };
        fetchTopics();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/exam/questions`, {
                params: {
                    key_name: searchTerm,
                    topic_id: selectedTopic,
                    limit: limit, // Gửi limit
                    page: page,   // Gửi page
                },
            });
            setQuestions(response.data.data.questions || []);

            // Cập nhật thông tin phân trang từ API
            const count = response.data.data.count || 0;
            setTotalQuestions(count);
            setTotalPages(Math.ceil(count / limit));

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi page, search hoặc topic thay đổi
    useEffect(() => {
        fetchQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchTerm, selectedTopic]); // Thêm page vào dependency

    // Reset về trang 1 khi thay đổi bộ lọc
    const handleSearchChange = (val: string) => {
        setSearchTerm(val);
        setPage(1);
    };

    const handleTopicChange = (val: string) => {
        setSelectedTopic(val);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const closeModal = () => setIsModalOpen(false);

    // --- HANDLERS CŨ ---
    const handleAdd = () => {
        setModalTitle("Thêm câu hỏi mới");
        setModalContent(<QuestionForm onClose={closeModal} onReload={fetchQuestions} examSlug="" />);
        setIsModalOpen(true);
    };

    const handleEdit = (q: Question) => {
        setModalTitle("Cập nhật câu hỏi");
        setModalContent(<QuestionForm examSlug="" question={q} onClose={closeModal} onReload={fetchQuestions} />);
        setIsModalOpen(true);
    };

    const handleImportExcel = () => {
        setModalTitle("Import câu hỏi từ Excel");
        setModalContent(<ImportQuestionModal onClose={closeModal} onSuccess={() => { fetchQuestions(); closeModal(); }} />);
        setIsModalOpen(true);
    };

    // --- HANDLERS AI MỚI ---
    const handleSaveVariations = async (newQuestions: any[], originalTopicId: number | string) => {
        try {
            if (!confirm(`Xác nhận lưu ${newQuestions.length} câu hỏi này vào ngân hàng?`)) return;

            const savePromises = newQuestions.map(q => {
                return axios.post(`/exam/question/create`, {
                    ...q,
                    topic_id: originalTopicId
                });
            });

            await Promise.all(savePromises);

            alert("Đã lưu thành công!");
            setIsModalOpen(false);
            fetchQuestions();
        } catch (error: any) {
            alert("Lỗi khi lưu: " + (error.response?.data || error.message));
        }
    };

    const handleGenerateAI = async (originalQuestion: Question) => {
        setIsModalOpen(true);
        setModalTitle("✨ AI Assistant");

        setModalContent(
            <div className="flex flex-col items-center justify-center py-10 px-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Đang phân tích và tạo câu hỏi tương tự...</p>
                <p className="text-sm text-gray-500 mt-2">Quá trình này mất khoảng 3-5 giây.</p>
            </div>
        );

        try {
            const response = await axios.post('/exam/generate-variations', {
                originalQuestion: originalQuestion,
                quantity: 3
            });

            const generatedData = response.data.data.data;

            setModalTitle(`Kết quả: Tìm thấy ${generatedData.length} biến thể`);
            setModalContent(
                <AiResultView
                    data={generatedData}
                    originalQuestion={originalQuestion}
                    onCancel={closeModal}
                    onSave={handleSaveVariations}
                />
            );
        } catch (error: any) {
            setModalTitle("Đã xảy ra lỗi");
            setModalContent(
                <div className="text-center py-8">
                    <div className="text-red-500 text-5xl mb-4">✕</div>
                    <p className="text-gray-700 font-medium mb-2">Không thể tạo câu hỏi.</p>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">{error.response?.data?.message || error.message}</p>
                    <button onClick={closeModal} className="mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800">Đóng</button>
                </div>
            );
        }
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
            {/* HEADER & TOOLBAR */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">
                    Ngân hàng câu hỏi <span className="text-gray-500 font-normal text-sm">({totalQuestions})</span>
                </h2>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <select
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={selectedTopic}
                        onChange={(e) => handleTopicChange(e.target.value)}
                    >
                        <option value="">-- Tất cả chủ đề --</option>
                        {topics.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>

                    <div className="relative flex-grow md:w-64">
                        <input
                            type="text"
                            placeholder="Tìm kiếm câu hỏi..."
                            className="w-full border border-gray-300 pl-9 pr-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        <SearchIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center text-sm font-medium transition shadow-sm whitespace-nowrap">
                            <PlusIcon className="w-4 h-4 mr-1.5" /> Thêm câu hỏi
                        </button>
                        <button onClick={handleImportExcel} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center text-sm font-medium transition shadow-sm whitespace-nowrap">
                            <UploadIcon className="w-4 h-4 mr-1.5" /> Import Excel
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} className="w-full max-w-4xl">
                {modalContent}
            </Modal>

            {/* TABLE */}
            {loading ? (
                <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : (
                <>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full bg-white divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center w-16">STT</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Nội dung</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center w-32">Loại</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center w-36">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {questions.length > 0 ? questions.map((q, index) => (
                                    <QuestionRow
                                        key={q.id}
                                        index={(page - 1) * limit + index + 1} // Tính STT theo trang
                                        question={q}
                                        handleEdit={handleEdit}
                                        onReload={fetchQuestions}
                                        handleGenerateAI={handleGenerateAI}
                                    />
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-500 italic">
                                            Chưa có câu hỏi nào. Hãy thêm câu hỏi mới!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-4">
                        <Pagination
                            currentPage={page}
                            onPageChange={handlePageChange}
                            totalPages={totalPages}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

// --- COMPONENT CON: QUẢN LÝ VIỆC CHỌN CÂU HỎI ---
const AiResultView = ({ data, originalQuestion, onSave, onCancel }: any) => {
    // Mặc định chọn tất cả (mảng chứa index của các câu hỏi)
    const [selectedIndices, setSelectedIndices] = useState<number[]>(
        data.map((_: any, idx: number) => idx)
    );

    const toggleSelect = (index: number) => {
        setSelectedIndices((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index) // Bỏ chọn
                : [...prev, index] // Chọn thêm
        );
    };

    const handleSave = () => {
        // Lọc ra các câu hỏi có index nằm trong danh sách đã chọn
        const selectedQuestions = data.filter((_: any, i: number) => selectedIndices.includes(i));
        if (selectedQuestions.length === 0) {
            alert("Vui lòng chọn ít nhất 1 câu hỏi để lưu!");
            return;
        }
        // Gọi hàm save của cha
        onSave(selectedQuestions, originalQuestion.topic_id || "");
    };

    return (
        <div className="flex flex-col h-full min-h-[70vh] max-h-[90vh]">
            <div className="mb-4 bg-purple-50 text-purple-900 px-5 py-3 rounded text-base border border-purple-100 flex justify-between items-center">
                <span>Gốc: <strong>{originalQuestion.name}</strong></span>
                <span className="text-sm font-bold text-blue-600">
                    Đã chọn: {selectedIndices.length}/{data.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 pr-3 custom-scrollbar pb-6">
                {data.map((q: any, idx: number) => {
                    const isSelected = selectedIndices.includes(idx);
                    return (
                        <div
                            key={idx}
                            onClick={() => toggleSelect(idx)} // Click vào khung để chọn luôn cho tiện
                            className={`relative border rounded-xl p-5 shadow-sm transition cursor-pointer select-none
                ${isSelected ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}
              `}
                        >
                            {/* Checkbox to ở góc */}
                            <div className="absolute top-4 right-4">
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => { }} // Đã xử lý ở onClick div
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-between mb-3 pr-8">
                                <span className={`font-bold text-lg ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                                    Câu {idx + 1}
                                </span>
                                <span className="text-sm bg-white border px-3 py-1 rounded text-gray-600">
                                    {q.type === 'radio' ? '1 Lựa chọn' : 'Nhiều lựa chọn'}
                                </span>
                            </div>

                            <p className="mb-4 text-gray-800 font-medium text-base">{q.name}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {q.choice.map((c: string, cIdx: number) => {
                                    const isCorrect = q.correctAns.includes(c);
                                    return (
                                        <div key={cIdx} className={`text-base px-4 py-3 rounded border ${isCorrect ? 'bg-green-100 border-green-300 text-green-900 font-bold' : 'bg-white border-gray-200 text-gray-600'}`}>
                                            {c} {isCorrect && "✓"}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pt-4 border-t flex justify-end gap-3 bg-white mt-auto">
                <button onClick={onCancel} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded text-base">
                    Hủy bỏ
                </button>
                <button
                    onClick={handleSave}
                    disabled={selectedIndices.length === 0}
                    className={`px-5 py-2.5 text-white rounded flex items-center font-medium shadow text-base
            ${selectedIndices.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
          `}
                >
                    <UploadIcon className="w-5 h-5 mr-2" />
                    Lưu {selectedIndices.length} câu đã chọn
                </button>
            </div>
        </div>
    );
};