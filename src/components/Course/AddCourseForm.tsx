import React, { useState, useEffect } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import { AddFormProps } from "../../interfaces/Form.interface";
import { Topic } from "../../interfaces/Topic.interface";

export default function AddCourseForm({ onClose, onReload }: AddFormProps) {
  // --- STATE ---
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isUnlimited, setisUnlimited] = useState(true);
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [topicsList, setTopicsList] = useState<Topic[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  // Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axiosInstance.get("/topic/list");
        setTopicsList(res.data.data.topics);
      } catch {
        alert("Không thể tải danh sách chủ đề!");
      }
    };
    fetchTopics();
  }, []);

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUnlimited) {
      if (!startDate || !endDate) {
        alert("Vui lòng chọn ngày bắt đầu và kết thúc!");
        return;
      }
      if (new Date(startDate) > new Date(endDate)) {
        alert("Ngày kết thúc phải sau ngày bắt đầu!");
        return;
      }
    }
    if (isPaid && price <= 0) {
      alert("Vui lòng nhập giá tiền hợp lệ (> 0)!");
      return;
    }

    try {
      setLoading(true);
      const requestData = {
        name: name,
        topic_id: topic,
        description: description,
        type: "0",
        start_date: isUnlimited ? "" : startDate,
        end_date: isUnlimited ? "" : endDate,
        price: isPaid ? price : 0,
        status: status,
      };

      const res = await axiosInstance.post("/course/create", requestData);
      alert(res.data.message || "Thêm khóa học thành công!");
      onClose();
      onReload();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Lỗi khi thêm khóa học!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-gray-50/50">

      {/* --- BODY FORM (Scrollable) --- */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* 1. THÔNG TIN CHUNG (Grid 2 cột) */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
         

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên khóa học */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên khóa học <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
                placeholder="Ví dụ: Lập trình ReactJS căn bản"
              />
            </div>

            {/* Chủ đề */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Chủ đề <span className="text-red-500">*</span></label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
                required
              >
                <option value="">-- Chọn chủ đề --</option>
                {topicsList.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Trạng thái */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trạng thái hiển thị</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="active">🟢 Hoạt động (Công khai)</option>
                <option value="hidden">👁️ Ẩn (Chỉ Admin thấy)</option>
                <option value="locked">🔒 Khóa (Hiện nhưng không cho học)</option>
              </select>
            </div>

            {/* Mô tả (Full width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả khóa học</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                rows={4}
                placeholder="Mô tả ngắn gọn nội dung khóa học..."
              />
            </div>
          </div>
        </div>

        {/* 2. CẤU HÌNH (Grid 2 cột cho Thời gian & Giá) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Cột Trái: Thời gian */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-purple-100 text-purple-600 p-1 rounded">⏳</span> Thời gian học
            </h3>

            <div className="flex items-center mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100">
              <input
                type="checkbox"
                id="unlimitedCheck"
                checked={isUnlimited}
                onChange={(e) => setisUnlimited(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="unlimitedCheck" className="ml-3 font-medium text-gray-700 cursor-pointer select-none text-sm">
                Khóa học vĩnh viễn (Không giới hạn)
              </label>
            </div>

            {!isUnlimited && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày bắt đầu <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setstartDate(e.target.value)}
                    required={!isUnlimited}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày kết thúc <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setendDate(e.target.value)}
                    required={!isUnlimited}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cột Phải: Học phí */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-green-100 text-green-600 p-1 rounded">💰</span> Học phí
            </h3>

            <div className="flex items-center mb-4 bg-green-50 p-3 rounded-lg border border-green-100">
              <input
                type="checkbox"
                id="paidCheck"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
              />
              <label htmlFor="paidCheck" className="ml-3 font-medium text-gray-700 cursor-pointer select-none text-sm">
                Khóa học có tính phí
              </label>
            </div>

            {isPaid && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Giá tiền (VNĐ) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none font-semibold text-gray-800"
                    placeholder="Nhập giá tiền..."
                  />
                  <span className="absolute right-3 top-2 text-gray-500 text-sm font-medium">đ</span>
                </div>
              </div>
            )}
            {!isPaid && (
              <div className="text-sm text-gray-500 italic p-2">
                Khóa học này sẽ được phát hành <strong>Miễn phí</strong> cho tất cả học viên.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- FOOTER --- */}
      <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center gap-2
             ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
        >
          {loading && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
          {loading ? "Đang xử lý..." : "Tạo khóa học"}
        </button>
      </div>
    </form>
  );
}