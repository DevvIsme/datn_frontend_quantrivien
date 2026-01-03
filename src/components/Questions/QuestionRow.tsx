import React from "react";
// @ts-ignore
import { PencilIcon, TrashIcon, SparklesIcon } from "@heroicons/react/solid"; // 1. Import SparklesIcon
import axiosInstance from "../../configs/axiosConfigs";
import { Question } from "../../interfaces/Questions.interface";

interface QuestionRowProps {
    question: Question;
    handleEdit: (q: Question) => void;
    onReload: () => void;
    index: number;
    handleGenerateAI: (q: Question) => void; // 2. Thêm prop này
}

export default function QuestionRow({ question, handleEdit, onReload, handleGenerateAI, index }: QuestionRowProps) {

    const handleDelete = async () => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm("Bạn chắc chắn muốn xóa câu hỏi này?")) return;
        try {
            await axiosInstance.delete(`/exam/delete-question/${question.id}`);
            onReload();
        } catch (error: any) {
            alert(error.response?.data || "Lỗi khi xóa");
        }
    };

    return (
        <tr className="border-b hover:bg-gray-50 group">
            <td className="px-4 py-3 text-center border text-gray-500">{index}</td>

            <td className="px-4 py-3 border">
                <div className="font-semibold text-gray-800 mb-1">{question.name}</div>
                <div className="text-sm">
                    <span className="text-gray-500">Đáp án đúng: </span>
                    {question.correctAns.map((ans, i) => (
                        <span key={i} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mr-1 border border-green-200">
                            {ans}
                        </span>
                    ))}
                </div>
            </td>

            <td className="px-4 py-3 border text-center">
                {question.type === 'radio' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        1 Lựa chọn
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Nhiều lựa chọn
                    </span>
                )}
            </td>

            <td className="px-4 py-3 border text-center">
                <div className="flex justify-center space-x-2 opacity-100">
                    {/* 3. Thêm nút AI mới */}
                    <button
                        onClick={() => handleGenerateAI(question)}
                        className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-1 rounded transition"
                        title="Tạo câu hỏi tương tự (AI)"
                    >
                        <SparklesIcon className="h-5 w-5" />
                    </button>

                    <button
                        onClick={() => handleEdit(question)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1 rounded transition"
                        title="Sửa"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                        title="Xóa"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
}