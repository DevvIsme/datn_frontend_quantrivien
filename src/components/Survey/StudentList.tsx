import { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";

// Interface nội bộ cho component này
interface ParticipateItem {
  id: number;
  name: string;
  createdAt: string;
}

interface AnswerDetail {
  id: number;
  score: number | null;
  text_answer: string | null;
  question_data: {
    content: string;
    type: string;
  };
}

export function StudentListPaticipate({ slug }: { slug: string }) {
  const [list, setList] = useState<ParticipateItem[]>([]);
  const [loading, setLoading] = useState(false);

  // State cho Modal Xem chi tiết
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendId, setSelectedAttendId] = useState<number | null>(null);
  const [detailAnswers, setDetailAnswers] = useState<AnswerDetail[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 1. Lấy danh sách người tham gia
  useEffect(() => {
    const fetchParticipates = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/survey/student-list/${slug}`);
        // Lưu ý: Kiểm tra kỹ API trả về dạng { participates: [] } hay { data: { participates: [] } }
        // Thường axios là response.data.<key_backend_trả_về>
        setList(response.data.data.participates || []);
      } catch (error: any) {
        console.error("Lỗi tải danh sách:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchParticipates();
  }, [slug]);

  // 2. Hàm xem chi tiết
  const handleViewDetail = async (attendId: number) => {
    setSelectedAttendId(attendId);
    setIsModalOpen(true);
    setDetailAnswers([]); // Reset data cũ

    try {
      setLoadingDetail(true);
      const res = await axiosInstance.get(`/survey/attend-detail/${attendId}`);
      setDetailAnswers(res.data.data.answers);
    } catch (error) {
      alert("Không thể tải chi tiết bài làm");
      console.error(error);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="mt-4">
      {/* --- DANH SÁCH --- */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full bg-white max-h-[400px]">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-base font-semibold text-gray-600">ID</th>
              <th className="px-6 py-3 text-left text-base font-semibold text-gray-600">Sinh viên</th>
              <th className="px-6 py-3 text-left text-base font-semibold text-gray-600">Thời gian nộp</th>
              <th className="px-6 py-3 text-center text-base font-semibold text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Chưa có sinh viên nào làm bài.
                </td>
              </tr>
            )}
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-base text-gray-500">#{item.id}</td>
                <td className="px-6 py-4 text-base font-medium text-gray-800">{item.name}</td>
                <td className="px-6 py-4 text-base text-gray-500">{item.createdAt}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleViewDetail(item.id)}
                    className="text-blue-600 hover:text-blue-800 text-base font-medium hover:underline"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL CHI TIẾT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl flex flex-col max-h-[90vh]">

            {/* Header Modal */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-bold text-gray-800">
                Chi tiết bài làm #{selectedAttendId}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingDetail ? (
                <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
              ) : (
                <div className="space-y-6">
                  {detailAnswers.map((ans, index) => (
                    <div key={ans.id} className="border-b pb-4 last:border-0">
                      <p className="font-semibold text-gray-800 mb-2">
                        <span className="text-blue-600 mr-1">Câu {index + 1}:</span>
                        {ans.question_data?.content}
                      </p>

                      <div className="bg-gray-50 p-3 rounded text-base text-gray-700">
                        {ans.question_data?.type === 'rating' ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Đánh giá:</span>
                            <div className="flex text-yellow-500">
                              {/* Render số sao tương ứng */}
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < (ans.score || 0) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              ))}
                            </div>
                            <span className="text-gray-500 ml-2">({ans.score} sao)</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-medium">Trả lời: </span>
                            <span>{ans.text_answer || "(Trống)"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {detailAnswers.length === 0 && <p>Không có dữ liệu câu trả lời.</p>}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t bg-gray-50 flex justify-end rounded-b-lg">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}