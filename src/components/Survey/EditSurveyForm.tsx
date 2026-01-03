import React, { useState } from "react";
import { Survey } from "../../interfaces/Survey.interface";
import axiosInstance from "../../configs/axiosConfigs";

interface Props {
    survey: Survey;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function EditSurveyForm({ survey, onSuccess, onCancel }: Props) {
    const [loading, setLoading] = useState(false);

    // --- HÀM XỬ LÝ NGÀY MẠNH MẼ HƠN (Logic giữ nguyên) ---
    const safeDateForInput = (dateString: any) => {
        if (!dateString) return "";

        let date: Date | null = null;

        // 1. Thử parse trực tiếp
        const d1 = new Date(dateString);
        if (!isNaN(d1.getTime())) {
            date = d1;
        }
        // 2. Nếu thất bại, thử parse format custom "DD/MM/YYYY : HH:mm:ss"
        else if (typeof dateString === 'string' && dateString.includes(' : ')) {
            try {
                const parts = dateString.split(' : ');
                const dParts = parts[0].split('/');
                const tParts = parts[1].split(':');

                if (dParts.length === 3 && tParts.length >= 2) {
                    date = new Date(
                        parseInt(dParts[2]),
                        parseInt(dParts[1]) - 1,
                        parseInt(dParts[0]),
                        parseInt(tParts[0]),
                        parseInt(tParts[1]),
                        parseInt(tParts[2] || '0')
                    );
                }
            } catch (e) {
                // Ignore error
            }
        }

        // 3. Convert sang format cho input datetime-local
        if (date && !isNaN(date.getTime())) {
            const offset = date.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
            return localISOTime;
        }

        return "";
    };
    // ------------------------------------

    const [formData, setFormData] = useState({
        name: survey.name,
        dueAt: safeDateForInput(survey.dueAt),
        status: (survey as any).status || "active",
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axiosInstance.put(`/survey/update/${survey.id}`, formData);
            alert("Cập nhật thành công!");

            if (onSuccess) onSuccess();
            else window.location.reload();

        } catch (error: any) {
            alert(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleUpdate} className="bg-white">
            <div className="space-y-6">

                {/* Tên khảo sát */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tên khảo sát
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hạn kết thúc */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Hạn kết thúc
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                            value={formData.dueAt}
                            onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
                            required
                        />
                        {/* Debug msg */}
                        {formData.dueAt === "" && survey.dueAt && (
                            <p className="text-xs text-red-500 mt-2 italic">
                                * Không thể đọc định dạng ngày: {String(survey.dueAt)}. Vui lòng chọn lại.
                            </p>
                        )}
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="active">🟢 Đang hoạt động (Active)</option>
                                <option value="hidden">⚪ Ẩn (Hidden)</option>
                                <option value="locked">🔴 Đã khóa (Locked)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                    >
                        Hủy
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center
                        ${loading ? 'opacity-70 cursor-wait' : ''}`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang lưu...
                        </>
                    ) : (
                        "Lưu thay đổi"
                    )}
                </button>
            </div>
        </form>
    );
}