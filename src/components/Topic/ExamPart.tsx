import { useEffect, useState } from "react";
import { Exam } from "../../interfaces/Exam.interface";
import axiosInstance from "../../configs/axiosConfigs";
import SearchAndLimit from "../SearchInput";
import Pagination from "../Pagination";
import { Link } from "react-router-dom";

export default function ExamTopic({ id }: { id: string }) {
  // --- LOGIC GIỮ NGUYÊN ---
  const [list, setList] = useState<Exam[]>([]);
  const [limit, setLimit] = useState(5);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchExam = async () => {
    try {
      const response = await axiosInstance.get(`/exam/list`, {
        params: {
          topic_id: id,
          limit,
          page,
          key_name: search,
        },
      });
      let data = response.data.data;
      setList(data.exams);
      setTotalStudents(data.count);
      let ttPage = Math.ceil(data.count / limit);
      setTotalPages(ttPage);
    } catch (error: any) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchExam();
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
          Tổng số bài thi: <span className="text-blue-600 font-bold">{totalStudents}</span>
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
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tên bài thi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Chủ đề
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Đã làm
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ngày khởi tạo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {list.length > 0 ? (
                  list.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 font-mono">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">
                        <Link to={`/exam/${item.slug}`} className="hover:underline hover:text-blue-800">
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.topic.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                          {item.studentDid}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {item.createdAt}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                      Chưa có bài thi nào thuộc chủ đề này.
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