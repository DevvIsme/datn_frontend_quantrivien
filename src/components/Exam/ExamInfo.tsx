import { Exam } from "../../interfaces/Exam.interface";

export default function ExamInfo({ exam }: { exam: Exam }) {
  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden mb-6">

      {/* HEADER: Tên bài thi & Gradient */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          {/* Icon đại diện bài thi */}
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600 shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              {exam.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Trạng thái: Đang hoạt động
            </p>
          </div>
        </div>
      </div>

      {/* BODY: Thông tin chi tiết */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">

          {/* 1. Chủ đề */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-md text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Chủ đề</p>
              <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded text-sm font-bold border border-blue-100 inline-block">
                {exam.topic.name}
              </span>
            </div>
          </div>

          {/* 2. Số câu hỏi */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-md text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Số lượng câu hỏi</p>
              <p className="text-gray-900 font-bold text-lg">{exam.numberQuestion} <span className="text-sm font-normal text-gray-500">câu</span></p>
            </div>
          </div>

          {/* 3. Thời gian làm bài */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-md text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Thời gian làm bài</p>
              <p className="text-gray-900 font-bold text-lg">{exam.submitTime} <span className="text-sm font-normal text-gray-500">phút</span></p>
            </div>
          </div>

          {/* 4. Số lần làm lại */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-md text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Lượt thi cho phép</p>
              <p className="text-gray-900 font-bold text-lg">
                {exam.reDoTime === 0 ? "Không giới hạn" : `${exam.reDoTime} lần`}
              </p>
            </div>
          </div>

          {/* 5. Ngày tạo */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-md text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Ngày tạo</p>
              <p className="text-gray-700 font-medium text-sm">{exam.createdAt}</p>
            </div>
          </div>

          {/* 6. Ngày cập nhật */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-md text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Cập nhật lần cuối</p>
              <p className="text-gray-700 font-medium text-sm">{exam.updatedAt}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}