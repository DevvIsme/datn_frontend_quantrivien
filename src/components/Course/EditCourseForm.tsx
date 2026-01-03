import React, { useState, useEffect } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import { EditFormProps } from "../../interfaces/Form.interface";
import { Topic } from "../../interfaces/Topic.interface";

export default function EditCourseForm({ id, slug, onClose, onReload }: EditFormProps) {
  // --- STATE ---
  const [name, setName] = useState("");
  const [topic, setTopic] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isUnlimited, setIsUnlimited] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [topicsList, setTopicsList] = useState<Topic[]>([]);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  // 1. Fetch dữ liệu
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [topicsRes, courseRes] = await Promise.all([
          axiosInstance.get("/topic/list"),
          axiosInstance.get(`/course/${slug}`),
        ]);

        const listTopics = topicsRes.data.data?.topics || topicsRes.data?.topics || [];
        setTopicsList(listTopics);

        let responseBody = courseRes.data;
        let realData = responseBody;
        if (realData.data) realData = realData.data;
        if (realData.data) realData = realData.data;

        if (realData) {
          setName(realData.name || "");
          setDescription(realData.description || "");
          setStatus(realData.status || "active");
          let targetTopicId = "";
          if (realData.topic && realData.topic.id) targetTopicId = String(realData.topic.id);
          else if (realData.topic_id) targetTopicId = String(realData.topic_id);
          setTopic(targetTopicId);

          if (!realData.start_date && !realData.end_date) {
            setIsUnlimited(true);
            setStartDate("");
            setEndDate("");
          } else {
            setIsUnlimited(false);
            setStartDate(realData.start_date ? realData.start_date.split('T')[0] : "");
            setEndDate(realData.end_date ? realData.end_date.split('T')[0] : "");
          }

          if (realData.price && realData.price > 0) {
            setIsPaid(true);
            setPrice(realData.price);
          } else {
            setIsPaid(false);
            setPrice(0);
          }
        }
      } catch (error) {
        console.error("Lỗi fetch data:", error);
      }
    };

    if (slug) fetchAllData();
  }, [slug]);

  // 2. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Xác nhận cập nhật khóa học này?")) return;

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
      alert("Vui lòng nhập giá tiền hợp lệ!");
      return;
    }

    try {
      setLoading(true);
      const requestData = {
        name: name,
        topic_id: topic,
        description: description,
        start_date: isUnlimited ? "" : startDate,
        end_date: isUnlimited ? "" : endDate,
        price: isPaid ? price : 0,
        status: status
      };

      const response = await axiosInstance.put(`/course/update/${id}`, requestData);
      alert(response.data.message || "Cập nhật thành công!");
      onClose();
      onReload();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Lỗi khi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-gray-50/50">

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* INFO */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên khóa học</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Chủ đề</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">-- Chọn chủ đề --</option>
                {topicsList.map((t) => (
                  <option key={t.id} value={String(t.id)}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="active">🟢 Hoạt động</option>
                <option value="hidden">👁️ Ẩn</option>
                <option value="locked">🔒 Khóa</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* CONFIG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TIME */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-purple-100 text-purple-600 p-1 rounded">⏳</span> Thời gian học
            </h3>

            <div className="flex items-center mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100">
              <input
                type="checkbox"
                id="unlimitedCheck"
                checked={isUnlimited}
                onChange={(e) => setIsUnlimited(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="unlimitedCheck" className="ml-3 font-medium text-gray-700 cursor-pointer select-none text-sm">
                Không giới hạn (Vĩnh viễn)
              </label>
            </div>

            {!isUnlimited && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required={!isUnlimited}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required={!isUnlimited}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PRICE */}
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
                Có tính phí
              </label>
            </div>

            {isPaid && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Giá tiền (VNĐ)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none font-semibold text-gray-800"
                  />
                  <span className="absolute right-3 top-2 text-gray-500 text-sm font-medium">đ</span>
                </div>
              </div>
            )}
            {!isPaid && (
              <div className="text-sm text-gray-500 italic p-2">
                Khóa học này đang <strong>Miễn phí</strong>.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
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