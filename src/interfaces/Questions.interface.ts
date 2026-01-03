export type QuestionType = "radio" | "checkbox";

export interface Question {
  id: number;
  name: string; // Tên câu hỏi
  type: QuestionType;
  choice: string[]; // Danh sách lựa chọn
  correctAns: string[]; // Danh sách đáp án đúng
  topic_id?: number;
}

export interface QuestionFormProps {
  examSlug: string; // Slug của bài thi để gọi API
  question?: Question; // Nếu có là mode Sửa, không có là mode Thêm
  onClose: () => void;
  onReload: () => void;
}
