import { z } from "zod";

// Định nghĩa surveySchema
export const surveySchema = z.object({
  name: z.string().min(1, "Tên khảo sát không được để trống"),
  list_question: z
    .array(z.string().min(1, "Câu hỏi không được để trống"))
    .nonempty("Phải có ít nhất một câu hỏi"),
  dueAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Ngày hết hạn không hợp lệ")
    .refine(
      (val) => new Date(val) > new Date(),
      "Hạn chót phải lớn hơn thời gian hiện tại"
    ),
});

export interface Survey {
  id: string;
  name: string;
  slug: string;
  numberQuestion: number;
  participated: number;
  isExpired: boolean;
  dueAt: string;
  createdAt: string;
  status?: "active" | "hidden" | "locked";
}

export interface SurveyQuestion {
  id: string;
  name: string;
  yes: number;
  no: number;
}

export interface SurveyAttend {
  id: string;
  name: string;
  createdAt: string;
}
