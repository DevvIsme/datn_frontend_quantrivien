/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";
import { Topic } from "../../interfaces/Topic.interface";

export default function AddExamForm() {
  const [name, setName] = useState("");
  const [numberQuestion, setNumberQuestion] = useState(1);
  const [reDoTime, setReDoTime] = useState(0);
  const [submitTime, setSubmitTime] = useState(10);
  const [passingScore, setpassingScore] = useState(5);
  const [topic, setTopic] = useState<number | undefined>(undefined);
  const [list, setList] = useState<Topic[]>([]);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [status, setStatus] = useState<number>(1);

  // --- STATE CẤU HÌNH THỜI GIAN ---
  const [isLimited, setIsLimited] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- STATE GIÁM THỊ AI (MỚI) ---
  const [isAIProctoring, setIsAIProctoring] = useState(false);

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
    if (!topic) return alert("Vui lòng chọn chủ đề !");
    if (submitTime < 1) return alert("Thời gian làm bài tối thiểu là 1 phút.");
    if (numberQuestion < 1) return alert("Số lượng câu hỏi phải ít nhất là 1.");
    if (passingScore < 0 || passingScore > 10) return alert("Điểm cần đạt phải từ 0 đến 10");

    if (isLimited) {
      if (!startDate || !endDate) return alert("Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc!");
      if (new Date(startDate) >= new Date(endDate)) return alert("Thời gian kết thúc phải sau thời gian bắt đầu!");
    }

    try {
      if (!confirm("Xác nhận thêm bài thi!")) return;

      const formData = {
        name,
        topic_id: topic,
        numberQuestion,
        reDoTime,
        submitTime,
        passingScore,
        shuffle_questions: shuffleQuestions ? 1 : 0,
        shuffle_answers: shuffleAnswers ? 1 : 0,
        status: status,
        start_date: isLimited ? startDate : null,
        end_date: isLimited ? endDate : null,
        is_ai_proctoring: isAIProctoring ? 1 : 0
      };

      const response = await axiosInstance.post(`/exam/create/`, formData);
      alert(response.data.data);
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.error || "Có lỗi xảy ra");
    }
  };

  // Class chung cho input để tái sử dụng và đồng bộ kích thước compact
  const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none";
  const labelClass = "block text-xs font-bold text-gray-700 mb-1";

  return (
    // Bỏ cố định chiều cao (h-[650px]), thay vào đó để auto hoặc fit content
    <form onSubmit={handleSubmit} className="flex flex-col w-full md:w-[1100px] bg-gray-50 p-4 rounded-xl">

      {/* Grid Layout 3 cột */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

        {/* CỘT 1: THÔNG TIN CƠ BẢN */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-xs">1</span> Thông tin chung
          </h3>

          <div>
            <label className={labelClass}>Tên bài thi <span className="text-red-500">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="VD: Kiểm tra giữa kỳ..." className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Chủ đề <span className="text-red-500">*</span></label>
            <select value={topic} onChange={(e) => setTopic(Number(e.target.value))} required className={inputClass}>
              <option value="">-- Chọn chủ đề --</option>
              {list.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Trạng thái</label>
            <select value={status} onChange={(e) => setStatus(Number(e.target.value))} className={inputClass}>
              <option value={1}>🟢 Hoạt động</option>
              <option value={2}>🔒 Khóa (Chỉ xem)</option>
              <option value={0}>🚫 Ẩn hoàn toàn</option>
            </select>
          </div>
        </div>

        {/* CỘT 2: CẤU HÌNH SỐ LIỆU */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded text-xs">2</span> Cấu hình số liệu
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Số câu hỏi</label>
              <input type="number" value={numberQuestion} onChange={(e) => setNumberQuestion(Number(e.target.value))} required min={1} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Điểm đạt (0-10)</label>
              <input type="number" value={passingScore} onChange={(e) => setpassingScore(Number(e.target.value))} required min={0} max={10} step={0.1} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Thời gian (Phút)</label>
              <input type="number" value={submitTime} onChange={(e) => setSubmitTime(Number(e.target.value))} required min={1} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Lượt thi (0=Vô hạn)</label>
              <input type="number" value={reDoTime} onChange={(e) => setReDoTime(Number(e.target.value))} required min={0} className={inputClass} />
            </div>
          </div>

          {/* Giám thị AI đưa vào đây cho gọn */}
          <div className="mt-auto p-3 bg-red-50 rounded border border-red-100 flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-gray-800">Giám thị AI (Camera)</span>
              <span className="block text-[10px] text-gray-500">Chống gian lận</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAIProctoring}
                onChange={(e) => setIsAIProctoring(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>

        {/* CỘT 3: TÙY CHỌN & THỜI GIAN */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded text-xs">3</span> Tùy chọn & Thời gian
          </h3>

          {/* Checkbox Đảo câu */}
          <div className="flex flex-col gap-2 mb-2">
            <label className="flex items-center cursor-pointer select-none text-sm">
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600 mr-2" checked={shuffleQuestions} onChange={(e) => setShuffleQuestions(e.target.checked)} />
              Đảo thứ tự câu hỏi
            </label>
            <label className="flex items-center cursor-pointer select-none text-sm">
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600 mr-2" checked={shuffleAnswers} onChange={(e) => setShuffleAnswers(e.target.checked)} />
              Đảo thứ tự đáp án
            </label>
          </div>

          <hr className="border-gray-100" />

          {/* Thời gian */}
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer text-xs font-semibold">
              <input type="radio" name="timeConfig" className="mr-1" checked={!isLimited} onChange={() => setIsLimited(false)} /> Tự do
            </label>
            <label className="flex items-center cursor-pointer text-xs font-semibold">
              <input type="radio" name="timeConfig" className="mr-1" checked={isLimited} onChange={() => setIsLimited(true)} /> Có hạn
            </label>
          </div>

          {isLimited && (
            <div className="flex flex-col gap-2 animate-fade-in mt-1">
              <div>
                <label className={labelClass}>Bắt đầu:</label>
                <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required={isLimited} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Kết thúc:</label>
                <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required={isLimited} className={inputClass} />
              </div>
            </div>
          )}
        </div>

      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow hover:shadow-md transition-all">
        Xác nhận Thêm Bài Thi
      </button>
    </form>
  );
}