import { Course } from "./Course.interface";
import { Document } from "./Document.interface";
import { Exam } from "./Exam.interface";
import { Lesson } from "./Lesson.interface";

export interface EditExamFormProps extends AddFormProps {
  exam: Exam;
}
export interface EditDocFormProps extends AddFormProps {
  doc: Document;
}

export interface EditLessFormProps extends AddFormProps {
  // course: Course;
   lessonId: string;
  // lessons: Lesson[];
}

export interface AddLessFormProps extends AddFormProps {
  // courseId: string;
  // lessons: Lesson[];
}

export interface AddExamFormProps extends AddFormProps {
  courseId: string;
}

export interface AddFormProps {
  onClose: () => void;
  onReload: () => void;
}

export interface EditFormProps {
  id: string;
  slug: string;
  onClose: () => void;
  onReload: () => void;
}
