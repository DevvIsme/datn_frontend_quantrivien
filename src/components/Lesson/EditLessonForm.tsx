import React, { useState, useEffect } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { EditLessFormProps } from "../../interfaces/Form.interface";

export default function EditLessonForm({ onClose, lessonId, onReload }: EditLessFormProps) {
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [type, setType] = useState("text");
  const [file, setFile] = useState<File | null>(null);
  const [oldFileUrl, setOldFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await axiosInstance.get(`/lesson/${lessonId}`);
        const data = response.data.data.data;

        setName(data.name);
        setType(data.type);
        if (data.type === 'text' || data.type === 'video') {
          setContext(data.context || "");
        } else {
          setOldFileUrl(data.context || data.url || "");
        }
      } catch (error: any) {
        alert("Không tải được thông tin bài học!");
        onClose();
      }
    };
    fetchLessonData();
  }, [lessonId, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Lưu thay đổi bài học này?")) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);

      if (['upload_video', 'pdf'].includes(type)) {
        if (file) {
          formData.append("file", file);
        }
        formData.append("context", "");
      } else {
        formData.append("context", context);
      }

      const response = await axiosInstance.put(`/lesson/update/${lessonId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data?.message || "Cập nhật thành công!");
      onReload();
      onClose();
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
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* NỘI DUNG CHÍNH - PADDING P-6 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* TÊN */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên bài học</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* LOẠI */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Loại tài nguyên</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setFile(null);
              }}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="text">📄 Soạn thảo văn bản (Text)</option>
              <option value="video">🔴 Youtube Video (Nhúng)</option>
              <option value="upload_video">🎬 Video tải lên (MP4)</option>
              <option value="pdf">📚 Tài liệu PDF</option>
            </select>
          </div>

          {/* FULL WIDTH CONTENT */}
          <div className="md:col-span-2">
            {/* TEXT EDITOR */}
            {type === "text" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung chi tiết</label>
                <div className="prose max-w-none border border-gray-300 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                  <CKEditor
                    editor={ClassicEditor}
                    data={context}
                    onChange={(event: any, editor: any) => setContext(editor.getData())}
                  />
                </div>
              </div>
            )}

            {/* YOUTUBE */}
            {type === "video" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Đường dẫn YouTube</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                  </div>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full pl-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* FILE UPLOAD */}
            {['upload_video', 'pdf'].includes(type) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {type === 'upload_video' ? 'Cập nhật Video' : 'Cập nhật PDF'}
                </label>

                {/* Cảnh báo file cũ */}
                {!file && oldFileUrl && (
                  <div className="flex items-center p-3 mb-3 text-sm text-yellow-800 border border-yellow-200 rounded-lg bg-yellow-50">
                    <svg className="flex-shrink-0 inline w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                    <span>Đang sử dụng file cũ. Upload file mới bên dưới nếu muốn thay đổi.</span>
                  </div>
                )}

                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {file ? (
                      <>
                        <svg className="w-10 h-10 mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-sm text-gray-900 font-bold">{file.name}</p>
                        <p className="text-xs text-gray-500">Nhấn để chọn lại</p>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        </div>
                        <p className="mb-1 text-sm text-gray-500"><span className="font-bold text-gray-700">Tải lên file mới</span></p>
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

      {/* FOOTER */}
      <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center gap-2
             ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
        >
          {loading && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}