import React, { useEffect, useState, useRef } from "react";
import axios from "../../configs/axiosConfigs";
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon } from "@heroicons/react/solid";

// ... (Giữ nguyên interface Question)
interface Question {
    id: number;
    content: string;
    type: "rating" | "text" | "choice";
    createdAt: string;
}

const SurveyQuestionBank = () => {
    // ... (Giữ nguyên các state cũ)
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    // State Modal & Form (Giữ nguyên)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [formData, setFormData] = useState({ content: "", type: "rating" });

    // Ref để tránh fetch 2 lần khi search (optional optimization)
    const isFirstRender = useRef(true);

    // --- LOGIC API ---
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `survey/questions/list?page=${page}&limit=${limit}&search=${search}`
            );
            setQuestions(res.data.data.questions);
            setTotal(res.data.data.count);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- SỬA LOGIC USE EFFECT TẠI ĐÂY ---

    // 1. Effect riêng cho SEARCH (Có Debounce)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            // Nếu đang ở trang 1 thì gọi luôn, nếu không thì set về 1 (effect dưới sẽ chạy)
            if (page === 1) {
                fetchQuestions();
            } else {
                setPage(1);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // 2. Effect riêng cho PAGE (Chạy NGAY LẬP TỨC)
    useEffect(() => {
        fetchQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // ... (Giữ nguyên các hàm handleSave, handleDelete, openModal...)
    const handleSave = async () => { /* Logic cũ */ };
    const handleDelete = async (id: number) => { /* Logic cũ */ };
    const openAddModal = () => { setIsModalOpen(true); setEditingQuestion(null); setFormData({ content: "", type: "rating" as any }); };
    const openEditModal = (q: Question) => { setEditingQuestion(q); setFormData({ content: q.content, type: q.type as any }); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingQuestion(null); };


    // --- RENDER ---
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header & Search (Giữ nguyên) */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Ngân hàng câu hỏi khảo sát</h1>
                    <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center gap-2">
                        <PlusIcon className="h-5 w-5" /> <span>Thêm câu hỏi</span>
                    </button>
                </div>

                <div className="mb-4 bg-white p-4 rounded shadow-sm">
                    <input
                        type="text"
                        placeholder="Tìm kiếm nội dung câu hỏi..."
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} // Bỏ setPage(1) ở đây để useEffect xử lý
                    />
                </div>

                {/* --- TABLE VỚI HIỆU ỨNG LOADING MỚI --- */}
                <div className="bg-white rounded shadow overflow-hidden relative min-h-[400px]">

                    {/* Loading Overlay: Hiện đè lên bảng thay vì làm mất bảng */}
                    {loading && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                            <span className="mt-2 text-base text-blue-600 font-medium">Đang tải dữ liệu...</span>
                        </div>
                    )}

                    <table className="min-w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-3 text-gray-600 font-semibold text-base">STT</th>
                                <th className="px-6 py-3 text-gray-600 font-semibold text-base">Nội dung câu hỏi</th>
                                <th className="px-6 py-3 text-gray-600 font-semibold text-base">Loại</th>
                                <th className="px-6 py-3 text-gray-600 font-semibold text-base text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* Logic hiển thị dữ liệu: Nếu đang loading lần đầu (mảng rỗng) thì không hiện gì, ngược lại hiện data cũ mờ đi nhờ Overlay */}
                            {questions.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Chưa có câu hỏi nào trong kho.</td>
                                </tr>
                            ) : (
                                questions.map((q, index) => (
                                    <tr key={q.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-500">{(page - 1) * limit + (index + 1)}</td>
                                        <td className="px-6 py-4 text-gray-800 font-medium">{q.content}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold 
                                                ${q.type === 'rating' ? 'bg-green-100 text-green-700' :
                                                    q.type === 'text' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'}`}>
                                                {q.type === 'rating' ? 'Đánh giá' : q.type === 'text' ? 'Tự luận' : 'Lựa chọn'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                                            <button onClick={() => openEditModal(q)} className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors">
                                                <PencilIcon className="h-5 w-5" /> {/* Sửa lại icon Eye thành Pencil cho đúng ngữ nghĩa sửa */}
                                            </button>
                                            <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Giữ nguyên) */}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-600 text-base">
                        Hiển thị {questions.length > 0 ? questions.length : 0} / {total} kết quả
                    </span>
                    <div className="flex space-x-2">
                        <button
                            disabled={page <= 1 || loading} // Disable khi đang loading
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 border rounded bg-white disabled:opacity-50 hover:bg-gray-100 transition-colors"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1 border rounded bg-blue-50 text-blue-600 font-bold">{page}</span>
                        <button
                            disabled={page * limit >= total || loading} // Disable khi đang loading
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 border rounded bg-white disabled:opacity-50 hover:bg-gray-100 transition-colors"
                        >
                            Sau
                        </button>
                    </div>
                </div>

                {/* Modal (Giữ nguyên code Modal của bạn ở đây...) */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                            {/* ... Nội dung form giống hệt code cũ ... */}
                            <h2 className="text-xl font-bold mb-4 text-gray-800">
                                {editingQuestion ? "Cập nhật câu hỏi" : "Thêm câu hỏi mới"}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-1">Nội dung câu hỏi</label>
                                    <textarea
                                        rows={3}
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-1">Loại câu hỏi</label>
                                    <select
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    >
                                        <option value="rating" className="text-green-700 font-semibold bg-white py-2">
                                            🟢 Đánh giá (1-5 sao)
                                        </option>
                                        <option value="text" className="text-yellow-600 font-semibold bg-white py-2">
                                            🟡 Tự luận (Nhập text)
                                        </option>
                                        <option value="choice" className="text-purple-700 font-semibold bg-white py-2">
                                            🟣 Lựa chọn (Đồng ý/Không)
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button onClick={closeModal} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Hủy bỏ</button>
                                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">Lưu</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SurveyQuestionBank;