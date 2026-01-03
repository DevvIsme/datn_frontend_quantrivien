/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import SearchAndLimit from "../../SearchInput";
import axiosInstance from "../../../configs/axiosConfigs";
import Pagination from "../../Pagination";
import { ExamResult } from "../../../interfaces/Exam.interface";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
// @ts-ignore
import { DownloadIcon } from "@heroicons/react/solid";

export default function AttendList({ id }: { id: string }) {
  const [list, setList] = useState<ExamResult[]>([]);
  const [limit, setLimit] = useState(5);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const parseCustomDate = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      // Tách phần ngày và giờ dựa trên chuỗi " : "
      const parts = dateStr.split(' : ');
      if (parts.length !== 2) return new Date(dateStr); // Fallback nếu format khác

      const datePart = parts[0]; // "17/12/2025"
      const timePart = parts[1]; // "08:34:41"

      // Tách ngày/tháng/năm
      const [day, month, year] = datePart.split('/');

      // Tạo chuỗi chuẩn ISO: "YYYY-MM-DDTHH:mm:ss"
      const isoString = `${year}-${month}-${day}T${timePart}`;

      return new Date(isoString);
    } catch (e) {
      return null;
    }
  };

  const fetchResult = async () => {
    try {
      const response = await axiosInstance.get(`/exam/list-attend/${id}`, {
        params: { limit, page, key_name: search },
      });
      let data = response.data.data;
      setList(data.results);
      setTotalResults(data.count);
      let ttPage = Math.ceil(data.count / limit);
      setTotalPages(ttPage);
    } catch (error: any) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [limit, page, search]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const response = await axiosInstance.get(`/exam/list-attend/${id}`, {
        params: { limit: 10000, page: 1, key_name: search },
      });

      const fullData = response.data.data.results;

      if (!fullData || fullData.length === 0) {
        alert("Không có dữ liệu để xuất!");
        setIsExporting(false);
        return;
      }

      const excelData = fullData.map((item: any) => ({
        "Mã Bài Làm": item.id,
        "Mã Học Sinh": item.student?.id,
        "Tên Học Sinh": item.student?.fullName,
        "Điểm Số": item.point,
        "Số Câu Đúng": item.correctAns,
        "Trạng Thái": item.isPass ? "Đạt" : "Chưa đạt",
        "Thời Gian Nộp": item.submitAt || "Chưa nộp",
        "Ngày Tạo": item.createdAt,
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const wscols = [
        { wch: 10 }, { wch: 10 }, { wch: 25 }, { wch: 10 },
        { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 20 },
      ];
      worksheet['!cols'] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Lịch Sử Làm Bài");
      XLSX.writeFile(workbook, `Lich_Su_Lam_Bai_${id}.xlsx`);

    } catch (error) {
      console.error("Export error:", error);
      alert("Có lỗi khi xuất file Excel");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">

        {/* Title */}
        <div className="shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Lịch sử làm bài</h2>
          <p className="text-sm text-gray-500 mt-1">Tổng số: <span className="font-bold text-blue-600">{totalResults}</span> bài nộp</p>
        </div>

        {/* Actions Area */}
        {/* SỬA: Dùng items-start hoặc items-center tuỳ thuộc vào SearchInput. 
             Thường SearchInput có margin nên items-start an toàn hơn, nhưng items-center đẹp hơn nếu SearchInput chuẩn.
             Ở đây dùng items-center và fix nút button.
         */}
        <div className="flex flex-col sm:flex-row gap-3 ">

          <div className="h-[40px] flex items-start pt-[1px] ">
            <SearchAndLimit
              search={search}
              setSearch={setSearch}
              limit={limit}
              setLimit={setLimit}
            />
          </div>

          {/* FIX LỆCH TRIỆT ĐỂ:
                1. Bỏ h-[42px] cứng.
                2. Dùng py-2 (8px) giống hệt input chuẩn (p-2).
                3. Thêm border border-transparent (1px) để bù lại viền của input.
                4. Dùng text-sm hoặc text-base tùy theo input của bạn. (Thường input là text-base hoặc text-sm).
            */}
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className={`
                    px-5 py-2 border border-transparent rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap
                    ${isExporting
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md hover:-translate-y-0.5"
              }
                `}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Đang xuất...</span>
              </>
            ) : (
              <>
                <DownloadIcon className="w-5 h-5" />
                <span>Xuất Excel</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <th className="px-6 py-4 text-center w-24">ID Bài</th>
              <th className="px-6 py-4 text-center w-28">ID HV</th>
              <th className="px-6 py-4">Học sinh tham gia</th>
              <th className="px-6 py-4 text-center">Điểm số</th>
              <th className="px-6 py-4 text-center">Câu đúng</th>
              <th className="px-6 py-4 text-center">Tham gia lúc</th>
              <th className="px-6 py-4 text-center">Nộp bài lúc</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.length > 0 ? (
              list.map((item: any) => (
                <tr key={item.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                  <td className="px-6 py-4 text-center font-medium text-gray-600">#{item.id}</td>
                  <td className="px-6 py-4 text-center text-gray-500 text-sm">{item.student?.id}</td>
                  <td className="px-6 py-4">
                    <Link to={`/student/${item.student?.id}`} className="text-gray-900 font-semibold hover:text-blue-600 hover:underline transition-colors">
                      {item.student?.fullName || "Không xác định"}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-bold ${item.point >= 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.point}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700 font-medium">{item.correctAns}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    {item.createdAt
                      ? parseCustomDate(item.createdAt)?.toLocaleString('vi-VN')
                      : '-'}                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    {item.submitAt
                      ? parseCustomDate(item.submitAt)?.toLocaleString('vi-VN')
                      : 'Chưa nộp'}                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500 italic">Chưa có dữ liệu bài làm nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <Pagination currentPage={page} onPageChange={handlePageChange} totalPages={totalPages} />
      </div>
    </div>
  );
}