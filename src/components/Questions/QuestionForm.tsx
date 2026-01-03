import React, { useState, useEffect } from "react";
// @ts-ignore
import { PlusIcon, TrashIcon, XIcon, CheckCircleIcon, CheckIcon } from "@heroicons/react/solid";
import axiosInstance from "../../configs/axiosConfigs";
import { QuestionFormProps, QuestionType } from "../../interfaces/Questions.interface";
import { Topic } from "../../interfaces/Topic.interface";

export default function QuestionForm({ question, onClose, onReload, examSlug }: QuestionFormProps) {
    const isEditMode = !!question;

    // --- STATE ---
    const [name, setName] = useState(question?.name || "");
    const [type, setType] = useState<QuestionType>(question?.type || "radio");

    // Mặc định tạo 4 ô input trống nếu là thêm mới
    const [choices, setChoices] = useState<string[]>(question?.choice || ["", "", "", ""]);
    const [correctAnswers, setCorrectAnswers] = useState<string[]>(question?.correctAns || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [topicId, setTopicId] = useState<number | string>(question?.topic_id || "");
    const [topics, setTopics] = useState<Topic[]>([]);
    // --- EFFECT ---
    // Khi đổi loại câu hỏi, nếu chuyển sang Radio mà đang chọn nhiều đáp án, phải reset lại
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await axiosInstance.get("/topic/list");
                setTopics(res.data.data.topics || []);
            } catch (e) { console.error(e); }
        };
        fetchTopics();
        if (type === 'radio' && correctAnswers.length > 1) {
            setCorrectAnswers([]); // Reset để người dùng chọn lại 1 cái duy nhất
        }
    }, [type, correctAnswers.length]);

    // --- HANDLERS ---

    // 1. Xử lý khi nhập nội dung đáp án (A, B, C, D...)
    const handleChoiceTextChange = (index: number, newValue: string) => {
        const newChoices = [...choices];
        const oldValue = newChoices[index];
        newChoices[index] = newValue;
        setChoices(newChoices);

        // QUAN TRỌNG: Nếu đáp án này đang là đáp án ĐÚNG, phải cập nhật text trong mảng correctAnswers theo
        if (correctAnswers.includes(oldValue)) {
            setCorrectAnswers(prev => prev.map(ans => ans === oldValue ? newValue : ans));
        }
    };

    // 2. Xử lý khi click chọn đáp án đúng
    const handleToggleCorrect = (choiceValue: string) => {
        if (!choiceValue.trim()) return; // Không cho chọn ô trống

        if (type === 'radio') {
            // Nếu là Radio: Luôn thay thế mảng bằng giá trị mới (chỉ 1)
            setCorrectAnswers([choiceValue]);
        } else {
            // Nếu là Checkbox: Toggle (có thì xóa, chưa có thì thêm)
            if (correctAnswers.includes(choiceValue)) {
                setCorrectAnswers(prev => prev.filter(item => item !== choiceValue));
            } else {
                setCorrectAnswers(prev => [...prev, choiceValue]);
            }
        }
    };

    // 3. Thêm/Xóa dòng lựa chọn
    const handleAddChoice = () => setChoices([...choices, ""]);

    const handleRemoveChoice = (index: number) => {
        if (choices.length <= 2) return alert("Cần tối thiểu 2 lựa chọn!");
        const valueToRemove = choices[index];
        setChoices(choices.filter((_, i) => i !== index));
        // Xóa luôn khỏi danh sách đúng nếu nó đang được chọn
        setCorrectAnswers(prev => prev.filter(ans => ans !== valueToRemove));
    };

    // 4. Submit Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) return alert("Vui lòng nhập nội dung câu hỏi!");
        const validChoices = choices.filter(c => c.trim() !== "");
        if (validChoices.length < 2) return alert("Cần ít nhất 2 lựa chọn không rỗng!");
        if (correctAnswers.length === 0) return alert("Vui lòng chọn đáp án đúng!");

        // Validate Backend requirement
        if (type === 'radio' && correctAnswers.length !== 1) {
            return alert("Câu hỏi 1 lựa chọn (Radio) chỉ được phép có duy nhất 1 đáp án đúng!");
        }

        // Check xem đáp án đúng có nằm trong danh sách lựa chọn không (đề phòng lỗi logic)
        const isAllCorrectValid = correctAnswers.every(ans => validChoices.includes(ans));
        if (!isAllCorrectValid) return alert("Có lỗi: Đáp án đúng không khớp với danh sách lựa chọn!");

        // eslint-disable-next-line no-restricted-globals
        if (!confirm(`Xác nhận ${isEditMode ? 'cập nhật' : 'thêm'} câu hỏi?`)) return;
        if (!topicId) {
            return alert("Vui lòng chọn chủ đề cho câu hỏi!");
        }
        setIsSubmitting(true);
        try {
            const payload = {
                name,
                type,
                choice: validChoices,
                correctAns: correctAnswers,
                topic_id: topicId // <== Gửi topic_id lên server
            };

            if (isEditMode) {
                // API Sửa (dựa trên UpdateQuestion trong controller)
                await axiosInstance.put(`/exam/question/update/${question.id}`, payload); alert("Cập nhật thành công!");
            } else {
                // API Thêm (dựa trên AddQuestion trong controller: param là exam_id nhưng logic tìm theo slug)
                await axiosInstance.post(`/exam/question/create`, payload); alert("Thêm mới thành công!");
            }

            onReload();
            onClose();
        } catch (error: any) {
            alert(error.response?.data || error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // SỬA: Thêm p-6 để cách lề, h-full overflow-y-auto để cuộn nếu dài
        <form onSubmit={handleSubmit} className="p-6 space-y-4 h-full overflow-y-auto">
            {/* ==> SELECT BOX CHỌN CHỦ ĐỀ */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Chủ đề <span className="text-red-500">*</span></label>
                <select
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">-- Chọn chủ đề --</option>
                    {topics.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>
            {/* Tên câu hỏi */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nội dung câu hỏi</label>
                <textarea
                    rows={3}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập câu hỏi..."
                    required
                />
            </div>

            {/* Chọn loại câu hỏi */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Loại câu hỏi</label>
                <div className="flex gap-6">
                    <label className={`flex items-center cursor-pointer p-3 border rounded-lg transition-all ${type === 'radio' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}>
                        <input type="radio" name="qType" className="hidden" checked={type === 'radio'} onChange={() => setType('radio')} />
                        <div className="w-4 h-4 rounded-full border border-gray-400 mr-2 flex items-center justify-center bg-white">
                            {type === 'radio' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                        </div>
                        <span className="font-medium text-gray-700">1 Lựa chọn (Radio)</span>
                    </label>

                    <label className={`flex items-center cursor-pointer p-3 border rounded-lg transition-all ${type === 'checkbox' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'hover:bg-gray-50'}`}>
                        <input type="radio" name="qType" className="hidden" checked={type === 'checkbox'} onChange={() => setType('checkbox')} />
                        <div className="w-4 h-4 rounded border border-gray-400 mr-2 flex items-center justify-center bg-white">
                            {type === 'checkbox' && <CheckIcon className="w-3 h-3 text-purple-600" />}
                        </div>
                        <span className="font-medium text-gray-700">Nhiều lựa chọn (Checkbox)</span>
                    </label>
                </div>
            </div>

            {/* Danh sách lựa chọn */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700">
                        Các lựa chọn & Đáp án đúng <span className="text-red-500">*</span>
                    </label>
                    <button type="button" onClick={handleAddChoice} className="text-sm text-blue-600 font-medium hover:underline flex items-center">
                        <PlusIcon className="w-4 h-4 mr-1" /> Thêm lựa chọn
                    </button>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {choices.map((choice, idx) => {
                        const isCorrect = correctAnswers.includes(choice) && choice !== "";
                        return (
                            <div key={idx} className={`flex items-center gap-2 p-2 border rounded-md transition-colors ${isCorrect ? (type === 'radio' ? 'bg-blue-50 border-blue-300' : 'bg-purple-50 border-purple-300') : 'bg-white'}`}>
                                {/* Nút check đúng/sai: Thay đổi hình dáng dựa theo type */}
                                <div
                                    onClick={() => handleToggleCorrect(choice)}
                                    className={`cursor-pointer w-8 h-8 flex items-center justify-center flex-shrink-0 transition-all ${!choice ? 'opacity-30 pointer-events-none' : ''}`}
                                    title="Click để đánh dấu đáp án đúng"
                                >
                                    {type === 'radio' ? (
                                        // Giao diện Radio
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isCorrect ? 'border-blue-600' : 'border-gray-300'}`}>
                                            {isCorrect && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                        </div>
                                    ) : (
                                        // Giao diện Checkbox
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isCorrect ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white'}`}>
                                            {isCorrect && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    )}
                                </div>

                                {/* Input nhập nội dung */}
                                <input
                                    type="text"
                                    value={choice}
                                    onChange={(e) => handleChoiceTextChange(idx, e.target.value)}
                                    placeholder={`Lựa chọn ${idx + 1}`}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400"
                                />

                                {/* Nút xóa */}
                                <button type="button" onClick={() => handleRemoveChoice(idx)} className="text-gray-400 hover:text-red-500 p-1">
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )
                    })}
                </div>
                <p className="text-xs text-gray-500 mt-1 italic">
                    * Click vào hình tròn/vuông bên trái để chọn đáp án đúng.
                </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
                    Hủy
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center">
                    {isSubmitting && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {isEditMode ? "Lưu thay đổi" : "Thêm câu hỏi"}
                </button>
            </div>
        </form>
    );
}