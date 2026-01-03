import { useEffect, useState } from "react";
import { Course } from "../../interfaces/Course.interface";
import axiosInstance from "../../configs/axiosConfigs";
import SearchAndLimit from "../SearchInput";
import Pagination from "../Pagination";
import { Link } from "react-router-dom";

export default function CourseStudent({ id }: { id: string }) {
  const [list, setList] = useState<Course[]>([]);
  const [limit, setLimit] = useState(5);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchCourse = async () => {
    try {
      const response = await axiosInstance.get(`/course/my-course/`, {
        params: {
          student_id: id,
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
      console.error("Error fetching courses:", error);
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

  return (
    <div className="space-y-4">
      {/* Header & Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Danh sách khóa học ({totalStudents})
        </h3>
        <div className="w-full sm:w-auto">
          <SearchAndLimit
            search={search}
            setSearch={setSearch}
            limit={limit}
            setLimit={setLimit}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  STT
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên khóa học
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ đề
                </th>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list.length > 0 ? (
                list.map((item: any, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/course/${item.slug}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.topic?.name || "Chưa phân loại"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-400 italic">
                    Học viên chưa tham gia khóa học nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      {list.length > 0 && (
        <div className="mt-4">
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