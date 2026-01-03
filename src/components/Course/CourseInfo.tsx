import { Course } from "../../interfaces/Course.interface";

export default function CourseInfo({ course }: { course: Course }) {
  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden mb-6">
      {/* HEADER: Tên khóa học & Gradient nền */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Icon đại diện khóa học */}
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {course.name}
          </h2>
        </div>
      </div>

      {/* BODY: Grid thông tin chi tiết */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {/* 1. Ngày tạo */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Ngày tạo
            </span>
            <span className="text-gray-900 font-medium text-lg">
              {new Date(course.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          {/* 2. Chủ đề */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
              Chủ đề
            </span>
            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit font-semibold text-sm border border-blue-100 mt-1">
              {course.topic.name}
            </span>
          </div>


          {/* 4. Tổng bài học */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Bài học
            </span>
            <span className="text-gray-900 font-bold text-lg">
              {course.totalLesson}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}