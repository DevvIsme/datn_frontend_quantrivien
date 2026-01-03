import { Course } from "./Course.interface";

export interface LessonListProps {
  course: Course;
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
  context: string;
  createdAt: string;
  updatedAt: string;
  type: 'text' | 'video' | 'file';
  file_path?: string | null;
}
