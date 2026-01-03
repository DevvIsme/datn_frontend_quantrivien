import React, { useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import { AddLessFormProps } from "../../interfaces/Form.interface";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function AddLessonForm({ onClose, onReload }: AddLessFormProps) {
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [type, setType] = useState("text");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Xác nhận thêm bài học?")) return;

    if (['upload_video', 'pdf'].includes(type) && !file) {
      alert("Vui lòng chọn file cần upload!");
      return;
    }
    if (['text', 'video'].includes(type) && !context.trim()) {
      alert(type === 'video' ? "Vui lòng nhập link Youtube" : "Vui lòng nhập nội dung bài học");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);

      if (['upload_video', 'pdf'].includes(type) && file) {
        formData.append("file", file);
        formData.append("context", "");
      } else {
        formData.append("context", context);
      }

      const response = await axiosInstance.post("/lesson/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data?.message || "Thêm bài học thành công!");
      onClose();
      onReload();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  return (
    // THAY ĐỔI: Thêm class 'p-6' để tạo khoảng cách với viền Modal
    <form onSubmit={handleSubmit} className="flex flex-col h-full">

      {/* PHẦN NỘI DUNG CHÍNH (Có cuộn dọc nếu dài) */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* CỘT TRÁI: TÊN BÀI HỌC */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên bài học <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="VD: Bài 1 - Giới thiệu..."
            />
          </div>

          {/* CỘT PHẢI: LOẠI TÀI NGUYÊN */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Loại tài nguyên</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setFile(null);
                setContext("");
              }}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
            >
              <option value="text">📄 Soạn thảo văn bản (Text)</option>
              <option value="video">🔴 Youtube Video (Nhúng)</option>
              <option value="upload_video">🎬 Video tải lên (MP4)</option>
              <option value="pdf">📚 Tài liệu PDF</option>
            </select>
          </div>

          {/* HÀNG DƯỚI: NỘI DUNG (CHIẾM FULL 2 CỘT) */}
          <div className="md:col-span-2">

            {/* TRƯỜNG HỢP 1: TEXT EDITOR */}
            {type === "text" && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung chi tiết</label>
                <div className="prose max-w-none border border-gray-300 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <CKEditor
                    editor={ClassicEditor}
                    data={context}
                    onChange={(event: any, editor: any) =>
                      setContext(editor.getData())
                    }
                  />
                </div>
              </div>
            )}

            {/* TRƯỜNG HỢP 2: YOUTUBE */}
            {type === "video" && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Đường dẫn YouTube</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                  </div>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Paste link Youtube vào đây..."
                    className="w-full pl-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* TRƯỜNG HỢP 3: FILE UPLOAD */}
            {['upload_video', 'pdf'].includes(type) && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {type === 'upload_video' ? 'Tải lên Video (MP4)' : 'Tải lên tài liệu (PDF)'}
                </label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    {file ? (
                      <>
                        <svg className="w-10 h-10 mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-sm text-gray-900 font-bold truncate max-w-md">{file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Nhấn để đổi file khác</p>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-gray-500 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        </div>
                        <p className="mb-1 text-sm text-gray-500"><span className="font-bold text-gray-700">Click tải lên</span> hoặc kéo thả</p>
                        <p className="text-xs text-gray-400 uppercase">{type === 'upload_video' ? 'MP4 (Max 500MB)' : 'PDF only'}</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept={type === 'upload_video' ? 'video/mp4,video/*' : '.pdf'}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER BUTTONS: Tách biệt hẳn xuống dưới cùng với nền xám nhẹ */}
      <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-100 transition-all"
        >
          Đóng
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all flex items-center gap-2
            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
        >
          {loading && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
          {loading ? "Đang xử lý..." : "Thêm Bài Học"}
        </button>
      </div>
    </form>
  );
}