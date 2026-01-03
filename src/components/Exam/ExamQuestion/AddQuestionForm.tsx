import { useState, useEffect } from "react";
import axiosInstance from "../../../configs/axiosConfigs";
// @ts-ignore
import { SearchIcon, FilterIcon } from "@heroicons/react/solid";

interface Topic {
  id: number;
  name: string;
}

interface Question {
  id: number;
  name: string;
  type: string;
  topic_id?: number;
}

// Props: id là slug hoặc id của bài thi
export default function AddQuestionFromBankForm({ id }: { id: string }) {
  // State dữ liệu
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  // State giới hạn câu hỏi
  const [maxQuestions, setMaxQuestions] = useState<number>(0); // Tổng số câu hỏi cho phép
  const [currentCount, setCurrentCount] = useState<number>(0); // Số câu hỏi đang có trong bài thi

  // State xử lý
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch dữ liệu tổng hợp
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi song song 4 API: 
        // 1. Ngân hàng câu hỏi
        // 2. Danh sách chủ đề
        // 3. Chi tiết bài thi (để lấy numberQuestion)
        // 4. Danh sách câu hỏi ĐANG CÓ trong bài thi (để đếm số lượng hiện tại)

        const [bankRes, topicsRes, examDetailRes] = await Promise.all([
          axiosInstance.get(`/exam/questions`),
          axiosInstance.get(`/topic/list`),
          axiosInstance.get(`/exam/detail/${id}`),       // API lấy chi tiết bài thi
        ]);

        setQuestions(bankRes.data.data.questions || []);
        setTopics(topicsRes.data.data.topics || []);

        // Cập nhật giới hạn
        setMaxQuestions(examDetailRes.data.data.numberQuestion || 0);
        // setCurrentCount(currentQuestionsRes.data.data.count || 0);

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Tính số slot còn lại
  const remainingSlots = maxQuestions - currentCount;
  // Tính số slot còn lại sau khi trừ đi những câu đang chọn trong form này
  const slotsLeftAfterSelection = remainingSlots - selectedIds.length;

  // 2. Hàm xử lý chọn checkbox (CÓ VALIDATE)
  const handleSelect = (questionId: number) => {
    if (selectedIds.includes(questionId)) {
      // Bỏ chọn: Luôn cho phép
      setSelectedIds(selectedIds.filter((id) => id !== questionId));
    } else {
      // Chọn thêm: Phải kiểm tra giới hạn
      if (selectedIds.length >= remainingSlots) {
        alert(`Bài thi này chỉ cho phép tối đa ${maxQuestions} câu hỏi.\nHiện đã có ${currentCount} câu.\nBạn chỉ được phép thêm tối đa ${remainingSlots} câu nữa.`);
        return;
      }
      setSelectedIds([...selectedIds, questionId]);
    }
  };

  // 3. Hàm chọn tất cả (CÓ VALIDATE - Chỉ chọn đủ số lượng còn thiếu)
  const handleSelectAll = () => {
    // Nếu đang chọn tất cả (hoặc chọn bằng số lượng hiển thị) -> Bỏ chọn hết
    if (selectedIds.length >= filteredQuestions.length && filteredQuestions.length > 0) {
      setSelectedIds([]);
      return;
    }

    // Logic chọn tất cả nhưng không vượt quá giới hạn
    const availableSlots = remainingSlots;
    if (availableSlots <= 0) {
      alert("Bài thi đã đủ số lượng câu hỏi, không thể chọn thêm.");
      return;
    }

    // Lấy danh sách ID từ filter
    const allFilteredIds = filteredQuestions.map(q => q.id);

    // Nếu số lượng câu hỏi lọc ra ít hơn số slot còn lại -> Chọn hết danh sách lọc
    if (allFilteredIds.length <= availableSlots) {
      setSelectedIds(allFilteredIds);
    } else {
      // Nếu số lượng lọc ra nhiều hơn slot -> Chỉ lấy đúng số lượng slot còn lại
      const idsToSelect = allFilteredIds.slice(0, availableSlots);
      setSelectedIds(idsToSelect);
      alert(`Chỉ tự động chọn ${availableSlots} câu hỏi đầu tiên vì giới hạn bài thi.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return alert("Vui lòng chọn câu hỏi!");

    // Validate lần cuối trước khi gửi
    if (selectedIds.length > remainingSlots) {
      return alert("Số lượng câu hỏi vượt quá giới hạn cho phép!");
    }

    try {
      await axiosInstance.post(`/exam/add-existing-questions/${id}`, {
        question_ids: selectedIds,
      });
      alert("Thêm thành công!");
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data || "Có lỗi xảy ra");
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic
      ? q.topic_id === Number(selectedTopic)
      : true;
    return matchesSearch && matchesTopic;
  });

  const getTopicName = (topicId?: number) => {
    if (!topicId) return "Chưa phân loại";
    const topic = topics.find((t) => t.id === topicId);
    return topic ? topic.name : "Unknown Topic";
  };

  return (
    // SỬA: Thêm class "p-6" để nội dung cách đều 4 viền
    <form onSubmit={handleSubmit} className="flex flex-col h-[550px] p-6">

      {/* --- THANH TRẠNG THÁI GIỚI HẠN (MỚI) --- */}
      <div className={`mb-4 p-3 rounded-md border flex justify-between items-center ${remainingSlots <= 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
        <div className="text-sm">
          <span className="font-bold">Giới hạn bài thi:</span> {maxQuestions} câu |
          <span className="font-bold ml-2">Đã có:</span> {currentCount} câu
        </div>
        <div className="text-sm font-bold">
          Còn lại: {remainingSlots <= 0 ? 0 : remainingSlots} slot
        </div>
      </div>

      {/* --- BỘ LỌC --- */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm tên câu hỏi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 pl-8 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-2 top-2.5" />
          </div>
          <div className="flex-1 relative">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="border border-gray-300 p-2 pl-8 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="">-- Tất cả chủ đề --</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <FilterIcon className="w-5 h-5 text-gray-400 absolute left-2 top-2.5" />
          </div>
        </div>
      </div>

      {/* --- DANH SÁCH --- */}
      <div className="flex-1 overflow-y-auto border rounded-lg p-2 bg-gray-50 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-full text-gray-500">Đang tải dữ liệu...</div>
        ) : filteredQuestions.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs text-gray-500">Tìm thấy <b>{filteredQuestions.length}</b> câu hỏi</span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-blue-600 hover:underline font-medium"
                // Disable nút chọn tất cả nếu đã hết slot
                disabled={remainingSlots <= 0}
              >
                {selectedIds.length > 0 ? "Bỏ chọn tất cả" : "Chọn nhanh (tự động điền)"}
              </button>
            </div>

            <div className="space-y-2">
              {filteredQuestions.map((q) => {
                const isSelected = selectedIds.includes(q.id);
                // Disable checkbox nếu chưa chọn VÀ đã hết slot
                const isDisabled = !isSelected && selectedIds.length >= remainingSlots;

                return (
                  <label
                    key={q.id}
                    className={`flex items-start p-3 border rounded-md transition-all ${isDisabled ? "bg-gray-100 opacity-60 cursor-not-allowed" : "cursor-pointer bg-white hover:border-blue-300"
                      } ${isSelected ? "bg-blue-50 border-blue-500 shadow-sm" : "border-gray-200"}`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 mr-3 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={isSelected}
                      onChange={() => handleSelect(q.id)}
                      disabled={isDisabled}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{q.name}</div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${q.type === 'radio'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}>
                          {q.type === "radio" ? "Một đáp án" : "Nhiều đáp án"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          Topic: <b>{getTopicName(q.topic_id)}</b>
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-gray-500 text-sm">
            <p>Không tìm thấy câu hỏi phù hợp.</p>
          </div>
        )}
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-4 pt-4 border-t flex justify-between items-center bg-white sticky bottom-0">
        <div className="text-sm">
          <span className="font-medium text-gray-700">Đang chọn:</span>
          <span className={`font-bold ml-1 text-lg ${slotsLeftAfterSelection < 0 ? 'text-red-600' : 'text-blue-600'}`}>
            {selectedIds.length}
          </span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-gray-500">còn lại {remainingSlots}</span>
        </div>

        <button
          type="submit"
          disabled={selectedIds.length === 0 || selectedIds.length > remainingSlots}
          className={`px-6 py-2 rounded-md text-white font-medium shadow-sm transition-colors ${selectedIds.length === 0 || selectedIds.length > remainingSlots
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          Thêm vào bài thi
        </button>
      </div>
    </form>
  );
}