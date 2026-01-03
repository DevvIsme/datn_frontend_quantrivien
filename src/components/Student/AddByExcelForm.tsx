import React, { useState } from "react";
import * as XLSX from "xlsx";
import axiosInstance from "../../configs/axiosConfigs";

interface AddByExcelFormProps {
  onClose: () => void;
  onRefresh: () => void;
}

export default function AddByExcelForm({ onClose, onRefresh }: AddByExcelFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ added: string[]; skipped: any[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        gender: "Nam",
        phone: "0987654321",
        birthday: "2000-01-01",
      },
      {
        fullName: "Trần Thị B",
        email: "tranthib@example.com",
        gender: "Nữ",
        phone: "",
        birthday: "",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Mau_Nhap_Hoc_Vien.xlsx");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Vui lòng chọn file Excel!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/student/create/bulk/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { added, skipped } = response.data.data.data;
      setResult({ added, skipped });
      if (added.length > 0) onRefresh();

    } catch (error: any) {
      console.error(error);
      alert(error.response?.data || "Lỗi khi upload file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header hướng dẫn */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-blue-800">Hướng dẫn nhập liệu</h3>
          <p className="text-sm text-blue-600 mt-1">
            Vui lòng sử dụng file Excel (.xlsx) theo đúng định dạng mẫu.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Tải file mẫu
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Vùng upload file đẹp hơn */}
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click để chọn file</span> hoặc kéo thả vào đây</p>
              <p className="text-xs text-gray-500">XLSX, XLS (MAX. 5MB)</p>
            </div>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Hiển thị tên file đã chọn */}
        {file && (
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            File đã chọn: <span className="font-semibold">{file.name}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg transition shadow-md ${loading || !file
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Đang xử lý...
            </span>
          ) : "Bắt đầu Import"}
        </button>
      </form>

      {/* Kết quả sau khi Import */}
      {result && (
        <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-bold text-gray-800">Kết quả Import</h4>
            <div className="text-sm">
              <span className="text-green-600 font-semibold mr-3">Thành công: {result.added.length}</span>
              <span className="text-red-500 font-semibold">Bỏ qua: {result.skipped.length}</span>
            </div>
          </div>

          <div className="p-4 max-h-64 overflow-y-auto bg-white">
            {result.skipped.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 font-medium mb-2">Chi tiết lỗi:</p>
                {result.skipped.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm bg-red-50 p-2 rounded text-red-700">
                    <span className="font-mono font-bold whitespace-nowrap">{item.email}:</span>
                    <span>{item.reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-green-600 py-4">
                <svg className="w-12 h-12 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p>Tất cả dữ liệu đã được thêm thành công!</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-200 text-right">
            <button onClick={onClose} className="text-gray-600 font-medium hover:text-gray-900 text-sm">Đóng cửa sổ này</button>
          </div>
        </div>
      )}
    </div>
  );
}