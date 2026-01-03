import { Survey } from "../../interfaces/Survey.interface";
import { CalendarIcon, ClockIcon, UserGroupIcon, ClipboardListIcon } from "@heroicons/react/solid";

export default function SurveyInfo({ survey }: { survey: Survey }) {
  return (
    <div className="bg-white p-6 sm:p-8">
      {/* --- PHẦN TIÊU ĐỀ --- */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">
          {survey.name}
        </h2>
      </div>

      {/* --- PHẦN THÔNG SỐ (GRID 4 CỘT) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Ngày tạo */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-medium text-gray-500 uppercase tracking-wide">
              Ngày tạo
            </span>
            <span className="text-base font-bold text-gray-800 mt-1">
              {survey.createdAt}
            </span>
          </div>
        </div>

        {/* Hạn kết thúc */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-50 rounded-xl text-red-600 shrink-0">
            <ClockIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-medium text-gray-500 uppercase tracking-wide">
              Ngày kết thúc
            </span>
            <span className="text-base font-bold text-gray-800 mt-1">
              {survey.dueAt}
            </span>
          </div>
        </div>

        {/* Số người tham gia */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-50 rounded-xl text-green-600 shrink-0">
            <UserGroupIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-medium text-gray-500 uppercase tracking-wide">
              Đã thực hiện
            </span>
            <span className="text-base font-bold text-gray-800 mt-1">
              {survey.participated} <span className="text-xs font-normal text-gray-400">người</span>
            </span>
          </div>
        </div>

        {/* Tổng số câu hỏi */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600 shrink-0">
            <ClipboardListIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-medium text-gray-500 uppercase tracking-wide">
              Tổng câu hỏi
            </span>
            <span className="text-base font-bold text-gray-800 mt-1">
              {survey.numberQuestion} <span className="text-xs font-normal text-gray-400">câu</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}