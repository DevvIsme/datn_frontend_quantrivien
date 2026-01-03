import React, { useState, useEffect } from "react";
import axiosInstance from "../../configs/axiosConfigs";

interface Props {
    // SỬA Ở ĐÂY: Đổi từ number sang string (hoặc string | number để linh hoạt nhất)
    surveyId: string;
    currentQuestions: any[];
    onReload: () => void;
}

const ManageSurveyQuestions: React.FC<Props> = ({ surveyId, currentQuestions, onReload }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bankQuestions, setBankQuestions] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loadingBank, setLoadingBank] = useState(false);

    // 1. Hàm Xóa câu hỏi
    const handleRemove = async (questionBankId: number) => {
        if (!window.confirm("Bạn muốn gỡ câu hỏi này khỏi bài khảo sát?")) return;
        try {
            await axiosInstance.post(`/survey/remove-question/${surveyId}`, {
                question_bank_id: questionBankId
            });
            alert("Đã xóa thành công!");
            onReload();
        } catch (error) {
            alert("Lỗi khi xóa câu hỏi");
        }
    };

    // 2. Fetch kho câu hỏi
    const fetchQuestionBank = async () => {
        try {
            setLoadingBank(true);
            const res = await axiosInstance.get(`/survey/questions/list?limit=100`);

            const existingIds = currentQuestions.map((q: any) => q.bank_id || q.question_data?.id);
            const available = res.data.data.questions.filter((q: any) => !existingIds.includes(q.id));

            setBankQuestions(available);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingBank(false);
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'text': return 'Tự luận';
            case 'choice': return 'Trắc nghiệm'; // Hoặc 'Lựa chọn'
            default: return 'Đánh giá';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'text': return 'text-yellow-600 bg-yellow-100';
            case 'choice': return 'text-purple-600 bg-purple-100';
            default: return 'text-green-600 bg-green-100';
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchQuestionBank();
            setSelectedIds([]);
        }
    }, [isModalOpen]);

    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // 3. Hàm Thêm câu hỏi
    const handleAddSelected = async () => {
        try {
            await Promise.all(selectedIds.map(id =>
                axiosInstance.post(`/survey/add-question/${surveyId}`, { question_bank_id: id })
            ));

            alert("Đã thêm câu hỏi vào khảo sát!");
            setIsModalOpen(false);
            onReload();
        } catch (error) {
            alert("Có lỗi xảy ra khi thêm câu hỏi.");
        }
    };

    return (
        <div className="bg-white p-4 shadow rounded">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Danh sách câu hỏi hiện tại ({currentQuestions.length})</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                >
                    <span>+</span> Thêm từ kho câu hỏi
                </button>
            </div>

            <div className="space-y-3">
                {currentQuestions.map((q: any, index) => (
                    <div key={index} className="flex justify-between items-start border p-3 rounded hover:bg-gray-50">
                        <div>
                            <span className="font-bold text-gray-500 mr-2">Câu {index + 1}:</span>
                            <span className="font-medium text-gray-800">{q.content || q.question_data?.content}</span>

                            {/* SỬA ĐOẠN NÀY: Hiển thị Badge đẹp thay vì text thô */}
                            <div className="mt-2">
                                <span className={`text-xs px-2 py-1 rounded font-semibold ${getTypeColor(q.type || q.question_data?.type)}`}>
                                    {getTypeLabel(q.type || q.question_data?.type)}
                                </span>
                            </div>

                        </div>
                        <button
                            onClick={() => handleRemove(q.bank_id || q.question_data?.id)}
                            className="text-red-500 hover:text-red-700 text-base font-medium"
                        >
                            Xóa bỏ
                        </button>
                    </div>
                ))}
                {currentQuestions.length === 0 && <p className="text-gray-500 text-center">Chưa có câu hỏi nào.</p>}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    {/* Thêm max-h để tránh tràn màn hình và animation nhẹ */}
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-fade-in-down">

                        {/* HEADER */}
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Chọn câu hỏi từ Ngân hàng</h3>
                                <p className="text-base text-gray-500 mt-1">Tích chọn các câu hỏi bạn muốn thêm vào bài khảo sát này</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                {/* Icon đóng */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* BODY - LIST CÂU HỎI */}
                        <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
                            {loadingBank ? (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                                    <svg className="animate-spin h-6 w-6 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang tải dữ liệu...
                                </div>
                            ) : (
                                bankQuestions.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500 italic">
                                        Không còn câu hỏi nào trong kho để thêm.
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {bankQuestions.map(q => (
                                            <div
                                                key={q.id}
                                                onClick={() => toggleSelect(q.id)}
                                                className={`flex items-start gap-4 p-3 rounded-lg border transition-all cursor-pointer group
                                        ${selectedIds.includes(q.id)
                                                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                                                        : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-sm'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                                    checked={selectedIds.includes(q.id)}
                                                    onChange={() => toggleSelect(q.id)}
                                                />

                                                <div className="flex-1">
                                                    <p className={`font-medium mb-1.5 ${selectedIds.includes(q.id) ? 'text-blue-800' : 'text-gray-800'}`}>
                                                        {q.content}
                                                    </p>

                                                    {/* PHẦN HIỂN THỊ LOẠI CÂU HỎI ĐÃ ĐƯỢC STYLE LẠI */}
                                                    <div>
                                                        {q.type === 'rating' && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                                Đánh giá
                                                            </span>
                                                        )}
                                                        {q.type === 'text' && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                                Tự luận
                                                            </span>
                                                        )}
                                                        {q.type === 'choice' && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                                                Lựa chọn
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleAddSelected}
                                disabled={selectedIds.length === 0}
                                className={`px-5 py-2.5 rounded-lg text-base font-medium text-white shadow-sm transition-all flex items-center
                        ${selectedIds.length === 0
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
                            >
                                {selectedIds.length > 0 && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                )}
                                Thêm {selectedIds.length > 0 ? selectedIds.length : ''} câu hỏi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSurveyQuestions;