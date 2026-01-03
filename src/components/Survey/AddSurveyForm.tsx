import { useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";

interface AddSurveyFormProps {
  onSuccess?: () => void;
}

export default function AddSurveyForm({ onSuccess }: AddSurveyFormProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");

  const [dueAt, setDueAt] = useState(() => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);

    const offset = currentDate.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(currentDate.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!name.trim()) {
      setErrors({ name: "Tên khảo sát không được để trống" });
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/survey/create/", {
        name,
        dueAt,
        status,
        list_question_ids: []
      });

      alert("Tạo đợt khảo sát thành công!");

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || error.response?.data || "Có lỗi xảy ra";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Thêm padding p-6 cho toàn bộ form để không bị sát lề modal
    <form onSubmit={handleSubmit} className="bg-white p-6">

      {/* Tăng khoảng cách giữa các khối từ space-y-5 lên space-y-8 */}
      <div className="space-y-8">

        {/* Tên khảo sát */}
        <div>
          {/* Tăng margin-bottom của label từ mb-2 lên mb-3 */}
          <label className="block mb-3 text-sm font-semibold text-gray-700">
            Tên bài khảo sát <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
              ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
            placeholder="Ví dụ: Khảo sát chất lượng đào tạo Spring 2025..."
            required
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-2 italic flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Tăng khoảng cách giữa 2 cột từ gap-5 lên gap-8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Trạng thái */}
          <div>
            <label className="block mb-3 text-sm font-semibold text-gray-700">
              Trạng thái
            </label>
            <div className="relative">
              {/* Tăng padding-y cho select (py-3) */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white pr-10"
              >
                <option value="active">🟢 Đang hoạt động (Active)</option>
                <option value="hidden">⚪ Ẩn (Hidden)</option>
                <option value="locked">🔴 Đã khóa (Locked)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Trạng thái hiển thị đối với sinh viên.</p>
          </div>

          {/* Hạn chót */}
          <div>
            <label className="block mb-3 text-sm font-semibold text-gray-700">
              Hạn chót nộp bài
            </label>
            {/* Tăng padding-y cho input date (py-3) */}
            <input
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              required
            />
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center px-8 py-3 rounded-lg text-sm font-medium text-white shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${loading
              ? 'bg-blue-400 cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            "Tạo khảo sát"
          )}
        </button>
      </div>
    </form>
  );
}