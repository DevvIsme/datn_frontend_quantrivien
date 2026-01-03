import { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import Pagination from "../Pagination";
// @ts-ignore
import { TrashIcon, PlusIcon, SearchIcon, UserGroupIcon, XIcon } from "@heroicons/react/solid";

interface Student {
    id: number;
    fullName: string;
    email: string;
}

export default function ExamStudentManager({ id }: { id: string }) {
    // State danh sách lớp
    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [totalStudents, setTotalStudents] = useState(0);

    // State Modal & Tìm kiếm
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchAdd, setSearchAdd] = useState("");
    const [searchResult, setSearchResult] = useState<Student[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [addingId, setAddingId] = useState<number | null>(null);

    // 1. Lấy danh sách lớp (Giữ nguyên)
    const fetchClassList = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/exam/students-in-exam/${id}`, {
                params: { limit: 10, page, key_name: search },
            });
            setList(response.data.data.students);
            setTotalStudents(response.data.data.count);
            setTotalPages(Math.ceil(response.data.data.count / 10));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search]);

    // 2. [QUAN TRỌNG] EFFECT TÌM KIẾM HỌC VIÊN
    useEffect(() => {
        // Nếu Modal chưa mở -> Không làm gì cả (để tiết kiệm tài nguyên)
        if (!isModalOpen) return;

        console.log("🟡 1. Effect chạy. Từ khóa:", searchAdd);

        // Tạo bộ đếm ngược
        const timeoutId = setTimeout(async () => {
            console.log("🟠 2. Timeout kích hoạt. Chuẩn bị gọi API...");
            setIsSearching(true);

            try {
                // Gọi API (KHÔNG KIỂM TRA RỖNG - RỖNG VẪN GỌI ĐỂ LẤY ALL)
                const url = `/student/list`;
                const params = { limit: 100,  key_name: searchAdd };

                console.log("🚀 3. Gọi Axios:", url, params);

                const res = await axiosInstance.get(url, { params });

                console.log("🟢 4. API Trả về:", res.data);

                // Logic bắt dữ liệu
                let studentsData: Student[] = [];

                // Kiểm tra các trường hợp trả về của API
                if (res.data.students && Array.isArray(res.data.students)) {
                    studentsData = res.data.students;
                } else if (res.data.data?.students && Array.isArray(res.data.data.students)) {
                    studentsData = res.data.data.students;
                } else if (Array.isArray(res.data.data)) {
                    studentsData = res.data.data;
                } else if (Array.isArray(res.data)) {
                    studentsData = res.data;
                }

                console.log("🔵 5. Dữ liệu sau xử lý:", studentsData);
                setSearchResult(studentsData);

            } catch (error) {
                console.error("🔴 Lỗi API Search:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [searchAdd, isModalOpen]); // <--- Chạy khi gõ phím HOẶC khi mở modal

    // 3. Xử lý Thêm
    const handleAddStudent = async (student: Student) => {
        try {
            setAddingId(student.id);
            await axiosInstance.post(`/exam/add-student/${id}`, { email: student.email });
            alert(`Đã thêm: ${student.fullName}`);
            fetchClassList();
            // Xóa khỏi danh sách gợi ý
            setSearchResult(prev => prev.filter(s => s.id !== student.id));
        } catch (error: any) {
            alert(error.response?.data || "Lỗi server");
        } finally {
            setAddingId(null);
        }
    };

    // 4. Xử lý Xóa
    const handleDelete = async (studentId: number) => {
        if (!window.confirm("Xóa học viên sẽ xóa hết lịch sử thi. Tiếp tục?")) return;
        try {
            await axiosInstance.delete(`/exam/remove-student-all/${id}/${studentId}`);
            alert("Đã xóa!");
            fetchClassList();
        } catch (error: any) {
            alert("Lỗi khi xóa");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <UserGroupIcon className="w-6 h-6 text-blue-600" /> Danh sách học viên ({totalStudents})
                </h2>
                <div className="flex gap-2">
                    <input type="text" placeholder="Tìm trong lớp..." className="border p-2 rounded text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-3 py-2 rounded text-sm flex gap-1">
                        <PlusIcon className="w-4 h-4" /> Thêm
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
                <table className="min-w-full bg-white text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-center">ID</th>
                            <th className="py-3 px-4 text-left">Học viên</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-center">Số lần thi</th>
                            <th className="py-3 px-4 text-center">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length > 0 ? list.map((item) => (
                            <tr key={item.student.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4 text-center">{item.student.id}</td>
                                <td className="py-3 px-4 font-bold text-blue-600">{item.student.fullName}</td>
                                <td className="py-3 px-4">{item.student.email}</td>
                                <td className="py-3 px-4 text-center">{item.total_attempts}</td>
                                <td className="py-3 px-4 text-center">
                                    <button onClick={() => handleDelete(item.student.id)} className="text-red-500 hover:text-red-700">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="text-center py-4 text-gray-400">Trống</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-2"><Pagination currentPage={page} onPageChange={setPage} totalPages={totalPages} /></div>

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-100">
                            <h3 className="font-bold">Thêm học viên</h3>
                            <button onClick={() => setIsModalOpen(false)}><XIcon className="w-6 h-6 text-gray-500" /></button>
                        </div>

                        <div className="p-4 flex-1 overflow-hidden flex flex-col">
                            <div className="relative mb-2">
                                <input
                                    type="text"
                                    className="w-full border p-2 pl-10 rounded focus:ring-2 ring-blue-500 outline-none"
                                    placeholder="Nhập tên/email để tìm..."
                                    value={searchAdd}
                                    onChange={(e) => setSearchAdd(e.target.value)} // Gõ phím -> State đổi -> Effect chạy
                                    autoFocus
                                />
                                {isSearching ? (
                                    <div className="absolute left-3 top-3 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                ) : (
                                    <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto border rounded bg-gray-50 p-2">
                                {searchResult.length > 0 ? (
                                    <ul className="space-y-2">
                                        {searchResult.map((student) => (
                                            <li key={student.id} className="bg-white p-2 rounded border flex justify-between items-center shadow-sm">
                                                <div>
                                                    <div className="font-bold text-sm">{student.fullName}</div>
                                                    <div className="text-xs text-gray-500">{student.email}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleAddStudent(student)}
                                                    disabled={addingId === student.id}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:bg-gray-400"
                                                >
                                                    {addingId === student.id ? "..." : "Thêm"}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center text-gray-500 py-4 text-sm">
                                        {isSearching ? "Đang tìm..." : "Không tìm thấy học viên nào."}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}