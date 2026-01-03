import { Topic } from "../../interfaces/Topic.interface";

export default function TopicInfo({ topic }: { topic: Topic }) {
  return (
    // Container chính dạng thẻ bài (Card), có dải màu nhấn trên cùng
    <div className="bg-white relative overflow-hidden">
      {/* Dải màu trang trí trên cùng */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-blue-400"></div>

      <div className="p-6 sm:p-8 pt-10">
        {/* --- PHẦN TIÊU ĐỀ --- */}
        <div className="mb-6">
          {/* Nhãn phụ */}
          <span className="block text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">
            Chủ đề đào tạo
          </span>
          {/* Tên chủ đề lớn */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {topic.name}
          </h1>
        </div>

        {/* Đường kẻ phân cách mờ */}
        <div className="border-t border-gray-100 w-full my-8"></div>

        {/* --- PHẦN MÔ TẢ --- */}
        <div>
          <div className="flex items-center mb-4">
            {/* Icon trang trí nhỏ cho phần mô tả */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
              Mô tả chi tiết
            </h3>
          </div>

          {/* Nội dung mô tả HTML */}
          {/* Sử dụng 'prose' để format văn bản HTML đẹp mắt, loại bỏ scrollbar để hiển thị toàn bộ */}
          <div
            className="text-base text-gray-600 leading-relaxed prose prose-blue prose-sm sm:prose-base max-w-none"
            dangerouslySetInnerHTML={{ __html: topic.description }}
          />
        </div>
      </div>
    </div>
  );
}