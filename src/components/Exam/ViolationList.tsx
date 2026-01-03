import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import { format } from "date-fns"; // Hoặc dùng hàm formatTime của bạn

interface Violation {
    id: number;
    type: string;
    description: string;
    evidence_image: string | null;
    detectedAt: string;
    student: {
        fullName: string;
        email: string;
        avatar: string;
    };
}

const ViolationList = ({ slug }: { slug: string }) => {
    const [violations, setViolations] = useState<Violation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // State cho Popup ảnh

    useEffect(() => {
        const fetchViolations = async () => {
            try {
                const res = await axiosInstance.get(`/exam/violations/${slug}`);
                setViolations(res.data.data.data);
            } catch (error) {
                console.error("Lỗi tải danh sách vi phạm", error);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchViolations();
    }, [slug]);

    // Helper: Dịch loại lỗi sang tiếng Việt
    const translateType = (type: string) => {
        switch (type) {
            case "face_missing": return <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs font-bold">⚠️ Không thấy mặt</span>;
            case "multiple_faces": return <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs font-bold">🚫 Nhiều người</span>;
            case "detect_phone": return <span className="text-purple-600 bg-purple-100 px-2 py-1 rounded text-xs font-bold">📱 Dùng điện thoại</span>;
            case "cheating_tab_switch": return <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs font-bold">Tab trình duyệt</span>;
            default: return <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-bold">Khác</span>;
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                🚨 Lịch sử vi phạm ({violations.length})
            </h2>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
            ) : violations.length === 0 ? (
                <div className="text-center py-10 text-gray-400 italic">
                    Chưa ghi nhận vi phạm nào trong bài thi này.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học viên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lỗi vi phạm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bằng chứng</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {violations.map((v, index) => (
                                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{v.student.fullName}</div>
                                                <div className="text-xs text-gray-500">{v.student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            {translateType(v.type)}
                                            <span className="text-xs text-gray-400 italic max-w-[200px] truncate" title={v.description}>
                                                {v.description}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {/* Format ngày giờ */}
                                        {new Date(v.detectedAt).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {v.evidence_image ? (
                                            <button
                                                onClick={() => setSelectedImage(v.evidence_image || "")} // Mở popup
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                📷 Xem ảnh
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400">Không có ảnh</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- POPUP MODAL XEM ẢNH --- */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4" onClick={() => setSelectedImage(null)}>
                    <div className="relative bg-white rounded-lg p-2 max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 text-gray-600 z-10"
                        >
                            ✕
                        </button>
                        <div className="flex flex-col items-center">
                            <h3 className="text-gray-900 font-semibold mb-2">Bằng chứng vi phạm</h3>
                            {/* Backend cần config static folder để load được ảnh từ link này */}
                            <img
                                src={`http://localhost:3000/violations/violation_25_1765942828270.jpg`} // Thay localhost bằng URL server thực tế của bạn
                                alt="Evidence"
                                className="max-h-[80vh] w-auto rounded border border-gray-300"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViolationList;