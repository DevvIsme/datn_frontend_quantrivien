import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import SearchAndLimit from "../../components/SearchInput";
import Modal from "../../components/Modal";
import LoadingSpinner from "../../components/Loading";
import axiosInstance from "../../configs/axiosConfigs";

import LessonRow from "../../components/Lesson/Lesson.row";
import AddLessonForm from "../../components/Lesson/AddLessonForm";
import EditLessonForm from "../../components/Lesson/EditLessonForm";
import { Lesson } from "../../interfaces/Lesson.interface";

export default function LessonPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [totalLessons, setTotalLessons] = useState<number>(0);

    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

    const fetchLessons = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/lesson/list", {
                params: { page, limit, key_name: search },
            });
            // Kiểm tra kỹ cấu trúc data trả về để tránh lỗi undefined
            const dataSource = res.data?.data?.data || {};
            setLessons(dataSource.lessons ?? []);
            setTotalLessons(dataSource.count ?? 0);
            setTotalPages(Math.ceil((dataSource.count ?? 0) / limit));
        } catch (err) {
            console.error("Error fetch lessons", err);
            setLessons([]);
            setTotalLessons(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLessons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, search]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleAddLesson = () => {
        setModalTitle("Thêm bài học mới");
        setModalContent(<AddLessonForm onClose={closeModal} onReload={fetchLessons} />);
        setIsModalOpen(true);
    };

    const handleEditLesson = (id: string) => {
        setModalTitle("Chỉnh sửa bài học");
        setModalContent(<EditLessonForm onClose={closeModal} onReload={fetchLessons} lessonId={id} />);
        setIsModalOpen(true);
    };

    // Hàm delete này nên gọi API thực tế rồi mới reload
    const handleDeleteLesson = (id: string) => {
        setTotalLessons((prev) => prev - 1);
        setLessons((prev) => prev.filter((l) => l.id !== id));
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50/50 p-6 overflow-hidden font-sans">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Quản lý Bài học</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Danh sách và quản lý các bài học trong hệ thống LMS
                    </p>
                </div>

                {/* Stat Badge */}
                <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                    <span className="text-sm text-gray-500 mr-2">Tổng số bài học:</span>
                    <span className="text-lg font-bold text-blue-600">{totalLessons}</span>
                </div>
            </div>

            {/* --- TOOLBAR SECTION --- */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <div className="w-full sm:w-auto flex-1">
                    <SearchAndLimit
                        search={search}
                        setSearch={setSearch}
                        limit={limit}
                        setLimit={setLimit}
                    />
                </div>

                <button
                    onClick={handleAddLesson}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 whitespace-nowrap"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Thêm bài học
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>

            {/* --- TABLE SECTION --- */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden animate-fade-in">

                {/* Table Header & Body Wrapper */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm border-b border-gray-200">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-bold text-gray-600 w-20">ID</th>
                                    <th scope="col" className="px-6 py-4 font-bold text-gray-600">Tên bài học</th>
                                    <th scope="col" className="px-6 py-4 font-bold text-gray-600">Loại</th>
                                    <th scope="col" className="px-6 py-4 font-bold text-gray-600">Ngày tạo</th>
                                    <th scope="col" className="px-6 py-4 font-bold text-gray-600 text-center w-32">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {lessons?.length > 0 ? (
                                    lessons.map((lesson, index) => (
                                        <LessonRow
                                            key={lesson.id}
                                            index={(page - 1) * 10 + (index + 1)}
                                            lesson={lesson}
                                            handleEdit={handleEditLesson}
                                            // Chú ý: Cần truyền handleDeleteLesson nếu LessonRow có nút xóa\

                                            onReload={fetchLessons}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                <p className="text-base font-medium">Không tìm thấy bài học nào</p>
                                                <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc thêm bài học mới</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* --- PAGINATION FOOTER --- */}
                {lessons?.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}