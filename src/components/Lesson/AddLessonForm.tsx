import React, { useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import { AddLessFormProps } from "../../interfaces/Form.interface";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function AddLessonForm({ onClose, onReload }: AddLessFormProps) {
  const [name, setName] = useState("");
  // context: Sẽ chứa nội dung Text, hoặc Link Youtube, HOẶC Link Cloudinary (nếu upload)
  const [context, setContext] = useState("");
  const [type, setType] = useState("text");

  // State quản lý việc upload
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState(""); // Để hiển thị tên file sau khi up xong

  // --- HÀM 1: UPLOAD NGAY KHI CHỌN FILE ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate kích thước (Ví dụ: Video < 100MB, PDF < 10MB)
    const limit = type === 'upload_video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > limit) {
      alert(`File quá lớn! Vui lòng chọn file < ${type === 'upload_video' ? '100MB' : '10MB'}`);
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file); // Key 'file' phải trùng với backend uploadCloud.single('file')

      // Gọi API Upload riêng
      const res = await axiosInstance.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Lấy URL từ server trả về
      // (Lưu ý: check lại console log xem backend trả về biến 'url' nằm ở đâu trong object data)
      const uploadedUrl = res.data.data.url;

      setContext(uploadedUrl); // Lưu URL vào context
      setFileName(file.name);
      console.log("Upload thành công:", uploadedUrl);

    } catch (error) {
      console.error("Lỗi upload:", error);
      alert("Upload thất bại! Vui lòng thử lại.");
      setFileName("");
      setContext("");
    } finally {
      setIsUploading(false);
    }
  };

  // --- HÀM 2: SUBMIT FORM (GỬI JSON) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert("Vui lòng nhập tên bài học"); return; }

    // Kiểm tra nếu đang chọn loại upload mà chưa có link (chưa up xong)
    if (['upload_video', 'pdf'].includes(type) && !context) {
      alert("Vui lòng upload file trước khi lưu!");
      return;
    }
    if (type === 'video' && !context) {
      alert("Vui lòng nhập link Youtube!");
      return;
    }

    try {
      // Vì đã có URL rồi, ta gửi JSON bình thường, không cần FormData nữa
      const payload = {
        name: name,
        type: type,
        context: context, // Đây chính là URL ảnh/pdf/video hoặc nội dung text
        course_id: 0 // Nếu backend yêu cầu course_id ở đây thì thêm vào, hoặc API xử lý riêng
      };

      const response = await axiosInstance.post("/lesson/create", payload);

      alert(response.data?.message || "Thêm bài học thành công!");
      onClose();
      onReload();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Hàng 1: Tên & Loại */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên bài học <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: Bài 1 - Giới thiệu..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Loại tài nguyên</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setContext("");
                setFileName("");
              }}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="text">📄 Soạn thảo văn bản</option>
              <option value="video">🔴 Youtube Video</option>
              <option value="upload_video">🎬 Video tải lên (MP4)</option>
              <option value="pdf">📚 Tài liệu PDF</option>
            </select>
          </div>
        </div>

        {/* Hàng 2: Nội dung chi tiết */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">

          {/* TRƯỜNG HỢP 1: TEXT EDITOR */}
          {type === "text" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung văn bản</label>
              <div className="prose max-w-none border rounded-lg overflow-hidden">
                <CKEditor
                  editor={ClassicEditor}
                  data={context}
                  onChange={(event: any, editor: any) => setContext(editor.getData())}
                />
              </div>
            </div>
          )}

          {/* TRƯỜNG HỢP 2: YOUTUBE */}
          {type === "video" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Link YouTube</label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {/* TRƯỜNG HỢP 3: UPLOAD FILE (Video/PDF) */}
          {['upload_video', 'pdf'].includes(type) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {type === 'upload_video' ? 'Upload Video (MP4)' : 'Upload Tài liệu (PDF)'}
              </label>

              <label className={`
                    flex flex-col items-center justify-center w-full h-48 
                    border-2 border-dashed rounded-xl cursor-pointer transition-all
                    ${isUploading ? 'bg-gray-100 border-gray-400 cursor-not-allowed' : 'bg-blue-50/50 border-blue-300 hover:bg-blue-50'}
                `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">

                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                      <p className="text-sm font-medium text-gray-600">Đang tải lên server...</p>
                      <p className="text-xs text-gray-400 mt-1">Vui lòng không đóng cửa sổ</p>
                    </>
                  ) : context ? (
                    // Đã upload xong
                    <>
                      <div className="bg-green-100 text-green-600 p-3 rounded-full mb-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <p className="text-sm font-bold text-gray-800 break-all max-w-md">{fileName || "File đã tải lên"}</p>
                      <p className="text-xs text-green-600 mt-1 font-medium">Sẵn sàng để lưu!</p>
                      <p className="text-xs text-gray-400 mt-2 hover:text-blue-500 underline">Click để thay file khác</p>
                    </>
                  ) : (
                    // Chưa upload
                    <>
                      <svg className="w-10 h-10 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click để chọn file</span> hoặc kéo thả</p>
                      <p className="text-xs text-gray-400">
                        {type === 'upload_video' ? 'MP4 (Max 100MB)' : 'PDF (Max 10MB)'}
                      </p>
                    </>
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
        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Đóng</button>
        <button
          type="submit"
          disabled={isUploading}
          className={`px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? "Đang Upload..." : "Thêm Bài Học"}
        </button>
      </div>
    </form>
  );
}