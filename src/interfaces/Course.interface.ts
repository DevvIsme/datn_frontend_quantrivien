import { Topic } from "./Topic.interface";

export interface Course {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  topic: Topic;
  slug: string;
  type: boolean;
  createdAt: string;
  studentCount: number;
  totalLesson: number;
  start_date: string;
  end_date: string;
  status: string;
}
