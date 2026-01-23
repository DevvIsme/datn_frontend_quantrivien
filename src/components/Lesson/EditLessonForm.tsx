import React, { useState, useEffect } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { EditLessFormProps } from "../../interfaces/Form.interface";

export default function EditLessonForm({ onClose, lessonId, onReload }: EditLessFormProps) {
  const [name, setName] = useState("");
  const [context, setContext] = useState(""); // URL hoặc nội dung text
  const [type, setType] = useState("text");

  // State upload
  const [isUploading, setIsUploading] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await axiosInstance.get(`/lesson/${lessonId}`);
        // Giả sử API trả về data nằm ở response.data.data.data (check lại console log nhé)
        const data = response.data.data.data || response.data.data;

        setName(data.name);
        setType(data.type);
        setContext(data.context || ""); // context chứa URL video/pdf cũ
      } catch (error) {
        alert("Không tải được thông tin bài học!");
        onClose();
      }
    };
    fetchLessonData();
  }, [lessonId, onClose]);

  // --- HÀM UPLOAD MỚI (NẾU MUỐN ĐỔI FILE) ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = res.data.data.url;
      setContext(uploadedUrl); // Cập nhật context thành URL mới
      setNewFileName(file.name);
      console.log("Đã cập nhật file mới:", uploadedUrl);

    } catch (error) {
      console.error(error);
      alert("Lỗi upload file mới!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) { alert("Vui lòng đợi upload xong!"); return; }

    try {
      // Gửi JSON cập nhật
      const payload = {
        name: name,
        type: type,
        context: context // URL mới (nếu vừa up) hoặc URL cũ (nếu không up)
      };

      await axiosInstance.put(`/lesson/update/${lessonId}`, payload);

      alert("Cập nhật thành công!");
      onReload();
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên bài học</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Loại */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Loại tài nguyên</label>
            <select
              value={type}
              disabled // Thường khi edit ít khi cho đổi loại, nhưng nếu muốn thì bỏ disabled
              className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
            >
              <option value="text">Văn bản</option>
              <option value="video">Youtube</option>
              <option value="upload_video">Video Upload</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>

        {/* Nội dung */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          {type === "text" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung</label>
              <div className="prose max-w-none border rounded-lg overflow-hidden">
                <CKEditor
                  editor={ClassicEditor}
                  data={context}
                  onChange={(event: any, editor: any) => setContext(editor.getData())}
                />
              </div>
            </div>
          )}

          {type === "video" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Link Youtube</label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          {['upload_video', 'pdf'].includes(type) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cập nhật File</label>

              {/* Thông báo file hiện tại */}
              {!newFileName && context && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-center justify-between">
                  <span>📁 Đang dùng file hiện tại trên hệ thống.</span>
                  <a href={context} target="_blank" rel="noreferrer" className="underline font-bold">Xem file</a>
                </div>
              )}

              <label className={`
                    flex flex-col items-center justify-center w-full h-40 
                    border-2 border-dashed rounded-xl cursor-pointer transition-all
                    ${isUploading ? 'bg-gray-100' : 'bg-white hover:bg-gray-50 border-gray-300'}
                `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2 mx-auto"></div>
                      <span className="text-sm text-gray-500">Đang tải lên...</span>
                    </div>
                  ) : newFileName ? (
                    <div className="text-center">
                      <svg className="w-10 h-10 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <p className="text-sm font-bold">{newFileName}</p>
                      <p className="text-xs text-gray-400">Đã sẵn sàng lưu thay đổi</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      <p className="text-sm">Click để tải file mới thay thế</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  accept={type === 'upload_video' ? 'video/mp4,video/*' : '.pdf'}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t">
        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
        <button
          type="submit"
          disabled={isUploading}
          className={`px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 
            ${isUploading ? 'opacity-50' : ''}`}
        >
          {isUploading ? "Đang xử lý..." : "Lưu Thay Đổi"}
        </button>
      </div>
    </form>
  );
}