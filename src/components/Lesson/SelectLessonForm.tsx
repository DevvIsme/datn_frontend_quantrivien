import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import LoadingSpinner from "../Loading";
import { Lesson } from "../../interfaces/Lesson.interface";

interface SelectLessonFormProps {
    courseId: number;
    onClose: () => void;
    onReload: () => void;
}

const SelectLessonForm: React.FC<SelectLessonFormProps> = ({
    courseId,
    onClose,
    onReload,
}) => {
    const [allLessons, setAllLessons] = useState<Lesson[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // 1. Logic lấy danh sách (Giữ nguyên)
    useEffect(() => {
        const fetchAllLessons = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get("/lesson/list?limit=100");
                setAllLessons(res.data.data.data.lessons || []);
            } catch (error) {
                console.error("Lỗi lấy danh sách bài học:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllLessons();
    }, []);

    // 2. Logic Checkbox (Giữ nguyên)
    const handleCheckboxChange = (lessonId: number) => {
        setSelectedIds((prev) => {
            if (prev.includes(lessonId)) {
                return prev.filter((id) => id !== lessonId);
            } else {
                return [...prev, lessonId];
            }
        });
    };

    // 3. Logic Submit (Giữ nguyên)
    const handleSubmit = async () => {
        if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất 1 bài học!");
            return;
        }
        try {
            await axiosInstance.post("/material/add-lessons-to-course", {
                course_id: courseId,
                lesson_ids: selectedIds,
            });
            alert("Thêm bài học vào khóa học thành công!");
            onReload();
            onClose();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Lỗi khi thêm bài học!");
        }
    };

    // Filter Logic (Giữ nguyên)
    const filteredLessons = allLessons.filter((l) =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- HELPER UI: Mapping loại bài học sang Badge đẹp (Chỉ để hiển thị) ---
    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'video': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold border border-red-200">Youtube</span>;
            case 'upload_video': return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold border border-purple-200">Video Upload</span>;
            case 'pdf': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold border border-yellow-200">PDF</span>;
            case 'text': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold border border-blue-200">Văn bản</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold border border-gray-200">{type}</span>;
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-gray-50/50">

            {/* HEADER & SEARCH AREA */}
            <div className="p-4 bg-white border-b border-gray-200 shadow-sm z-10">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài học để thêm..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
                    <span>Đã tìm thấy: <strong>{filteredLessons.length}</strong> bài học</span>
                    <span>Đã chọn: <strong className="text-blue-600">{selectedIds.length}</strong> bài học</span>
                </div>
            </div>

            {/* TABLE LIST AREA */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-full text-gray-500 gap-3">
                        <LoadingSpinner />
                        <span className="text-base">Đang tải danh sách bài học...</span>
                    </div>
                ) : filteredLessons.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center w-16">
                                        <span className="sr-only">Select</span>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Tên bài học
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center w-32 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Loại
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLessons.map((lesson) => {
                                    const isSelected = selectedIds.includes(Number(lesson.id));
                                    return (
                                        <tr
                                            key={lesson.id}
                                            className={`transition-colors duration-150 cursor-pointer ${isSelected ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}
                                            onClick={() => handleCheckboxChange(Number(lesson.id))} // Cho phép click cả dòng để chọn
                                        >
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => { }} // Đã handle ở tr onClick
                                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer pointer-events-none" // pointer-events-none để tránh conflict click 2 lần
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-base font-medium text-gray-900">
                                                {lesson.name}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getTypeBadge(lesson.type)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p>Không tìm thấy bài học nào phù hợp.</p>
                    </div>
                )}
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="text-base text-gray-600">
                    {selectedIds.length > 0 ? (
                        <span>Đang chọn <span className="font-bold text-blue-600">{selectedIds.length}</span> mục</span>
                    ) : (
                        <span>Chưa chọn mục nào</span>
                    )}
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-base font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={selectedIds.length === 0}
                        className={`px-5 py-2.5 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-md flex items-center gap-2 transition-all
                            ${selectedIds.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:-translate-y-0.5'}`}
                    >
                        <span>Thêm vào khóa học</span>
                        {selectedIds.length > 0 && (
                            <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs ml-1">
                                {selectedIds.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectLessonForm;