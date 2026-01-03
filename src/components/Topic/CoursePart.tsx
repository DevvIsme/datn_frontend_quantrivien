import { useEffect, useState } from "react";
import { Course } from "../../interfaces/Course.interface";
import axiosInstance from "../../configs/axiosConfigs";
import SearchAndLimit from "../SearchInput";
import Pagination from "../Pagination";
import { Link } from "react-router-dom";

export default function CourseTopic({ id }: { id: string }) {
  // --- LOGIC GIỮ NGUYÊN ---
  const [list, setList] = useState<Course[]>([]);
  const [limit, setLimit] = useState(5);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchCourse = async () => {
    try {
      const response = await axiosInstance.get(`/course/list`, {
        params: {
          topic_id: id,
          limit,
          page,
          key_name: search,
        },
      });
      let data = response.data.data;
      setList(data.courses);
      setTotalStudents(data.count);
      let ttPage = Math.ceil(data.count / limit);
      setTotalPages(ttPage);
    } catch (error: any) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, search]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // --- GIAO DIỆN STYLE MỚI ---
  return (
    <div className="flex flex-col gap-4">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 w-fit">
          Tổng số khóa học: <span className="text-blue-600 font-bold">{totalStudents}</span>
        </div>
        <div className="w-full sm:w-auto">
          <SearchAndLimit
            search={search}
            setSearch={setSearch}
            limit={limit}
            setLimit={setLimit}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                    STT
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tên khóa học
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Chủ đề
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Loại khóa học
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Học viên
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ngày khởi tạo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {list.length > 0 ? (
                  list.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 font-mono">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">
                        <Link to={`/course/${item.slug}`} className="hover:underline hover:text-blue-800">
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.topic.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${item.type
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-orange-100 text-orange-800 border border-orange-200"
                          }`}>
                          {item.type ? "Miễn phí" : "Trả phí"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                        {item.studentCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {item.createdAt}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">
                      Chưa có khóa học nào thuộc chủ đề này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {list.length > 0 && (
        <div className="flex justify-end">
          <Pagination
            currentPage={page}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}