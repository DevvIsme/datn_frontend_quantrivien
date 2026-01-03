import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";
// @ts-ignore
import LoadingSpinner from "../Loading";

interface QuestionAnalytics {
  id: number;
  content: string;
  type: "rating" | "text" | "choice";
  stats: any;
}

export default function QuestionList({ surveyId }: { surveyId: number | string }) {
  const [data, setData] = useState<QuestionAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Gọi API Analytics riêng biệt
        const res = await axiosInstance.get(`/survey/analytics/${surveyId}`);
        setData(res.data.data.analytics);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu thống kê.");
      } finally {
        setLoading(false);
      }
    };

    if (surveyId) fetchAnalytics();
  }, [surveyId]);

  // Hàm render thanh phần trăm
  const renderProgressBar = (label: string, count: number, total: number, colorClass: string) => {
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
      <div className="flex items-center gap-3 mb-3 text-sm">
        {/* Tăng width từ w-24 lên w-32 để hiển thị đủ nhãn dài */}
        <span className="w-32 font-medium text-gray-600 truncate text-right" title={label}>
          {label}
        </span>

        {/* Thanh Progress */}
        <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        {/* Số liệu */}
        <div className="w-20 flex justify-end gap-1 text-xs">
          <span className="font-bold text-gray-800">{percent}%</span>
          <span className="text-gray-400">({count})</span>
        </div>
      </div>
    );
  };

  if (loading) return <div className="py-10 flex justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="py-10 text-center text-red-500 font-medium">{error}</div>;
  if (data.length === 0) return <div className="py-10 text-center text-gray-500 italic">Chưa có dữ liệu thống kê nào.</div>;

  return (
    // SỬA: Tăng khoảng cách space-y-6, bỏ max-h cứng nếu muốn scroll ở thẻ cha, hoặc giữ nguyên và custom scrollbar
    <div className="space-y-6 pr-1 mt-2">
      {data.map((q, index) => (
        <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">

          {/* Header Câu hỏi */}
          <div className="flex justify-between items-start mb-5 pb-3 border-b border-gray-100 border-dashed">
            <h3 className="font-bold text-gray-800 text-lg flex-1 mr-4">
              <span className="inline-block bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-sm mr-2 mb-1">
                Câu {index + 1}
              </span>
              <span className="align-middle">{q.content}</span>
            </h3>

            {/* Badge Loại câu hỏi */}
            <span className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider
              ${q.type === 'rating' ? 'bg-green-100 text-green-700' :
                q.type === 'text' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>
              {q.type === 'text' ? 'Tự luận' : q.type === 'choice' ? 'Trắc nghiệm' : 'Đánh giá'}
            </span>
          </div>

          {/* Body Thống kê */}
          <div className="pl-0 md:pl-2">

            {/* 1. RATING STATS */}
            {q.type === 'rating' && q.stats && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Phân bố đánh giá</p>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">Tổng: {q.stats.total} lượt</span>
                </div>

                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map(star => (
                    renderProgressBar(
                      `${star} Sao`,
                      q.stats.distribution[star] || 0, // Fallback 0 nếu undefined
                      q.stats.total,
                      star >= 4 ? 'bg-emerald-500' : star === 3 ? 'bg-yellow-400' : 'bg-rose-400'
                    )
                  ))}
                </div>
              </div>
            )}

            {/* 2. CHOICE STATS */}
            {q.type === 'choice' && q.stats && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Kết quả bình chọn</p>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">Tổng: {q.stats.total} lượt</span>
                </div>

                <div className="space-y-1">
                  {renderProgressBar("Đồng ý / Có", q.stats.distribution.yes || 0, q.stats.total, "bg-blue-500")}
                  {renderProgressBar("Không / Từ chối", q.stats.distribution.no || 0, q.stats.total, "bg-slate-400")}
                </div>
              </div>
            )}

            {/* 3. TEXT STATS */}
            {q.type === 'text' && Array.isArray(q.stats) && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Danh sách trả lời</p>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{q.stats.length} phản hồi</span>
                </div>

                <div className="bg-gray-50/50 rounded-lg border border-gray-200/80 max-h-60 overflow-y-auto custom-scrollbar">
                  {q.stats.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-400 italic">Chưa có dữ liệu phản hồi nào.</div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {q.stats.map((text: string, idx: number) => (
                        <li key={idx} className="p-3 text-sm text-gray-700 hover:bg-white transition-colors flex gap-3">
                          <span className="text-gray-300 font-mono text-xs mt-0.5">#{idx + 1}</span>
                          <span>"{text}"</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      ))}
    </div>
  );
}