/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import { EditExamFormProps } from "../../interfaces/Form.interface";
import { Topic } from "../../interfaces/Topic.interface";

const formatDateForInput = (dateString?: Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
  return localISOTime;
};

export default function EditExamForm({ exam }: EditExamFormProps) {
  const [name, setName] = useState(exam.name || "");
  const [numberQuestion, setNumberQuestion] = useState(exam.numberQuestion || 1);
  const [reDoTime, setReDoTime] = useState(exam.reDoTime || 0);
  const [submitTime, setSubmitTime] = useState(exam.submitTime || 1);
  const [passingScore, setpassingScore] = useState(exam.passingScore || 1);
  const [topic, setTopic] = useState<string | undefined>(exam.topic.id);
  const [list, setList] = useState<Topic[]>([]);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(exam.shuffle_questions === 1);
  const [shuffleAnswers, setShuffleAnswers] = useState<boolean>(exam.shuffle_answers === 1);
  const [status, setStatus] = useState<number>(exam.status);
  const [isLimited, setIsLimited] = useState(!!(exam.start_date || exam.end_date));
  const [startDate, setStartDate] = useState(formatDateForInput(exam.start_date));
  const [endDate, setEndDate] = useState(formatDateForInput(exam.end_date));

  // --- STATE GIÁM THỊ AI (MỚI) ---
  // Lưu ý: Cần chắc chắn backend trả về exam có trường is_ai_proctoring (hoặc tên tương tự)
  const [isAIProctoring, setIsAIProctoring] = useState<boolean>(!!exam.is_ai_proctoring);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axiosInstance.get("/topic/list");
        setList(response.data.data.topics || []);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      }
    };
    fetchTopics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) { alert("Vui lòng chọn chủ đề !"); return; }
    if (submitTime < 1) { alert("Thời gian làm bài tối thiểu là 1 phút."); return; }
    if (numberQuestion < 1) { alert("Số lượng câu hỏi phải ít nhất là 1."); return; }
    if (passingScore <= 0) { alert("Điểm cần đạt phải lớn hơn 0"); return; }
    if (isLimited) {
      if (!startDate || !endDate) return alert("Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc!");
      if (new Date(startDate) >= new Date(endDate)) return alert("Thời gian kết thúc phải sau thời gian bắt đầu!");
    }

    try {
      const isConfirmed = confirm("Xác nhận sửa bài thi!");
      if (!isConfirmed) return;

      const formData = {
        name, topic_id: topic, numberQuestion, reDoTime, submitTime, passingScore,
        shuffle_questions: shuffleQuestions ? 1 : 0, shuffle_answers: shuffleAnswers ? 1 : 0,
        status: status, start_date: isLimited ? startDate : null, end_date: isLimited ? endDate : null,
        // Gửi cờ AI Proctoring cập nhật
        is_ai_proctoring: isAIProctoring ? 1 : 0
      };

      const response = await axiosInstance.put(`/exam/update/${exam.id}`, formData);
      alert(response.data.data);
      window.location.reload();
    } catch (error: any) {
      alert(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-gray-50 min-h-screen p-6 md:p-8">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa bài thi: <span className="text-blue-600">{exam.name}</span></h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* CỘT TRÁI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3 border-b pb-4">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-lg">📝</span>
            Thông tin chung
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tên Bài Thi</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Chủ Đề</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer shadow-sm"
              >
                <option value="">Chọn chủ đề</option>
                {list.map((topicItem) => (
                  <option key={topicItem.id} value={topicItem.id}>{topicItem.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Trạng thái hiển thị</label>
              <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer shadow-sm"
              >
                <option value={1}>🟢 Hoạt động (Bình thường)</option>
                <option value={2}>🔒 Khóa (Chỉ xem, không được thi)</option>
                <option value={0}>🚫 Ẩn (Học viên không nhìn thấy)</option>
              </select>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-800 border border-blue-100">
                <strong>Lưu ý:</strong> {status === 1 ? "Học viên thấy và làm bài được." : status === 2 ? "Học viên thấy đề nhưng không làm được." : "Chỉ Admin mới thấy."}
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3 border-b pb-4">
            <span className="bg-orange-100 text-orange-600 p-2 rounded-lg text-lg">⚙️</span>
            Cấu hình đề thi
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng câu</label>
              <input
                type="number"
                name="numberQuestion"
                value={numberQuestion}
                onChange={(e) => setNumberQuestion(Number(e.target.value))}
                required
                min={1}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Điểm đạt (Thang 10)</label>
              <input
                type="number"
                name="passingScore"
                value={passingScore}
                onChange={(e) => setpassingScore(Number(e.target.value))}
                required
                min={1}
                step={0.5}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Thời gian (Phút)</label>
              <input
                type="number"
                name="submitTime"
                value={submitTime}
                onChange={(e) => setSubmitTime(Number(e.target.value))}
                required
                min={1}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Lượt thi (0=Vô hạn)</label>
              <input
                type="number"
                name="reDoTime"
                value={reDoTime}
                onChange={(e) => setReDoTime(Number(e.target.value))}
                required
                min={0}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <label className="flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
              />
              <span className="ml-3 text-sm font-bold text-gray-700">Đảo thứ tự câu hỏi</span>
            </label>

            <label className="flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                checked={shuffleAnswers}
                onChange={(e) => setShuffleAnswers(e.target.checked)}
              />
              <span className="ml-3 text-sm font-bold text-gray-700">Đảo thứ tự đáp án</span>
            </label>
          </div>

          {/* --- MỚI: CẤU HÌNH GIÁM THỊ AI --- */}
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
            <label className="flex items-center cursor-pointer justify-between">
              <div>
                <span className="block text-sm font-bold text-gray-800">Giám thị AI (Camera)</span>
                <span className="block text-xs text-gray-500 mt-1">Yêu cầu bật Camera & phát hiện gian lận</span>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAIProctoring}
                  onChange={(e) => setIsAIProctoring(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </div>
            </label>
          </div>

        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3 border-b pb-4">
          <span className="bg-purple-100 text-purple-600 p-2 rounded-lg text-lg">⏳</span>
          Thời gian tổ chức thi
        </h3>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col gap-4 min-w-[250px]">
            <label className={`flex items-center cursor-pointer p-4 border-2 rounded-xl transition-all ${!isLimited ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
              <input
                type="radio"
                name="timeConfig"
                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                checked={!isLimited}
                onChange={() => setIsLimited(false)}
              />
              <span className="ml-3 text-sm font-bold text-gray-700">Tự do (Không giới hạn)</span>
            </label>

            <label className={`flex items-center cursor-pointer p-4 border-2 rounded-xl transition-all ${isLimited ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
              <input
                type="radio"
                name="timeConfig"
                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                checked={isLimited}
                onChange={() => setIsLimited(true)}
              />
              <span className="ml-3 text-sm font-bold text-gray-700">Có thời hạn cụ thể</span>
            </label>
          </div>

          {isLimited && (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in p-6 bg-purple-50 rounded-xl border border-purple-100">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bắt đầu từ</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required={isLimited}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kết thúc lúc</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required={isLimited}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-lg"
        >
          Lưu Thay Đổi
        </button>
      </div>
    </form>
  );
}