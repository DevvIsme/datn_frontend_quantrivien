import { useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";
// @ts-ignore
import { UploadIcon, DownloadIcon } from "@heroicons/react/solid";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function ImportQuestionModal({ onClose, onSuccess }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // Tải file mẫu
    const handleDownloadTemplate = () => {
        import("xlsx").then((XLSX) => {
            const headers = [
                ["Câu hỏi", "Loại", "A", "B", "C", "D", "Đáp án đúng", "ID Chủ đề"],
                ["1 + 1 bằng mấy?", "radio", "1", "2", "3", "4", "B", "1"],
                ["Chọn số chẵn", "nhiều", "1", "2", "3", "4", "B,D", "1"]
            ];
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(headers);
            XLSX.utils.book_append_sheet(wb, ws, "Mau_Cau_Hoi");
            XLSX.writeFile(wb, "Mau_Import_Cau_Hoi.xlsx");
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setErrors([]); // Reset lỗi
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Vui lòng chọn file!");

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const res = await axiosInstance.post("/exam/question/import", formData);

            alert(`Thành công! Đã thêm ${res.data.count} câu hỏi.`);
            onSuccess(); // Reload list
            onClose();   // Đóng modal
        } catch (error: any) {
            console.error(error);
            const data = error.response?.data;
            if (data?.errors) {
                setErrors(data.errors);
            } else {
                alert(data || "Lỗi khi upload file.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // SỬA: Bỏ hết fixed inset-0, bg-black, bg-white...
        // Chỉ giữ lại form với padding p-6
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Bước 1: Tải file mẫu */}
            <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Bước 1: Tải file mẫu và nhập dữ liệu</p>
                <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-2 text-blue-700 hover:text-blue-900 text-sm font-semibold border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg w-full justify-center transition-colors"
                >
                    <DownloadIcon className="w-5 h-5" /> Tải xuống file mẫu (.xlsx)
                </button>
            </div>

            {/* Bước 2: Chọn file */}
            <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Bước 2: Tải lên file đã nhập liệu</p>
                <div className="relative group">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                    />
                    <label
                        htmlFor="fileInput"
                        className={`
                            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all block
                            ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
                        `}
                    >
                        <UploadIcon className={`w-12 h-12 mx-auto mb-3 ${file ? 'text-green-500' : 'text-gray-400 group-hover:text-blue-500'}`} />

                        <span className="block text-sm font-medium text-gray-700">
                            {file ? (
                                <span className="text-green-700 font-bold">{file.name}</span>
                            ) : (
                                <span>Click để chọn file Excel hoặc kéo thả vào đây</span>
                            )}
                        </span>
                        {!file && <span className="block text-xs text-gray-400 mt-1">Hỗ trợ định dạng .xlsx, .xls</span>}
                    </label>
                </div>
            </div>

            {/* Hiển thị lỗi nếu có */}
            {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg max-h-40 overflow-y-auto custom-scrollbar">
                    <p className="text-red-700 font-bold text-sm mb-2 flex items-center gap-2">
                        ⚠️ Import thất bại, vui lòng kiểm tra:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        {errors.map((err, idx) => (
                            <li key={idx} className="text-xs text-red-600 font-medium">{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                    Hủy bỏ
                </button>
                <button
                    type="submit"
                    disabled={loading || !file}
                    className={`
                        px-5 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 shadow-sm transition-all
                        ${loading || !file
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5'
                        }
                    `}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>Đang xử lý...</span>
                        </>
                    ) : (
                        <span>Bắt đầu Import</span>
                    )}
                </button>
            </div>
        </form>
    );
}